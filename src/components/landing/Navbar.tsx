"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  CreditCard, 
  Lock, 
  Menu, 
  X, 
  Layers, 
  UserCheck, 
  ChevronDown, 
  ShieldCheck, 
  Globe2, 
  Coins, 
  ArrowUpRight, 
  GraduationCap,
  Sparkles,
  Sliders,
  DollarSign,
  Video,
  BookOpen,
  LogOut,
  User,
  Wallet,
  Sun,
  Moon,
  Search
} from "lucide-react";

interface NavbarProps {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

export default function Navbar({ onOpenLogin, onOpenRegister }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [investDropdownOpen, setInvestDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [academyDropdownOpen, setAcademyDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Theme sync
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const loadUser = () => {
      try {
        const stored = localStorage.getItem("ekonnet_user");
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    };

    loadUser();
    window.addEventListener("auth-changed", loadUser);
    window.addEventListener("storage", loadUser);
    return () => {
      window.removeEventListener("auth-changed", loadUser);
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ekonnet_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ekonnet_theme", "light");
    }
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: next } }));
  };

  const handleSignOut = () => {
    localStorage.removeItem("ekonnet_user");
    setCurrentUser(null);
    setUserDropdownOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 dark:bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300 select-none shadow-xs dark:shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 lg:gap-6">
          
          {/* Brand Logo with Official Ekonnet Emblem */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-full overflow-hidden p-[1px] shadow-sm shadow-orange-500/20 group-hover:scale-105 transition transform">
              <picture>
                <source srcSet="/images/ekonnet-logo-96.webp" type="image/webp" />
                <img
                  src="/images/ekonnet-logo-96.png"
                  alt="Ekonnet Logo"
                  width={32}
                  height={32}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </picture>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Ekonnet<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Trader</span>
              </span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Submenu Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
            
            {/* Direct Home Link */}
            <Link 
              href="/"
              className="px-3 py-2 rounded-full hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition font-semibold"
            >
              Home
            </Link>

            {/* SUBMENU 1: WAYS TO INVEST */}
            <div 
              className="relative"
              onMouseEnter={() => setInvestDropdownOpen(true)}
              onMouseLeave={() => setInvestDropdownOpen(false)}
            >
              <button 
                onClick={() => setInvestDropdownOpen(!investDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition ${
                  investDropdownOpen ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10" : "hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                <span>Ways to Invest</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${investDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {investDropdownOpen && (
                <div className="absolute left-0 mt-1 w-80 rounded-2xl bg-white dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-white/5">
                    Invest in Markets (Section 14 & CMC Markets)
                  </div>

                  <Link 
                    href="/trades/crypto/direct" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0 mt-0.5 group-hover:bg-orange-500/20">
                      <Coins className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">Direct Crypto Exchange</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Institutional order book with 5 Base Pairs</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades/crypto/p2p" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5 group-hover:bg-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">Peer-to-Peer Direct Settlement</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Direct Milestone Clearing with 14 Payment Rails</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades/crypto/third-party" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shrink-0 mt-0.5 group-hover:bg-cyan-500/20">
                      <Globe2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">Third-Party Liquidity Hub</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Aggregated depth from Binance, Bitfinex & OKX</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades/forex" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 mt-0.5 group-hover:bg-purple-500/20">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">Forex Currency Markets</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">168+ Global Currencies with real-time interbank feeds</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades/shares" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 mt-0.5 group-hover:bg-amber-500/20">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">Shares & Investment Portfolios</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Fractional blue-chips & index baskets with 0% stamp duty</div>
                    </div>
                  </Link>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 px-2">
                    <Link 
                      href="/markets" 
                      className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 flex items-center justify-between p-1.5 rounded-lg hover:bg-orange-500/10 transition"
                    >
                      <span>View All Markets</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* SUBMENU 2: PLATFORMS & TOOLS */}
            <div 
              className="relative"
              onMouseEnter={() => setToolsDropdownOpen(true)}
              onMouseLeave={() => setToolsDropdownOpen(false)}
            >
              <button 
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition ${
                  toolsDropdownOpen ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10" : "hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                <span>Platforms & Tools</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-1 w-72 rounded-2xl bg-white dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-white/5">
                    Platform Engines
                  </div>

                  <a 
                    href="/#web-terminal" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                      <Sliders className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">Live Web Terminal</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">In-browser Bitfinex-grade 9 order engine</div>
                    </div>
                  </a>

                  <a 
                    href="/#features-advertisements" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">Platform Innovations</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">GSLO immunity, sentiment radar & multi-asset</div>
                    </div>
                  </a>

                  <a 
                    href="/#pricing-packages" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">Pricing & Account Tiers</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Institutional discounts and fee schedule</div>
                    </div>
                  </a>

                  <Link 
                    href="/payments" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 shrink-0 mt-0.5">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">14 Payment Rails</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Card, SEPA, Wire & local digital fiat rails</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* SUBMENU 3: ACADEMY & SECURITY */}
            <div 
              className="relative"
              onMouseEnter={() => setAcademyDropdownOpen(true)}
              onMouseLeave={() => setAcademyDropdownOpen(false)}
            >
              <button 
                onClick={() => setAcademyDropdownOpen(!academyDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition ${
                  academyDropdownOpen ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10" : "hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                <span>Academy & Security</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${academyDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {academyDropdownOpen && (
                <div className="absolute left-0 mt-1 w-72 rounded-2xl bg-white dark:bg-[#090e1a] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-white/5">
                    Learning & Trust
                  </div>

                  <a 
                    href="/#video-tutorials" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">Video Walkthroughs</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Bitfinex 2-style tutorial video player</div>
                    </div>
                  </a>

                  <Link 
                    href="/tutorials" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">Trading Academy Guides</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">In-depth written manuals for all techniques</div>
                    </div>
                  </Link>

                  <Link 
                    href="/security" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">Security & 2FA Protocols</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Cryptographic custody & multi-sig vault specs</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

          </nav>

          {/* Search Bar (Browzzit Pill Aesthetic) */}
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 text-xs text-slate-400 w-44 focus-within:w-56 focus-within:border-orange-500 transition-all">
            <Search className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search crypto, pairs..."
              className="bg-transparent focus:outline-none w-full text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            
            {/* Theme Toggle Button (Light/Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {/* Admin Console shortcut for privileged accounts */}
                {currentUser.role !== "user" && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-[11px] text-orange-600 dark:text-orange-400 font-semibold tracking-wide flex items-center gap-1.5 transition"
                    title="Enterprise Admin Management Console"
                  >
                    <Lock className="w-3 h-3" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* User Session Pill with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800/90 border border-slate-200 dark:border-white/10 text-xs transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-rose-600 flex items-center justify-center text-white text-[11px] font-bold">
                      {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="text-left flex flex-col leading-tight">
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] truncate max-w-[110px]">
                        {currentUser.fullName || currentUser.username}
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                        {currentUser.id}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#090e1a] border border-slate-200 dark:border-white/10 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 text-xs space-y-3">
                      <div className="border-b border-slate-100 dark:border-white/10 pb-2.5">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{currentUser.fullName}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{currentUser.id} • @{currentUser.username}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                            {currentUser.role.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono ${
                            currentUser.kycStatus === 'approved' 
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          }`}>
                            KYC {currentUser.kycStatus || 'pending'}
                          </span>
                        </div>
                      </div>

                      {/* Wallet Summary */}
                      {currentUser.walletBalances && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 space-y-1 font-mono text-[11px]">
                          <div className="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>USD Balance:</span>
                            <span className="text-emerald-500 font-bold">${Number(currentUser.walletBalances.USD || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-500 dark:text-slate-400">
                            <span>BTC Balance:</span>
                            <span className="text-amber-500 font-bold">{currentUser.walletBalances.BTC || 0} BTC</span>
                          </div>
                        </div>
                      )}

                      {/* User Account Dashboard Link */}
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Account Dashboard & KYC</span>
                      </Link>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleSignOut}
                        className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 font-semibold text-xs flex items-center justify-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/admin"
                  className="px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-[11px] text-slate-600 dark:text-slate-300 font-semibold tracking-wide flex items-center gap-1.5 transition"
                  title="Enterprise Admin Management Console"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin</span>
                </Link>

                <button
                  onClick={onOpenLogin || (() => window.location.href = '/#login')}
                  className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-white px-3 py-1.5 transition"
                >
                  Log In
                </button>

                <button
                  onClick={onOpenRegister || (() => window.location.href = '/#register')}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center gap-1.5">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer (Clean, Structured, Grouped) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#090e1a] border-b border-slate-200 dark:border-slate-800 px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2">Ways to Invest</span>
            <Link 
              href="/trades/crypto/direct" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Direct Crypto Exchange
            </Link>
            <Link 
              href="/trades/crypto/p2p" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Peer-to-Peer Crypto Settlement
            </Link>
            <Link 
              href="/trades/crypto/third-party" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Third-Party Liquidity Hub
            </Link>
            <Link 
              href="/trades/forex" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Forex Currency Markets (168+ Pairs)
            </Link>
            <Link 
              href="/trades/shares" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Shares & Investment Portfolios
            </Link>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2">Platforms & Tools</span>
            <a 
              href="/#web-terminal" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Live Web Trading Terminal
            </a>
            <a 
              href="/#features-advertisements" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Platform Innovations (Bitfinex / CMC Parity)
            </a>
            <Link 
              href="/payments" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • 14 Global Payment Rails
            </Link>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2">Academy & Trust</span>
            <Link 
              href="/tutorials" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-orange-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Video Tutorials & Written Academy
            </Link>
            <Link 
              href="/security" 
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-purple-500 py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Security & 2FA Protocols
            </Link>
            <Link 
              href="/admin" 
              className="block text-xs font-semibold text-orange-600 dark:text-orange-400 py-1.5 px-2 rounded-lg hover:bg-orange-50 dark:hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Enterprise Admin Console
            </Link>
          </div>

          {!currentUser && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenLogin) onOpenLogin();
                  else window.location.href = '/#login';
                }}
                className="flex-1 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenRegister) onOpenRegister();
                  else window.location.href = '/#register';
                }}
                className="flex-1 py-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-600 text-center text-xs font-bold text-white shadow-md shadow-orange-500/25"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
