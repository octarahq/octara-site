"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt?: string;
  passwordUpdatedAt?: string;
}

function getTimeAgo(date: string | undefined): string {
  if (!date) return "jamais";
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      return diffInMins <= 1 ? "à l'instant" : `il y a ${diffInMins} min`;
    }
    return `il y a ${diffInHours} h`;
  }
  return `il y a ${diffInDays} j`;
}

export default function AccountForms({ initialUser }: { initialUser: User }) {
  const { refreshAuth } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState(initialUser);
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityStatus, setSecurityStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    setName(user.name || "");
    setEmail(user.email || "");
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setStatus(null);

    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ type: "success", msg: "Profil mis à jour avec succès !" });
        await refreshAuth();
        setUser((prev) => ({ ...prev, name, email }));
      } else {
        setStatus({
          type: "error",
          msg: data.error || "Une erreur est survenue",
        });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "Erreur de connexion serveur" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);

    if (newPassword !== confirmPassword) {
      setSecurityStatus({
        type: "error",
        msg: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    if (newPassword.length < 8) {
      setSecurityStatus({
        type: "error",
        msg: "Le mot de passe doit faire au moins 8 caractères",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setSecurityStatus({
          type: "success",
          msg: "Mot de passe modifié avec succès !",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        await refreshAuth();
        setUser((prev) => ({
          ...prev,
          passwordUpdatedAt: new Date().toISOString(),
        }));
        setTimeout(() => setShowPasswordModal(false), 1500);
      } else {
        setSecurityStatus({
          type: "error",
          msg: data.error || "Ancien mot de passe incorrect",
        });
      }
    } catch (err) {
      setSecurityStatus({ type: "error", msg: "Erreur serveur" });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setIsUpdating(true);
      try {
        const res = await fetch("/api/user/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatarData: base64 }),
        });
        if (res.ok) {
          await refreshAuth();
          router.refresh();
        }
      } catch (err) {
        console.error("Avatar upload failed", err);
      } finally {
        setIsUpdating(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleAvatarUpload}
      />

      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-background-dark/90 backdrop-blur-sm"
            onClick={() => !isUpdating && setShowPasswordModal(false)}
          ></div>
          <div className="relative w-full max-w-md bg-surface-container rounded-3xl border border-outline shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black font-display">
                Protection Vault
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-on-surface/20 font-black">
                  close
                </span>
              </button>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface/20 mb-2 ml-1">
                    Secret actuel
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-background-dark/50 border border-outline rounded-xl px-5 py-4 focus:border-primary outline-none transition-all text-sm font-semibold"
                    placeholder="••••••••"
                  />
                </div>
                <div className="h-[1px] bg-outline/20 my-2"></div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface/20 mb-2 ml-1">
                    Nouveau secret
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={255}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-background-dark/50 border border-outline rounded-xl px-5 py-4 focus:border-primary outline-none transition-all text-sm font-semibold"
                    placeholder="Min. 8 caractères"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface/20 mb-2 ml-1">
                    Validation du secret
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background-dark/50 border border-outline rounded-xl px-5 py-4 focus:border-primary outline-none transition-all text-sm font-semibold"
                    placeholder="Confirmation"
                  />
                </div>
              </div>
              {securityStatus && (
                <div
                  className={`p-4 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${securityStatus.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-error/10 border-error/20 text-error"}`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {securityStatus.type === "success"
                      ? "verified"
                      : "security"}
                  </span>
                  {securityStatus.msg}
                </div>
              )}
              <button
                disabled={isUpdating}
                className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isUpdating ? "Traitement..." : "Modifier le secret"}
              </button>
            </form>
          </div>
        </div>
      )}

      <header className="fixed top-0 right-0 left-72 h-20 z-40 bg-background-dark/80 backdrop-blur-xl flex items-center justify-between px-12 border-b border-outline">
        <div className="flex items-center gap-2">
          <span className="text-on-surface text-[10px] font-black uppercase tracking-widest">
            Identité
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-tighter group-hover:text-primary transition-colors">
                {user.name || user.email.split("@")[0]}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full border border-outline group-hover:border-primary transition-all overflow-hidden flex items-center justify-center bg-slate-900 shadow-lg shadow-black/40">
              <img
                src={`/api/user/avatar/${user.id}`}
                alt="Avatar"
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="pl-72 pt-28 pb-20 px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 animate-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-5xl font-black font-display tracking-tighter mb-4 text-on-surface">
              Paramètres du Compte
            </h2>
            <p className="text-on-surface/40 max-w-xl text-sm leading-relaxed">
              Gérez votre identité centrale sur l'écosystème Octara et vos
              privilèges d'accès.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <section className="col-span-12 lg:col-span-8 bg-surface-container rounded-[2rem] p-10 border border-outline relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <span className="material-symbols-outlined text-primary text-[120px] select-none">
                  fingerprint
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-8 mb-16">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl bg-background-dark">
                      <img
                        src={`/api/user/avatar/${user.id}`}
                        alt="Avatar"
                        className="size-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-pointer border-2 border-surface-container"
                    >
                      <span className="material-symbols-outlined text-[14px] font-black">
                        photo_camera
                      </span>
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-on-surface mb-2 font-display">
                      {user.name || "Utilisateur Anonyme"}
                    </h3>
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[10px] text-on-surface/20 font-black uppercase tracking-[0.2em] bg-background-dark/50 px-3 py-1 rounded-lg border border-outline">
                        Inscrit depuis le{" "}
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "???"}
                      </span>
                    </div>
                    {status && (
                      <p
                        className={`mt-3 text-[10px] font-black uppercase tracking-widest ${status.type === "success" ? "text-green-500" : "text-error"}`}
                      >
                        {status.msg}
                      </p>
                    )}
                  </div>
                </div>

                <form className="space-y-8" onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] uppercase tracking-widest font-black text-on-surface/20 ml-1">
                        Nom complet
                      </label>
                      <input
                        className="w-full bg-background-dark/50 border border-outline focus:border-primary transition-all px-5 py-4 rounded-xl text-sm font-semibold text-on-surface outline-none"
                        type="text"
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] uppercase tracking-widest font-black text-on-surface/20 ml-1">
                        Adresse e-mail
                      </label>
                      <input
                        className="w-full bg-background-dark/50 border border-outline focus:border-primary transition-all px-5 py-4 rounded-xl text-sm font-semibold text-on-surface outline-none"
                        type="email"
                        maxLength={255}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="pt-6 flex">
                    <button
                      disabled={isUpdating}
                      className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                      {isUpdating
                        ? "Synchronisation..."
                        : "Mettre à jour l'identité"}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section className="col-span-12 lg:col-span-4 flex flex-col gap-8">
              <div className="bg-surface-container rounded-[2rem] p-8 border border-outline hover:border-primary/40 transition-all shadow-xl group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-background-dark border border-outline flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <span className="material-symbols-outlined font-black">
                      passkey
                    </span>
                  </div>
                  <h3 className="text-base font-black font-display uppercase tracking-widest">
                    Identifiants
                  </h3>
                </div>
                <p className="text-[10px] text-on-surface/40 font-black uppercase mb-8 leading-relaxed">
                  Mot de passe modifié {getTimeAgo(user.passwordUpdatedAt)}.
                  Gardez vos identifiants en sécurité dans le vault.
                </p>
                <button
                  onClick={() => {
                    setSecurityStatus(null);
                    setShowPasswordModal(true);
                  }}
                  className="w-full bg-background-dark/50 border border-outline py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  Changer le mot de passe
                </button>
              </div>

              <div className="bg-surface-container rounded-[2rem] p-8 border border-outline shadow-xl opacity-60 grayscale">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-background-dark border border-outline flex items-center justify-center text-on-surface/20">
                    <span className="material-symbols-outlined font-black">
                      shield_locked
                    </span>
                  </div>
                  <h3 className="text-base font-black font-display uppercase tracking-widest">
                    Sécurité 2FA
                  </h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/20">
                    Bientôt disponible
                  </span>
                </div>
              </div>
            </section>

            <section className="col-span-12 bg-error/5 border border-error/20 rounded-[2rem] p-8 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error border border-error/20">
                  <span className="material-symbols-outlined font-black">
                    power_settings_new
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black font-display uppercase tracking-widest text-error">
                    Zone de danger
                  </h3>
                  <p className="text-[10px] text-error/40 font-black uppercase tracking-widest">
                    Terminer la session et quitter le vault
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.push("/");
                  router.refresh();
                }}
                className="px-10 py-4 bg-error text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-error/20 hover:scale-105 active:scale-95 transition-all"
              >
                Déconnexion
              </button>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
