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
    <nav className="flex border-t border-divider bg-white">
      {TABS.map((tab) => {
        const isActive =
          tab.href === "/dashboard" ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-semibold"
          >
            <span className="flex items-center gap-1.5">
              <span className={isActive ? "text-brand-black" : "text-zinc-400"}>{tab.label}</span>
              {tab.href === "/dashboard/pending" && pendingCount > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-brand-black">
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
