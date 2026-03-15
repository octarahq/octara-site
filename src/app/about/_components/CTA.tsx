"use client";

import Link from 'next/link'
import { useI18n } from '@/lib/I18nProvider'

export default function CTA() {
  const { t } = useI18n();

  return (
    <section className="flex flex-col md:flex-row gap-12 items-center bg-slate-900 rounded-3xl overflow-hidden p-8 md:p-16 mb-24">
      <div className="flex-1 space-y-6">
        <h2 className="text-white text-3xl font-black">{t("about.cta.title")}</h2>
        <p className="text-slate-400 text-lg">{t("about.cta.description")}</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/careers" className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">{t("about.cta.openings")}</Link>
          <Link href="/api/discord" className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors border border-white/20">{t("about.cta.contact")}</Link>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-sm aspect-square bg-primary/20 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[120px]">groups_3</span>
          <div className="absolute -top-4 -right-4 size-20 bg-primary rounded-full animate-pulse opacity-50"></div>
        </div>
      </div>
    </section>
  )
}
