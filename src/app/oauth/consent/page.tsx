"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { getScopeLabel } from "@/lib/constants/scopes";

interface AppInfo {
  name: string;
  description: string | null;
  avatarURL?: string;
  is_first_party?: boolean;
}

function ConsentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const client_id = searchParams.get("client_id");
  const scope = searchParams.get("scope") || "read:profile";
  const state = searchParams.get("state") || "";
  const redirect_uri = searchParams.get("redirect_uri");

  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState<AppInfo | null>(null);

  useEffect(() => {
    if (client_id) {
      fetch(`/api/apps/info?client_id=${client_id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.app) setApp(data.app);
        })
        .finally(() => setLoading(false));
    }
  }, [client_id]);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/oauth/consent/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id, scope, state, redirect_uri }),
      });
      const data = await res.json();
      if (data.redirect_url) {
        router.push(data.redirect_url);
      } else {
        alert("Erreur d'approbation");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = () => {
    if (redirect_uri) {
      const url = new URL(redirect_uri);
      url.searchParams.set("error", "access_denied");
      if (state) url.searchParams.set("state", state);
      window.location.href = url.toString();
    }
  };

  if (loading) return <div className="text-center p-20">Chargement...</div>;

  return (
    <div className="container mx-auto p-8 max-w-xl flex flex-col items-center">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center w-full">
        <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6">
          <img
            src={app?.avatarURL || "/favicon.svg"}
            className="size-10"
            alt="Logo"
          />
        </div>

        {app?.is_first_party && (
          <div className="mb-3 flex items-center justify-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-xl">
            <span className="material-symbols-outlined text-sm text-primary">
              verified
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              Application officielle de Octara
            </span>
          </div>
        )}

        <h1 className="text-2xl font-black mb-2 text-center leading-tight">
          Autoriser {app?.name || "Application"} ?
        </h1>
        <p className="text-slate-500 text-center mb-2 text-sm">
          Cette application demande à accéder à votre compte Octara.
        </p>

        {redirect_uri && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
            <span className="material-symbols-outlined text-[10px] text-slate-400">
              link
            </span>
            <span className="text-[10px] font-bold text-slate-500 truncate max-w-[200px]">
              Redirection vers :{" "}
              {new URL(redirect_uri, window.location.origin).hostname}
            </span>
          </div>
        )}

        {app?.description && (
          <p className="text-slate-400 text-center mb-8 text-xs italic px-6">
            {app.description}
          </p>
        )}

        <div className="w-full bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
            L'application pourra accéder à :
          </h3>
          <ul className="space-y-3">
            {scope.split(" ").map((s, i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-sm font-medium"
              >
                <span className="size-5 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center text-xs">
                  ✓
                </span>
                {getScopeLabel(s)}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            onClick={handleDeny}
            className="px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-6 py-4 rounded-xl bg-primary text-white font-bold text-sm hover:scale-[1.03] transition-transform shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            Accepter
          </button>
        </div>

        <p className="mt-8 text-[10px] text-slate-400 text-center">
          Octara vous protège contre les accès malveillants. Vérifiez toujours
          que vous faites confiance au site demandeur avant d'accepter.
        </p>
      </div>
    </div>
  );
}

export default function ConsentPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <Suspense fallback={<div>Chargement...</div>}>
        <ConsentContent />
      </Suspense>
    </main>
  );
}
