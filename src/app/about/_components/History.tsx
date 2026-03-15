"use client";

import Image from "next/image";
import { useI18n } from '@/lib/I18nProvider'

export default function History() {
  const { t } = useI18n();

  return (
    <section className="grid md:grid-cols-3 gap-16 items-center mb-24">
      <div className="md:col-span-2">
        <h2 className="text-slate-900 dark:text-white text-3xl font-black mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">
            history_edu
          </span>
          {t("about.history.title")}
        </h2>
        <div className="space-y-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          <p>{t("about.history.paragraph1")}</p>
          <p>{t("about.history.paragraph2")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:col-span-1">
        <div className="rounded-xl overflow-hidden aspect-square bg-primary/10 flex items-center justify-center p-2">
          <Image
            alt="Team meeting"
            className="w-full h-full object-cover rounded-lg"
            src="/favicon.svg"
            width={30}
            height={30}
          />
        </div>
      </div>
    </section>
  );
}
