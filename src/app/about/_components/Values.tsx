"use client";

import { useI18n } from "@/lib/I18nProvider";

export default function Values() {
  const { t } = useI18n();

  return (
    <section className="mb-24">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-slate-900 dark:text-white text-3xl font-black mb-4">{t("about.values.title")}</h2>
        <div className="h-1.5 w-20 bg-primary rounded-full"></div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors group">
          <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">verified</span>
          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">{t("about.values.integrity.title")}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t("about.values.integrity.description")}</p>
        </div>
        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors group">
          <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">lightbulb</span>
          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">{t("about.values.innovation.title")}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t("about.values.innovation.description")}</p>
        </div>
        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors group">
          <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">diversity_3</span>
          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">{t("about.values.opensource.title")}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t("about.values.opensource.description")}</p>
        </div>
        <div className="bg-white dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors group">
          <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">eco</span>
          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">{t("about.values.impact.title")}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t("about.values.impact.description")}</p>
        </div>
      </div>
    </section>
  )
}
