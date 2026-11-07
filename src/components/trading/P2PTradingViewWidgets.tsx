"use client";

import React, { useEffect, useRef, useState } from "react";
import { TrendingUp, Activity, Globe2, ShieldCheck } from "lucide-react";

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
  const miniChartRef = useRef<HTMLDivElement>(null);
  const technicalAnalysisRef = useRef<HTMLDivElement>(null);
  const forexRef = useRef<HTMLDivElement>(null);

  const currentSymbol = SYMBOL_MAP[asset] || "BINANCE:BTCUSDT";
  const displayAssetName = asset === "ALL" ? "BTC" : asset;

  // Listen for dark mode changes
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

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

  // Inject Mini Chart Widget
  useEffect(() => {
    if (!miniChartRef.current) return;
    miniChartRef.current.innerHTML = "";

    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    container.style.width = "100%";
    container.style.height = "100%";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.width = "100%";
    widgetDiv.style.height = "100%";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: currentSymbol,
      width: "100%",
      height: 220,
      locale: "en",
      dateRange: "1M",
      colorTheme: theme,
      isTransparent: true,
      autosize: false,
      largeChartUrl: "",
      chartOnly: false,
      noTimeScale: false,
    });

    container.appendChild(script);
    miniChartRef.current.appendChild(container);
  }, [currentSymbol, theme]);

  // Inject Technical Analysis Widget
  useEffect(() => {
    if (!technicalAnalysisRef.current) return;
    technicalAnalysisRef.current.innerHTML = "";

    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    container.style.width = "100%";
    container.style.height = "100%";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.width = "100%";
    widgetDiv.style.height = "100%";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: "1D",
      width: "100%",
      isTransparent: true,
      height: 220,
      symbol: currentSymbol,
      showIntervalTabs: false,
      displayMode: "single",
      locale: "en",
      colorTheme: theme,
    });

    container.appendChild(script);
    technicalAnalysisRef.current.appendChild(container);
  }, [currentSymbol, theme]);

  // Inject Forex Cross Rates Widget
  useEffect(() => {
    if (!forexRef.current) return;
    forexRef.current.innerHTML = "";

    const container = document.createElement("div");
    container.className = "tradingview-widget-container";
    container.style.width = "100%";
    container.style.height = "100%";

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.width = "100%";
    widgetDiv.style.height = "100%";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 220,
      currencies: ["EUR", "USD", "GBP", "AED", "PKR"],
      isTransparent: true,
      colorTheme: theme,
      locale: "en",
    });

    container.appendChild(script);
    forexRef.current.appendChild(container);
  }, [theme]);

  return (
    <div className="space-y-3">
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
          Active: <span className="font-bold text-slate-900 dark:text-white">{displayAssetName}</span> Market Benchmarks
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
          <div className="h-[220px] w-full" ref={miniChartRef} />
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
          <div className="h-[220px] w-full" ref={technicalAnalysisRef} />
        </div>

        {/* Card 3: Global Fiat Cross Rates */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/[0.08] shadow-xs dark:shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Globe2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Fiat Settlement Rates</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Interbank</span>
          </div>
          <div className="h-[220px] w-full" ref={forexRef} />
        </div>
      </div>
    </div>
  );
}
