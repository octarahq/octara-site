"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

interface TokenInfo {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

interface UserInfo {
  id: string;
  email: string;
  name?: string;
  [key: string]: unknown;
}

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const authCode = searchParams.get("code");
    const state = searchParams.get("state");

    if (authCode) setCode(authCode);

    if (state) {
      try {
        let stateStr = state;
        try {
          stateStr = atob(state);
        } catch (e) {}

        const decoded = JSON.parse(stateStr);
        if (decoded.client_id) setClientId(decoded.client_id);
      } catch (e) {
        if (state.startsWith("app_oct")) {
          setClientId(state);
        }
        console.warn("State was not a JSON object", e);
      }
    }
  }, [searchParams]);

  const handleStepSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientSecret) return;
    handleExchangeToken();
  };

  const handleExchangeToken = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: "authorization_code",
          redirect_uri: window.location.origin + "/playground/callback",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Token exchange failed");

      setTokenInfo(data);
      setStep(2);

      await handleFetchUserInfo(data.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchUserInfo = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserInfo(data);
      setStep(3);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur de récupération";
      setError("Failed to fetch user info: " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-on-surface font-body selection:bg-primary/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      <nav className="relative z-50 border-b border-outline bg-background-dark/80 backdrop-blur-xl h-20 flex items-center px-12 justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/account/apps"
            className="flex items-center gap-2 text-on-surface/40 hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span className="text-[10px] uppercase tracking-widest font-black">
              Retour Dashboard
            </span>
          </Link>
          <div className="w-[1px] h-4 bg-outline mx-2"></div>
          <h1 className="text-sm font-black font-display uppercase tracking-widest">
            OAuth2 Playground
          </h1>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-6 shadow-2xl shadow-primary/20">
            <span className="material-symbols-outlined text-3xl font-black">
              science
            </span>
          </div>
          <h2 className="text-4xl font-extrabold font-headline mb-4 tracking-tighter">
            Analyse de l&apos;Authentification
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm leading-relaxed opacity-60">
            Félicitations ! Vous avez récupéré un code d&apos;autorisation.
            Utilisez-le maintenant pour obtenir un jeton d&apos;accès et
            récupérer les informations protégées de l&apos;utilisateur.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            {[
              {
                id: 1,
                label: "Code d'Autorisation",
                icon: "qr_code",
                status: code ? "complete" : "active",
              },
              {
                id: 2,
                label: "Échange de Token",
                icon: "sync_alt",
                status:
                  step >= 2 ? "complete" : step === 1 ? "pending" : "active",
              },
              {
                id: 3,
                label: "Récupération des Données",
                icon: "database",
                status: step === 3 ? "complete" : "pending",
              },
            ].map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-4 p-5 rounded-3xl border transition-all duration-300 ${
                  s.status === "complete"
                    ? "bg-green-500/5 border-green-500/20 opacity-100"
                    : s.status === "active" || (s.id === 1 && code)
                      ? "bg-primary/5 border-primary/20 opacity-100 shadow-lg shadow-primary/5"
                      : "bg-white/5 border-white/5 opacity-40 grayscale"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    s.status === "complete"
                      ? "bg-green-500 text-slate-950"
                      : "bg-white/10 text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl font-black">
                    {s.status === "complete" ? "check" : s.icon}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-0.5">
                    Étape 0{s.id}
                  </p>
                  <p className="text-sm font-bold">{s.label}</p>
                </div>
              </div>
            ))}
          </aside>

          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <section className="bg-surface-container rounded-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-headline flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/5 text-sm">
                    1
                  </span>
                  Configuration du Client
                </h3>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    Code d&apos;Autorisation Reçu
                  </label>
                  <code className="block w-full bg-slate-950/50 border border-white/5 p-4 rounded-2xl font-mono text-sm text-primary/70 break-all select-all">
                    {code || "En attente du flux..."}
                  </code>
                </div>

                <form onSubmit={handleStepSecret} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-error">
                        Action Requise : Client Secret
                      </label>
                    </div>
                    <input
                      required
                      autoFocus
                      id="client-secret"
                      className="w-full bg-[#0d0d16] border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/50 text-on-surface font-mono text-sm outline-none transition-all placeholder:opacity-20"
                      placeholder="Entrez le secret de votre application..."
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      disabled={step > 1}
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-error text-xs font-bold animate-in slide-in-from-top-1">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-sm">
                          warning
                        </span>
                        <p>{error}</p>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <button
                      type="submit"
                      disabled={isLoading || !clientSecret}
                      className="w-full py-4 bg-primary text-slate-100 font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-slate-100 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Échanger le Code
                          <span className="material-symbols-outlined text-sm font-black">
                            login
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </form>
              </div>
            </section>

            {step >= 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="bg-surface-container rounded-3xl border border-white/5 p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/10">
                      <span className="material-symbols-outlined text-sm">
                        key
                      </span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-on-surface-variant">
                      Échange du Jeton d'Accès
                    </h3>
                  </div>
                  <div className="bg-[#0b0b13] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-wider opacity-40 font-mono">
                        Response (JSON)
                      </span>
                      <span className="text-[10px] font-bold text-green-500">
                        200 OK
                      </span>
                    </div>
                    <pre className="p-6 text-sm font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(tokenInfo, null, 2)}
                    </pre>
                  </div>
                </section>

                {step === 3 && (
                  <section className="bg-surface-container rounded-3xl border border-green-500/20 p-12 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                    <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[100px] rounded-full"></div>

                    <div className="flex flex-col items-center text-center relative z-10">
                      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 mb-8 shadow-2xl shadow-green-500/20 ring-4 ring-green-500/5">
                        <span className="material-symbols-outlined text-4xl font-black">
                          verified
                        </span>
                      </div>

                      <h3 className="text-3xl font-black font-display mb-4 tracking-tighter">
                        Tout est fonctionnel !
                      </h3>

                      <p className="text-on-surface/60 max-w-lg mb-10 leading-relaxed font-semibold">
                        Félicitations, votre application a réussi le flux
                        OAuth2. Elle possède désormais une session valide et
                        peut interagir avec les endpoints sécurisés
                        d&apos;Octara.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link
                          href="https://tools.octara.xyz/docs/api/octara-api/v1"
                          target="_blank"
                          className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm font-black">
                            description
                          </span>
                          Accéder à la documentation
                        </Link>

                        <Link
                          href="/account/apps"
                          className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface font-black rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-sm font-black">
                            dashboard_customize
                          </span>
                          Dashboard
                        </Link>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#06060a] flex items-center justify-center text-primary font-black uppercase tracking-widest text-xs animate-pulse">
          Initialisation du Playground...
        </div>
      }
    >
      <PlaygroundContent />
    </Suspense>
  );
}
