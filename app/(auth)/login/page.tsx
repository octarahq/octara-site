"use client";

import { useForm } from "@tanstack/react-form";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Gradient from "@/app/background/shadergradients/06";
import { useSearchParams } from "next/navigation";

const formSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

export function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") || "/account";
  const { login } = useAuth();
  const [authError, setAuthError] = useState(false);
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setAuthError(false);
      try {
        await login(value);
        window.location.href = redirectUrl;
      } catch {
        setAuthError(true);
      }
    },
  });

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="w-full h-full opacity-60">
          <Gradient />
        </div>
      </div>
      <Card className="w-full max-w-lg z-10 shadow-2xl border-primary/20 bg-background/60 backdrop-blur-md">
        <CardHeader className="space-y-3 pb-2">
          <CardTitle className="flex items-center gap-2 text-3xl">
            <LogIn className="text-primary size-8" />
            Login
          </CardTitle>
          <CardDescription className="text-base">
            Welcome back! Put your email and password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="">
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched && !field.state.meta.isValid) ||
                    authError;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-2">
                      <FieldLabel htmlFor={field.name} className="text-base">
                        Email
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="ludovic.cruchot@octara.xyz"
                        aria-invalid={isInvalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          setAuthError(false);
                          field.handleChange(e.target.value);
                        }}
                        className="h-12 text-lg"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    (field.state.meta.isTouched && !field.state.meta.isValid) ||
                    authError;
                  return (
                    <Field data-invalid={isInvalid} className="space-y-2">
                      <FieldLabel htmlFor={field.name} className="text-base">
                        Password
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        placeholder="My awesome password"
                        aria-invalid={isInvalid}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          setAuthError(false);
                          field.handleChange(e.target.value);
                        }}
                        className="h-12 text-lg"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg h-12 mt-4"
              >
                Login
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-6 mt-2">
          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?redirectUrl=${encodeURIComponent(redirectUrl)}`}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

export default LoginPage;
