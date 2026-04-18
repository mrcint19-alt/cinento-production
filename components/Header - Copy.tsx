"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const currentLang =
    pathname?.startsWith("/tr") ? "tr" : "en";

  const navItems = [
    { label: "Home", href: `/${currentLang}` },
    { label: "About", href: `/${currentLang}/about` },
    { label: "Journal", href: `/${currentLang}/journal` },
    { label: "Gallery", href: `/${currentLang}/gallery` },
    { label: "Contact", href: `/${currentLang}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-6">
        <Link
          href={`/${currentLang}`}
          className="text-xl font-bold tracking-[0.2em] text-yellow-400 transition hover:opacity-90"
        >
          CINENTO
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `/${currentLang}` &&
                pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition ${
                  isActive
                    ? "text-yellow-400"
                    : "text-white/80 hover:text-yellow-300"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-2 left-0 h-[1px] bg-yellow-400 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          href={`/${currentLang}/contact`}
          className="rounded-xl bg-yellow-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400"
        >
          Start Project
        </Link>
      </div>
    </header>
  );
}