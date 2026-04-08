"use client";

import React, { useEffect, useState } from "react";
import Hero from "./_components/Hero";
import Incidents from "./_components/Incidents";
import History from "./_components/History";
import Metrics from "./_components/Metrics";
import Services from "./_components/Services";
import { useI18n } from "@/lib/I18nProvider";

const INCIDENT_URL =
  "https://raw.githubusercontent.com/octarahq/.github/main/assets/incidents.json";

export default function StatusContent() {
  const [projects, setProjects] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [status, setStatus] = useState<any | null>(null);
  const [snapshotUpdated, setSnapshotUpdated] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSnapshot() {
      try {
        const res = await fetch("/api/status-snapshot");
        const json = await res.json();
        if (!mounted) return;
        setProjects(Array.isArray(json?.projects) ? json.projects : []);
        setMetrics(json?.metrics ?? null);

        const updated = json?.metrics?.updatedAt ?? json?.updatedAt ?? null;
        setSnapshotUpdated(updated ?? null);
      } catch (e) {}
    }

    async function loadIncidents() {
      try {
        const res = await fetch(INCIDENT_URL);
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        setStatus(json);
      } catch (e) {}
    }

    loadSnapshot();
    loadIncidents();

    return () => {
      mounted = false;
    };
  }, []);

  const lastUpdatedSource = snapshotUpdated ?? status?.lastUpdated ?? null;
  const lastUpdated = lastUpdatedSource ? new Date(lastUpdatedSource) : null;
  const lastUpdatedText = lastUpdated
    ? lastUpdated.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "—";

  const projectSeverities = projects.map((project) => {
    const statuses = Object.values(project.statusUrls || {}).map(
      (s: any) => (s as any)?.status,
    );
    if (project?.status === "maintenance") return "maintenance";
    if (statuses.includes("down")) return "down";
    if (statuses.includes("degraded")) return "degraded";
    return "active";
  });

  const downCount = projectSeverities.filter((s) => s === "down").length;
  const maintenanceCount = projectSeverities.filter(
    (s) => s === "maintenance",
  ).length;

  const hasDown = downCount > 0;
  const hasMaintenance = !hasDown && maintenanceCount > 0;

  const bgGradient = hasDown
    ? "linear-gradient(to right, rgba(239,68,68,0.2), rgba(244,63,94,0.1))"
    : hasMaintenance
      ? "linear-gradient(to right, rgba(245,158,11,0.12), rgba(245,158,11,0.06))"
      : "linear-gradient(to right, rgba(16,185,129,0.2), rgba(59,130,246,0.1))";

  const borderColor = hasDown
    ? "rgba(239,68,68,0.3)"
    : hasMaintenance
      ? "rgba(245,158,11,0.28)"
      : "rgba(16,185,129,0.3)";
  const pingColor = hasDown
    ? "rgba(239,68,68,0.75)"
    : hasMaintenance
      ? "rgba(245,158,11,0.75)"
      : "rgba(16,185,129,0.75)";
  const dotColor = hasDown ? "#ef4444" : hasMaintenance ? "#f59e0b" : "#10b981";

  return (
    <>
      <StatusHeaderArea
        bgGradient={bgGradient}
        borderColor={borderColor}
        pingColor={pingColor}
        dotColor={dotColor}
        downCount={downCount}
        maintenanceCount={maintenanceCount}
        hasMaintenance={hasMaintenance}
        hasDown={hasDown}
        lastUpdatedText={lastUpdatedText}
      />

      <main className="flex-1 px-6 md:px-20 lg:px-40 py-10 max-w-[1200px] mx-auto w-full">
        <Hero projects={projects} />
        <Incidents status={status} />
        <History status={status} />
        <Metrics projects={projects} metrics={metrics} />
        <Services projects={projects} />
      </main>
    </>
  );
}

function StatusHeaderArea({
  bgGradient,
  borderColor,
  pingColor,
  dotColor,
  downCount,
  maintenanceCount,
  hasMaintenance,
  hasDown,
  lastUpdatedText,
}: {
  bgGradient: string;
  borderColor: string;
  pingColor: string;
  dotColor: string;
  downCount: number;
  maintenanceCount: number;
  hasMaintenance: boolean;
  hasDown: boolean;
  lastUpdatedText: string;
}) {
  const { t } = useI18n();

  const get = (key: string, fallback: string) => {
    const v = t(key);
    return v && v !== key ? v : fallback;
  };

  const downTitle = t("status.page.title.down");
  const downTitleMany = t("status.page.title.downMany", { count: downCount });
  const maintenanceTitle = t("status.page.title.maintenance");
  const maintenanceTitleMany = t("status.page.title.maintenanceMany", {
    count: maintenanceCount,
  });

  const title = hasDown
    ? downCount === 1
      ? downTitle && downTitle !== "status.page.title.down"
        ? downTitle
        : "1 système hors service"
      : downTitleMany && downTitleMany !== "status.page.title.downMany"
        ? downTitleMany
        : `${downCount} systèmes hors service`
    : hasMaintenance
      ? maintenanceCount === 1
        ? maintenanceTitle &&
          maintenanceTitle !== "status.page.title.maintenance"
          ? maintenanceTitle
          : "1 système en maintenance"
        : maintenanceTitleMany &&
            maintenanceTitleMany !== "status.page.title.maintenanceMany"
          ? maintenanceTitleMany
          : `${maintenanceCount} systèmes en maintenance`
      : get("status.page.title.operational", "Tous les systèmes opérationnels");

  const lastUpdatedLabel = (() => {
    const v = t("status.page.lastUpdated", { when: lastUpdatedText });
    if (v && v !== "status.page.lastUpdated") return v;
    return `Dernière mise à jour : ${lastUpdatedText} UTC`;
  })();

  return (
    <div
      className="w-full bg-gradient-to-r to-primary/10 border-b px-6 md:px-20 lg:px-40 py-12"
      style={{
        backgroundImage: bgGradient,
        borderBottomColor: borderColor,
      }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="relative flex h-6 w-6">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full"
                style={{ backgroundColor: pingColor }}
              ></span>
              <span
                className="relative inline-flex rounded-full h-6 w-6"
                style={{ backgroundColor: dotColor }}
              ></span>
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            {lastUpdatedLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
