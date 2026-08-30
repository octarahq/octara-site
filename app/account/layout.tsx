import Link from "next/link";
import { User, Settings, LayoutDashboard, LogOut } from "lucide-react";
import React from "react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/account"
            className="flex items-center gap-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-50 transition-all hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">My account</span>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 dark:text-zinc-400 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm font-medium">Projects</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 dark:text-zinc-400 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-zinc-200 dark:border-zinc-800">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 dark:text-zinc-400 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400">
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
