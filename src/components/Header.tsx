"use client";

import Link from "next/link";
import { useI18n } from "@/lib/I18nProvider";
import { useState, useEffect } from "react";

export default function Header() {
  const { t } = useI18n();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-slate-800 px-6 py-4 lg:px-20 backdrop-blur-md sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80">
      <Link className="flex items-center gap-4 text-primary" href="/">
        <div className="size-8 flex items-center justify-center">
          <img src="/favicon.svg" alt="Octara" className="h-8 w-8" />
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-black leading-tight tracking-tight">
          Octara
        </h2>
      </Link>

      <div className="flex flex-1 justify-end gap-6 items-center">
        <nav className="hidden lg:flex items-center gap-8 mr-4">
          <Link
            href="/status"
            className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
          >
            {t("nav.status")}
          </Link>
          <Link
            href="/about"
            className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/careers"
            className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
          >
            {t("nav.careers")}
          </Link>
        </nav>

        {/* {!loading && (
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-5">
                <Link href="/account">
                  <div className="size-10 rounded-full border-2 border-white dark:border-slate-800 shadow-xl overflow-hidden hover:scale-110 transition-transform ring-4 ring-primary/5">
                    <img
                      src={`/api/user/avatar/${user.id}`}
                      alt="Profile"
                      className="size-full object-cover"
                    />
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-primary text-white text-sm font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        )} */}
      </div>
    </header>
  );
}
