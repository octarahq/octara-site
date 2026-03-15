"use client";

import type { OctaraStatus, Incident } from '@/utils/incident'
import { useI18n } from '@/lib/I18nProvider'

export default function Incidents({ status }: { status?: OctaraStatus | null }) {
  const { t } = useI18n();

  const statusStyles: Record<Incident['updates'][number]['status'], { label: string; className: string }> = {
    investigating: { label: t('status.incidents.label.investigating'), className: 'bg-amber-100 text-amber-700' },
    identified: { label: t('status.incidents.label.identified'), className: 'bg-orange-100 text-orange-700' },
    monitoring: { label: t('status.incidents.label.monitoring'), className: 'bg-blue-100 text-blue-700' },
    resolved: { label: t('status.incidents.label.resolved'), className: 'bg-emerald-100 text-emerald-700' },
  }

  function getLatestUpdate(incident: Incident) {
    return incident.updates[incident.updates.length - 1]
  }

  const incidents = status?.incidents ?? []
  const activeIncidents = incidents.filter((incident) => {
    const latest = getLatestUpdate(incident)
    return latest?.status !== 'resolved'
  })

  if (!activeIncidents.length) {
    return (
      <section className="mb-12">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">{t("status.incidents.title")}</h2>
        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-primary/20 bg-slate-50/50 dark:bg-primary/5 p-12 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-primary/20 mb-4">notification_important</span>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t("status.incidents.none")}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">{t("status.incidents.title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeIncidents.map((incident) => {
          const latest = getLatestUpdate(incident)
          const statusInfo = statusStyles[latest.status]
          const updatedAt = new Date(latest.timestamp)
          const dateLabel = updatedAt.toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC',
          })
          return (
            <div
              key={incident.id}
              className="bg-white dark:bg-primary/5 p-5 rounded-xl border border-slate-200 dark:border-primary/10"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {incident.service}
                </p>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>
              </div>
              <h3 className="font-bold text-base mb-2">{incident.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                {latest.message || t("status.incidents.noUpdates")}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">{t("status.incidents.lastUpdated").replace("{date}", dateLabel)}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
