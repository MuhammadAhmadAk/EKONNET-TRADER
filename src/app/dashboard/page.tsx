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
  Layers, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  Camera,
  FileText
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("ekonnet_user");
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [kycUrl, setKycUrl] = useState("");

  useEffect(() => {
    setMounted(true);

    const loadSession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.isAdministrative) {
            router.replace("/admin");
            return;
          }
          if (data.authenticated && data.user && data.user.role === "user") {
            setUser(data.user);
            localStorage.setItem("ekonnet_user", JSON.stringify(data.user));

            // Instant auto-redirect to homepage if already approved
            if (data.user.kycStatus === "approved") {
              router.replace("/?kyc=approved");
              return;
            }
            return;
          }
        }
        
        // Backup from localStorage (ensuring role is user)
        const stored = localStorage.getItem("ekonnet_user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.role === "user") {
              setUser(parsed);
              if (parsed.kycStatus === "approved") {
                router.replace("/?kyc=approved");
              }
              return;
            } else {
              localStorage.removeItem("ekonnet_user");
            }
          } catch (err) {}
        }

        // Unauthenticated -> Redirect to login
        setUser(null);
        router.push("/?auth=login&from=/dashboard");
      } catch (e) {
        setUser(null);
        router.push("/?auth=login&from=/dashboard");
      }
    };

    loadSession();
    window.addEventListener("auth-changed", loadSession);

    // Auto-poll every 2.5 seconds to detect real-time Admin KYC Approval
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user && data.user.role === "user") {
            setUser(data.user);
            localStorage.setItem("ekonnet_user", JSON.stringify(data.user));
            if (data.user.kycStatus === "approved") {
              clearInterval(pollInterval);
              router.replace("/?kyc=approved");
            }
          }
        }
      } catch (e) {}
    }, 2500);

    return () => {
      window.removeEventListener("auth-changed", loadSession);
      clearInterval(pollInterval);
    };
  }, [router]);

  useEffect(() => {
    if (user?.id) {
      setKycUrl(`https://ekonnet.com/kyc/verify?userId=${user.id}`);
      fetch("/api/kyc/ticket")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.kycUrl) {
            setKycUrl(data.kycUrl);
          }
        })
        .catch(() => {});
    }
  }, [user?.id]);

  const copyKycLink = () => {
    const linkToCopy = kycUrl || (user?.id ? `https://ekonnet.com/kyc/verify?userId=${user.id}` : "https://ekonnet.com/kyc/verify");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(linkToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // No blocking loader - Render cleanly
  if (!mounted || !user) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#070b14]" />;
  }

  // If approved, don't show QR page - redirect immediately
  if (user.kycStatus === "approved") {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#070b14]" />;
  }

  // Safe helpers to prevent any array/string map exceptions
  const userEmails: string[] = Array.isArray(user?.emails)
    ? user.emails.filter(Boolean)
    : typeof user?.emails === "string" && user.emails
    ? [user.emails]
    : typeof user?.email === "string" && user.email
    ? [user.email]
    : ["No email registered"];

  const userPhones: string[] = Array.isArray(user?.phones)
    ? user.phones.filter(Boolean)
    : typeof user?.phones === "string" && user.phones
    ? [user.phones]
    : typeof user?.phone === "string" && user.phone
    ? [user.phone]
    : ["No phone registered"];

  const activeKycUrl = kycUrl || (user?.id ? `https://ekonnet.com/kyc/verify?userId=${user.id}` : "https://ekonnet.com/kyc/verify");
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(activeKycUrl)}`;

  const isKycApproved = user?.kycStatus === "approved";
  const isKycPending = user?.kycStatus === "pending";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* TOP PROFILE BANNER */}
        <div className="rounded-2xl p-6 bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {user.fullName || "User Account"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  {user.packageTier || "Standard Tier"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <span>Account ID: <strong className="text-slate-900 dark:text-white">{user.id}</strong></span>
                <span>•</span>
                <span>@{user.username}</span>
                {user.country && (
                  <>
                    <span>•</span>
                    <span>{user.city ? `${user.city}, ` : ""}{user.country}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold font-mono uppercase flex items-center gap-2 ${
              isKycApproved
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : isKycPending
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            }`}>
              {isKycApproved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>KYC Verified</span>
                </>
              ) : isKycPending ? (
                <>
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>KYC Pending Review</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>KYC Required</span>
                </>
              )}
            </div>

            <Link
              href="/trades/crypto/p2p"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold text-xs tracking-wide shadow-sm flex items-center gap-1.5 transition"
            >
              <span>P2P Trading</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* IDENTITY VERIFICATION (KYC) ONBOARDING CARD */}
        {!isKycApproved && (
          <div className="rounded-2xl p-6 bg-white dark:bg-[#0c1222] border border-orange-500/30 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Identity Verification</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Verify Your Identity to Unlock Full Account Features
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Fast verification takes less than 2 minutes. Complete on this screen or scan with your mobile device.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href={activeKycUrl}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Verify on This Device</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Split Grid: Requirements & Mobile QR Option */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Requirements Checklist */}
              <div className="lg:col-span-8 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Required Documents:
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Government ID</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Passport, National ID Card, or Driver&apos;s License (Front &amp; Back).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Live Biometric Selfie</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Quick facial verification using your front-facing camera.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Profile Details</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Legal name and residential address matching your document.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile QR Box */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 flex flex-col items-center text-center space-y-3">
                <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 inline-block">
                  <img 
                    src={qrCodeImageUrl} 
                    alt="Scan KYC QR Code" 
                    className="w-36 h-36 object-contain rounded"
                  />
                </div>
                
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                    <span>Scan with Mobile</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Use your phone camera to scan and verify instantly
                  </p>
                </div>

                <div className="flex gap-2 w-full pt-1">
                  <button
                    onClick={copyKycLink}
                    className="flex-1 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1 transition"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                  </button>
                  <Link
                    href={activeKycUrl}
                    className="flex-1 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-[11px] font-bold text-orange-600 dark:text-orange-400 flex items-center justify-center gap-1 transition"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* MULTI-CURRENCY WALLET BALANCES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Wallet Balances</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Segregated multi-asset accounts with instant settlement</p>
            </div>
            <Link 
              href="/payments"
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>Deposits &amp; Withdrawals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { symbol: "USD", name: "US Dollar", bal: `$${Number(user.walletBalances?.USD || 0).toLocaleString()}`, color: "text-emerald-500" },
              { symbol: "USDT", name: "Tether USD", bal: `${Number(user.walletBalances?.USDT || 0).toLocaleString()} USDT`, color: "text-emerald-500" },
              { symbol: "BTC", name: "Bitcoin", bal: `${user.walletBalances?.BTC || 0} BTC`, color: "text-amber-500" },
              { symbol: "ETH", name: "Ethereum", bal: `${user.walletBalances?.ETH || 0} ETH`, color: "text-blue-500" },
              { symbol: "XRP", name: "Ripple XRP", bal: `${Number(user.walletBalances?.XRP || 0).toLocaleString()} XRP`, color: "text-indigo-500" },
              { symbol: "BCH", name: "Bitcoin Cash", bal: `${user.walletBalances?.BCH || 0} BCH`, color: "text-emerald-600" }
            ].map((w) => (
              <div key={w.symbol} className="p-3.5 rounded-xl bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400 font-bold block">{w.name}</span>
                <div className={`text-sm sm:text-base font-bold font-mono ${w.color}`}>{w.bal}</div>
                <div className="text-[10px] font-mono text-slate-400">Available</div>
              </div>
            ))}
          </div>
        </div>

        {/* SECURITY & COMPLIANCE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Registered Security Contacts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registered Security Contacts</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified security emails and multi-factor phone destinations.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 space-y-1.5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Registered Emails:</span>
                {userEmails.map((email: any, idx: number) => {
                  const displayEmail = typeof email === "string" ? email : (email?.email || email?.address || String(email));
                  return (
                    <div key={idx} className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                      <span className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate">{displayEmail}</span>
                      </span>
                      <span className="text-[10px] text-emerald-500 font-bold shrink-0">{idx === 0 ? "PRIMARY" : "BACKUP"}</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5 space-y-1.5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Registered Phones:</span>
                {userPhones.map((phone: any, idx: number) => {
                  const displayPhone = typeof phone === "string" ? phone : (phone?.phone || phone?.number || String(phone));
                  return (
                    <div key={idx} className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                      <span className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{displayPhone}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold shrink-0">{idx === 0 ? "SMS 2FA" : "SECONDARY"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Account Protection Controls */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account Protection Controls</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Continuous security monitoring and automated intrusion protection.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">2FA Authenticator</span>
                    <span className="text-[11px] text-slate-500">Google / Microsoft Authenticator Time-based OTP</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold font-mono text-[10px]">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Brute-Force Shield</span>
                    <span className="text-[11px] text-slate-500">Automatic 30-minute lockout on suspicious attempts</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold font-mono text-[10px]">
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
                <span>View Security Settings &amp; Telemetry</span>
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
