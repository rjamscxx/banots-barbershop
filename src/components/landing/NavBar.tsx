"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-20 flex items-center justify-between px-6 py-4 transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-100 bg-white/90 backdrop-blur-sm"
          : "border-b border-white/10 bg-transparent"
      }`}
    >
      <span
        className={`font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight transition-colors duration-300 ${
          scrolled ? "text-foreground" : "text-white"
        }`}
      >
        Banot&apos;s
      </span>
      <Link href="/book" className="btn-gold h-9 px-5 text-xs">
        Book Now
      </Link>
    </header>
  );
}
