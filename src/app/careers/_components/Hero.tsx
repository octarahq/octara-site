"use client";

import React from "react";
import { useI18n } from "@/lib/I18nProvider";

export default function Hero() {
  const { t } = useI18n();

  const titleLines = t("careers.hero.title").split("\\n");

  return (
    <section className="w-full px-6 lg:px-40 pt-16 pb-20 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center rounded-xl overflow-hidden mb-12">
        <div
          className="w-full h-48 lg:h-[280px] lg:col-span-1 bg-cover bg-center rounded-xl transform group-hover:scale-105 transition-transform duration-700"
          style={{ backgroundImage: "url('/favicon.svg')" }}
        ></div>
        <div className="p-6 lg:p-12 lg:col-span-2">
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
            {titleLines.map((line: string, idx: number) => (
              <React.Fragment key={idx}>
                {line}
                {idx < titleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <p className="max-w-2xl text-slate-600 dark:text-slate-300 text-lg lg:text-xl">
            {t("careers.hero.description")}
          </p>
        </div>
      </div>
    </section>
  );
}
