"use client";

import { useI18n } from "@/lib/I18nProvider";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative rounded-xl overflow-hidden mb-16">
      <div
        className="bg-cover bg-center min-h-[200px] flex flex-col justify-end relative"
        data-alt="Modern collaborative workspace with diverse team members"
      >
        <div className="max-w-2xl">
          <h1 className="text-white text-4xl md:text-6xl font-black leading-tight mb-4">{t("about.hero.title")}</h1>
          <p className="text-slate-300 text-lg leading-relaxed">{t("about.hero.description")}</p>
        </div>
      </div>
    </section>
  )
}
