"use client";

import React, { useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Initial theme check
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // MutationObserver to reactively detect theme toggle changes in Navbar
    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains("dark");
      setTheme(darkNow ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.width = "100%";
    widgetContainer.style.height = `${height}px`;

    const widgetInner = document.createElement("div");
    widgetInner.className = "tradingview-widget-container__widget";
    widgetInner.style.width = "100%";
    widgetInner.style.height = "100%";
    widgetContainer.appendChild(widgetInner);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: height,
      defaultColumn: defaultColumn,
      screener_type: "crypto_mkt",
      displayCurrency: currency,
      colorTheme: theme,
      locale: "en",
      isTransparent: true,
    });

    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);
  }, [theme, height, defaultColumn, currency]);

  return (
    <div key={theme + "-" + currency} className="w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-xl p-4 sm:p-6 shadow-xs dark:shadow-xl space-y-4">
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
          <span>Theme:</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold uppercase text-[10px]">
            {theme} Mode
          </span>
        </div>
      </div>
      <div ref={containerRef} className="w-full" style={{ minHeight: `${height}px` }} />
    </div>
  );
}
