import { useI18n } from "@/lib/I18nProvider";

export default function Metrics({ projects, metrics }: { projects?: any[]; metrics?: any }) {
  const { t } = useI18n();

  const computeAvailability = () => {
    if (metrics && typeof metrics.availability === "number") return metrics.availability
    let total = 0
    let up = 0
    for (const p of projects || []) {
      const urls = p?.statusUrls || {}
      for (const k of Object.keys(urls)) {
        total++
        if ((urls[k] && urls[k].status) === "active") up++
      }
    }
    return total > 0 ? Number(((up / total) * 100).toFixed(2)) : 0
  }

  const computeAvgResponse = () => {
    if (metrics && typeof metrics.avgResponseMs === "number") return metrics.avgResponseMs
    return null
  }

  const computeDaysWithout = () => {
    if (metrics && typeof metrics.daysWithoutIncident === "number") return metrics.daysWithoutIncident
    if (metrics && metrics.lastIncidentAt) {
      const diff = Date.now() - new Date(metrics.lastIncidentAt).getTime()
      return Math.floor(diff / (1000 * 60 * 60 * 24))
    }
    return null
  }

  const availability = computeAvailability()
  const avgResponseMs = computeAvgResponse()
  const daysWithoutIncident = computeDaysWithout()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-slate-50 dark:bg-primary/5 p-5 rounded-xl border border-slate-200 dark:border-primary/10">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{t("status.metrics.availability")}</p>
        <p className="text-2xl font-bold">{availability}%</p>
      </div>
      <div className="bg-slate-50 dark:bg-primary/5 p-5 rounded-xl border border-slate-200 dark:border-primary/10">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{t("status.metrics.daysWithout")}</p>
        <p className="text-2xl font-bold">{daysWithoutIncident !== null ? `${daysWithoutIncident} ${t("status.metrics.daysSuffix")}` : t("status.metrics.none")}</p>
      </div>
      <div className="bg-slate-50 dark:bg-primary/5 p-5 rounded-xl border border-slate-200 dark:border-primary/10">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{t("status.metrics.responseTime")}</p>
        <p className="text-2xl font-bold">{avgResponseMs !== null ? `${avgResponseMs}ms` : t("status.metrics.none")}</p>
      </div>
    </div>
  )
}
