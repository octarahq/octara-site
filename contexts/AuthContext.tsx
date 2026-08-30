"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface User {
  email: string;
  username: string;
}

export interface AuthCredentials {
  email: string;
  username?: string;
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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
  initialToken = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialToken?: string | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [token, setToken] = useState<string | null>(initialToken);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/v1/auth/status");
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error("Error while getting session:", err);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
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
      const userObj: User = data.user || {
        email: credentials.email,
        username: credentials.username || "Unknown",
      };

      setUser(userObj);

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

      toast.success("Account created", {
        description: credentials.username || credentials.email,
      });

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

  const logout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch (e) {}
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
    router.push("/");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, signup, logout, setUser }}
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
