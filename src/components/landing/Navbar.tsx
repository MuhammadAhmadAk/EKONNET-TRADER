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
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Globe2,
  Coins,
  ArrowUpRight
} from "lucide-react";

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export default function Navbar({ onOpenLogin, onOpenRegister }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tradingDropdownOpen, setTradingDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'features' | 'pricing' | 'terminal'>('home');

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const terminalEl = document.getElementById('web-terminal');
      const pricingEl = document.getElementById('pricing-packages');
      const featuresEl = document.getElementById('features-advertisements');

      if (terminalEl && scrollPos >= terminalEl.offsetTop - 60) {
        setActiveSection('terminal');
      } else if (pricingEl && scrollPos >= pricingEl.offsetTop - 60) {
        setActiveSection('pricing');
      } else if (featuresEl && scrollPos >= featuresEl.offsetTop - 60) {
        setActiveSection('features');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand / Logo */}
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

          {/* Desktop Navigation Links (Strictly Single Line, never wraps) */}
          <nav className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-300 shrink-0">
            <a 
              href="#"
              onClick={() => {
                setActiveSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                activeSection === 'home'
                  ? 'bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </a>

            <a 
              href="#features-advertisements"
              onClick={() => setActiveSection('features')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                activeSection === 'features'
                  ? 'bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Innovations
            </a>

            <a 
              href="#pricing-packages"
              onClick={() => setActiveSection('pricing')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                activeSection === 'pricing'
                  ? 'bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Pricing & Tiers
            </a>

            <a 
              href="#web-terminal"
              onClick={() => setActiveSection('terminal')}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${
                activeSection === 'terminal'
                  ? 'bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Live Terminal
            </a>

            {/* Trading Markets Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setTradingDropdownOpen(true)}
              onMouseLeave={() => setTradingDropdownOpen(false)}
            >
              <button 
                onClick={() => setTradingDropdownOpen(!tradingDropdownOpen)}
                className="flex items-center gap-1 py-1.5 px-3 rounded-full hover:text-white hover:bg-white/5 transition whitespace-nowrap"
              >
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                <span>Markets</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {tradingDropdownOpen && (
                <div className="absolute left-0 mt-0 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <Link 
                    href="/trades" 
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 transition"
                  >
                    <Coins className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Crypto Trading</div>
                      <div className="text-[10px] text-slate-400">Direct & P2P Trading (5 Base Pairs)</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades" 
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 transition"
                  >
                    <Globe2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Forex Markets</div>
                      <div className="text-[10px] text-slate-400">168+ Global Currencies</div>
                    </div>
                  </Link>

                  <Link 
                    href="/trades" 
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white">Corporate Shares</div>
                      <div className="text-[10px] text-slate-400">Global Equities & Indexes</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/payments" className="hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-full transition flex items-center gap-1.5 whitespace-nowrap">
              <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
              <span>Payments</span>
            </Link>

            <Link href="/security" className="hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-full transition flex items-center gap-1 whitespace-nowrap">
              <Lock className="w-3 h-3 text-purple-400" />
              <span>Security</span>
            </Link>
          </nav>

          {/* Right Action Bar (Compact & Sleek) */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            
            {/* Management Portal Shortcut */}
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

          {/* Mobile hamburger button */}
          <div className="xl:hidden flex items-center gap-2">
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

      {/* Mobile Drawer (Clean & Responsive) */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-slate-800 px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <Link 
            href="/trades" 
            className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            Trading Markets (Crypto, Forex, Shares)
          </Link>
          <Link 
            href="/payments" 
            className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            Payments & Transfers (14 Rails)
          </Link>
          <a 
            href="#pricing-packages" 
            className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing & Packages
          </a>
          <a 
            href="#security-protocols" 
            className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            Security & 2FA Protocols
          </a>
          <a 
            href="#support-desk" 
            className="block text-xs font-semibold text-slate-200 hover:text-blue-400 py-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            Support Desk & Documentation
          </a>
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
