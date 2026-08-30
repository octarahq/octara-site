"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user || user.role !== "ADMIN") {
    notFound();
  }

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-foreground">
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col">
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-semibold"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 px-3 py-2.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <div className="flex-1 p-8 max-w-6xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
