"use client";

import Link from "next/link";
import { useI18n } from "@/lib/I18nProvider";

export default function Header() {
  const { t } = useI18n();

  const handleI18nDebug = async () => {
    try {
      console.log('client.navigator.language', navigator.language);
      console.log('client.navigator.languages', navigator.languages);
      console.log('client.navigator.userAgent', navigator.userAgent);
      console.log('client.document.documentElement.lang', document.documentElement.lang);
      console.log('client.document.cookie', document.cookie);
      try { console.log('client.localStorage.locale', localStorage.getItem('locale')); } catch (e) { console.log('localStorage unavailable', e); }

      const res = await fetch('/api/i18n-debug');
      const data = await res.json();
      console.log('server i18n debug', data);
    } catch (err) {
      console.error('i18n debug error', err);
    }
  };

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
        <button onClick={handleI18nDebug} title="translate" className="text-slate-600 dark:text-slate-300 text-sm hover:text-primary transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined">translate</span>
        </button>
      </div>
    </header>
  );
}
