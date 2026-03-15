"use client";

import type { ProjectStatus } from '@/utils/projects';
import { useI18n } from '@/lib/I18nProvider';

type SnapshotProject = {
    id: string;
    name: string;
    mainUrl: string;
    statusUrls: Record<string, { url: string; status: ProjectStatus | 'degraded' }>;
    records: unknown[];
  }

export default function Services({ projects }: { projects?: SnapshotProject[] }) {
  const { t } = useI18n();

  const meta: Record<string, { icon: string; color: string; label: string }> = {
    active: { icon: 'check_circle', color: '#10b981', label: t('status.services.live') },
    maintenance: { icon: 'build', color: '#f59e0b', label: t('status.services.maintenance') },
    degraded: { icon: 'warning', color: '#f59e0b', label: t('status.services.degraded') },
    down: { icon: 'error', color: '#ef4444', label: t('status.services.down') },
    archived: { icon: 'archive', color: '#94a3b8', label: t('status.services.archived') },
    experimental: { icon: 'science', color: '#7c3aed', label: t('status.services.experimental') },
  };

  const hexToRgba = (hex: string, alpha = 1) => {
    const h = hex.replace('#', '')
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
    const bigint = parseInt(full, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const severityOrder: Array<ProjectStatus | 'degraded'> = ['down', 'degraded', 'maintenance']

  return (
    <div className="space-y-8">
      {projects && projects.length ? (
        projects.map((p) => {
          const entries = Object.entries(p.statusUrls || {})
          const foundStatuses = entries.map(([_, v]) => (v && v.status) || 'degraded')
          const sectionSeverity = severityOrder.find(s => foundStatuses.includes(s))
          const sectionColor = sectionSeverity ? (meta[sectionSeverity]?.color ?? '#f59e0b') : null
          const sectionBorderStyle = sectionColor ? { borderColor: hexToRgba(sectionColor, 0.3) } : undefined
          const sectionBorderClass = 'rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10' + (sectionSeverity ? ' border-2' : '')

          return (
            <section key={p.id} className="">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">widgets</span>
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <a href={p.mainUrl} className="text-sm text-slate-500 hover:underline">{p.mainUrl}</a>
                </div>
              </div>

              <div className={sectionBorderClass + ' divide-y divide-slate-200 dark:divide-primary/10 bg-white dark:bg-background-dark/50'} style={sectionBorderStyle}>
                {entries.map(([k, v]) => {
                  const s = (v && v.status) || 'degraded'
                  const info = meta[s] || meta.degraded
                  const isProblem = ['maintenance', 'degraded', 'down'].includes(s)
                  const subBg = isProblem ? hexToRgba(info.color, 0.05) : undefined
                  return (
                    <div key={k} className="flex items-center justify-between p-4 transition-colors" style={{ backgroundColor: subBg }}>
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined" style={{ color: info.color }}>{info.icon}</span>
                        <div>
                          <div className="font-medium">{k}</div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: info.color }}>{info.label}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })
      ) : (
        <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-500">{t("status.services.none")}</div>
      )}
    </div>
  )
}
