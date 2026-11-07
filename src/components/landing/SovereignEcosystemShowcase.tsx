"use client";

import React, { useState } from "react";
import { 
  Building2, 
  TrendingUp, 
  Mail, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Globe2
} from "lucide-react";

export interface EcosystemApp {
  id: string;
  name: string;
  tagline: string;
  category: string;
  replaces: string;
  domain: string;
  url: string;
  isCurrent?: boolean;
  accentColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  metrics: { label: string; value: string }[];
  deepExplanation: string;
}

export default function SovereignEcosystemShowcase({
  onOpenRegister,
  onOpenLogin,
}: {
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
}) {
  const [selectedAppId, setSelectedAppId] = useState<string>("ekonnet");

  const platforms: EcosystemApp[] = [
    {
      id: "konnetone",
      name: "KonnetOne",
      tagline: "Global Real Estate MLS, 4K WebRTC Virtual Studios & Direct Milestone Settlement",
      category: "Core Sovereign Hub",
      replaces: "Zillow + Zoom + Upwork",
      domain: "konnetone.com",
      url: "https://konnetone.com",
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/40 hover:border-cyan-400",
      icon: Building2,
      metrics: [
        { label: "Active MLS Listings", value: "14,800+" },
        { label: "WebRTC Studio Latency", value: "<50ms" },
        { label: "Platform Commission", value: "0%" },
      ],
      features: [
        "Automated deed verification & multi-zone MLS property syndication",
        "SFU Mesh 4K video rooms for remote walkthroughs & auctions",
        "Direct milestone settlement without third-party dispute delays",
      ],
      deepExplanation: "KonnetOne eliminates the high fees of real estate brokers, video software, and freelance portals by uniting MLS listings, virtual studios, and smart settlements into one direct ecosystem.",
    },
    {
      id: "imeigs",
      name: "IMEIGS",
      tagline: "17-Tier Unified Digital Workspace, Air-Gapped Cloud Storage & AI Orchestrator",
      category: "Enterprise Cloud & Workspace",
      replaces: "Google Workspace + Dropbox + Slack",
      domain: "imeigs.com",
      url: "https://imeigs.com",
      accentColor: "text-[#FF5C35]",
      borderColor: "border-[#FF5C35]/50 hover:border-[#FF5C35]",
      icon: Layers,
      metrics: [
        { label: "Unified Tiers", value: "17 Services" },
        { label: "Cloud Drive Quota", value: "2 TB NVMe" },
        { label: "Annual User Savings", value: "$1,100+" },
      ],
      features: [
        "One master user identity (#USR-XXXXXX) unlocking 17 business tiers",
        "Air-gapped 2 TB NVMe storage with zero-trace client-side share tokens",
        "Cross-tier neural AI copilot orchestrating multi-step enterprise workflows",
      ],
      deepExplanation: "Instead of paying 17 fragmented monthly SaaS bills, IMEIGS consolidates your video, drive, chat, commerce, and AI copilot under one unified high-speed dashboard.",
    },
    {
      id: "ekonnet",
      name: "EkonnetTrader",
      tagline: "100% In-Browser Multi-Asset Web Trading Terminal & 14 Global Payment Rails",
      category: "Institutional FinTech",
      replaces: "Binance + MT4 Desktop + Bitfinex",
      domain: "ekonnet.com",
      url: "https://ekonnet.com",
      isCurrent: true,
      accentColor: "text-blue-400",
      borderColor: "border-blue-500/50 ring-1 ring-blue-500/30",
      icon: TrendingUp,
      metrics: [
        { label: "Free Demo Balance", value: "$10,000" },
        { label: "Global Payment Rails", value: "14 Gateways" },
        { label: "Desktop Software Required", value: "Zero (Web Native)" },
      ],
      features: [
        "Direct in-browser trading without installing unstable desktop software",
        "Instant 1-click toggle between Live Clearing and Free $10,000 Demo",
        "Multi-asset liquidity: Crypto (BTC/ETH/SOL), Forex (EUR/USD), and Equities (AAPL)",
      ],
      deepExplanation: "EkonnetTrader solves the common problem of desktop software crashes and poor client connections by moving institutional-grade trading directly into the web browser.",
    },
    {
      id: "imezin",
      name: "ImeZin",
      tagline: "Zero-Access Client-Side Encrypted Email & Tracking Pixel Neutralizer",
      category: "Cryptographic Privacy Suite",
      replaces: "ProtonMail + Tuta + Gmail",
      domain: "imezin.com",
      url: "https://imezin.com",
      accentColor: "text-violet-400",
      borderColor: "border-violet-500/40 hover:border-violet-400",
      icon: Mail,
      metrics: [
        { label: "Keypair Generation", value: "Client RAM (WebCrypto)" },
        { label: "Server Plaintext Storage", value: "0% (Impossible)" },
        { label: "Tracking Pixel Stripping", value: "100% Verified" },
      ],
      features: [
        "4096-bit RSA & Curve25519 keys mathematically derived inside browser memory",
        "Zero-Knowledge server storage: backend sees only opaque AES-256 ciphertext blobs",
        "Real-time tracking beacon stripper blocking remote tracking scripts and IP leaks",
      ],
      deepExplanation: "ImeZin guarantees absolute correspondence confidentiality. Even server operators and database engineers cannot read your email bodies, subjects, or attachments.",
    },
    {
      id: "aurasearch",
      name: "AuraSearch",
      tagline: "Zero-Trace Private Web Search, Okapi BM25 Indexing & Fact-Grounded RAG AI",
      category: "Sovereign AI Search Core",
      replaces: "Google Search + DuckDuckGo + Perplexity",
      domain: "browzzit.com",
      url: "https://browzzit.com",
      accentColor: "text-emerald-400",
      borderColor: "border-emerald-500/40 hover:border-emerald-400",
      icon: Search,
      metrics: [
        { label: "BM25 Score Latency", value: "<5ms" },
        { label: "Search History Logged", value: "Zero (RAM Only)" },
        { label: "RAG Citation Accuracy", value: "Offset Grounded" },
      ],
      features: [
        "Mathematical Okapi BM25 ranking (k1=1.5, b=0.75) for lightning-fast doc retrieval",
        "Zero tracking cookies, zero IP logging, and zero ad surveillance profiling",
        "Fact-Grounded RAG AI answers with clickable mathematical source citations",
      ],
      deepExplanation: "AuraSearch frees users from invasive commercial search engine trackers and SEO spam, delivering clean, verified search results and grounded AI summaries instantly.",
    },
  ];

  const activeApp = platforms.find((p) => p.id === selectedAppId) || platforms[2];
  const ActiveIcon = activeApp.icon;

  return (
    <section 
      id="ecosystem-showcase" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-slate-200/80 dark:border-white/10 select-none transition-colors"
    >
      {/* SECTION HEADER: BIG ADVERTISEMENT BILLBOARD FOR ALL 5 PLATFORMS */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
          <Globe2 className="w-3.5 h-3.5" />
          <span>The Sovereign 5-Platform Digital Empire</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif text-slate-900 dark:text-white leading-tight">
          One Master Account. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-[#FF5C35] to-emerald-600 dark:from-blue-400 dark:via-[#FF5C35] dark:to-emerald-400 bg-clip-text text-transparent">
            5 Interconnected Enterprise Platforms.
          </span>
        </h2>

        <p className="text-xs sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
          Why juggle dozens of expensive third-party subscriptions? We combined the best features of global giants 
          like <span className="font-semibold text-slate-900 dark:text-white">Binance, Proton, Zillow, Zoom, Upwork, and Dropbox</span> into 
          5 sovereign platforms—all unlocked automatically through your single master identity.
        </p>

        {/* 1 Master SSO Identity Benefit Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl border text-xs font-mono bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-700/80 text-cyan-700 dark:text-cyan-300 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <span>Single Sign-On (SSO): Your <strong>#USR-XXXXXX</strong> handle works seamlessly across all 5 platforms</span>
        </div>
      </div>

      {/* 5-PLATFORM SHOWCASE CARDS (HORIZONTAL GRID) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {platforms.map((platform) => {
          const IconComponent = platform.icon;
          const isSelected = platform.id === selectedAppId;

          return (
            <div
              key={platform.id}
              onClick={() => setSelectedAppId(platform.id)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden ${
                isSelected
                  ? `${platform.borderColor} bg-white dark:bg-slate-900/95 text-slate-900 dark:text-white shadow-xl scale-[1.02]`
                  : "bg-white/80 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-600 dark:text-slate-300 shadow-sm"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isSelected ? "bg-blue-50 dark:bg-white/10 border-blue-200 dark:border-white/20" : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  }`}>
                    <IconComponent className={`w-5 h-5 ${platform.accentColor}`} />
                  </div>
                  
                  {platform.isCurrent ? (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                      Active Site
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1">
                      <span>Live</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold font-serif leading-tight text-slate-900 dark:text-white">
                    {platform.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5 uppercase tracking-wide">
                    {platform.category}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 dark:border-white/10">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block font-semibold">
                    Replaces:
                  </span>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {platform.replaces}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className={isSelected ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-400 dark:text-slate-500"}>
                  {isSelected ? "Inspecting" : "Click to View"}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "translate-x-1 text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* INTERACTIVE DEEP INSPECTOR PANE */}
      <div className="p-6 sm:p-10 rounded-2xl border bg-white/95 dark:bg-slate-950/70 border-slate-200/80 dark:border-slate-800/80 text-slate-900 dark:text-white shadow-xl dark:shadow-2xl transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Ecosystem Spotlight
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {activeApp.domain}
              </span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
                {activeApp.name}
              </h3>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                Replaces: {activeApp.replaces}
              </p>
              <p className="text-xs sm:text-sm mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                {activeApp.deepExplanation}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {activeApp.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl border text-center bg-slate-50 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    {m.label}
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 pt-2">
              {activeApp.features.map((f, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              {activeApp.isCurrent ? (
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition cursor-pointer"
                >
                  ✓ Open Web Trading Terminal
                </button>
              ) : (
                <a
                  href={activeApp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-[#FF5C35] to-purple-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition cursor-pointer"
                >
                  <span>Launch {activeApp.name} Platform</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={onOpenRegister}
                className="px-5 py-3 rounded-full text-xs font-bold border border-slate-300 dark:border-slate-700 hover:border-slate-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                Create Universal SSO Account
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl border space-y-5 bg-slate-50/80 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <ActiveIcon className={`w-4 h-4 ${activeApp.accentColor}`} />
                  <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                    {activeApp.name} Specification
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Operational
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                  <span className="text-slate-500">Live URL:</span>
                  <a href={activeApp.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-cyan-400 underline flex items-center gap-1 font-medium">
                    {activeApp.domain}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                  <span className="text-slate-500">Platform Category:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activeApp.category}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                  <span className="text-slate-500">Consolidation:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{activeApp.replaces}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-white/5">
                  <span className="text-slate-500">Cross-Platform SSO:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Supported (Instant Switch)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
                <p>
                  <strong>Zero Multiple Logins:</strong> When you register an account on {activeApp.name}, your credentials 
                  automatically authenticate you on all 5 platforms.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
