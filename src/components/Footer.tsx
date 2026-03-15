"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from '@/lib/I18nProvider'

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const copyUrl = async () => {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <footer className="bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-6 md:px-20 lg:px-40 py-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-2xl font-bold">explore</span>
              <h2 className="text-slate-900 dark:text-slate-100 text-lg font-black tracking-tight">Octara</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-slate-900 dark:text-white font-bold">{t("footer.product")}</h4>
            <nav className="flex flex-col gap-2">
              <Link
                className="text-slate-600 dark:text-slate-400 text-sm hover:text-primary transition-colors"
                href="/status"
              >
                {t("footer.linkStatus")}
              </Link>
              <Link
                className="text-slate-600 dark:text-slate-400 text-sm hover:text-primary transition-colors"
                href="/careers"
              >
                {t("footer.linkCareers")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-slate-900 dark:text-white font-bold">{t("footer.company")}</h4>
            <nav className="flex flex-col gap-2">
              <Link
                className="text-slate-600 dark:text-slate-400 text-sm hover:text-primary transition-colors"
                href="/about"
              >
                {t("footer.linkCompany")}
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-slate-900 dark:text-white font-bold">{t("footer.legal")}</h4>
            <nav className="flex flex-col gap-2">
              <Link
                className="text-slate-600 dark:text-slate-400 text-sm hover:text-primary transition-colors"
                href="/terms"
              >
                {t("footer.linkTerms")}
              </Link>
              <Link
                className="text-slate-600 dark:text-slate-400 text-sm hover:text-primary transition-colors"
                href="/privacy"
              >
                {t("footer.linkPrivacy")}
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-200 dark:border-slate-800 pt-8">
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            {t("footer.copy").replace("{year}", String(year))} <Link href="https://creativecommons.org/licenses/by-nc-sa/4.0/" className="text-primary" target="_blank">
              {t("footer.license")}
            </Link>
            .
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={copyUrl}
              className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">content_copy</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
