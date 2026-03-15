"use client"

import { useMemo, useState } from 'react'
import type { OctaraStatus, Incident, Maintenance } from '@/utils/incident'


type HistoryItem = {
  id: string
  title: string
  subtitle: string
  date: Date
  statusLabel: string
  statusClass: string
  description?: string
  isPastMaintenance?: boolean
}



function formatDate(date: Date) {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

import { useI18n } from '@/lib/I18nProvider'

export default function History({ status }: { status?: OctaraStatus | null }) {
  const [showPastMaintenance, setShowPastMaintenance] = useState(false)

  const maintenances = status?.maintenances ?? []

  const now = useMemo(() => new Date(), [])

  const pastMaintenances = useMemo(() => {
    return maintenances
      .filter((m) => {
        if (m.status === 'completed') return true
        const end = new Date(m.scheduledEnd)
        return end.getTime() <= now.getTime()
      })
      .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())
  }, [maintenances, now])

  const activeMaintenances = useMemo(() => {
    const pastIds = new Set(pastMaintenances.map((m) => m.id))
    return maintenances
      .filter((m) => !pastIds.has(m.id))
      .sort((a, b) => new Date(b.scheduledStart).getTime() - new Date(a.scheduledStart).getTime())
  }, [maintenances, pastMaintenances])

  const { t } = useI18n();

  const items = useMemo(() => {
    const out: HistoryItem[] = []

    const maintenanceStatusStyles: Record<Maintenance['status'], { label: string; className: string }> = {
      scheduled: { label: t('status.history.maintenance.scheduled'), className: 'bg-slate-100 text-slate-500' },
      'in-progress': { label: t('status.history.maintenance.inProgress'), className: 'bg-indigo-100 text-indigo-700' },
      completed: { label: t('status.history.maintenance.completed'), className: 'bg-emerald-100 text-emerald-700' },
    }

    for (const maintenance of activeMaintenances.slice(0, 2)) {
      const statusStyle = maintenanceStatusStyles[maintenance.status]
      out.push({
        id: maintenance.id,
        title: maintenance.title,
        subtitle: maintenance.service,
        date: new Date(maintenance.scheduledStart),
        statusLabel: statusStyle.label,
        statusClass: statusStyle.className,
        description: maintenance.message || undefined,
      })
    }

    return out
  }, [activeMaintenances])

  const pastItems = useMemo(() => {
    const maintenanceStatusStyles: Record<Maintenance['status'], { label: string; className: string }> = {
      scheduled: { label: t('status.history.maintenance.scheduled'), className: 'bg-slate-100 text-slate-500' },
      'in-progress': { label: t('status.history.maintenance.inProgress'), className: 'bg-indigo-100 text-indigo-700' },
      completed: { label: t('status.history.maintenance.completed'), className: 'bg-emerald-100 text-emerald-700' },
    }

    return pastMaintenances.map((maintenance) => {
      const statusStyle = maintenanceStatusStyles.completed
      return {
        id: maintenance.id,
        title: maintenance.title,
        subtitle: maintenance.service,
        date: new Date(maintenance.scheduledStart),
        statusLabel: statusStyle.label,
        statusClass: statusStyle.className,
        description: maintenance.message || undefined,
        isPastMaintenance: true,
      }
    })
  }, [pastMaintenances, t])

  const hasItems = items.length > 0
  const hasPastItems = pastItems.length > 0
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{t("status.history.title")}</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline"
          onClick={() => {
            setShowPastMaintenance((prev) => !prev)
          }}
        >
          {showPastMaintenance ? t("status.history.hide") : t("status.history.show")}
          <span className="material-symbols-outlined text-xs">
            {showPastMaintenance ? 'expand_less' : 'arrow_forward'}
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hasItems ? (
          items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-primary/5 p-5 rounded-xl border border-slate-200 dark:border-primary/10">
              <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{formatDate(item.date)}</p>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.statusClass}`}>
                  {item.statusLabel}
                </span>
              </div>
              <h3 className="font-bold text-base mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                {item.description ?? t("status.incidents.noUpdates")}
              </p>
            </div>
          ))
          ) : (
          <div className="col-span-full rounded-2xl border border-slate-200 dark:border-primary/10 bg-slate-50/50 dark:bg-primary/5 p-10 text-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t("status.history.noScheduled")}</p>
          </div>
        )}

        {showPastMaintenance && (
          <div className="col-span-full">
            {hasPastItems ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastItems.map((item) => (
                  <div
                    key={`${item.id}-history`}
                    className="bg-white dark:bg-primary/5 p-5 rounded-xl border border-slate-200 dark:border-primary/10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {formatDate(item.date)}
                      </p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.statusClass}`}>
                        {item.statusLabel}
                      </span>
                    </div>
                    <h3 className="font-bold text-base mb-2">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {item.description ?? t("status.incidents.noUpdates")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 dark:border-primary/10 bg-slate-50/50 dark:bg-primary/5 p-10 text-center">
                <p className="text-slate-500 dark:text-slate-400 font-medium">{t("status.history.noPast")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
