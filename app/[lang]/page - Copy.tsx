<header className="sticky top-4 z-50">
  <div className="rounded-3xl border border-yellow-600/25 bg-black/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
    <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => goToSection("home")}
          className="group flex items-center gap-3 text-left"
        >
          <span className="text-xl font-semibold tracking-[0.18em] text-yellow-500 transition group-hover:text-yellow-400">
            {content.nav.brand}
          </span>
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => switchLanguage("en")}
            className={`min-w-[52px] rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition ${
              language === "en"
                ? "border-yellow-500 bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.25)]"
                : "border-yellow-600/25 bg-black/40 text-yellow-100 hover:border-yellow-500 hover:text-white"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => switchLanguage("tr")}
            className={`min-w-[52px] rounded-full border px-3 py-1.5 text-xs font-semibold tracking-wide transition ${
              language === "tr"
                ? "border-yellow-500 bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.25)]"
                : "border-yellow-600/25 bg-black/40 text-yellow-100 hover:border-yellow-500 hover:text-white"
            }`}
          >
            TR
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        {content.nav.items.map((item) => (
          <button
            key={item.label}
            onClick={() => goToSection(item.target)}
            className="rounded-full border border-yellow-600/15 bg-white/[0.02] px-4 py-2 text-sm text-neutral-200 transition hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-white"
          >
            {item.label}
          </button>
        ))}

        <div className="ml-2 hidden items-center gap-2 rounded-full border border-yellow-600/20 bg-black/40 px-2 py-1 lg:flex">
          <span className="px-2 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            {content.nav.languageLabel}
          </span>

          <button
            onClick={() => switchLanguage("en")}
            className={`min-w-[54px] rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition ${
              language === "en"
                ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.25)]"
                : "text-yellow-100 hover:bg-white/5 hover:text-white"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => switchLanguage("tr")}
            className={`min-w-[54px] rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition ${
              language === "tr"
                ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.25)]"
                : "text-yellow-100 hover:bg-white/5 hover:text-white"
            }`}
          >
            TR
          </button>
        </div>
      </div>
    </div>
  </div>
</header>