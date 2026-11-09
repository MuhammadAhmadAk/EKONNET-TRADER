"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  LogIn, 
  Sun, 
  Moon, 
  Loader2, 
  AlertOctagon, 
  Layers
} from "lucide-react";

export default function AdminManagementLoginPage() {
  const router = useRouter();
  const [adminToken, setAdminToken] = useState("");
  const [rootKey, setRootKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Theme sync - match current system theme
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Check if already authenticated as admin via dedicated admin storage
    try {
      const stored = localStorage.getItem("ekonnet_admin_user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === "master_admin" || u.role === "management" || u.role === "staff") {
          router.push("/admin");
          return;
        }
      }
    } catch (e) {}

    // Verify dedicated admin server session
    fetch("/api/auth/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          const role = data.user.role;
          if (role === "master_admin" || role === "management" || role === "staff") {
            localStorage.setItem("ekonnet_admin_user", JSON.stringify(data.user));
            router.push("/admin");
          }
        }
      })
      .catch(() => {});
  }, [router]);

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const next = isCurrentlyDark ? "light" : "dark";
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

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!adminToken || !rootKey) {
      setError("Please enter your Admin Email / Staff ID and Password.");
      return;
    }

    setIsAuthorizing(true);
    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: adminToken.trim(),
          password: rootKey
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Access denied to Management Root.");
        setIsAuthorizing(false);
        return;
      }

      // STRICT ENFORCEMENT: Traders / Normal Users are strictly forbidden from this gate!
      if (data.user?.role === "user") {
        setError("ACCESS DENIED: Trader accounts do not possess administrative clearance. Please sign in via the Customer Trading Portal.");
        setIsAuthorizing(false);
        return;
      }

      if (data.user?.role !== "master_admin" && data.user?.role !== "management" && data.user?.role !== "staff") {
        setError("Access Restricted: This gate requires Master Admin or Management Staff clearance.");
        setIsAuthorizing(false);
        return;
      }

      // Store authenticated session strictly in dedicated admin storage
      localStorage.setItem("ekonnet_admin_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("admin-auth-changed"));
      router.push("/admin");
    } catch (err) {
      setError("Network error connecting to management auth service.");
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full relative overflow-hidden flex flex-col justify-between p-4 sm:px-8 sm:py-4 font-sans selection:bg-orange-500 selection:text-white transition-colors duration-500 bg-gradient-to-b from-[#e3edf7] via-[#eef5fc] to-[#f4f9ff] dark:from-[#060913] dark:via-[#090e1f] dark:to-[#050811]">
      
      {/* Background Architectural Rings (exact match to reference image) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Soft glowing ambient circles */}
        <div className="w-[850px] h-[850px] rounded-full border border-white/60 dark:border-white/5 opacity-50 dark:opacity-20 absolute -top-10" />
        <div className="w-[1100px] h-[1100px] rounded-full border border-white/50 dark:border-white/5 opacity-40 dark:opacity-10 absolute -top-40" />
        <div className="w-[1400px] h-[1400px] rounded-full border border-white/30 dark:border-white/5 opacity-30 dark:opacity-5 absolute -top-80" />
        
        {/* Subtle orange-rose glow accent in dark mode / soft sky cloud glow in light mode */}
        <div className="absolute top-1/3 w-[500px] h-[500px] bg-orange-500/10 dark:bg-orange-500/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 w-[600px] h-[400px] bg-rose-500/5 dark:bg-rose-500/10 blur-[130px] rounded-full pointer-events-none" />
      </div>

      {/* Top Bar with Brand Logo and Theme Switcher */}
      <header className="relative z-20 flex items-center justify-between w-full max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full overflow-hidden p-[1px] shadow-sm shadow-orange-500/20 group-hover:scale-105 transition transform">
            <picture>
              <source srcSet="/images/ekonnet-logo-96.webp" type="image/webp" />
              <img
                src="/images/ekonnet-logo-96.png"
                alt="Ekonnet Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </picture>
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            Ekonnet <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-[6px] bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">Admin</span>
          </span>
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-[8px] bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/80 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-slate-200 transition shadow-sm hover:shadow"
          title={theme === "dark" ? "Switch to Light Sky Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </header>

      {/* Main Centered Floating Glass Card - Border Radius 8px */}
      <main className="relative z-20 flex-1 flex items-center justify-center py-2 sm:py-4">
        <div className="w-full max-w-[390px] rounded-[8px] bg-white/85 dark:bg-[#0c1222]/90 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7)] p-6 sm:p-7 transition-all duration-300">
          
          {/* Elevated Centered Top Icon Badge */}
          <div className="flex justify-center mb-3">
            <div className="w-11 h-11 p-2.5 rounded-[8px] bg-white/95 dark:bg-[#131b2e] border border-slate-100 dark:border-white/10 shadow-md shadow-slate-200/50 dark:shadow-black/40 flex items-center justify-center text-slate-800 dark:text-orange-400 transform hover:scale-105 transition-transform">
              <LogIn className="w-5 h-5 text-slate-800 dark:text-orange-400 stroke-[2.2]" />
            </div>
          </div>

          {/* Header Title & Subtitle */}
          <div className="text-center space-y-1 mb-4">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign in with credentials
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto">
              Privileged root management terminal for Ekonnet Executive &amp; Compliance Staff.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-3 p-2.5 rounded-[8px] bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminAuth} className="space-y-3">
            
            {/* Input 1: Admin Email / Username */}
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Email or Staff ID"
                className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-slate-100/80 dark:bg-black/35 border border-slate-200/70 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-black/50 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition"
              />
            </div>

            {/* Input 2: Password with Show/Hide Toggle */}
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={rootKey}
                onChange={(e) => setRootKey(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-2.5 rounded-[8px] bg-slate-100/80 dark:bg-black/35 border border-slate-200/70 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-black/50 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition p-1"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Main Primary Action Button - 8px radius */}
            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full py-3 rounded-[8px] bg-[#1e232e] hover:bg-black dark:bg-gradient-to-r dark:from-orange-500 dark:to-rose-500 dark:hover:from-orange-600 dark:hover:to-rose-600 text-white font-bold text-xs tracking-wide shadow-md shadow-black/15 dark:shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 mt-1 cursor-pointer"
            >
              {isAuthorizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                  <span>Authorizing Clearance...</span>
                </>
              ) : (
                <span>Authorize &amp; Get Started</span>
              )}
            </button>

          </form>

          {/* Bottom Switch to Customer Portal */}
          <div className="mt-4 pt-3 text-center border-t border-slate-100 dark:border-white/5">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Are you a trader?{" "}
            </span>
            <Link
              href="/"
              className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline"
            >
              Customer Trading Portal →
            </Link>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-20 text-center text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-600 font-mono py-1">
        TLS 1.3 Hardware Enclave Encrypted &bull; Host Node VPS-DE-01 (82.165.10.77)
      </footer>

    </div>
  );
}
