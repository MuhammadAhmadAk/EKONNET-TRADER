"use client";

import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Mail, Phone, Lock, Globe2 } from "lucide-react";

export default function Footer() {
  return (
    <footer id="support-desk" className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">EKONNET TRADER</span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Global multi-asset trading, P2P escrow settlement, and 14-processor payments infrastructure. Engineered with isolated modular resilience.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL/TLS</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Plesk-Secured</span>
              </span>
            </div>
          </div>

          {/* Markets & Trading */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Trading Ecosystem</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li><Link href="/trades" className="hover:text-white transition">Direct Crypto Trading</Link></li>
              <li><Link href="/trades" className="hover:text-white transition">P2P Escrow Exchange</Link></li>
              <li><Link href="/trades" className="hover:text-white transition">10 CEX Order Router</Link></li>
              <li><Link href="/trades" className="hover:text-white transition">Forex (168 Currencies)</Link></li>
              <li><Link href="/trades" className="hover:text-white transition">Shares & Indices</Link></li>
            </ul>
          </div>

          {/* Payments & Transfers */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Payment Rails</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li><Link href="/payments" className="hover:text-white transition">Wise Multi-Currency</Link></li>
              <li><Link href="/payments" className="hover:text-white transition">PayPal & Airwallex</Link></li>
              <li><Link href="/payments" className="hover:text-white transition">Skrill & Neteller</Link></li>
              <li><Link href="/payments" className="hover:text-white transition">SWIFT & SEPA Wire</Link></li>
              <li><Link href="/payments" className="hover:text-white transition">Debit & Credit Cards</Link></li>
            </ul>
          </div>

          {/* Legal, Support & Management */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Governance & Auth</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li><Link href="/admin" className="text-blue-400 hover:text-blue-300 font-semibold transition">Management Admin Portal</Link></li>
              <li><a href="#security-protocols" className="hover:text-white transition">Terms & Conditions (Sec 35)</a></li>
              <li><a href="#security-protocols" className="hover:text-white transition">Privacy & AML Policy</a></li>
              <li><a href="#support-desk" className="hover:text-white transition">Gorelo AI Support Desk</a></li>
              <li><a href="#support-desk" className="hover:text-white transition">Report Platform Abuse</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Ekonnet Technologies. Hand-crafted proprietary architecture. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Regulatory Compliance</a>
            <a href="#" className="hover:text-white transition">Security Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
