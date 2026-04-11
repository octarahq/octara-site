"use client";

import Link from "next/link";
import { useI18n } from "@/lib/I18nProvider";

export default function CTA() {
  const { t } = useI18n();

  return (
    <section className="w-full px-6 lg:px-40 pb-20 max-w-[1200px] mx-auto">
      <div className="bg-primary rounded-xl p-10 lg:p-16 flex flex-col lg:flex-row items-center gap-10 text-center lg:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="z-10 flex-1">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
            {t("careers.cta.title")}
          </h2>
          <p className="text-white/80 text-lg">
            {t("careers.cta.description")}
          </p>
        </div>
        <div className="z-10">
          <Link
            href="/api/discord"
            className="bg-white text-primary px-10 py-4 rounded-xl font-black text-lg hover:bg-slate-100 transition-colors shadow-xl inline-block"
          >
            {t("careers.cta.button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
