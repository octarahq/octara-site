"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, User } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Composant interne pour le Formulaire (affiché uniquement quand l'utilisateur est chargé)
function AccountForm({ initialUser }: { initialUser: User }) {
  const { setUser } = useAuth();
  const [username, setUsername] = useState(initialUser.username);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Le nom d'utilisateur ne peut pas être vide");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/v1/users/@me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        throw new Error("Erreur de mise à jour");
      }

      setUser({
        email: initialUser.email,
        username: username,
      });

      toast.success("Profil mis à jour avec succès !");
    } catch {
      toast.error("Impossible de sauvegarder les détails.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardHeader className="relative">
          <div className="flex flex-col gap-1">
            <CardTitle>Profile details</CardTitle>
            <CardDescription>Your personal informations.</CardDescription>
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
              placeholder="Your username"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={initialUser.email}
              disabled
              className="bg-muted/50 cursor-not-allowed"
              placeholder="ludovic.crushot@octara.xyz"
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My account</h1>
          <p className="text-muted-foreground">
            Manage your profile information and account settings.
          </p>
        </div>
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My account</h1>
        <p className="text-muted-foreground">
          Manage your profile information and account settings.
        </p>
      </div>
      <AccountForm initialUser={user} />
    </div>
  );
}
