"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth, User } from '@/contexts/AuthContext';
import { toast } from 'sonner';

function AccountForm({ initialUser }: { initialUser: User }) {
  const { setUser } = useAuth();
  const [username, setUsername] = useState(initialUser.username);
  const [email, setEmail] = useState(initialUser.email);
  const [saving, setSaving] = useState(false);

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [verifyingCode, setVerifyingCode] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const usernameChanged = username.trim() !== initialUser.username;
    const emailChanged = email.trim().toLowerCase() !== initialUser.email.toLowerCase();

    if (!usernameChanged && !emailChanged) {
      toast.info("No changes detected.");
      return;
    }

    setSaving(true);
    try {
      if (usernameChanged) {
        if (!username.trim() || username.length < 3) {
          toast.error("Username must be at least 3 characters.");
          setSaving(false);
          return;
        }

        const res = await fetch("/api/v1/users/@me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || "Failed to update username");
        }

        setUser({ ...initialUser, username });
        toast.success("Username updated successfully!");
      }

      if (emailChanged) {
        if (!email.trim()) {
          toast.error("Email address cannot be empty.");
          setSaving(false);
          return;
        }

        const res = await fetch("/api/v1/users/@me/email/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_email: email }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || "Error requesting email change.");
        }

        setPendingEmail(email);
        setIsVerifyingEmail(true);
        toast.success(`A verification code has been sent to ${email}`);
      }

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred while saving details.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailCode.length !== 6) {
      toast.error("The code must be 6 digits.");
      return;
    }

    setVerifyingCode(true);
    try {
      const res = await fetch("/api/v1/users/@me/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: emailCode }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Incorrect or expired code.");
      }

      setUser({
        ...initialUser,
        email: pendingEmail,
      });

      toast.success("Email address updated successfully!");
      setIsVerifyingEmail(false);
      setEmailCode('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed.";
      toast.error(message);
    } finally {
      setVerifyingCode(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader className="relative">
            <div className="flex flex-col gap-1">
              <CardTitle>Profile details</CardTitle>
              <CardDescription>Your personal details.</CardDescription>
            </div>
            <CardAction>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save details"}
              </Button>
            </CardAction>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
              <p className="text-xs text-muted-foreground mt-0.5">
                Note: Changing your email requires verifying the new address before the update takes effect.
              </p>
            </div>
          </CardContent>
        </Card>
      </form>

      {isVerifyingEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-150">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Verify your new email address</CardTitle>
              <CardDescription>
                Enter the 6-digit verification code sent to <strong className="text-foreground">{pendingEmail}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyEmailCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-code">Verification code</Label>
                  <Input
                    id="email-code"
                    type="text"
                    maxLength={6}
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="h-11 text-center tracking-widest font-mono text-lg"
                    disabled={verifyingCode}
                  />
                </div>
                
                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsVerifyingEmail(false)}
                    disabled={verifyingCode}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={verifyingCode}
                  >
                    {verifyingCode ? "Verifying..." : "Confirm"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My account</h1>
          <p className="text-muted-foreground">Manage your profile information and account settings.</p>
        </div>
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My account</h1>
        <p className="text-muted-foreground">Manage your profile information and account settings.</p>
      </div>
      <AccountForm initialUser={user} />
    </div>
  );
}
