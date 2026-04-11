"use client";

import Link from "next/link";
import { useI18n } from "@/lib/I18nProvider";

export default function Hero() {
  const { t } = useI18n();

  return (
    <section className="px-6 lg:px-20 py-12 lg:py-24">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex flex-col gap-8 flex-1">
          <div className="flex flex-col gap-4">
            <h1 className="text-slate-900 dark:text-white text-5xl lg:text-7xl font-black leading-tight tracking-tight">
              {t("hero.title.prefix")}{" "}
              <span className="text-primary">{t("hero.title.brand")}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg lg:text-xl font-normal leading-relaxed max-w-2xl">
              {t("hero.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/api/discord"
              target="_blank"
              className="flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-xl h-14 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <span className="material-symbols-outlined">chat</span>
              {t("hero.join_discord")}
            </Link>
            <Link
              href="/api/github"
              target="_blank"
              className="flex min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-xl h-14 px-6 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
            >
              <span className="material-symbols-outlined">terminal</span>
              {t("hero.view_github")}
            </Link>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-full aspect-video lg:aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700">
              <img
                src="/favicon.svg"
                alt="Octara"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
