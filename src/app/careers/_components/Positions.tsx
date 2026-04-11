"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/I18nProvider";

export default function Positions() {
  const { t } = useI18n();

  const openingsText =
    t("careers.positions.count", { count: 2 }) ?? "2 opportunities";

  return (
    <section className="w-full px-6 lg:px-40 pb-24 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
          <span className="w-8 h-1 bg-primary inline-block"></span>
          {t("careers.positions.title")}
        </h2>
        <span className="text-sm text-slate-500 font-medium">
          {openingsText}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="group flex flex-col md:flex-row bg-slate-100 dark:bg-slate-900/40 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary/40 transition-all">
          <div className="md:w-1/3 h-64 md:h-auto overflow-hidden relative">
            <Image
              src="/assets/careers/communityManager.png"
              alt="Octara communauté"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 w-full h-full bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {t("careers.positions.role1.title")}
                </h3>
                <span className="text-slate-500 text-xs font-bold uppercase">
                  {t("careers.positions.role1.status")}
                </span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {t("careers.positions.role1.description")}
              </p>
              <div className="space-y-2 mb-8">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {t("careers.positions.role1.responsibilities.title")}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      draw
                    </span>
                    {t("careers.positions.role1.responsibilities.item1")}
                  </li>
                </ul>
              </div>
            </div>
            <Link
              href="/api/discord"
              className="w-fit inline-flex items-center gap-3 bg-primary text-white px-8 py-3 rounded-lg font-bold hover:gap-5 transition-all"
            >
              {t("careers.positions.apply")}{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="group flex flex-col md:flex-row bg-slate-100 dark:bg-slate-900/40 rounded-xl overflow-hidden border border-slate-200 dark:border-primary/10 hover:border-primary/40 transition-all">
          <div className="md:w-1/3 h-64 md:h-auto overflow-hidden relative">
            <Image
              src="/assets/careers/contributor.png"
              alt="Octara développement"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 w-full h-full bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          <div className="flex-1 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {t("careers.positions.role2.title")}
                </h3>
                <span className="text-slate-500 text-xs font-bold uppercase">
                  {t("careers.positions.role2.status")}
                </span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {t("careers.positions.role2.description")}
              </p>
              <div className="space-y-2 mb-8">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {t("careers.positions.role2.needs")}
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      code
                    </span>
                    {t("careers.positions.role2.need1")}
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      palette
                    </span>
                    {t("careers.positions.role2.need2")}
                  </li>
                </ul>
              </div>
            </div>
            <Link
              href="/api/discord"
              className="w-fit inline-flex items-center gap-3 bg-primary text-white px-8 py-3 rounded-lg font-bold hover:gap-5 transition-all"
            >
              {t("careers.positions.apply")}{" "}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
