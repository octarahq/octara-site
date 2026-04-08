"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AccountSidebar from "@/app/account/_components/AccountSidebar";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { AVAILABLE_SCOPES } from "@/lib/constants/scopes";
import MultiSelect from "@/app/_components/MultiSelect";
import Image from "next/image";

interface AppDetail {
  id: string;
  client_id: string;
  name: string;
  description: string | null;
  logoData?: string | null;
  is_first_party: boolean;
  redirect_uris: { id: string; uri: string; clientId: string }[];
}

export default function ConfigAppClientView({ app }: { app: AppDetail }) {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(app.name);
  const [description, setDescription] = useState(app.description || "");
  const [redirectUris, setRedirectUris] = useState<string[]>(
    app.redirect_uris.map((r) => r.uri),
  );
  const [newUri, setNewUri] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setIsSaving(true);
      try {
        const res = await fetch("/api/apps/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: app.id,
            logoData: base64,
          }),
        });
        if (res.ok) {
          router.refresh();
        }
      } catch (err) {
        console.error("Logo upload failed", err);
      } finally {
        setIsSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRotationModal, setShowRotationModal] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);

  const [showTestModal, setShowTestModal] = useState(false);
  const [testScopes, setTestScopes] = useState<string[]>(["read:profile"]);
  const [testRedirectUri, setTestRedirectUri] = useState(
    "/playground/callback",
  );

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/apps/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: app.id,
          name,
          description,
          redirect_uris: redirectUris,
        }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== app.name.toUpperCase()) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/apps/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app.id }),
      });
      if (res.ok) {
        router.push("/account/apps");
      }
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRotateSecret = async () => {
    setIsRotating(true);
    try {
      const res = await fetch("/api/apps/rotate-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app.id }),
      });
      const data = await res.json();
      if (data.success) {
        setNewSecret(data.client_secret);
      }
    } catch (err) {
      console.error("Rotation failed", err);
    } finally {
      setIsRotating(false);
    }
  };

  const [uriError, setUriError] = useState("");

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const addUri = () => {
    if (!newUri) return;

    if (!isValidUrl(newUri)) {
      setUriError(
        "L'URL doit être valide et commencer par http:// ou https:// (ex: https://mon-app.com)",
      );
      return;
    }

    if (!redirectUris.includes(newUri)) {
      setRedirectUris([...redirectUris, newUri]);
      setNewUri("");
      setUriError("");
    }
  };

  const getTestAuthUrl = () => {
    const stateData = {
      client_id: app.client_id,
      nonce: "test_" + Math.random().toString(36).substring(7),
    };
    const state = btoa(JSON.stringify(stateData));

    const finalRedirectUri = testRedirectUri.startsWith("/")
      ? "https://octara.xyz" + testRedirectUri
      : testRedirectUri;

    const url = new URL("/api/oauth/authorize", "https://octara.xyz");
    url.searchParams.set("client_id", app.client_id);
    url.searchParams.set("redirect_uri", finalRedirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", testScopes.join(" "));
    url.searchParams.set("state", state);

    return url.toString();
  };

  const removeUri = (uri: string) => {
    setRedirectUris(redirectUris.filter((u) => u !== uri));
  };

  return (
    <div className="min-h-screen bg-background-dark text-on-surface selection:bg-primary/30 font-body">
      <AccountSidebar />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleLogoUpload}
      />

      {showRotationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-background-dark/90 backdrop-blur-sm"
            onClick={() => !isRotating && setShowRotationModal(false)}
          ></div>

          {!newSecret ? (
            <div className="relative w-full max-w-md bg-surface-container rounded-3xl border border-white/5 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                  <span className="material-symbols-outlined font-black">
                    sync_lock
                  </span>
                </div>
                <h3 className="text-xl font-black font-display">
                  Renouveler le Secret
                </h3>
              </div>

              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Êtes-vous sûr ? L&apos;ancien secret de l&apos;application{" "}
                <span className="text-on-surface font-black">
                  arrêtera immédiatement de fonctionner
                </span>
                . Tous les services utilisant l&apos;ancien secret ne pourront
                plus s&apos;authentifier.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowRotationModal(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-on-surface font-bold rounded-2xl transition-all"
                >
                  Annuler
                </button>
                <button
                  disabled={isRotating}
                  onClick={handleRotateSecret}
                  className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isRotating ? "Chiffrement..." : "Renouveler"}
                </button>
              </div>
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
                  Nouveau Secret
                </h3>
              </div>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Copiez ce secret <b>maintenant</b>. Il ne sera plus jamais
                accessible une fois cette fenêtre fermée.
              </p>

              <div className="group relative">
                <code className="block w-full bg-error/5 border border-error/10 p-4 rounded-xl font-mono text-base text-primary break-all select-all mb-8">
                  {newSecret}
                </code>
              </div>

              <button
                onClick={() => {
                  setNewSecret(null);
                  setShowRotationModal(false);
                }}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface font-black rounded-2xl transition-all"
              >
                J&apos;ai bien noté, fermer
              </button>
            </div>
          )}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-background-dark/95 backdrop-blur-md"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          ></div>
          <div className="relative w-full max-w-md bg-surface-container rounded-3xl border border-error/20 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error border border-error/10">
                <span className="material-symbols-outlined font-black">
                  delete_forever
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black font-display text-error">
                  Suppression Irréversible
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-error/60 font-black">
                  Action Requise
                </p>
              </div>
            </div>

            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
              Vous êtes sur le point de supprimer l&apos;application{" "}
              <span className="text-on-surface font-black">{app.name}</span>.
              Tous les accès utilisateurs et les jetons seront immédiatement
              révoqués.
            </p>

            <form onSubmit={handleDeleteApp} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-on-surface-variant mb-3 ml-1">
                  Tapez{" "}
                  <span className="text-on-surface font-black">
                    {app.name.toUpperCase()}
                  </span>{" "}
                  pour confirmer
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full bg-error/5 border border-error/10 rounded-xl px-5 py-4 focus:ring-2 focus:ring-error/50 outline-none transition-all text-sm font-black text-error text-center uppercase tracking-widest placeholder:opacity-20"
                  placeholder="NOM DE L'APP"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/5 text-on-surface font-bold rounded-2xl transition-all"
                >
                  Annuler
                </button>
                <button
                  disabled={
                    isDeleting || confirmText !== app.name.toUpperCase()
                  }
                  className="flex-1 py-4 bg-error text-white font-black rounded-2xl shadow-xl shadow-error/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30"
                >
                  {isDeleting ? "Exécution..." : "Supprimer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-background-dark/90 backdrop-blur-sm"
            onClick={() => setShowTestModal(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-surface-container rounded-3xl border border-white/5 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                <span className="material-symbols-outlined font-black">
                  science
                </span>
              </div>
              <h3 className="text-xl font-black font-display">
                Tester l&apos;Authentification
              </h3>
            </div>

            <div className="space-y-6">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1">
                Scopes
              </label>
              <MultiSelect
                options={AVAILABLE_SCOPES}
                selected={testScopes}
                onChange={setTestScopes}
                placeholder="Choisissez les scopes..."
              />

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-on-surface-variant ml-1">
                  URL de redirection
                </label>
                <input
                  className="w-full bg-background-dark/50 border border-white/5 focus:border-primary transition-all px-4 py-3 rounded-xl text-on-surface font-medium outline-none"
                  type="text"
                  value={testRedirectUri}
                  onChange={(e) => setTestRedirectUri(e.target.value)}
                  placeholder="/playground/callback"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface font-bold rounded-2xl transition-all"
                >
                  Annuler
                </button>
                <Link
                  href={getTestAuthUrl()}
                  className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                >
                  Continuer
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="fixed top-0 right-0 left-72 h-20 z-40 bg-background-dark/80 backdrop-blur-xl flex items-center justify-between px-12 border-b border-outline">
        <div className="flex items-center gap-2">
          <Link
            href="/account/apps"
            className="text-on-surface/40 hover:text-primary text-[10px] tracking-widest uppercase font-black transition-colors"
          >
            Développeur
          </Link>
          <span className="material-symbols-outlined text-[10px] opacity-20">
            chevron_right
          </span>
          <span className="text-on-surface text-[10px] font-black uppercase tracking-widest">
            {app.name}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-tighter group-hover:text-primary transition-colors">
                {authUser?.name || authUser?.email.split("@")[0]}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full border border-outline group-hover:border-primary transition-all overflow-hidden flex items-center justify-center bg-slate-900 shadow-lg shadow-black/40">
              <img
                src={`/api/user/avatar/${authUser?.id}`}
                alt="Avatar"
                className="size-full object-cover grayscale group-hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pl-72 pt-28 pb-20 px-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-4xl font-black font-display tracking-tighter mb-3 text-on-surface">
                Paramètres de l'App
              </h2>
              <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed opacity-60">
                Gérez les configurations de sécurité et l&apos;identité de votre
                client OAuth2 Forge.
              </p>
            </div>
            <button
              onClick={() => setShowTestModal(true)}
              className="group flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
              <span className="material-symbols-outlined text-sm">
                play_arrow
              </span>
              <span className="text-xs uppercase tracking-widest">
                Tester l'Auth
              </span>
            </button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-12 lg:col-span-8 flex flex-col gap-8">
              <div className="bg-surface-container rounded-[2rem] p-10 border border-outline shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>

                <div className="flex items-center gap-8 mb-12">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-outline bg-background-dark/50 flex items-center justify-center">
                      <img
                        src={`/api/apps/logo/${app.id}`}
                        alt="Logo"
                        className="size-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-lg shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer border border-white/10"
                    >
                      <span className="material-symbols-outlined text-xs font-black">
                        edit
                      </span>
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-black font-display mb-1">
                      Identité Générale
                    </h3>
                    <p className="text-xs text-on-surface/40 leading-relaxed max-w-xs">
                      Ce profil sera affiché aux utilisateurs d&apos;Octara lors
                      de la demande d&apos;autorisation.
                    </p>
                  </div>
                </div>

                <form className="space-y-8" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 gap-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface/30 ml-2">
                        Nom de l'application
                      </label>
                      <input
                        className="w-full bg-background-dark/50 border border-outline focus:border-primary transition-all px-6 py-4 rounded-2xl text-on-surface font-semibold outline-none placeholder:opacity-20"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface/30 ml-2">
                        Description
                      </label>
                      <textarea
                        className="w-full bg-background-dark/50 border border-outline focus:border-primary transition-all px-6 py-4 rounded-2xl text-on-surface font-semibold outline-none resize-none placeholder:opacity-20"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Que fait votre application ?"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface/30">
                          URIs de redirection autorisées
                        </label>
                      </div>
                      <div className="space-y-3">
                        {redirectUris.map((uri) => (
                          <div
                            key={uri}
                            className="flex items-center gap-3 bg-background-dark/30 rounded-xl pr-3 border border-outline"
                          >
                            <input
                              type="text"
                              value={uri}
                              onChange={(e) =>
                                setRedirectUris(
                                  redirectUris.map((u) =>
                                    u === uri ? e.target.value : u,
                                  ),
                                )
                              }
                              className="flex-1 bg-transparent border-0 focus:ring-0 text-on-surface/60 font-mono py-3 px-5 text-xs truncate"
                            />
                            <button
                              type="button"
                              onClick={() => removeUri(uri)}
                              className="p-2 text-on-surface/20 hover:text-error transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                            </button>
                          </div>
                        ))}
                        <div
                          className={`flex items-center gap-2 bg-background-dark/20 rounded-xl pr-3 border border-dashed transition-all ${uriError ? "border-error/50" : "border-outline"}`}
                        >
                          <input
                            className="flex-1 bg-transparent border-0 focus:ring-0 text-on-surface font-semibold py-4 px-6 text-xs placeholder:opacity-70"
                            placeholder="Ajouter une URL (https://...)"
                            type="text"
                            value={newUri}
                            onChange={(e) => {
                              setNewUri(e.target.value);
                              if (uriError) setUriError("");
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addUri();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={addUri}
                            className={`p-2 transition-colors ${uriError ? "text-error" : "text-primary/70 hover:text-primary"}`}
                          >
                            <span className="material-symbols-outlined font-black">
                              add
                            </span>
                          </button>
                        </div>
                        {uriError && (
                          <p className="text-[10px] text-error font-black uppercase tracking-wider ml-4 animate-pulse">
                            {uriError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 flex justify-end">
                    <button
                      disabled={isSaving}
                      className="px-10 py-4 bg-white/5 border border-white/5 text-on-surface font-black uppercase tracking-widest text-[10px] hover:bg-white/10 rounded-2xl transition-all active:scale-95 disabled:opacity-30"
                    >
                      {isSaving
                        ? "Synchronisation..."
                        : "Enregistrer les modifications"}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-container rounded-3xl p-8 border border-outline shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                    <span className="material-symbols-outlined text-sm font-black">
                      shield
                    </span>
                  </div>
                  <h3 className="text-sm font-black font-display uppercase tracking-widest">
                    Sécurité & Auth
                  </h3>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-[0.2em] text-on-surface/20 mb-3 ml-1">
                      Application Client ID
                    </label>
                    <div className="bg-background-dark border border-outline p-4 rounded-xl flex items-center justify-between group/id overflow-hidden">
                      <code className="text-xs text-white font-black truncate max-w-[200px]">
                        {app.client_id}
                      </code>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(app.client_id)
                        }
                        className="text-on-surface/90 hover:text-primary transition-all"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          content_copy
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setNewSecret(null);
                        setShowRotationModal(true);
                      }}
                      className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface/60 hover:text-on-surface hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xs">
                        refresh
                      </span>
                      Changer le Secret
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-error/5 rounded-3xl p-8 border border-error/10 space-y-4 shadow-sm hover:bg-error/10 transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error text-lg">
                    dangerous
                  </span>
                  <h3 className="text-xs font-black uppercase tracking-widest text-error">
                    Zone de danger
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setConfirmText("");
                    setShowDeleteModal(true);
                  }}
                  disabled={isDeleting}
                  className="w-full py-3 border border-error/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-error hover:bg-error hover:text-white transition-all disabled:opacity-20"
                >
                  Supprimer l&apos;App
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
