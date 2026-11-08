"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  Globe
} from "lucide-react";
import { calculateAge } from "@/lib/utils";

interface UserRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUser: any) => void;
  onSwitchToLogin?: () => void;
}

export default function UserRegisterModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  onSwitchToLogin 
}: UserRegisterModalProps) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState("2000-01-01");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("New York");
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [age, setAge] = useState(26);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    const calculated = calculateAge(val);
    setAge(calculated);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !fullName.trim()) {
      setErrorMessage("Please enter both Username and Full Legal Name.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Email address is required.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (age < 18) {
      setErrorMessage("Regulatory requirement: You must be at least 18 years old to open a trading account.");
      return;
    }

    if (!agreedTerms) {
      setErrorMessage("You must accept the Terms of Service to create an account.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          fullName: fullName.trim(),
          password,
          dob,
          emails: [email.trim()],
          phones: phone ? [phone.trim()] : [],
          country: country.trim(),
          city: city.trim() || "Default",
          agreedTerms: true,
          packageTier: "Free"
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Registration failed. Please check your information.");
        setIsLoading(false);
        return;
      }

      // Save user session in localStorage
      localStorage.setItem("ekonnet_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-changed"));

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMessage("Network error contacting registration service. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-black/80 backdrop-blur-md">
      
      {/* Centered Compact Card - Fits screen without inner scrolling */}
      <div className="relative w-full max-w-lg rounded-[8px] border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-2xl bg-white dark:bg-[#0c1222] p-6 sm:p-7 text-slate-900 dark:text-white transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-[8px] text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-[8px] bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center shadow-sm shrink-0">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Create Ekonnet Account
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Institutional clearing &amp; multi-asset trading
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-2.5 rounded-[8px] bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs mb-3.5">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Row 1: Full Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Full Legal Name
              </label>
              <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 focus-within:border-orange-500 transition">
                <User className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Farhan Qureshi"
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Username
              </label>
              <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 focus-within:border-orange-500 transition">
                <span className="text-slate-400 font-mono text-xs mr-1">@</span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 focus-within:border-orange-500 transition">
                <Mail className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 focus-within:border-orange-500 transition">
                <Phone className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 focus-within:border-orange-500 transition">
                <Lock className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 ml-1 transition"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 focus-within:border-orange-500 transition">
                <Lock className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 4: DOB & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Date of Birth
                </label>
                <span className={`text-[10px] font-mono font-bold ${age >= 18 ? "text-emerald-500" : "text-rose-500"}`}>
                  {age} yrs ({age >= 18 ? "18+ Eligible" : "Under 18"})
                </span>
              </div>
              <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 focus-within:border-orange-500 transition">
                <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={handleDobChange}
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Country
              </label>
              <div className="flex items-center rounded-[8px] bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 focus-within:border-orange-500 transition">
                <Globe className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Pakistan, United States"
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              id="terms"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="rounded-[4px] accent-orange-500 w-3.5 h-3.5"
            />
            <label htmlFor="terms" className="cursor-pointer select-none">
              I agree to the <span className="text-orange-600 dark:text-orange-400 font-semibold">Terms of Service</span> &amp; <span className="text-orange-600 dark:text-orange-400 font-semibold">Privacy Policy</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || age < 18}
            className="w-full py-3 rounded-[8px] bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Footer Navigation */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <span>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onSwitchToLogin) onSwitchToLogin();
              }}
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline"
            >
              Sign In
            </button>
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bank-Grade Isolation</span>
          </div>
        </div>

      </div>
    </div>
  );
}
