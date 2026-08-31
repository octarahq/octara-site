"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HeroBackground } from "@/app/(home)/_components/hero";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function ChangelogPage() {
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch("/api/v1/changelogs"),
          fetch("/api/v1/projects"),
        ]);
        const cData = await cRes.json();
        const pData = await pRes.json();
        if (Array.isArray(cData)) setChangelogs(cData);
        if (Array.isArray(pData)) setProjects(pData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredChangelogs = useMemo(() => {
    if (activeProject === "all") return changelogs;
    return changelogs.filter((c) => c.project_id === activeProject);
  }, [changelogs, activeProject]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleProjectChange = (projectId: string) => {
    setActiveProject(projectId);
    if (containerRef.current) {
      const topOffset =
        containerRef.current.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen relative bg-[#0a0a0a] text-zinc-50 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="fixed inset-0 z-0 pointer-events-none opacity-40"
      >
        <HeroBackground />
      </motion.div>

      <div
        ref={containerRef}
        className="relative z-10 container mx-auto px-4 py-24 max-w-6xl flex flex-col md:flex-row gap-12"
      >
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                Changelog
              </h1>
              <p className="text-sm text-zinc-400">
                New updates and improvements to our services.
              </p>
            </div>

            <nav className="flex flex-col gap-1">
              <button
                onClick={() => handleProjectChange("all")}
                className={cn(
                  "text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  activeProject === "all"
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5",
                )}
              >
                All Updates
              </button>
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectChange(project.id)}
                  className={cn(
                    "text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    activeProject === project.id
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  {project.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="size-8 animate-spin text-zinc-500" />
            </div>
          ) : filteredChangelogs.length === 0 ? (
            <div className="text-center py-32 text-zinc-400 bg-[#111111]/80 backdrop-blur-md rounded-xl border border-zinc-800/80">
              No updates available for this selection.
            </div>
          ) : (
            <div className="space-y-16">
              {filteredChangelogs.map((log) => {
                const date = new Date(log.created_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                );

                return (
                  <div key={log.id} className="relative pl-8 md:pl-0">
                    <div className="md:grid md:grid-cols-4 md:items-start md:gap-8">
                      <div className="mb-4 md:mb-0 md:col-span-1 md:sticky md:top-24 flex flex-col items-start gap-3">
                        <span className="text-sm font-semibold text-zinc-400">
                          {date}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20">
                          {log.project?.name || "Unknown"}
                        </span>
                      </div>

                      <div className="md:col-span-3 bg-[#111111]/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 md:p-8 shadow-2xl hover:border-zinc-700/80 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-6">
                          {log.title}
                        </h2>

                        <div className="prose prose-invert prose-zinc max-w-none prose-p:text-zinc-300 prose-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-code:text-emerald-400 prose-code:bg-emerald-400/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {log.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
