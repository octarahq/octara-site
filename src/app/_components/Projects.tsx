"use client";

import React, { useEffect, useState } from "react";
import { getProjects, ProjectsData, Project } from "../../utils/projects";
import { useI18n } from "@/lib/I18nProvider";
import Link from "next/link";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let mounted = true;
    getProjects().then((data: ProjectsData) => {
      if (!mounted) return;
      setProjects(data.flatMap((g) => g.projects || []));
    });
    return () => {
      mounted = false;
    };
  }, []);

  const { t } = useI18n();

  return (
    <section className="px-6 lg:px-20 py-20 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold">
              {t("projects.title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {t("projects.description")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 && (
            <div className="col-span-full text-center text-slate-500">
              {t("projects.none")}
            </div>
          )}

          {projects.map((project) => {
            let baseDomain = "octara.xyz";
            let origin = "";
            try {
              const hostname = window.location.hostname;
              const parts = hostname.split(".");
              const isLocalhost =
                hostname === "localhost" || hostname === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
              if (!isLocalhost && parts.length >= 2) {
                baseDomain = parts.slice(-2).join(".");
              }
              origin = window.location.origin;
            } catch (e) {}

            const buildSiteUrl = (site: string) => {
              if (!site) return "";
              if (site.startsWith("http://") || site.startsWith("https://"))
                return site.replace(/\/$/, "");
              return `https://${site}.${baseDomain}`;
            };

            const siteHref = buildSiteUrl(project.siteUrl);

            const buildFavicon = (favicon: string) => {
              if (!favicon) return "";
              if (
                favicon.startsWith("http://") || favicon.startsWith("https://")
              )
                return favicon;
              try {
                const siteOrigin = siteHref
                  ? new URL(siteHref).origin
                  : origin || "";
                if (!siteOrigin) return favicon;
                if (favicon.startsWith("/")) return siteOrigin + favicon;
                return siteOrigin + "/" + favicon.replace(/^\/+/, "");
              } catch (e) {
                return favicon;
              }
            };

            const faviconUrl = buildFavicon(project.favicon);

            return (
              <div
                key={project.id}
                className="flex flex-col gap-4 group relative"
              >
                <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <img
                    src={faviconUrl}
                    alt={project.name}
                    className="max-h-[85%] max-w-[85%] object-contain"
                  />
                  <div className="absolute top-4 right-4 px-2 py-1 bg-background-dark/80 backdrop-blur rounded text-[10px] font-bold text-white border border-white/10 uppercase tracking-tighter">
                    {project.version}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-slate-900 dark:text-white text-xl font-bold group-hover:text-primary transition-colors">
                    <Link
                      href={siteHref}
                      className="after:absolute after:inset-0 after:z-0"
                    >
                      {project.name}
                    </Link>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {project.descriptions?.fr || project.descriptions?.en}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {project.platforms?.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase"
                      >
                        {p}
                      </span>
                    ))}
                    {project.tags?.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-medium rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 relative z-10">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-primary"
                      >
                        {t("projects.github")}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
