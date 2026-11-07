"use client";

import React, { useEffect, useState } from "react";

interface TradingViewCryptoScreenerProps {
  height?: number | string;
  defaultColumn?: string;
  currency?: string;
}

export default function TradingViewCryptoScreener({
  height = 580,
  defaultColumn = "overview",
  currency = "USD",
}: TradingViewCryptoScreenerProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Initial sync with DOM or localStorage
    const saved = localStorage.getItem("ekonnet_theme");
    const isDark = saved ? saved === "dark" : document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Listen to theme-changed custom event
    const handleThemeChange = (e: any) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme);
      } else {
        const darkNow = document.documentElement.classList.contains("dark");
        setTheme(darkNow ? "dark" : "light");
      }
    };

    window.addEventListener("theme-changed", handleThemeChange);

    // MutationObserver as secondary guarantee
    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains("dark");
      setTheme(darkNow ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("theme-changed", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const settings = {
    width: "100%",
    height: typeof height === "number" ? height : 580,
    defaultColumn: defaultColumn,
    screener_type: "crypto_mkt",
    displayCurrency: currency,
    colorTheme: theme,
    locale: "en",
    isTransparent: false,
  };

  const iframeSrc = `https://www.tradingview-widget.com/embed-widget/crypto-mkt-screener/#${encodeURIComponent(
    JSON.stringify(settings)
  )}`;

  return (
    <div
      key={`screener-${theme}-${currency}`}
      className="w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 shadow-xs dark:shadow-xl space-y-4 transition-colors duration-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            TradingView Live Market Screener
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold border border-orange-500/20">
            Official Feed
          </span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
          <span>Active Theme:</span>
          <span
            className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] transition-colors ${
              theme === "dark"
                ? "bg-slate-800 text-orange-400 border border-white/10"
                : "bg-slate-100 text-slate-800 border border-slate-200"
            }`}
          >
            {theme} Mode
          </span>
        </div>
      </div>

      {mounted && (
        <iframe
          src={iframeSrc}
          width="100%"
          height={height}
          style={{ border: "none", borderRadius: "12px", display: "block" }}
          scrolling="no"
          title="TradingView Crypto Screener"
        />
      )}
    </div>
  );
}
