"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight,
  ArrowDownLeft, 
  Layers, 
  Globe2, 
  Briefcase, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadSession = () => {
      try {
        const stored = localStorage.getItem("ekonnet_user");
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // Provide demo user fallback for preview if not logged in
          const demoUser = {
            id: "EKON-749201",
            username: "demo_trader",
            fullName: "Verified Trader",
            role: "user",
            emails: ["trader.primary@ekonnet.com", "recovery@domain.com", "backup@domain.com"],
            phones: ["+92-300-1234567", "+92-42-35890123"],
            dateOfBirth: "2000-01-15",
            age: 26,
            country: "Pakistan",
            city: "Lahore",
            kycStatus: "unverified",
            packageTier: "Pro Trader",
            twoFactorEnabled: true,
            twoFactorType: "totp",
            walletBalances: {
              USD: 14850.00,
              BTC: 0.4520,
              ETH: 4.820,
              USDT: 25400.00,
              XRP: 12500,
              BCH: 18.5
            }
          };
          setUser(demoUser);
        }
      } catch (e) {
        setUser(null);
      }
    };

    loadSession();
    window.addEventListener("auth-changed", loadSession);
    return () => window.removeEventListener("auth-changed", loadSession);
  }, []);

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center font-mono text-xs text-slate-500">
        Loading Sovereign Trading Dashboard...
      </div>
    );
  }

  const kycUrl = `https://ekonnet.com/kyc/verify?userId=${user.id}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(kycUrl)}`;

  const copyKycLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(kycUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP PROFILE BANNER */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/20">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  {user.packageTier || "Free Tier"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>Account ID: <strong className="text-slate-900 dark:text-white">{user.id}</strong></span>
                <span>•</span>
                <span>@{user.username}</span>
                <span>•</span>
                <span>{user.city}, {user.country}</span>
              </div>
            </div>
          </div>

          {/* KYC Status Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative z-10 w-full md:w-auto">
            <div className={`px-4 py-2 rounded-2xl border text-xs font-bold font-mono uppercase flex items-center gap-2 ${
              user.kycStatus === "approved"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : user.kycStatus === "pending"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            }`}>
              {user.kycStatus === "approved" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>KYC Level 2 Verified</span>
                </>
              ) : user.kycStatus === "pending" ? (
                <>
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>KYC Under Review</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>KYC Action Required</span>
                </>
              )}
            </div>

            <Link
              href="/trades/crypto/p2p"
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition"
            >
              <span>Live P2P Market</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            BINANCE-STYLE MOBILE QR CODE KYC VERIFICATION SECTION
        ========================================================================= */}
        {user.kycStatus !== "approved" && (
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-orange-500/5 via-rose-500/5 to-transparent border border-orange-500/20 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-500/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Instant Mobile KYC Verification Flow</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Verify Your Identity on Mobile Camera
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                  Apne smartphone ke camera se niche QR code scan karein taake bina kisi download ke foran mobile browser mein KYC upload ho sake.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400">KYC Requirement:</span>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Sirf 4 Zaroori Cheezein</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* QR Code Presentation Box */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 shadow-lg text-center space-y-3">
                <div className="p-3 bg-white rounded-2xl shadow border border-slate-200 inline-block">
                  <img 
                    src={qrCodeImageUrl} 
                    alt="Ekonnet KYC Mobile QR Code" 
                    className="w-48 h-48 object-contain rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-orange-500" />
                    <span>Scan with Mobile Camera</span>
                  </div>
                  <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                    Direct mobile browser khul jayega aur camera se live photo upload hogi.
                  </p>
                </div>

                <div className="flex gap-2 w-full pt-1">
                  <button
                    onClick={copyKycLink}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Link Copied" : "Copy Link"}</span>
                  </button>
                  <Link
                    href={`/kyc/verify?userId=${user.id}`}
                    className="flex-1 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-[11px] font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1 transition"
                  >
                    <span>Open on PC</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 4 Required Items Explanation Cards */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/10 space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Original ID Document</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Smart CNIC (English wala), Valid Passport, ya Government Driving License ki Front aur Back photo.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/10 space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Details</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Poora legal naam, Date of Birth (18+ verification), aur ghar ka mukammal pata jo ID ke mutabiq ho.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/10 space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-bold text-xs">
                    3
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Camera Selfie</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Mobile ke front camera se bina sunglasses ya cap ke live face verification selfie.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/10 space-y-2 shadow-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-xs">
                    4
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Proof of Address</h3>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-mono">Optional</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Sirf $100k+ unlimited limit ke liye pichle 3 mahine ka utility bill (bijli/gas) ya bank statement.
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* MULTI-CURRENCY SOVEREIGN WALLET LEDGER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Multi-Currency Wallet Balances</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Institutional segregated balances with zero-latency transfers</p>
            </div>
            <Link 
              href="/payments"
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>Manage Deposit & Withdrawals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { symbol: "USD", name: "US Dollar", bal: `$${Number(user.walletBalances?.USD || 0).toLocaleString()}`, color: "text-emerald-500" },
              { symbol: "USDT", name: "Tether USD", bal: `${Number(user.walletBalances?.USDT || 0).toLocaleString()} USDT`, color: "text-emerald-500" },
              { symbol: "BTC", name: "Bitcoin", bal: `${user.walletBalances?.BTC || 0} BTC`, color: "text-amber-500" },
              { symbol: "ETH", name: "Ethereum", bal: `${user.walletBalances?.ETH || 0} ETH`, color: "text-blue-500" },
              { symbol: "XRP", name: "Ripple XRP", bal: `${Number(user.walletBalances?.XRP || 0).toLocaleString()} XRP`, color: "text-indigo-500" },
              { symbol: "BCH", name: "Bitcoin Cash", bal: `${user.walletBalances?.BCH || 0} BCH`, color: "text-emerald-600" }
            ].map((w) => (
              <div key={w.symbol} className="p-4 rounded-2xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold block">{w.name}</span>
                <div className={`text-base font-black font-mono ${w.color}`}>{w.bal}</div>
                <div className="text-[10px] font-mono text-slate-500">Available</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECURITY & SECTION 30 COMPLIANCE CREDENTIALS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Registered Emails & Phones (Section 30) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Registered Security Contacts</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Section 30 requirement: 3 registered security emails and 2 verified phone numbers.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 space-y-1.5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">3 Security Emails:</span>
                {(user.emails || []).map((email: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-orange-500" />
                      <span>{email}</span>
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold">{idx === 0 ? "PRIMARY" : "BACKUP"}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 space-y-1.5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">2 Registered Phones:</span>
                {(user.phones || []).map((phone: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-500" />
                      <span>{phone}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">{idx === 0 ? "SMS 2FA" : "LANDLINE"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2FA & Protection Controls */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1222]/80 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Account Security Protocols</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Active protections against brute-force intrusion and session interception.
              </p>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">2FA TOTP Authenticator</span>
                    <span className="text-[11px] text-slate-500">Google / Proton Authenticator Protection</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold font-mono text-[10px]">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">30-Minute Brute-Force Lockout</span>
                    <span className="text-[11px] text-slate-500">Locks account for 30 mins after 3 failed attempts</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold font-mono text-[10px]">
                    ENFORCED
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/security"
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition font-mono"
              >
                <span>View Full Platform Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
