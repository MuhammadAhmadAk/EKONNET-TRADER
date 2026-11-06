"use client";

import React, { useState } from "react";
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
  ArrowRightLeft,
  Briefcase,
  Cpu
} from "lucide-react";

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export default function Navbar({ onOpenLogin, onOpenRegister }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [investDropdownOpen, setInvestDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [academyDropdownOpen, setAcademyDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070b14]/95 backdrop-blur-xl border-b border-white/10 transition-all select-none shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-105 transition transform" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                Ekonnet<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Trader</span>
              </span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Clean Submenu Navigation (Spacious, Uncluttered, Never Wraps) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
            
            {/* Direct Home Link */}
            <Link 
              href="/"
              className="px-3.5 py-2 rounded-xl hover:text-white hover:bg-white/5 transition font-medium"
            >
              Home
            </Link>

            {/* SUBMENU 1: WAYS TO INVEST (CMC MARKETS MEGA DROPDOWN PARITY) */}
            <div 
              className="relative"
              onMouseEnter={() => setInvestDropdownOpen(true)}
              onMouseLeave={() => setInvestDropdownOpen(false)}
            >
              <button 
                onClick={() => setInvestDropdownOpen(!investDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                  investDropdownOpen ? "text-white bg-white/10" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Ways to Invest</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${investDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {investDropdownOpen && (
                <div className="absolute left-0 mt-1 w-80 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-2xl p-3 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-white/5">
                    Invest in Markets (Section 14 & CMC Markets)
                  </div>

                  <Link 
                    href="/trades/crypto/direct" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5 group-hover:bg-blue-500/20">
                      <Coins className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Direct Crypto Exchange</div>
                      <div className="text-[11px] text-slate-400">Direct order book trading (BTC, ETH, SOL)</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades/crypto/p2p" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 group-hover:bg-emerald-500/20">
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Peer-to-Peer Settlement</div>
                      <div className="text-[11px] text-slate-400">Direct buyer-seller local currency trades</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades/crypto/third-party" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 group-hover:bg-cyan-500/20">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">Third-Party Liquidity Hub</div>
                      <div className="text-[11px] text-slate-400">External aggregator for deep multi-coin depth</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades/forex" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 group-hover:bg-purple-500/20">
                      <Globe2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Forex Trading Markets</div>
                      <div className="text-[11px] text-slate-400">168+ Sovereign currency pairs</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades/shares" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 group-hover:bg-amber-500/20">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Shares & Investment Portfolios</div>
                      <div className="text-[11px] text-slate-400">International equities, ETFs, and indices</div>
                    </div>
                  </Link>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between px-2 text-[11px]">
                    <span className="text-slate-400">Looking for all pairs?</span>
                    <Link href="/trades" className="text-blue-400 hover:text-cyan-300 font-bold flex items-center gap-1">
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
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                  toolsDropdownOpen ? "text-white bg-white/10" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Platforms & Tools</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-1 w-72 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-2xl p-3 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-white/5">
                    Platform Engines
                  </div>

                  <a 
                    href="/#web-terminal" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Sliders className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Live Web Terminal</div>
                      <div className="text-[11px] text-slate-400">In-browser Bitfinex-grade 9 order engine</div>
                    </div>
                  </a>

                  <a 
                    href="/#features-advertisements" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Platform Innovations</div>
                      <div className="text-[11px] text-slate-400">GSLO immunity, sentiment radar & multi-asset</div>
                    </div>
                  </a>

                  <a 
                    href="/#pricing-packages" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Pricing & Account Tiers</div>
                      <div className="text-[11px] text-slate-400">Institutional discounts and fee schedule</div>
                    </div>
                  </a>

                  <Link 
                    href="/payments" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">14 Payment Rails</div>
                      <div className="text-[11px] text-slate-400">Card, SEPA, Wire & local digital fiat rails</div>
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
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                  academyDropdownOpen ? "text-white bg-white/10" : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Academy & Security</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${academyDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {academyDropdownOpen && (
                <div className="absolute left-0 mt-1 w-72 rounded-2xl bg-[#090e1a] border border-slate-800 shadow-2xl p-3 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-white/5">
                    Learning & Trust
                  </div>

                  <a 
                    href="/#video-tutorials" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <Video className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Video Walkthroughs</div>
                      <div className="text-[11px] text-slate-400">Bitfinex 2-style tutorial video player</div>
                    </div>
                  </a>

                  <Link 
                    href="/tutorials" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Trading Academy Guides</div>
                      <div className="text-[11px] text-slate-400">In-depth written manuals for all techniques</div>
                    </div>
                  </Link>

                  <Link 
                    href="/security" 
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.04] transition group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Security & 2FA Protocols</div>
                      <div className="text-[11px] text-slate-400">Cryptographic custody & multi-sig vault specs</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 whitespace-nowrap">
            <Link
              href="/admin"
              className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-[11px] text-blue-400 font-semibold tracking-wide flex items-center gap-1.5 transition"
              title="Enterprise Admin Management Console"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Console</span>
            </Link>

            <button
              onClick={onOpenLogin}
              className="text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1.5 transition"
            >
              Sign In
            </button>

            <button
              onClick={onOpenRegister}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Register (18+)</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/admin"
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold"
            >
              Admin
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Clean, Structured, Grouped) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090e1a] border-b border-slate-800 px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block px-2">Ways to Invest</span>
            <Link 
              href="/trades/crypto/direct" 
              className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Direct Crypto Exchange
            </Link>
            <Link 
              href="/trades/crypto/p2p" 
              className="block text-xs font-semibold text-slate-200 hover:text-emerald-400 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Peer-to-Peer Crypto Settlement
            </Link>
            <Link 
              href="/trades/crypto/third-party" 
              className="block text-xs font-semibold text-slate-200 hover:text-cyan-400 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Third-Party Liquidity Hub
            </Link>
            <Link 
              href="/trades/forex" 
              className="block text-xs font-semibold text-slate-200 hover:text-purple-400 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Forex Currency Markets (168+ Pairs)
            </Link>
            <Link 
              href="/trades/shares" 
              className="block text-xs font-semibold text-slate-200 hover:text-amber-400 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Shares & Investment Portfolios
            </Link>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block px-2">Platforms & Tools</span>
            <a 
              href="/#web-terminal" 
              className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Live Web Trading Terminal
            </a>
            <a 
              href="/#features-advertisements" 
              className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Platform Innovations (Bitfinex / CMC Parity)
            </a>
            <Link 
              href="/payments" 
              className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • 14 Global Payment Rails
            </Link>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block px-2">Academy & Trust</span>
            <Link 
              href="/tutorials" 
              className="block text-xs font-semibold text-blue-400 hover:text-blue-300 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Video Tutorials & Written Academy
            </Link>
            <Link 
              href="/security" 
              className="block text-xs font-semibold text-slate-200 hover:text-purple-400 py-1.5 px-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              • Security & 2FA Protocols
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs font-semibold text-slate-200 hover:text-white"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-center text-xs font-bold text-white shadow-md shadow-blue-500/20"
            >
              Register (18+)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
