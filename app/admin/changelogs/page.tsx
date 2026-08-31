"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, X, Pencil } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface Changelog {
  id: string;
  project_id: string;
  project: Project;
  title: string;
  content: string;
  created_at: string;
}

export default function AdminChangelogs() {
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingChangelog, setEditingChangelog] = useState<Changelog | null>(
    null,
  );
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchChangelogs = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/changelogs");
      const data = await res.json();
      if (Array.isArray(data)) setChangelogs(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/projects");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch {}
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mounted = true;
    const load = async () => {
      await Promise.all([fetchChangelogs(), fetchProjects()]);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [fetchChangelogs, fetchProjects]);

  const handleOpenCreate = () => {
    setEditingChangelog(null);
    setProjectId("");
    setTitle("");
    setContent("");
    setShowForm(true);
  };

  const handleOpenEdit = (log: Changelog) => {
    setEditingChangelog(log);
    setProjectId(log.project_id);
    setTitle(log.title);
    setContent(log.content);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingChangelog(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !projectId) {
      toast.error("Please fill all fields.");
      return;
    }

    setSubmitting(true);
    const url = editingChangelog
      ? `/api/v1/changelogs/${editingChangelog.id}`
      : "/api/v1/changelogs";
    const method = editingChangelog ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, title, content }),
      });

      if (!res.ok) throw new Error();

      toast.success(
        editingChangelog
          ? "Changelog updated!"
          : "Changelog created and sent to Discord!",
      );
      handleCloseForm();
      fetchChangelogs();
    } catch {
      toast.error(
        editingChangelog
          ? "Failed to update changelog."
          : "Failed to create changelog.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this changelog?")) return;
    try {
      const res = await fetch(`/api/v1/changelogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Changelog deleted successfully!");
      fetchChangelogs();
    } catch {
      toast.error("Failed to delete changelog.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Changelogs</h1>
          <p className="text-muted-foreground">
            Post updates and sync them to Discord.
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="size-4" />
            New Update
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingChangelog ? "Edit Update" : "Create New Update"}
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseForm}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <CardDescription>
                {editingChangelog
                  ? "Update the content of this changelog."
                  : "Post an update. It will be immediately sent via the Discord webhook."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Project *</Label>
                <select
                  id="project"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                  disabled={submitting}
                >
                  <option value="" disabled>
                    Select a project
                  </option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="v1.2.0 is out!"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Content (Markdown) *</Label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="- Added new feature X..."
                  required
                  disabled={submitting}
                  className="flex min-h-37.5 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseForm}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editingChangelog
                      ? "Save Changes"
                      : "Post Update"}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading changelogs...</p>
        </div>
      ) : changelogs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CardHeader>
            <CardTitle>No changelogs yet</CardTitle>
            <CardDescription>
              Keep your users informed by posting your first update.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleOpenCreate} className="mt-2">
              Post Update
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {changelogs.map((log) => (
            <Card
              key={log.id}
              className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {log.project?.name || "Unknown"}
                    </span>
                    <span>{new Date(log.created_at).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="text-xl">{log.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-zinc-500 hover:text-foreground"
                    onClick={() => handleOpenEdit(log)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => handleDelete(log.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
