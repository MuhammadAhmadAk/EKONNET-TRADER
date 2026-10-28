"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  CheckCircle, 
  ShieldAlert, 
  UserPlus, 
  Upload, 
  ArrowRight, 
  FileText,
  AlertCircle
} from "lucide-react";
import { generateEkonnetId, calculateAge } from "@/lib/utils";

interface UserRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUser: any) => void;
}

export default function UserRegisterModal({ isOpen, onClose, onSuccess }: UserRegisterModalProps) {
  const [autoUserId, setAutoUserId] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("2000-01-01");
  const [age, setAge] = useState(26);
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("New York");
  const [sex, setSex] = useState("Male");
  
  // Section 30: 3 personal emails & 2 phones
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [email3, setEmail3] = useState("");
  const [phoneMobile, setPhoneMobile] = useState("");
  const [phoneLandline, setPhoneLandline] = useState("");

  // Section 30: Security Questions
  const [secQ1, setSecQ1] = useState("What was your first school name?");
  const [secA1, setSecA1] = useState("");
  const [secQ2, setSecQ2] = useState("What city were you born in?");
  const [secA2, setSecA2] = useState("");

  // Terms & Conditions checkbox (Section 35)
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [underageError, setUnderageError] = useState("");
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (isOpen) {
      setAutoUserId(generateEkonnetId("EKON"));
    }
  }, [isOpen]);

  // Recalculate age and enforce Section 63 (Under 18 prohibited)
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    const calculated = calculateAge(val);
    setAge(calculated);

    if (calculated < 18) {
      setUnderageError("SECTION 63 REGULATORY NOTICE: Persons under 18 years of age are strictly prohibited from opening an account on Ekonnet Trades & Payments Platform.");
    } else {
      setUnderageError("");
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age < 18) {
      alert("Registration halted: You must be at least 18 years old to open an account (Section 63).");
      return;
    }
    if (!agreedTerms) {
      alert("You must agree to the Terms & Conditions and Legal Procedures (Section 35).");
      return;
    }

    const newUser = {
      id: autoUserId,
      username: username || "trader_" + autoUserId.split("-")[1],
      fullName,
      emails: [email1, email2, email3].filter(Boolean),
      phones: [phoneMobile, phoneLandline].filter(Boolean),
      age,
      country,
      city,
      kycStatus: "pending",
      packageTier: "Free",
      walletBalances: { USD: 0, BTC: 0, XRP: 0, ETH: 0, BCH: 0 }
    };

    onSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#111827] border border-[#1F293D] p-6 sm:p-8 shadow-2xl my-8 glow-violet">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <UserPlus className="w-3.5 h-3.5" />
            <span>SECTION 30 & 63 COMPLIANT REGISTRATION</span>
          </div>
          <h3 className="text-2xl font-black text-white">Create Ekonnet Trader Account</h3>
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            <span>Auto-Generated ID: <strong className="text-emerald-400 font-mono">{autoUserId}</strong></span>
            <span>•</span>
            <span>Step {activeStep} of 2</span>
          </div>
        </div>

        {/* Age Restriction Alert (Section 63) */}
        {underageError && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-1 mb-5">
            <div className="flex items-center space-x-2 font-bold text-rose-400">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>UNDER 18 YEARS REGISTRATION PROHIBITED</span>
            </div>
            <p>{underageError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {activeStep === 1 ? (
            /* Step 1: Personal Data & 18+ Verification */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Custom Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. btc_master"
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="First and Last Name"
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* DOB and Calculated Age (Section 30, 63) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    Date of Birth (Must be 18+)
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={handleDobChange}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">
                    System Verified Age:
                  </label>
                  <div className="flex items-center rounded-xl bg-[#0B0F19] border border-[#1F293D] p-3 text-sm font-bold font-mono">
                    <span className={age >= 18 ? "text-emerald-400" : "text-rose-400"}>
                      {age} Years Old {age >= 18 ? "(Eligible)" : "(Rejected under Sec 63)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Multi-Email Form (Section 30: 3 personal emails) */}
              <div className="p-4 rounded-2xl bg-[#0E1424] border border-[#1F293D] space-y-3">
                <span className="text-xs font-bold text-gray-200 block">
                  3 Registered Security Emails (Section 30 requirement)
                </span>
                <input
                  type="email"
                  required
                  placeholder="Primary Email Address (Verification Link sent here)"
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value)}
                  className="w-full rounded-lg bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Secondary Recovery Email"
                    value={email2}
                    onChange={(e) => setEmail2(e.target.value)}
                    className="w-full rounded-lg bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-white focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Tertiary Backup Email"
                    value={email3}
                    onChange={(e) => setEmail3(e.target.value)}
                    className="w-full rounded-lg bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Location & Phones */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Mobile Number (SMS)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1-555-0199"
                    value={phoneMobile}
                    onChange={(e) => setPhoneMobile(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={age < 18}
                onClick={() => setActiveStep(2)}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>Proceed to KYC & Security Setup (Step 2)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Step 2: KYC Photo Guidelines & Security Questions */
            <div className="space-y-4">
              
              {/* KYC Photo Instructions as mandated in Section 27, 30 */}
              <div className="p-4 rounded-2xl bg-[#0E1424] border border-blue-500/30 space-y-2.5 text-xs">
                <div className="flex items-center space-x-2 font-bold text-blue-300">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>MANDATORY KYC PHOTO WITH HANDWRITTEN NOTE</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  As required by Ekonnet Compliance, after signing up you must upload a clear photo of your face holding your official ID alongside a handwritten note stating:
                </p>
                <div className="p-3 bg-[#0B0F19] rounded-xl border border-gray-800 text-emerald-400 font-mono text-[11px]">
                  &quot;{fullName || "Your Full Name"}, Ekonnet, {new Date().toISOString().split('T')[0]}&quot;
                </div>
              </div>

              {/* Security Questions (Section 30) */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-200 block">Security Questions Setup:</span>
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Question 1</label>
                  <input
                    type="text"
                    value={secQ1}
                    onChange={(e) => setSecQ1(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-gray-300 focus:outline-none mb-1.5"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Your Answer to Question 1"
                    value={secA1}
                    onChange={(e) => setSecA1(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Question 2</label>
                  <input
                    type="text"
                    value={secQ2}
                    onChange={(e) => setSecQ2(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-gray-300 focus:outline-none mb-1.5"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Your Answer to Question 2"
                    value={secA2}
                    onChange={(e) => setSecA2(e.target.value)}
                    className="w-full rounded-xl bg-[#0B0F19] border border-[#1F293D] p-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 35: Terms and Conditions Agreement Checkbox */}
              <div className="p-3.5 rounded-xl bg-[#0B0F19] border border-gray-800 flex items-start space-x-3 text-xs">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-gray-700 text-blue-600 focus:ring-0"
                />
                <label htmlFor="agreeTerms" className="text-gray-300 cursor-pointer text-[11px] leading-relaxed">
                  I fully accept and agree to the <strong>Ekonnet Terms & Conditions, Security Protocols, and Legal Obligations</strong> (Section 35). I confirm I am 18+ years old and all personal details submitted are genuine.
                </label>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-[#161F33] text-gray-300 text-xs font-bold hover:bg-gray-800"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!agreedTerms || age < 18}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                >
                  Complete Registration
                </button>
              </div>

            </div>
          )}

        </form>

      </div>
    </div>
  );
}
