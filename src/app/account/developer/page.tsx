"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Trash2, KeyRound, ExternalLink, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface OAuthApp {
  ID: string;
  ClientID: string;
  ClientSecretHash?: string;
  Name: string;
  Description: string;
  LogoURL: string;
  RedirectURIs: string[];
}

export default function DeveloperPage() {
  const { user } = useAuth();
  const [apps, setApps] = useState<OAuthApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    redirect_uris: '',
  });

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/v1/apps');
      if (!res.ok) throw new Error('Failed to load apps');
      const data = await res.json();
      setApps(data);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const uris = formData.redirect_uris.split(',').map(u => u.trim()).filter(u => u);
      const res = await fetch('/api/v1/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          redirect_uris: uris,
        })
      });
      if (!res.ok) throw new Error('Failed to create app');
      const data = await res.json();
      setApps([...apps, data]);
      setNewSecret(data.ClientSecretHash);
      setIsCreating(false);
      setFormData({ name: '', description: '', redirect_uris: '' });
      toast.success('Application created!');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;
    try {
      const res = await fetch(`/api/v1/apps/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setApps(apps.filter(a => a.ID !== id));
      toast.success('App deleted');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  const handleRotateSecret = async (id: string) => {
    if (!confirm('Are you sure? The old secret will stop working immediately.')) return;
    try {
      const res = await fetch(`/api/v1/apps/${id}/rotate-secret`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to rotate secret');
      const data = await res.json();
      setNewSecret(data.ClientSecretHash);
      toast.success('Secret rotated successfully');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Developer Portal</h1>
          <p className="text-muted-foreground">Create and manage your OAuth applications.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" /> New App
        </Button>
      </div>

      {newSecret && (
        <Card className="border-green-500 bg-green-500/10">
          <CardHeader>
            <CardTitle className="text-green-500 flex items-center gap-2">
              <KeyRound className="h-5 w-5" /> Keep this secret safe!
            </CardTitle>
            <CardDescription className="text-green-400">
              This is the only time we will show you the client secret. Copy it now!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-black/40 rounded-lg text-green-400 font-mono text-sm break-all">
              {newSecret}
            </div>
            <Button className="mt-4" onClick={() => setNewSecret(null)}>I have copied it</Button>
          </CardContent>
        </Card>
      )}

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Application</CardTitle>
            <CardDescription>Setup a new OAuth application to integrate with Octara.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">App Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Awesome App"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does your app do?"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="redirect_uris">Redirect URIs (comma separated)</Label>
                <Input
                  id="redirect_uris"
                  value={formData.redirect_uris}
                  onChange={e => setFormData({ ...formData, redirect_uris: e.target.value })}
                  placeholder="https://myapp.com/callback, http://localhost:3000/callback"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit">Create Application</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading apps...</p>
        </div>
      ) : apps.length === 0 && !isCreating ? (
        <div className="text-center p-12 border rounded-xl border-dashed">
          <p className="text-muted-foreground mb-4">You have no OAuth applications yet.</p>
          <Button variant="outline" onClick={() => setIsCreating(true)}>Create your first app</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {apps.map(app => (
            <Card key={app.ID}>
              <CardHeader className="relative">
                <CardTitle>{app.Name}</CardTitle>
                <CardDescription>{app.Description || 'No description provided.'}</CardDescription>
                <CardAction>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleRotateSecret(app.ID)}>
                      Rotate Secret
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(app.ID)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Client ID</span>
                  <code className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-sm w-fit">
                    {app.ClientID}
                  </code>
                </div>
                <div className="grid gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Redirect URIs</span>
                  <div className="flex flex-col gap-1">
                    {app.RedirectURIs?.map(uri => (
                      <span key={uri} className="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                        <ExternalLink className="h-3 w-3" /> {uri}
                      </span>
                    ))}
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
