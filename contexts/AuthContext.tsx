"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface User {
  email: string;
}

export interface AuthCredentials {
  email: string;
  password?: string;
}

const ERROR_CODES: Record<string, { code: string; message: string }> = {
  "wrong ids": {
    code: "AUTH_INVALID_CREDENTIALS",
    message: "Invalid email or password.",
  },
  "mail already in use": {
    code: "AUTH_EMAIL_EXISTS",
    message: "This email is already in use.",
  },
  "invalid JSON": { code: "BAD_REQUEST", message: "Invalid request data." },
  "error while generate token": {
    code: "INTERNAL_ERROR",
    message: "An internal error occurred.",
  },
  "server error": {
    code: "INTERNAL_ERROR",
    message: "An internal error occurred.",
  },
};

function getErrorDetails(backendError: string) {
  return (
    ERROR_CODES[backendError] || {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred.",
    }
  );
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  signup: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      await Promise.resolve();

      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          setUser(null);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to login");
      }

      const data = await res.json();
      const token = data.token;
      const userObj: User = data.user || { email: credentials.email };

      setToken(token);
      setUser(userObj);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(userObj));

      toast.success("Welcome back", { description: userObj.email });
      router.push("/");
    } catch (error: unknown) {
      const backendError = error instanceof Error ? error.message : "";
      const { message } = getErrorDetails(backendError);
      toast.error("Oups, something went wrong", { description: message });
      throw error;
    }
  };

  const signup = async (credentials: AuthCredentials) => {
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to sign up");
      }

      toast.success("Account created", { description: credentials.email });

      await login(credentials);
    } catch (error: unknown) {
      const backendError = error instanceof Error ? error.message : "";
      const { message } = getErrorDetails(backendError);
      toast.error("Oups, something went wrong", {
        description: message,
      });
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    toast.info("Logged out successfully");
    router.push("/");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
