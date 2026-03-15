const INTERVAL_MS = 60_000;
const BASE_DOMAIN = "octara.xyz";

function normalizeMainUrl(siteRaw) {
  if (!siteRaw) return "";
  siteRaw = siteRaw.trim();
  try {
    if (/^https?:\/\//i.test(siteRaw)) {
      return new URL(siteRaw).origin;
    }
    if (siteRaw.includes("/")) {
      return new URL("https://" + siteRaw).origin;
    }
    if (siteRaw.includes(".")) return "https://" + siteRaw;
    return "https://" + siteRaw + "." + BASE_DOMAIN;
  } catch (e) {
    return siteRaw ? "https://" + siteRaw : "";
  }
}

async function fetchProjects() {
  try {
    const utils = require("../src/utils/projects");
    if (utils && typeof utils.getProjects === "function") {
      const data = await utils.getProjects();
      return data || [];
    }
  } catch (e) {}
}

try {
  if (!global.__octara_status_timer_started) {
    global.__octara_status_timer_started = true;

    const tick = async () => {
      try {
        const groups = await fetchProjects();
        const existing = global.__octara_status_projects_snapshot || {
          projects: [],
        };
        const existingById = new Map();
        for (const p of existing.projects || [])
          if (p && p.id) existingById.set(p.id, p);

        const newSnapshot = [];

        const probeUrl = async (url) => {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            const start = Date.now();
            const res = await fetch(url, {
              method: "GET",
              signal: controller.signal,
            });
            const ms = Date.now() - start;
            clearTimeout(timeout);
            return { ok: Boolean(res && res.ok), ms };
          } catch (e) {
            return { ok: false, ms: null };
          }
        };

        let totalEndpoints = 0;
        let upCount = 0;
        let responseTimesAll = [];

        for (const group of groups || []) {
          for (const project of group.projects || []) {
            const id = project.id || project.name || "";
            const name = project.name || id || "";
            const statusUrls = project.statusUrls || {};
            const mainUrl = normalizeMainUrl(project.siteUrl || "");
            const prev = existingById.get(id);
            const records =
              prev && Array.isArray(prev.records) ? prev.records : [];

            const transformed = {};
            const endpointResults = [];
            const responseTimes = [];

            for (const [k, raw] of Object.entries(statusUrls || {})) {
              const rawUrl = (raw && raw.url) || raw || "";
              let absolute = "";
              try {
                if (/^https?:\/\//i.test(rawUrl)) absolute = rawUrl;
                else if (rawUrl.startsWith("/"))
                  absolute =
                    (mainUrl || "https://" + (project.siteUrl || "")) + rawUrl;
                else
                  absolute =
                    (mainUrl || "https://" + (project.siteUrl || "")) +
                    "/" +
                    rawUrl;
              } catch (e) {
                absolute = rawUrl;
              }

              const result = await probeUrl(absolute);
              const statusStr = result.ok ? "active" : "down";
              transformed[k] = { url: String(rawUrl || ""), status: statusStr };
              endpointResults.push(statusStr);
              if (typeof result.ms === "number") responseTimes.push(result.ms);
            }

            const probeStatus = endpointResults.includes("down")
              ? "down"
              : "active";

            const originalStatus = project.status || "active";
            const priority = new Set([
              "degraded",
              "maintenance",
              "experimental",
              "archived",
            ]);
            const finalStatus = priority.has(originalStatus)
              ? originalStatus
              : probeStatus;

            newSnapshot.push({
              id,
              name,
              mainUrl,
              statusUrls: transformed,
              records,
              status: finalStatus,
            });

            // If the project is in maintenance, exclude its endpoints from incident calculations
            if (finalStatus !== "maintenance") {
              totalEndpoints += endpointResults.length;
              upCount += endpointResults.filter((s) => s === "active").length;
            }
            responseTimesAll = responseTimesAll.concat(responseTimes);
          }
        }

        const now = new Date().toISOString();
        const existingMetrics = (existing && existing.metrics) || {};
        const anyDown = upCount < totalEndpoints && totalEndpoints > 0;

        const availability =
          totalEndpoints && totalEndpoints > 0
            ? Number(((upCount / totalEndpoints) * 100).toFixed(2))
            : 0;
        const avgResponseMs =
          responseTimesAll.length > 0
            ? Math.round(
                responseTimesAll.reduce((a, b) => a + b, 0) /
                  responseTimesAll.length,
              )
            : null;

        let lastIncidentAt = existingMetrics.lastIncidentAt || null;
        if (anyDown) lastIncidentAt = now;

        let daysWithoutIncident = null;
        if (lastIncidentAt) {
          const diff = Date.now() - new Date(lastIncidentAt).getTime();
          daysWithoutIncident = Math.floor(diff / (1000 * 60 * 60 * 24));
        }

        const metrics = {
          availability,
          avgResponseMs,
          daysWithoutIncident,
          lastIncidentAt,
          updatedAt: now,
        };

        global.__octara_status_projects_snapshot = {
          projects: newSnapshot,
          metrics,
        };

        try {
          const fs = require("fs");
          const path = require("path");
          const outPath = path.join(__dirname, "status-snapshot.json");
          await fs.promises.writeFile(
            outPath,
            JSON.stringify({ projects: newSnapshot, metrics }, null, 2),
            "utf8",
          );
        } catch (werr) {
          console.error("[status timer bootstrap] failed to write", werr);
        }
      } catch (err) {
        console.error("[status timer bootstrap] tick error", err);
      }
    };

    void tick();
    setInterval(() => void tick(), INTERVAL_MS);
  }
} catch (e) {
  console.error("[status timer bootstrap] failed to start", e);
}

module.exports = true;
