"use client"

import { useEffect, useState } from 'react'
import { getProjects } from '@/utils/projects'

export default function Stats({ translations }: { translations?: Record<string,string> }) {
  const [projectsCount, setProjectsCount] = useState<number | null>(null)
  const [totalRepos, setTotalRepos] = useState<number | null>(null)
  const [totalStars, setTotalStars] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const groups = await getProjects()
        if (!mounted) return
        setProjectsCount(groups.flatMap((g) => g.projects || []).length)
      } catch (e) {
        if (mounted) setProjectsCount(0)
      }

      try {
        const orgRes = await fetch('https://api.github.com/orgs/octarahq')
        if (orgRes.ok) {
          const org = await orgRes.json()
          if (mounted) setTotalRepos(org.public_repos || 0)
        } else if (mounted) {
          setTotalRepos(0)
        }
      } catch (e) {
        if (mounted) setTotalRepos(0)
      }

      try {
        const res = await fetch('/api/org/stars')
        if (res.ok) {
          const data = await res.json()
          if (mounted) setTotalStars(typeof data.total === 'number' ? data.total : 0)
        } else if (mounted) {
          setTotalStars(0)
        }
      } catch (e) {
        if (mounted) setTotalStars(0)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const t = (key: string) => translations?.[key] ?? key;

  return (
    <section className="px-6 lg:px-20 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 rounded-2xl p-8 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">{t("stats.projects")}</p>
            <p className="text-slate-900 dark:text-white text-4xl font-black">{projectsCount ?? '—'}</p>
            <div className="w-12 h-1 bg-primary mt-2 rounded-full"></div>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-8 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">{t("stats.stars")}</p>
            <p className="text-slate-900 dark:text-white text-4xl font-black">{totalStars != null ? totalStars.toLocaleString() : '—'}</p>
            <div className="w-12 h-1 bg-primary mt-2 rounded-full"></div>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl p-8 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">{t("stats.repos")}</p>
            <p className="text-slate-900 dark:text-white text-4xl font-black">{totalRepos ?? '—'}</p>
            <div className="w-12 h-1 bg-primary mt-2 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
