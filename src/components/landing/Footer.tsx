"use client";

import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Mail, Phone, Lock, Globe2 } from "lucide-react";

export default function Footer() {
  return (
    <footer id="support-desk" className="bg-transparent border-t border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full overflow-hidden p-[1px] shadow-sm shadow-orange-500/20 group-hover:scale-105 transition transform">
                <picture>
                  <source srcSet="/images/ekonnet-logo-96.webp" type="image/webp" />
                  <img
                    src="/images/ekonnet-logo-96.png"
                    alt="Ekonnet Logo"
                    width={32}
                    height={32}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </picture>
              </div>
              <span className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                EKONNET<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">TRADER</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
              Global multi-asset trading, direct P2P settlement, and 14-processor payments infrastructure. Engineered with isolated modular resilience.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL/TLS</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-orange-500" />
                <span>Plesk-Secured</span>
              </span>
            </div>
          </div>

          {/* Markets & Trading */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Trading Ecosystem</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
              <li><Link href="/trades/crypto/direct" className="hover:text-orange-500 transition">Direct Crypto Trading</Link></li>
              <li><Link href="/trades/crypto/p2p" className="hover:text-orange-500 transition">P2P Direct Exchange</Link></li>
              <li><Link href="/trades/crypto/third-party" className="hover:text-orange-500 transition">10 CEX Order Router</Link></li>
              <li><Link href="/trades/forex" className="hover:text-orange-500 transition">Forex (168 Currencies)</Link></li>
              <li><Link href="/trades/shares" className="hover:text-orange-500 transition">Shares & Indices</Link></li>
            </ul>
          </div>

          {/* Payments & Transfers */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Payment Rails</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
              <li><Link href="/payments" className="hover:text-orange-500 transition">Wise Multi-Currency</Link></li>
              <li><Link href="/payments" className="hover:text-orange-500 transition">PayPal & Airwallex</Link></li>
              <li><Link href="/payments" className="hover:text-orange-500 transition">Skrill & Neteller</Link></li>
              <li><Link href="/payments" className="hover:text-orange-500 transition">SWIFT & SEPA Wire</Link></li>
              <li><Link href="/payments" className="hover:text-orange-500 transition">Debit & Credit Cards</Link></li>
            </ul>
          </div>

          {/* Legal, Support & Management */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Governance & Auth</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-xs">
              <li><Link href="/admin" className="text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold transition">Management Admin Portal</Link></li>
              <li><a href="#security-protocols" className="hover:text-orange-500 transition">Terms & Conditions (Sec 35)</a></li>
              <li><a href="#security-protocols" className="hover:text-orange-500 transition">Privacy & AML Policy</a></li>
              <li><a href="#support-desk" className="hover:text-orange-500 transition">Gorelo AI Support Desk</a></li>
              <li><a href="#support-desk" className="hover:text-orange-500 transition">Report Platform Abuse</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Ekonnet Technologies. Hand-crafted proprietary architecture. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-orange-500 transition">Regulatory Compliance</a>
            <a href="#" className="hover:text-orange-500 transition">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
