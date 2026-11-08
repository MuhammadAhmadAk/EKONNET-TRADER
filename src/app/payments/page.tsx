"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CreditCard, 
  Send, 
  ShieldCheck, 
  ArrowDownLeft, 
  History,
  Lock,
  Building,
  Smartphone,
  ChevronRight,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  RefreshCw,
  Sun,
  Moon
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface DepositItem {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  paymentRail: string;
  transactionRef: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  cvVerification?: {
    status: "PASS" | "WARN" | "FAIL";
    confidenceScore: number;
    sharpnessScore: number;
    details: string;
    verifiedAt: string;
  };
  createdAt: string;
}

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"deposit" | "history">("deposit");
  const [selectedMethod, setSelectedMethod] = useState("wire");
  const [amount, setAmount] = useState<number>(2500);
  const [currency, setCurrency] = useState<"USD" | "PKR" | "EUR" | "GBP">("USD");
  const [transactionRef, setTransactionRef] = useState("");
  const [senderAccountName, setSenderAccountName] = useState("");
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [deposits, setDeposits] = useState<DepositItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ekonnet_user");
      if (stored) {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        setSenderAccountName(u.fullName || u.username || "");
      }
    } catch (e) {}

    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await fetch("/api/finance/deposits");
      const data = await res.json();
      if (data.success && Array.isArray(data.deposits)) {
        setDeposits(data.deposits);
      }
    } catch (err) {
      console.error("Failed to load deposits:", err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setErrorMsg("Please upload a valid receipt image (PNG, JPG, WEBP).");
      return;
    }

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setReceiptBase64(result);
      setErrorMsg("");
    };
    reader.readAsDataURL(file);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmissionResult(null);

    if (!currentUser) {
      setErrorMsg("Authentication required. Please sign in to submit deposit slips.");
      return;
    }

    if (!amount || amount <= 0) {
      setErrorMsg("Please enter a valid deposit amount.");
      return;
    }

    if (!transactionRef.trim()) {
      setErrorMsg("Please provide your Bank / Wire Transfer Reference or UTR Number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/finance/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.fullName || currentUser.username,
          amount: Number(amount),
          currency,
          paymentRail: getPaymentRailName(selectedMethod),
          transactionRef: transactionRef.trim(),
          slipBase64: receiptBase64 || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit deposit slip.");
        setIsSubmitting(false);
        return;
      }

      setSubmissionResult(data.deposit);
      setTransactionRef("");
      setReceiptBase64(null);
      setReceiptFileName(null);
      fetchDeposits();
    } catch (err: any) {
      setErrorMsg("Network error submitting deposit slip to ledger.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPaymentRailName = (methodId: string) => {
    switch (methodId) {
      case "wire": return "Direct Wire";
      case "raast": return "Raast";
      case "wise": return "Wise";
      case "revolut": return "Revolut";
      case "cards": return "Local Bank";
      case "crypto": return "Crypto";
      default: return "Direct Wire";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Universal Top Header */}
      <Navbar />

      {/* Main Body */}
      {!currentUser ? (
        <main className="p-6 sm:p-12 max-w-md mx-auto w-full flex-1 flex items-center justify-center">
          <div className="w-full rounded-2xl bg-white dark:bg-[#0c1222]/90 border border-slate-200 dark:border-white/10 shadow-xl p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Authentication Required
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Please sign in to your verified Ekonnet account to view custody balances, initiate bank deposits, and access institutional clearing rails.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/?auth=login&from=/payments"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-500/25 hover:from-orange-600 hover:to-rose-600 transition"
              >
                Sign In to Account
              </Link>
              <Link
                href="/?auth=register&from=/payments"
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-white/20 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </main>
      ) : (
      <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">
              <Link href="/" className="hover:text-orange-500 transition">Portal</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-orange-600 dark:text-orange-400 font-bold">Treasury & Multi-Rail Payments</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Fiat &amp; Crypto Treasury Clearing Hub
            </h1>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-200/80 dark:bg-white/10 p-1 rounded-xl self-start">
            <button
              onClick={() => setActiveTab("deposit")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "deposit"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Deposit &amp; Upload Slip
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/25"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Ledger Slips ({deposits.length})
            </button>
          </div>
        </div>

        {/* Top Wallet Balances Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Available USD Custody</span>
            <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              ${Number(currentUser.walletBalances?.USD || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant Trading &amp; P2P Ready
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Crypto Reserves</span>
            <div className="text-2xl font-black font-mono text-orange-600 dark:text-orange-400">
              {Number(currentUser.walletBalances?.BTC || 0).toFixed(4)} BTC
            </div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              ≈ ${( Number(currentUser.walletBalances?.BTC || 0) * 67450 ).toLocaleString("en-US", { maximumFractionDigits: 0 })} USD
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Clearing Engine</span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Python AI Verified</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
              Laplacian Slip Forensics + Zero-Sum Ledger
            </div>
          </div>
        </div>

        {/* Tab 1: Deposit & Upload Receipt Flow */}
        {activeTab === "deposit" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Deposit Form */}
            <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 p-6 space-y-5 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Initiate Deposit &amp; Submit Transfer Proof
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select your payment rail, enter transfer reference, and upload bank slip for automated clearing.
                </p>
              </div>

              {/* Payment Rail Selectors */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Choose Clearing Rail:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "wire", name: "Bank Swift Wire", speed: "1-2 Hours", icon: "🏦" },
                    { id: "raast", name: "Raast / 1Link (PKR)", speed: "Instant", icon: "⚡" },
                    { id: "wise", name: "Wise Transfer", speed: "Instant", icon: "🌐" },
                    { id: "revolut", name: "Revolut Pay", speed: "Immediate", icon: "💳" },
                    { id: "cards", name: "Local Bank Transfer", speed: "Same-Day", icon: "🏢" },
                    { id: "crypto", name: "USDT / BTC Direct", speed: "5-10 Mins", icon: "⛓️" },
                  ].map(method => (
                    <button
                      type="button"
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedMethod === method.id 
                          ? "bg-orange-500/10 dark:bg-orange-500/15 border-orange-500/60 ring-1 ring-orange-500/40 shadow-xs" 
                          : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 hover:border-orange-500/30"
                      }`}
                    >
                      <span className="text-lg mb-1 block">{method.icon}</span>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{method.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{method.speed}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleDepositSubmit} className="space-y-4">
                
                {/* Amount & Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Deposit Amount:</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        required
                        min="10"
                        value={amount}
                        onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Currency:</label>
                    <select
                      value={currency}
                      onChange={(e: any) => setCurrency(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PKR">PKR (Rs)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                {/* Sender Name & Transaction Ref */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sender Account Name:</label>
                    <input
                      type="text"
                      required
                      value={senderAccountName}
                      onChange={(e) => setSenderAccountName(e.target.value)}
                      placeholder="e.g. Farhan Qureshi"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Transaction Ref / UTR #:</label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. WIRE-998124 or RAAST-3381"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                {/* Upload Receipt Slip File */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Upload Bank Transfer Receipt Slip (PNG, JPG):
                  </label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-white/15 rounded-xl p-4 text-center hover:border-orange-500/50 transition relative bg-slate-50/50 dark:bg-white/[0.01]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {receiptFileName ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Attached: {receiptFileName}</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="w-6 h-6 mx-auto text-slate-400 dark:text-slate-500" />
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          Click to browse or drag &amp; drop transfer slip
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Automated Python Forensic Scan will evaluate slip legibility &amp; transaction reference
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Success Banner */}
                {submissionResult && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs space-y-1.5 animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Deposit Slip Queued Successfully (ID: {submissionResult.id})</span>
                    </div>
                    {submissionResult.cvVerification && (
                      <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-300">
                        Python Forensic Score: {submissionResult.cvVerification.confidenceScore}% Clarity ({submissionResult.cvVerification.status}) &bull; Staff clearing in progress.
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs tracking-wide shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning Slip with Python Engine &amp; Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Deposit Slip to Clearing</span>
                    </>
                  )}
                </button>

              </form>

            </div>

            {/* Right: Bank Account Details & Instructions */}
            <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 p-6 space-y-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-orange-500" />
                <span>Ekonnet Sovereign Beneficiary Rails</span>
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">Bank Name:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">Standard Chartered Sovereign Corp</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">Account Title:</span>
                  <div className="font-bold text-slate-900 dark:text-white">EKONNET FINANCIAL TECHNOLOGIES LTD</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">IBAN / Wire Account:</span>
                  <div className="font-bold text-orange-600 dark:text-orange-400 text-sm">PK36SCBL0000001928471029</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">SWIFT / BIC Code:</span>
                  <div className="font-bold text-slate-900 dark:text-white">SCBLPKKHI</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans font-bold">Raast ID (Instant PKR):</span>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">raast.ekonnet@scb</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <div className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Double-Entry Settlement Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every deposit slip submitted is forensically scanned by our dedicated Python computer vision engine and matched with institutional ledger records before 1-click administrative clearance.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Ledger Slips History */}
        {activeTab === "history" && (
          <div className="rounded-2xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Treasury Ledger Deposit Slips
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Track the real-time clearing and verification status of your wire and bank transfers.
                </p>
              </div>
              <button
                onClick={fetchDeposits}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {deposits.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-mono">
                No deposit slips found in ledger.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 text-[10px] font-mono uppercase tracking-wider">
                      <th className="py-3 pr-4">DEPOSIT ID</th>
                      <th className="py-3 px-4">RAIL</th>
                      <th className="py-3 px-4">AMOUNT</th>
                      <th className="py-3 px-4">TRANSACTION REF</th>
                      <th className="py-3 px-4">PYTHON AI FORENSIC</th>
                      <th className="py-3 pl-4 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                    {deposits.map(dep => (
                      <tr key={dep.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition">
                        <td className="py-3 pr-4 font-bold text-slate-900 dark:text-white">
                          {dep.id}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                          {dep.paymentRail}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          +${dep.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {dep.currency}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                          {dep.transactionRef}
                        </td>
                        <td className="py-3 px-4">
                          {dep.cvVerification ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              ✓ {dep.cvVerification.confidenceScore}% Clarity ({dep.cvVerification.status})
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Standard Wire</span>
                          )}
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            dep.status === "APPROVED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse"
                          }`}>
                            {dep.status === "APPROVED" ? "APPROVED & CREDITED" : "PENDING CLEARING"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
      )}

      {/* Universal Footer */}
      <Footer />

    </div>
  );
}
