"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Owner {
  id: string;
  name: string;
  email: string;
}

interface OAuthApp {
  id: string;
  client_id: string;
  name: string;
  description: string;
  is_first_party: boolean;
  owner: Owner;
  created_at: string;
}

export default function AdminApps() {
  const [apps, setApps] = useState<OAuthApp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await fetch("/api/v1/admin/apps");
      const data = await res.json();
      if (data.apps && Array.isArray(data.apps)) {
        setApps(data.apps);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleToggleFirstParty = async (id: string, currentStatus: boolean) => {
    const originalApps = [...apps];
    setApps(apps.map(app => app.id === id ? { ...app, is_first_party: !currentStatus } : app));

    try {
      const res = await fetch(`/api/v1/admin/apps/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_first_party: !currentStatus }),
      });

      if (!res.ok) throw new Error();
      toast.success("App updated successfully!");
    } catch {
      toast.error("Failed to update app.");
      setApps(originalApps);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OAuth Apps</h1>
          <p className="text-muted-foreground">Manage all OAuth applications and mark them as first-party.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading apps...</p>
        </div>
      ) : apps.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CardHeader>
            <CardTitle>No apps found</CardTitle>
            <CardDescription>No OAuth applications have been created yet.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {apps.map((app) => (
            <Card key={app.id} className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-3">
                    {app.name}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      app.is_first_party
                        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30"
                        : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-800"
                    }`}>
                      {app.is_first_party ? "First Party" : "Third Party"}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-sm pt-0.5 max-w-2xl">
                    {app.description || "No description provided."}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <input
                    id={`is-first-party-${app.id}`}
                    type="checkbox"
                    checked={app.is_first_party}
                    onChange={() => handleToggleFirstParty(app.id, app.is_first_party)}
                    className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <Label htmlFor={`is-first-party-${app.id}`} className="cursor-pointer text-sm font-medium">
                    Official App
                  </Label>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4 text-sm mt-2 p-4 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="text-muted-foreground text-xs block mb-1 uppercase tracking-wider font-semibold">Client ID</span>
                    <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs">
                      {app.client_id}
                    </code>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block mb-1 uppercase tracking-wider font-semibold">Owner</span>
                    <span className="font-medium text-foreground">{app.owner.name}</span>
                    <span className="text-muted-foreground ml-2">({app.owner.email})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
