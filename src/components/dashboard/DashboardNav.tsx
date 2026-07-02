"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "Today" },
  { href: "/dashboard/pending", label: "Pending" },
  { href: "/dashboard/clients", label: "Clients" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardNav({ pendingCount }: { pendingCount: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex border-t border-zinc-800 bg-brand-black">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/dashboard" ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="relative flex flex-1 flex-col items-center gap-1 py-3"
          >
            {isActive && (
              <span className="absolute top-0 inset-x-4 h-[2px] rounded-full bg-brand-gold" />
            )}
            <span className="flex items-center gap-1.5">
              <span className={`text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                isActive ? "text-brand-gold" : "text-zinc-600"
              }`}>
                {tab.label}
              </span>
              {tab.href === "/dashboard/pending" && pendingCount > 0 ? (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[9px] font-bold text-white">
                  {pendingCount}
                </span>
              ) : null}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
