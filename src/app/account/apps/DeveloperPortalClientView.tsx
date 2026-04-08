"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/AuthContext";
import AccountSidebar from "@/app/account/_components/AccountSidebar";
import Link from "next/link";
import Image from "next/image";

interface AppDetail {
  id: string;
  client_id: string;
  name: string;
  redirect_uris: string[];
  createdAt: string;
  userCount: number;
}

export default function DeveloperPortalClientView({
  initialApps,
}: {
  initialApps: AppDetail[];
}) {
  const { user } = useAuth();
  const [apps, setApps] = useState<AppDetail[]>(initialApps);

  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [redirectUris, setRedirectUris] = useState(
    "http://localhost:3000/callback",
  );
  const [isCreating, setIsCreating] = useState(false);
  const [lastCreated, setLastCreated] = useState<{
    client_id: string;
    client_secret: string;
  } | null>(null);

  const [deletingApp, setDeletingApp] = useState<AppDetail | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch("/api/apps/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          redirect_uris: redirectUris.split(",").map((u) => u.trim()),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApps([
          ...apps,
          {
            ...data.app,
            userCount: 0,
            createdAt: new Date().toISOString(),
            redirect_uris: redirectUris.split(",").map((u) => u.trim()),
          },
        ]);
        setLastCreated({
          client_id: data.app.client_id,
          client_secret: data.app.client_secret,
        });
        setName("");
        setRedirectUris("http://localhost:3000/callback");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletingApp || confirmText !== deletingApp.name.toUpperCase()) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/apps/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingApp.id }),
      });
      if (res.ok) {
        setApps(apps.filter((a) => a.id !== deletingApp.id));
        setDeletingApp(null);
        setConfirmText("");
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.client_id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background-dark text-on-surface selection:bg-primary/30 font-body">
      <AccountSidebar />

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-background-dark/90 backdrop-blur-sm"
            onClick={() => !isCreating && setShowModal(false)}
          ></div>
          {!lastCreated ? (
            <div className="relative w-full max-w-lg bg-surface-container rounded-3xl border border-white/5 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black font-display">
                  Enregistrer une App
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-on-surface/40 font-black">
                    close
                  </span>
                </button>
              </div>

              <form onSubmit={handleCreateApp} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface/20 mb-2 ml-1">
                      Nom de l'application
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-background-dark/50 border border-outline rounded-xl px-5 py-4 focus:border-primary outline-none transition-all text-sm font-semibold"
                      placeholder="e.g. Octara Dashboard"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface/20 mb-2 ml-1">
                      URIs de redirection (séparées par des virgules)
                    </label>
                    <input
                      type="text"
                      required
                      value={redirectUris}
                      onChange={(e) => setRedirectUris(e.target.value)}
                      className="w-full bg-background-dark/50 border border-outline rounded-xl px-5 py-4 focus:border-primary outline-none transition-all text-sm font-mono"
                      placeholder="http://localhost:3000/callback"
                    />
                  </div>
                </div>

                <button
                  disabled={isCreating}
                  className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isCreating ? "Enregistrement..." : "Enregistrer l'App"}
                </button>
              </form>
            </div>
          ) : (
            <div className="relative w-full max-w-lg bg-surface-container rounded-3xl border border-error/20 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error border border-error/10">
                  <span className="material-symbols-outlined font-black">
                    warning
                  </span>
                </div>
                <h3 className="text-xl font-black text-error font-display uppercase tracking-tighter">
                  Sécurité du Client
                </h3>
              </div>
              <p className="text-on-surface/40 text-sm mb-8 leading-relaxed">
                Copies ces informations <b>maintenant</b>. Le secret ne sera
                plus jamais accessible une fois cette page fermée.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface/20 mb-2">
                    Client ID
                  </label>
                  <code className="block w-full bg-background-dark/50 border border-outline p-4 rounded-xl font-mono text-xs text-primary break-all select-all">
                    {lastCreated.client_id}
                  </code>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-error/40 mb-2">
                    Client Secret
                  </label>
                  <code className="block w-full bg-error/5 border border-error/10 p-4 rounded-xl font-mono text-base text-primary break-all select-all">
                    {lastCreated.client_secret}
                  </code>
                </div>
              </div>

              <button
                onClick={() => {
                  setLastCreated(null);
                  setShowModal(false);
                }}
                className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface font-black rounded-2xl transition-all"
              >
                J'ai tout sauvegardé, fermer
              </button>
            </div>
          )}
        </div>
      )}

      {deletingApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-background-dark/95 backdrop-blur-md"
            onClick={() => !isDeleting && setDeletingApp(null)}
          ></div>
          <div className="relative w-full max-w-md bg-surface-container rounded-3xl border border-error/20 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error border border-error/20">
                <span className="material-symbols-outlined font-black">
                  delete_forever
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black font-display text-error">
                  Suppression Irréversible
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-error/60 font-black">
                  Action requise
                </p>
              </div>
            </div>

            <p className="text-on-surface/40 text-sm mb-8 leading-relaxed">
              Vous êtes sur le point de supprimer l'application{" "}
              <span className="text-on-surface font-black">
                {deletingApp.name}
              </span>
              . Tous les accès utilisateurs et les jetons seront immédiatement
              révoqués.
            </p>

            <form onSubmit={handleDeleteApp} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-on-surface/20 mb-3 ml-1">
                  Tapez{" "}
                  <span className="text-on-surface font-black">
                    {deletingApp.name.toUpperCase()}
                  </span>{" "}
                  pour confirmer
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full bg-error/5 border border-error/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-error/50 outline-none transition-all text-sm font-black text-error text-center uppercase tracking-widest"
                  placeholder="CONFIRMATION"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setDeletingApp(null)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-on-surface font-bold rounded-2xl transition-all"
                >
                  Annuler
                </button>
                <button
                  disabled={
                    isDeleting || confirmText !== deletingApp.name.toUpperCase()
                  }
                  className="flex-1 py-4 bg-error text-white font-black rounded-2xl shadow-xl shadow-error/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className="fixed top-0 right-0 left-72 h-20 z-40 bg-background-dark/80 backdrop-blur-xl flex items-center justify-between px-12 border-b border-outline">
        <div className="flex items-center gap-2">
          <span className="text-on-surface text-[10px] font-black uppercase tracking-widest">
            Espace Développeur
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-tighter group-hover:text-primary transition-colors">
                {user?.name || user?.email.split("@")[0]}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full border border-outline group-hover:border-primary transition-all overflow-hidden flex items-center justify-center bg-slate-900 shadow-lg shadow-black/40">
              <img
                src={`/api/user/avatar/${user?.id}`}
                alt="Avatar"
                className="size-full object-cover grayscale group-hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pl-72 pt-28 pb-20 px-12">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 animate-in slide-in-from-bottom-4 duration-700">
            <div>
              <h1 className="font-display text-5xl font-black tracking-tighter text-on-surface mb-3">
                Apps enregistrées
              </h1>
              <p className="text-on-surface/40 text-sm max-w-xl leading-relaxed">
                Gérez vos endpoints sécurisés OAuth2. Vous avez {apps.length}{" "}
                applications actives dans votre vault.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group flex items-center">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/40 text-lg font-black group-focus-within:text-primary transition-all">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="App ID ou Nom..."
                  className="w-64 bg-background-dark/50 border border-outline focus:border-primary px-10 py-3 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest text-on-surface placeholder:opacity-10 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApps.map((app, idx) => (
              <div
                key={app.id}
                className="group bg-surface-container rounded-[2rem] p-8 border border-outline transition-all duration-500 relative overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-10 -mt-10"></div>

                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="w-14 h-14 bg-background-dark border border-outline rounded-2xl flex items-center justify-center">
                    <Image
                      src={`/api/apps/logo/${app.id}`}
                      alt="Avatar"
                      className="size-full object-cover"
                      width={56}
                      height={56}
                    />
                  </div>
                </div>

                <h3 className="font-display text-xl font-black text-on-surface mb-2 tracking-tight">
                  {app.name}
                </h3>
                <p className="text-on-surface/60 text-xs mb-8 leading-relaxed font-semibold h-10 overflow-hidden text-ellipsis line-clamp-2">
                  Infrastructure client enregistrée le{" "}
                  {new Date(app.createdAt).toLocaleDateString()}.
                </p>

                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center bg-background-dark/30 border border-outline p-4 rounded-2xl">
                    <span className="text-[9px] text-on-surface/60 font-black uppercase tracking-widest">
                      Utilisateurs actifs
                    </span>
                    <span className="font-display font-black text-xs text-on-surface/60">
                      {app.userCount}
                    </span>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-outline flex items-center justify-between relative z-10">
                  <button
                    onClick={() => {
                      setConfirmText("");
                      setDeletingApp(app);
                    }}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-error/5 text-error hover:bg-error hover:text-white transition-all duration-300 border border-error/10 hover:border-error"
                  >
                    <span className="material-symbols-outlined text-sm font-black">
                      delete
                    </span>
                  </button>
                  <Link
                    href={`/account/apps/${app.id}/settings`}
                    className="h-10 px-6 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary text-on-surface/40 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all duration-300 border border-white/5 hover:border-primary"
                  >
                    <span>Modifier l'app</span>
                  </Link>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setLastCreated(null);
                setShowModal(true);
              }}
              className="border-2 border-dashed border-outline/20 rounded-[2rem] p-8 flex flex-col items-center justify-center group hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 min-h-[380px] animate-in fade-in zoom-in-95 duration-700"
            >
              <div className="w-12 h-12 rounded-xl bg-background-dark border border-outline flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-xl">
                <span className="material-symbols-outlined text-on-surface/20 group-hover:text-white font-black">
                  add
                </span>
              </div>
              <span className="font-display text-sm font-black text-on-surface/40 group-hover:text-on-surface transition-colors mb-2 uppercase tracking-widest">
                Nouvelle Application
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
