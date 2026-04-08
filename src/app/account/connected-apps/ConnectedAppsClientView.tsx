"use client";

import LinkNext from "next/link";
import AccountSidebar from "../_components/AccountSidebar";
import AppsList from "../_components/AppsList";

interface InitialUser {
  id: string;
  email: string;
  name: string | null;
}

export default function ConnectedAppsClientView({
  initialUser,
  initialConsents,
}: {
  initialUser: InitialUser;
  initialConsents: any[];
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary font-body">
      <AccountSidebar />

      <header className="fixed top-0 right-0 left-72 h-20 z-40 bg-[#0d0d16]/80 backdrop-blur-xl flex items-center justify-between px-12 border-b border-white/5">
        <div className="flex items-center gap-2">
          <LinkNext
            href="/"
            className="text-on-surface-variant text-xs tracking-widest uppercase font-bold"
          >
            Octara
          </LinkNext>
          <span className="material-symbols-outlined text-[10px] text-outline-variant font-black">
            chevron_right
          </span>
          <LinkNext
            href="/account"
            className="text-on-surface-variant text-[12px] font-headline font-bold"
          >
            Mon Compte
          </LinkNext>
          <span className="material-symbols-outlined text-[10px] text-outline-variant font-black">
            chevron_right
          </span>
          <span className="text-primary font-headline font-bold">
            Applications Connectées
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right">
              <p className="text-xs font-bold group-hover:text-primary transition-colors truncate max-w-[150px]">
                {initialUser?.name || initialUser?.email.split("@")[0]}
              </p>
              <p className="text-[10px] text-on-surface-variant truncate max-w-[150px]">
                {initialUser?.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full border border-primary/20 group-hover:border-primary transition-all overflow-hidden flex items-center justify-center bg-slate-900 shadow-lg">
              <img
                src={`/api/user/avatar/${initialUser?.id}`}
                alt="Avatar"
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="ml-72 pt-28 pb-12 px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl font-extrabold font-headline tracking-tighter mb-4 text-on-surface">
              Applications connectées a votre compte
            </h2>
            <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
              Gérez les accès que vous avez accordés aux applications tierces et
              aux services Octara.
            </p>
          </div>

          <AppsList initialApps={initialConsents} />
        </div>
      </main>
    </div>
  );
}
