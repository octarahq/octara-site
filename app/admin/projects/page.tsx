"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, X, ExternalLink, Pencil } from "lucide-react";

interface Service {
  id?: string;
  label: string;
  url: string;
  is_public: boolean;
  orion_id: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  github_url: string;
  is_public: boolean;
  services: Service[];
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/v1/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddServiceField = () => {
    setServices([...services, { label: "", url: "", is_public: false, orion_id: "" }]);
  };

  const handleRemoveServiceField = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string | boolean) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setName("");
    setDescription("");
    setAvatarUrl("");
    setGithubUrl("");
    setIsPublic(false);
    setServices([]);
    setShowForm(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description || "");
    setAvatarUrl(project.avatar_url || "");
    setGithubUrl(project.github_url || "");
    setIsPublic(project.is_public);
    setServices(project.services || []);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingProject(null);
    setName("");
    setDescription("");
    setAvatarUrl("");
    setGithubUrl("");
    setIsPublic(false);
    setServices([]);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project name is required.");
      return;
    }

    setSubmitting(true);
    const url = editingProject ? `/api/v1/projects/${editingProject.id}` : "/api/v1/projects";
    const method = editingProject ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          avatar_url: avatarUrl,
          github_url: githubUrl,
          is_public: isPublic,
          services: services.map((s) => ({
            label: s.label,
            url: s.url,
            is_public: s.is_public,
            orion_id: s.orion_id,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success(editingProject ? "Project updated successfully!" : "Project created successfully!");
      handleCloseForm();
      fetchProjects();
    } catch {
      toast.error(editingProject ? "Failed to update project." : "Failed to create project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Project deleted successfully!");
      fetchProjects();
    } catch {
      toast.error("Failed to delete project.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage details, visibility, and endpoints of your projects.</p>
        </div>
        {!showForm && (
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="size-4" />
            New Project
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="animate-in fade-in slide-in-from-top-4 duration-200">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingProject ? `Edit Project: ${editingProject.name}` : "Create New Project"}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseForm}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <CardDescription>Enter project details to register it in the directory.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My project name"
                  disabled={submitting}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the project"
                  disabled={submitting}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    disabled={submitting}
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="isPublic"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={submitting}
                  />
                  <Label htmlFor="isPublic" className="cursor-pointer">Publicly visible</Label>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="githubUrl">Github URL</Label>
                <Input
                  id="githubUrl"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  disabled={submitting}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Services</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddServiceField}
                    disabled={submitting}
                  >
                    Add Service
                  </Button>
                </div>

                {services.map((svc, index) => (
                  <div key={index} className="grid gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveServiceField(index)}
                      disabled={submitting}
                    >
                      <X className="size-3.5" />
                    </Button>
                    
                    <div className="grid gap-4 md:grid-cols-2 pt-4">
                      <div className="grid gap-1">
                        <Label className="text-xs" htmlFor={`svc-label-${index}`}>Label *</Label>
                        <Input
                          id={`svc-label-${index}`}
                          value={svc.label}
                          onChange={(e) => handleServiceChange(index, "label", e.target.value)}
                          placeholder="e.g. API Gateway"
                          required
                          disabled={submitting}
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-xs" htmlFor={`svc-url-${index}`}>URL</Label>
                        <Input
                          id={`svc-url-${index}`}
                          value={svc.url}
                          onChange={(e) => handleServiceChange(index, "url", e.target.value)}
                          placeholder="https://api.example.com"
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 mt-2">
                      <div className="grid gap-1">
                        <Label className="text-xs" htmlFor={`svc-orion-${index}`}>Orion ID *</Label>
                        <Input
                          id={`svc-orion-${index}`}
                          value={svc.orion_id}
                          onChange={(e) => handleServiceChange(index, "orion_id", e.target.value)}
                          placeholder="orion-service-1"
                          required
                          disabled={submitting}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-5">
                        <input
                          id={`svc-public-${index}`}
                          type="checkbox"
                          checked={svc.is_public}
                          onChange={(e) => handleServiceChange(index, "is_public", e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          disabled={submitting}
                        />
                        <Label htmlFor={`svc-public-${index}`} className="cursor-pointer text-xs">Public service</Label>
                      </div>
                    </div>
                  </div>
                ))}
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
                  {editingProject ? (submitting ? "Saving..." : "Save Changes") : (submitting ? "Creating..." : "Create Project")}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <CardHeader>
            <CardTitle>No projects found</CardTitle>
            <CardDescription>Get started by creating your very first project object.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleOpenCreate} className="mt-2">
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex gap-4 items-start">
                  {project.avatar_url ? (
                    <img
                      src={project.avatar_url}
                      alt={project.name}
                      className="size-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                    />
                  ) : (
                    <div className="size-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-lg text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="space-y-1">
                    <CardTitle className="text-xl flex items-center gap-3">
                      {project.name}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        project.is_public
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
                          : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-800"
                      }`}>
                        {project.is_public ? "Public" : "Private"}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-sm pt-0.5">
                      {project.description || "No description provided."}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-zinc-500 hover:text-foreground"
                    onClick={() => handleOpenEdit(project)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {project.services && project.services.length > 0 && (
                  <div className="mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Services</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {project.services.map((svc) => (
                        <div key={svc.id} className="text-xs flex items-center justify-between p-2.5 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-foreground">{svc.label}</span>
                            {svc.orion_id && (
                              <span className="font-mono text-[9px] text-muted-foreground">
                                ID: {svc.orion_id}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${
                              svc.is_public
                                ? "bg-emerald-50/50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/10 dark:text-emerald-400 dark:border-emerald-900/20"
                                : "bg-zinc-100/50 text-zinc-500 border-zinc-200/50 dark:bg-zinc-800/20 dark:text-zinc-500 dark:border-zinc-800/40"
                            }`}>
                              {svc.is_public ? "Public" : "Private"}
                            </span>
                            {svc.url && (
                              <a href={svc.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                <ExternalLink className="size-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
