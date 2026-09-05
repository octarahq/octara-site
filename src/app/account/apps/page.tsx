"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ShieldX } from 'lucide-react';

interface ConnectedApp {
  client_id: string;
  name: string;
  logoData: string;
  scopes: string[];
}

export default function ConnectedAppsPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<ConnectedApp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/v1/oauth/consents');
      if (!res.ok) throw new Error('Failed to load connected apps');
      const data = await res.json();
      setApps(data || []);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchApps(); 
    }
  }, [user]);

  const handleRevoke = async (clientId: string) => {
    if (!confirm('Are you sure you want to revoke access for this application? It will no longer be able to access your account.')) return;
    try {
      const res = await fetch(`/api/v1/oauth/consents/${clientId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to revoke access');
      setApps(apps.filter(a => a.client_id !== clientId));
      toast.success('Access revoked');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const VALID_SCOPES: Record<string, string> = {
    "identify": "Access your basic profile information",
    "read:profile": "Access your complete profile information",
    "read:search_history": "Read your Octara Search history",
    "write:search_history": "Modify or clear your Octara Search history",
    "read:search_settings": "View your search engine settings",
    "write:search_settings": "Modify your search engine settings",
    "read:search_domains": "View your verified domains for Octara Search",
    "write:search_domains": "Manage your verified domains",
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Connected Apps</h1>
        <p className="text-muted-foreground">Applications you have granted access to your Octara account.</p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center p-12 border rounded-xl border-dashed">
          <p className="text-muted-foreground">You have no connected applications.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {apps.map(app => (
            <Card key={app.client_id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{app.name}</CardTitle>
                  <CardDescription>
                    Has access to: {app.scopes?.map(s => VALID_SCOPES[s] || s).join(', ')}
                  </CardDescription>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleRevoke(app.client_id)}>
                  <ShieldX className="mr-2 h-4 w-4" /> Revoke Access
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mt-4 text-sm text-zinc-500">
                  Client ID: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">{app.client_id}</code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
