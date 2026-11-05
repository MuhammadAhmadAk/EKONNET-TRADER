"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Layers, 
  TrendingUp, 
  Mail, 
  Search, 
  ExternalLink,
  Globe2,
  Sparkles
} from "lucide-react";

export interface FloatingPlatform {
  id: string;
  name: string;
  tagline: string;
  category: string;
  replaces: string;
  domain: string;
  url: string;
  accentColor: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const FLOATING_PLATFORMS: FloatingPlatform[] = [
  {
    id: "konnetone",
    name: "KonnetOne",
    tagline: "Global Real Estate MLS & 4K WebRTC Studios",
    category: "MLS & 4K Studios",
    replaces: "Zillow + Zoom + Upwork",
    domain: "konnetone.com",
    url: "https://konnetone.com",
    accentColor: "text-cyan-400",
    glowColor: "rgba(6, 182, 212, 0.4)",
    icon: Building2,
  },
  {
    id: "imeigs",
    name: "IMEIGS",
    tagline: "17-Tier Digital Workspace & 2TB NVMe Cloud",
    category: "17-Tier Cloud Hub",
    replaces: "Google + Dropbox + Slack",
    domain: "imeigs.com",
    url: "https://imeigs.com",
    accentColor: "text-[#FF5C35]",
    glowColor: "rgba(255, 92, 53, 0.45)",
    icon: Layers,
  },
  {
    id: "ekonnet",
    name: "EkonnetTrader",
    tagline: "100% In-Browser Web Trading & Free $10K Demo",
    category: "Web FinTech Terminal",
    replaces: "Binance + MT4 + Bitfinex",
    domain: "ekonnet.com",
    url: "https://ekonnet.com",
    accentColor: "text-blue-400",
    glowColor: "rgba(59, 130, 246, 0.45)",
    icon: TrendingUp,
  },
  {
    id: "imezin",
    name: "ImeZin",
    tagline: "Zero-Knowledge Client-Side Encrypted Email",
    category: "Encrypted Privacy Mail",
    replaces: "ProtonMail + Tuta + Gmail",
    domain: "imezin.com",
    url: "https://imezin.com",
    accentColor: "text-violet-400",
    glowColor: "rgba(139, 92, 246, 0.45)",
    icon: Mail,
  },
  {
    id: "aurasearch",
    name: "AuraSearch",
    tagline: "Zero-Trace Private Web Search & Grounded RAG AI",
    category: "Sovereign AI Search",
    replaces: "Google + DuckDuckGo + Perplexity",
    domain: "browzzit.com",
    url: "https://browzzit.com",
    accentColor: "text-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.4)",
    icon: Search,
  },
];

export default function FloatingEcosystemDock({ currentPlatformId = "ekonnet" }: { currentPlatformId?: string }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handlePlatformClick = (platform: FloatingPlatform) => {
    if (platform.id === currentPlatformId) {
      const showcaseElem = document.getElementById("ecosystem-showcase");
      if (showcaseElem) {
        showcaseElem.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      window.open(platform.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <aside 
      aria-label="Sovereign Ecosystem Floating Dock"
      className="fixed right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-50 select-none hidden xs:flex flex-col items-center"
    >
      <div className="relative p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-slate-900/90 dark:bg-[#070b14]/90 backdrop-blur-2xl border border-white/10 dark:border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col items-center gap-1.5 sm:gap-2">
        
        <div 
          title="The Sovereign 5-Platform Digital Empire"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-default"
        >
          <Globe2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70 animate-pulse text-blue-400" />
        </div>

        <div className="w-5 h-[1px] bg-white/10 my-0.5" />

        {FLOATING_PLATFORMS.map((platform) => {
          const IconComponent = platform.icon;
          const isCurrent = platform.id === currentPlatformId;
          const isHovered = hoveredId === platform.id;

          return (
            <div
              key={platform.id}
              className="relative flex items-center"
              onMouseEnter={() => setHoveredId(platform.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                type="button"
                onClick={() => handlePlatformClick(platform)}
                className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 ${
                  isCurrent
                    ? "bg-white/15 ring-2 ring-blue-500 shadow-[0_0_16px_rgba(59,130,246,0.4)]"
                    : isHovered
                    ? "bg-white/15 shadow-lg"
                    : "bg-white/5 hover:bg-white/10"
                }`}
                style={{
                  boxShadow: isHovered ? `0 0 16px ${platform.glowColor}` : undefined,
                }}
              >
                <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${platform.accentColor} ${isHovered ? "scale-110" : ""}`} />

                {isCurrent && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                  </span>
                )}
              </button>

              <div
                onClick={() => handlePlatformClick(platform)}
                className={`absolute right-full mr-3.5 top-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-200 ease-out origin-right ${
                  isHovered
                    ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                    : "opacity-0 translate-x-3 scale-95 pointer-events-none"
                }`}
              >
                <div className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-900/95 dark:bg-[#080d19]/95 backdrop-blur-2xl border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.6)] whitespace-nowrap text-left group">
                  
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-extrabold font-serif tracking-tight text-white">
                        {platform.name}
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                        {platform.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {platform.tagline}
                    </p>
                  </div>

                  <div className="pl-2 border-l border-white/10 flex items-center">
                    {isCurrent ? (
                      <span className="text-[10px] font-mono font-bold text-blue-400 px-2 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30">
                        Active Site
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 group-hover:bg-cyan-500/25 transition-colors">
                        <span>Open</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-slate-900 dark:border-l-[#080d19]" />
                </div>
              </div>
            </div>
          );
        })}

        <div className="w-5 h-[1px] bg-white/10 my-0.5" />

        <div 
          onClick={() => {
            const el = document.getElementById("ecosystem-showcase");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          title="Scroll to full 5-Platform Showcase"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-white/5 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </div>
    </aside>
  );
}
