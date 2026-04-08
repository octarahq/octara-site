const dotenv = require("dotenv");
dotenv.config();

const INTERVAL_MS = 60_000;

// When true, the webhook is sent every tick for any project in down status.
// When false, the webhook is sent only when a project transitions from up -> down.
const FORCE_WEBHOOK_ON_EVERY_TICK = true;

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
  const PROJECTS_URL =
    "https://raw.githubusercontent.com/octarahq/.github/main/assets/projects.json";

  try {
    const res = await fetch(PROJECTS_URL, { next: { revalidate: 60 } });
    if (!res.ok) return [];

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      // The source may use unquoted object keys; try to normalize before parsing.
      const normalized = text.replace(
        /([\{,\n\r\s]+)([A-Za-z0-9_\-]+)\s*:/g,
        '$1"$2":',
      );
      try {
        return JSON.parse(normalized);
      } catch (e2) {
        return [];
      }
    }
  } catch (e) {
    return [];
  }
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

        const webhookUrlRaw = process.env.DISCORD_STATUS_WEBHOOK_URL;
        const webhookUrl = webhookUrlRaw
          ? webhookUrlRaw.trim().replace(/^"|"$/g, "")
          : null;

        console.log(
          "[status timer bootstrap] force webhook:",
          FORCE_WEBHOOK_ON_EVERY_TICK,
          "webhook url configured:",
          !!webhookUrl,
        );

        const sendStatusWebhook = async (payload) => {
          console.log("[status timer bootstrap] sending webhook");
          console.log(JSON.stringify(payload));
          console.log("[status timer bootstrap] webhook url", {
            webhookUrl: !!webhookUrl,
          });
          if (!webhookUrl) return;
          try {
            let bodyObj;
            if (typeof payload === "string") {
              bodyObj = { content: payload };
            } else if (Array.isArray(payload)) {
              // Discord webhook expects an object; attach components to top-level
              // include components V2 flag (32768) as requested and set content null
              bodyObj = { content: null, components: payload, flags: 32768 };
            } else {
              bodyObj = payload;
            }
            const res = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(bodyObj),
            });
            if (!res.ok) {
              console.log(await res.text());
            }
          } catch (err) {
            console.error("[status timer bootstrap] webhook send failed", err);
          }
        };

        const buildDiscordPayloadForProject = (project) => {
          const name = project.name || project.id || "Unknown";
          const ts = Math.floor(Date.now() / 1000);
          const statusMap = {
            active: { emoji: ":white_check_mark:", text: "Operational" },
            maintenance: { emoji: ":warning:", text: "Under Maintenance" },
            down: { emoji: ":x:", text: "Outage" },
            degraded: { emoji: ":warning:", text: "Degraded" },
            experimental: { emoji: ":grey_question:", text: "Experimental" },
            archived: { emoji: ":black_large_square:", text: "Archived" },
          };

          const statusLines = Object.entries(project.statusUrls || {}).map(
            ([k, v]) => {
              const s = (v && v.status) || "active";
              const map = statusMap[s] || statusMap.active;
              return `- ${map.emoji} ${k}  -  ${map.text}`;
            },
          );

          const mainUrl =
            project.mainUrl ||
            (project.siteUrl
              ? normalizeMainUrl(project.siteUrl)
              : "https://octara.xyz");

          // build favicon/media url (use absolute if provided, else derive from mainUrl)
          let faviconUrl = "";
          if (project.favicon) {
            const rawFav = String(project.favicon || "").trim();
            if (/^https?:\/\//i.test(rawFav)) faviconUrl = rawFav;
            else if (rawFav.startsWith("/"))
              faviconUrl = (mainUrl || "https://octara.xyz") + rawFav;
            else faviconUrl = (mainUrl || "https://octara.xyz") + "/" + rawFav;
          }

          const components = [
            {
              type: 9,
              // accessory: {
              //   type: 11,
              //   media: { url: faviconUrl },
              //   description: null,
              //   spoiler: false,
              // },
              components: [{ type: 10, content: "# Octara Status" }],
            },
            {
              type: 10,
              content: `:warning: Major outage affecting ${name}\nSome features may be unavailable.\n\nLast updated: <t:${ts}:R>`,
            },
            { type: 14, divider: true, spacing: 1 },
            { type: 10, content: `## ${name} Services Status` },
            { type: 10, content: statusLines.join("\n") },
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label: "View Octara Status",
                  // emoji: null,
                  disabled: false,
                  url: "https://octara.xyz",
                },
                {
                  type: 2,
                  style: 5,
                  label: `${name} Website`,
                  // emoji: null,
                  disabled: false,
                  url: mainUrl,
                },
              ],
            },
          ];

          return [
            {
              type: 17,
              accent_color: 1048576,
              spoiler: false,
              components,
            },
          ];
        };

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

        const forcedDown = [];
        let firstProjectName = null;
        let firstProjectObj = null;
        const projectMap = new Map();

        for (const group of groups || []) {
          for (const project of group.projects || []) {
            const id = project.id || project.name || "";
            const name = project.name || id || "";
            if (!firstProjectName) firstProjectName = name;
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

            const wasDown = prev && prev.status === "down";
            console.log(
              `[status timer bootstrap] project ${name} status: ${finalStatus} (was: ${prev ? prev.status : "n/a"})`,
            );
            if (!firstProjectObj) {
              firstProjectObj = {
                id,
                name,
                mainUrl,
                statusUrls: transformed,
                status: finalStatus,
              };
            }

            // store project snapshot for later payload building
            projectMap.set(name, {
              id,
              name,
              mainUrl,
              statusUrls: transformed,
              status: finalStatus,
            });

            if (FORCE_WEBHOOK_ON_EVERY_TICK) {
              if (finalStatus === "down") forcedDown.push(name);
            } else if (!wasDown && finalStatus === "down") {
              // void sendStatusWebhook(`Project ${name} down`);
            }

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
        console.log(
          `[status timer bootstrap] tick completed. Total endpoints: ${totalEndpoints}, Up endpoints: ${upCount}, Average response time: ${responseTimesAll.length > 0 ? (responseTimesAll.reduce((a, b) => a + b, 0) / responseTimesAll.length).toFixed(2) : "n/a"} ms`,
        );

        if (FORCE_WEBHOOK_ON_EVERY_TICK) {
          if (forcedDown.length > 0) {
            const distinct = [...new Set(forcedDown)];
            const chosen = distinct[0];
            const proj = projectMap.get(chosen) || firstProjectObj;
            if (proj) {
              const payload = buildDiscordPayloadForProject(proj);
              console.log(
                `[status timer bootstrap] forced webhook payload for ${proj.name}`,
              );
              // void sendStatusWebhook(payload);
            }
          } else if (firstProjectObj) {
            const payload = buildDiscordPayloadForProject(firstProjectObj);
            console.log(
              `[status timer bootstrap] forced webhook fallback payload for ${firstProjectObj.name}`,
            );
            // void sendStatusWebhook(payload);
          } else {
            console.log(
              "[status timer bootstrap] forced webhook enabled, but no project name available",
            );
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
