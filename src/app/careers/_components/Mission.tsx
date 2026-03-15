"use client";

import { } from "react";
import { useI18n } from '@/lib/I18nProvider'

export default function Mission() {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-10 border-b border-primary/10 max-w-[1200px] mx-auto">
      <div className="lg:col-span-8">
        <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary scale-125">volunteer_activism</span>
          {t("careers.mission.title")}
        </h2>
        <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
          <p>{t("careers.mission.description")}</p>
          <div className="p-6 bg-primary/10 border-l-4 border-primary rounded-r-lg">
            <p className="text-primary font-bold mb-1">{t("careers.mission.important")}</p>
            <p className="text-slate-300 text-base italic">{t("careers.mission.volunteer")}</p>
            <p className="text-slate-300 text-base italic mt-2">{t("careers.mission.future")}</p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-4 bg-slate-100 dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200 dark:border-primary/10">
        <h3 className="font-bold text-xl mb-4">{t("careers.mission.why.title")}</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span><span className="text-sm text-slate-400">{t("careers.mission.why.list1")}</span></li>
          <li className="flex items-start gap-3"><span className="material-symbols-outlined text-primary text-sm mt-1">check_circle</span><span className="text-sm text-slate-400">{t("careers.mission.why.list2")}</span></li>
        </ul>
      </div>
    </div>
  );
}
