"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ConnectedApp {
  id: string;
  clientId: string;
  scopes: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    client_id: string;
    is_first_party: boolean;
  };
}

interface AppsListProps {
  initialApps: ConnectedApp[];
}

export default function AppsList({ initialApps }: AppsListProps) {
  const router = useRouter();
  const [apps, setApps] = useState<ConnectedApp[]>(initialApps);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);

  const handleRevoke = async (clientId: string) => {
    if (
      !confirm(
        "Voulez-vous vraiment révoquer l'accès pour cette application ? Elle ne pourra plus accéder à vos données tant que vous ne vous reconnecterez pas.",
      )
    )
      return;

    setIsRevoking(clientId);
    try {
      const res = await fetch("/api/account/connected-apps/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      if (res.ok) {
        setApps(apps.filter((app) => app.client.id !== clientId));
        router.refresh();
      }
    } catch (err) {
      console.error("Revoke Error:", err);
    } finally {
      setIsRevoking(null);
    }
  };

  return (
    <div className="space-y-6">
      {apps.length === 0 ? (
        <div className="glass-panel p-20 rounded-3xl text-center border-dashed border-2 border-white/5 shadow-2xl">
          <span className="material-symbols-outlined text-6xl text-primary/10 mb-4 block">
            apps_outage
          </span>
          <h3 className="text-xl font-bold mb-2 text-on-surface">
            Aucune application connectée
          </h3>
          <p className="text-on-surface-variant text-sm">
            Gérez les applications autorisées pour sécuriser votre identité.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apps.map((app) => (
            <div
              key={app.id}
              className="glass-panel rounded-3xl p-8 border border-white/5 hover:border-primary/20 transition-all group flex flex-col shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 overflow-hidden shadow-inner">
                    <img
                      src={`/api/apps/logo/${app.client.id}`}
                      alt="Avatar"
                      className="size-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-black font-headline truncate max-w-[200px] text-on-surface">
                        {app.client.name}
                      </h3>
                      {app.client.is_first_party && (
                        <span className="bg-primary/10 text-primary text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-primary/10 tracking-widest leading-none">
                          Officiel
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-on-surface-variant font-mono opacity-60">
                      ID: {app.client.client_id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                <div>
                  <label className="block text-[10px] uppercase font-black tracking-widest text-on-surface-variant mb-3 ml-1">
                    Permissions accordées
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {app.scopes.split(" ").map((scope, idx) => (
                      <span
                        key={idx}
                        className="bg-surface-container-high px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface border border-white/5 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[10px]">
                          check_circle
                        </span>
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] bg-white/5"></div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest opacity-60">
                      Connectée le
                    </span>
                    <span className="text-xs font-bold text-on-surface">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRevoke(app.client.id)}
                    disabled={isRevoking === app.client.id}
                    className="px-5 py-2.5 rounded-xl border border-error/20 text-error text-[10px] font-black uppercase tracking-widest hover:bg-error hover:text-white transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isRevoking === app.client.id ? (
                      "Révocation..."
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xs">
                          logout
                        </span>
                        Révoquer l'accès
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
