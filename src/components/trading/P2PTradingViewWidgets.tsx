"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Activity, Globe2 } from "lucide-react";

interface P2PTradingViewWidgetsProps {
  asset?: "ALL" | "BTC" | "ETH" | "USDT";
}

const SYMBOL_MAP: Record<string, string> = {
  BTC: "BINANCE:BTCUSDT",
  ETH: "BINANCE:ETHUSDT",
  USDT: "BINANCE:USDCUSDT",
  ALL: "BINANCE:BTCUSDT",
};

export default function P2PTradingViewWidgets({ asset = "BTC" }: P2PTradingViewWidgetsProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState<boolean>(false);

  const currentSymbol = SYMBOL_MAP[asset] || "BINANCE:BTCUSDT";
  const displayAssetName = asset === "ALL" ? "BTC" : asset;

  useEffect(() => {
    setMounted(true);
    // Initial sync
    const saved = localStorage.getItem("ekonnet_theme");
    const isDark = saved ? saved === "dark" : document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Listen to theme-changed custom event from Navbar
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

  // Official TradingView iframe URLs with s.tradingview.com, /?locale=en# and colorTheme
  const miniSettings = {
    symbol: currentSymbol,
    width: "100%",
    height: 220,
    locale: "en",
    dateRange: "1M",
    colorTheme: theme,
    isTransparent: false,
    autosize: false,
    largeChartUrl: "",
    chartOnly: false,
    noTimeScale: false,
  };
  const miniIframeSrc = `https://s.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#${encodeURIComponent(
    JSON.stringify(miniSettings)
  )}`;

  const taSettings = {
    interval: "1D",
    width: "100%",
    isTransparent: false,
    height: 220,
    symbol: currentSymbol,
    showIntervalTabs: false,
    displayMode: "single",
    locale: "en",
    colorTheme: theme,
  };
  const taIframeSrc = `https://s.tradingview.com/embed-widget/technical-analysis/?locale=en#${encodeURIComponent(
    JSON.stringify(taSettings)
  )}`;

  const forexSettings = {
    width: "100%",
    height: 220,
    currencies: ["EUR", "USD", "GBP", "AED", "PKR"],
    isTransparent: false,
    colorTheme: theme,
    locale: "en",
  };
  const forexIframeSrc = `https://s.tradingview.com/embed-widget/forex-cross-rates/?locale=en#${encodeURIComponent(
    JSON.stringify(forexSettings)
  )}`;

  const widgetBgColor = theme === "dark" ? "#131722" : "#ffffff";

  return (
    <div key={`tv-widgets-${theme}-${currentSymbol}`} className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            P2P Reference Market Intelligence
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-semibold border border-orange-500/20">
            TradingView Live
          </span>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
          Active: <span className="font-bold text-slate-900 dark:text-white">{displayAssetName}</span> ({theme.toUpperCase()} MODE)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Mini Price & 1-Month Trend */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] shadow-xs dark:shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
              <span>{displayAssetName} Spot Benchmark</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">1M Trend</span>
          </div>
          <div className="w-full rounded-xl overflow-hidden" style={{ backgroundColor: widgetBgColor, height: 220 }}>
            {mounted && (
              <iframe
                key={`mini-${theme}-${currentSymbol}`}
                src={miniIframeSrc}
                width="100%"
                height="220"
                style={{ border: "none", borderRadius: "10px", display: "block", backgroundColor: widgetBgColor }}
                scrolling="no"
                title="TradingView Mini Chart"
              />
            )}
          </div>
        </div>

        {/* Card 2: Market Sentiment Gauge */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] shadow-xs dark:shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Market Sentiment Meter</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">1D Signals</span>
          </div>
          <div className="w-full rounded-xl overflow-hidden" style={{ backgroundColor: widgetBgColor, height: 220 }}>
            {mounted && (
              <iframe
                key={`ta-${theme}-${currentSymbol}`}
                src={taIframeSrc}
                width="100%"
                height="220"
                style={{ border: "none", borderRadius: "10px", display: "block", backgroundColor: widgetBgColor }}
                scrolling="no"
                title="TradingView Technical Analysis"
              />
            )}
          </div>
        </div>

        {/* Card 3: Fiat Cross Rates */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] shadow-xs dark:shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Globe2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Fiat Settlement Rates</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Interbank</span>
          </div>
          <div className="w-full rounded-xl overflow-hidden" style={{ backgroundColor: widgetBgColor, height: 220 }}>
            {mounted && (
              <iframe
                key={`forex-${theme}`}
                src={forexIframeSrc}
                width="100%"
                height="220"
                style={{ border: "none", borderRadius: "10px", display: "block", backgroundColor: widgetBgColor }}
                scrolling="no"
                title="TradingView Forex Cross Rates"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
