"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/I18nProvider";

function RegisterContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshAuth } = useAuth();
  const returnTo = searchParams.get("return_to") || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        await refreshAuth();
        await new Promise((r) => setTimeout(r, 200));
        router.push(returnTo);
        router.refresh();
      } else {
        setError(data.error || t("register.error_invalid"));
      }
    } catch (err) {
      setError(t("register.error_conn"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6 bg-[#020617] font-display overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] size-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[50%] bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-10 text-center">
          <Link
            href="/"
            className="size-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-6 hover:scale-110 transition-transform"
          >
            <img src="/favicon.svg" alt="Octara" className="size-8" />
          </Link>
          <h1 className="text-4xl font-black tracking-tight text-white mb-3">
            {t("register.title")}
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
            {t("register.description")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl"
        >
          {error && (
            <div className="p-4 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 animate-in fade-in">
              ⚠ {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              {t("register.email_label")}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-primary/50 text-white text-sm font-medium transition-all placeholder:text-slate-600 font-body"
              placeholder={t("register.email_placeholder")}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
              {t("register.password_label")}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:ring-2 focus:ring-primary/50 text-white text-sm font-medium transition-all placeholder:text-slate-600 font-body"
              placeholder={t("register.password_placeholder")}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-slate-950 rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50"
            >
              {loading ? t("register.submitting") : t("register.submit")}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-xs font-medium text-slate-500">
          {t("register.has_account")}{" "}
          <Link
            href={
              searchParams.has("return_to")
                ? `/login?return_to=${encodeURIComponent(searchParams.get("return_to")!)}`
                : "/login"
            }
            className="text-white font-black hover:underline underline-offset-4"
          >
            {t("register.login_link")}
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
