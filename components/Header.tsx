"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const lang = pathname?.startsWith("/tr") ? "tr" : "en";

  const nav = [
    { name: "Home", path: `/${lang}` },
    { name: "About", path: `/${lang}/about` },
    { name: "Gallery", path: `/${lang}/gallery` },
    { name: "Journal", path: `/${lang}/journal` },
    { name: "Contact", path: `/${lang}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-6">
        <Link
          href={`/${lang}`}
          className="text-xl font-bold tracking-wide text-yellow-400"
        >
          CINENTO
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active =
              pathname === item.path ||
              pathname?.startsWith(item.path + "/");

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative text-sm transition ${
                  active
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-300"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-2 left-0 h-[1px] bg-yellow-400 transition-all duration-300 ${
                    active ? "w-full" : "w-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <Link
          href={`/${lang}/contact`}
          className="rounded-xl bg-yellow-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400"
        >
          Start Project
        </Link>
      </div>
    </header>
  );
}