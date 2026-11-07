"use client";

import React, { useEffect, useRef, useState } from "react";

interface TradingViewAdvancedChartProps {
  symbol?: string; // e.g. "BINANCE:BTCUSDT" or "BINANCE:ETHUSDT"
  height?: string | number;
  timeFrame?: string; // e.g. "12M"
  allowSymbolChange?: boolean;
}

export default function TradingViewAdvancedChart({
  symbol = "BINANCE:BTCUSDT",
  height = "560px",
  timeFrame = "12M",
  allowSymbolChange = true,
}: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Sync theme with document class (dark / light)
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

  // Dynamically load the TradingView Web Component script
  useEffect(() => {
    const scriptId = "tv-advanced-chart-module";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "module";
      script.src = "https://widgets.tradingview-widget.com/w/en/tv-advanced-chart.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Mount the <tv-advanced-chart> custom element
  useEffect(() => {
    if (!containerRef.current) return;

    // Reset container contents
    containerRef.current.innerHTML = "";

    // Create custom element exactly per TradingView Web Component specification
    const tvChart = document.createElement("tv-advanced-chart");
    if (allowSymbolChange) {
      tvChart.setAttribute("allow-symbol-change", "true");
    }
    tvChart.setAttribute("symbol", symbol);
    tvChart.setAttribute("theme", theme);
    tvChart.setAttribute("autosize", "true");
    tvChart.setAttribute("locale", "en");
    tvChart.setAttribute("interval", "D");
    if (timeFrame) {
      tvChart.setAttribute("timeframe", timeFrame);
    }
    tvChart.setAttribute("calendar", "false");
    tvChart.setAttribute("show-date-ranges", "true");
    tvChart.setAttribute("show-drawing-toolbar", "true");
    tvChart.style.width = "100%";
    tvChart.style.height = "100%";
    tvChart.style.display = "block";

    containerRef.current.appendChild(tvChart);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme, timeFrame, allowSymbolChange]);

  return (
    <div className="w-full relative rounded-2xl overflow-hidden bg-slate-900/50 dark:bg-[#070b14] border border-slate-200/80 dark:border-white/10 shadow-xl">
      <div
        ref={containerRef}
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        className="w-full"
      />
    </div>
  );
}
