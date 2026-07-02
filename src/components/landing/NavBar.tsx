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
          ? "border-b border-zinc-800 bg-brand-black/95 backdrop-blur-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <span className="font-[family-name:var(--font-bebas)] text-2xl tracking-[0.06em] text-white">
        Banot&apos;s
      </span>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-7 sm:flex">
        <a
          href="#services"
          className="group relative text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 transition-colors duration-300 hover:text-white"
        >
          Services
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-brand-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
        </a>
        <a
          href="#how-it-works"
          className="group relative text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 transition-colors duration-300 hover:text-white"
        >
          How it works
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-brand-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
        </a>
        <Link href="/book" className="btn-gold h-9 px-5 text-xs">
          Book Now
        </Link>
      </nav>

      {/* Mobile — just the CTA */}
      <Link href="/book" className="btn-gold h-9 px-5 text-xs sm:hidden">
        Book Now
      </Link>
    </header>
  );
}
