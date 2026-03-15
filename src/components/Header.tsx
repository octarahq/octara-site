"use client";

import Link from "next/link";
import { useI18n } from "@/lib/useLocale";

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 px-6 py-4 lg:px-20">
      <Link className="flex items-center gap-4 text-primary" href="/">
        <div className="size-8 flex items-center justify-center">
          <img src="/favicon.svg" alt="Octara" className="h-8 w-8" />
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">Octara</h2>
      </Link>
      <div className="flex flex-1 justify-end gap-8 items-center">
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/status" className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">{t("nav.status")}</Link>
          <Link href="/about" className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">{t("nav.about")}</Link>
          <Link href="/careers" className="text-slate-600 dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors">{t("nav.careers")}</Link>
        </nav>
      </div>
    </header>
  );
}
