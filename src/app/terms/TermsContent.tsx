"use client";

import { } from "react";
import { useI18n } from '@/lib/I18nProvider'
import Link from "next/link";

export default function TermsContent() {
  const { t } = useI18n();

  return (
    <main className="flex flex-1 justify-center py-10 px-6 lg:px-40">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-white text-4xl lg:text-5xl font-black leading-tight tracking-tight">{t("terms.title")}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">{t("terms.updated")}</p>
          </div>

          <div className="flex flex-col gap-12 text-slate-700 dark:text-slate-300">
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section1.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.intro")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section2.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.section2.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section3.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.section3.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section4.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.section4.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section5.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.section5.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section6.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.section6.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section7.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.section7.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section8.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.section8.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section9.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.section9.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">{t("terms.section10.title")}</h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("terms.section10.body")}</p>
              </div>
            </section>
          </div>

          <div className="mt-16 p-8 rounded-xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">{t("terms.contact.title")}</h3>
              <p className="text-slate-500 dark:text-slate-400">{t("terms.contact.desc")}</p>
            </div>
            <Link href="/api/discord" className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-110 transition-all">
              {t("terms.contact.button")}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
