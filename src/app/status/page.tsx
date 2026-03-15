import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "./_components/Hero";
import Incidents from "./_components/Incidents";
import History from "./_components/History";
import Metrics from "./_components/Metrics";
import Services from "./_components/Services";
import { ProjectStatus } from "@/utils/projects";
import { getStatus, OctaraStatus } from "@/utils/incident";
import { headers } from "next/headers";
import { detectLocale, loadTranslations } from "@/lib/i18n";
import { I18nProvider } from "@/lib/I18nProvider";

export default async function Page() {
  type SnapshotProject = {
    id: string;
    name: string;
    mainUrl: string;
    statusUrls: Record<
      string,
      { url: string; status: ProjectStatus | "degraded" }
    >;
    records: unknown[];
  };

  let projects: SnapshotProject[] = [];
  let metrics: any = null;
  let status: OctaraStatus | null = null;

  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "server", "status-snapshot.json");
    const data = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(data);
    projects = Array.isArray(json?.projects) ? json.projects : [];
    metrics = json?.metrics ?? null;
  } catch (err) {}

  try {
    status = await getStatus();
  } catch (err) {}

  const acceptLanguage = (headers() as any)["accept-language"] ?? "";
  const lang = detectLocale(acceptLanguage);
  const translations = await loadTranslations(lang, "/status");

  const lastUpdated = status?.lastUpdated ? new Date(status.lastUpdated) : null;
  const lastUpdatedText = lastUpdated
    ? lastUpdated.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      })
    : "—";

  const downCount = projects.reduce((count, project) => {
    const statuses = Object.values(project.statusUrls || {}).map((s) => s?.status);
    return count + statuses.filter((s) => s === "down").length;
  }, 0);

  const hasDown = downCount > 0;
  const downTitle = translations["status.page.title.down"] ?? "1 system down";
  const downTitleMany =
    translations["status.page.title.downMany"] ?? "{count} systems down";

  const title = hasDown
    ? downCount === 1
      ? downTitle
      : downTitleMany.replace("{count}", String(downCount))
    : translations["status.page.title"] ?? "Tous les systèmes opérationnels";

  const bgGradient = hasDown
    ? "linear-gradient(to right, rgba(239,68,68,0.2), rgba(244,63,94,0.1))"
    : "linear-gradient(to right, rgba(16,185,129,0.2), rgba(59,130,246,0.1))";
  const borderColor = hasDown ? "rgba(239,68,68,0.3)" : "rgba(16,185,129,0.3)";
  const pingColor = hasDown ? "rgba(239,68,68,0.75)" : "rgba(16,185,129,0.75)";
  const dotColor = hasDown ? "#ef4444" : "#10b981";

  return (
    <I18nProvider lang={lang} translations={translations}>
      <Header />
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
              {translations["status.page.lastUpdated"]
                ? translations["status.page.lastUpdated"].replace("{when}", lastUpdatedText)
                : `Dernière mise à jour : ${lastUpdatedText} UTC`}
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 px-6 md:px-20 lg:px-40 py-10 max-w-[1200px] mx-auto w-full">
        <Hero projects={projects} />
        <Incidents status={status} />
        <History status={status} />
        <Metrics projects={projects} metrics={metrics} />
        <Services projects={projects} />
      </main>

      <Footer />
    </I18nProvider>
  );
}
