"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 z-50 bg-background-dark border-r border-outline flex flex-col transition-all duration-300">
      <div className="p-8 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group transition-all">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform shadow-lg shadow-primary/10">
            <Image
              src="/favicon.svg"
              alt="Octara"
              className="h-6 w-6"
              width={24}
              height={24}
            />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-on-surface">
              Octara
            </h1>
          </div>
        </Link>
      </div>

      <nav className="flex flex-col gap-1 p-6 flex-grow">
        
        {[
          { href: "/account", label: "Mon Compte", icon: "person", fill: true },
          {
            href: "/account/connected-apps",
            label: "Apps Connectées",
            icon: "grid_view",
            fill: false,
          },
          {
            href: "/account/apps",
            label: "Espace Développeur",
            icon: "deployed_code",
            fill: false,
          },
        ].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-4 group ${
                isActive
                  ? "bg-primary text-white shadow-xl shadow-primary/20 font-bold"
                  : "text-on-surface/40 hover:text-on-surface hover:bg-white/5 border border-transparent hover:border-white/5"
              }`}
            >
              <span
                className="material-symbols-outlined transition-transform group-hover:scale-110 text-xl"
                style={{
                  fontVariationSettings:
                    isActive && item.fill ? "'FILL' 1" : "",
                }}
              >
                {item.icon}
              </span>
              <span className="text-sm font-semibold tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-outline">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-2">
            Statut
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold opacity-60">Connecté</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
