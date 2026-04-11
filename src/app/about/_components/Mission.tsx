"use client";
import { useI18n } from "@/lib/I18nProvider";

export default function Mission() {
  const { t } = useI18n();

  return (
    <section className="mb-24">
      <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-slate-900 dark:text-white text-3xl font-black mb-6">
            {t("about.mission.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xl italic leading-relaxed">
            {t("about.mission.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
