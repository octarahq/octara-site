"use client";

import { useForm } from "@tanstack/react-form";
import { Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

const formSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: { password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("Invalid or missing reset token.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/v1/auth/password-reset/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            new_password: value.password,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || "Reset failed");
        }

        toast.success("Password reset successfully! Please login.");
        router.push("/login");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to reset password.";
        toast.error(message);
      } finally {
        setLoading(false);
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
            <Lock className="text-primary size-8" />
            Set New Password
          </CardTitle>
          <CardDescription className="text-base">
            Type your new secure password below to finish the reset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <div className="space-y-4 py-4 text-center">
              <p className="text-red-500 font-medium">
                Invalid or missing reset token. Please request a new password reset link.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field name="password">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="space-y-2">
                        <FieldLabel htmlFor={field.name} className="text-base">
                          New Password
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          placeholder="My new password"
                          aria-invalid={isInvalid}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="h-12 text-lg"
                          disabled={loading}
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
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </FieldGroup>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-6 mt-2">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

export default ResetPasswordPage;
