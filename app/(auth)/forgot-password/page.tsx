"use client";

import { useForm } from "@tanstack/react-form";
import { KeyRound, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
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

const formSchema = z.object({
  email: z.string().email("Enter a valid email."),
});

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/auth/password-reset/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        });

        if (!res.ok) {
          throw new Error();
        }

        setSubmitted(true);
        toast.success("Reset link sent!");
      } catch {
        toast.error("Failed to request password reset.");
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
            <KeyRound className="text-primary size-8" />
            Reset Password
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-4 py-4 text-center">
              <p className="text-muted-foreground">
                If an account is associated with this email, you will receive a password reset link shortly.
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
                <form.Field name="email">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
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
                  {loading ? "Sending..." : "Send link"}
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

export default ForgotPasswordPage;
