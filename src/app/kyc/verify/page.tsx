"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  User, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Layers, 
  Lock, 
  Loader2, 
  FileCheck 
} from "lucide-react";
import DocumentScanner from "@/components/kyc/DocumentScanner";
import LiveSelfieScanner from "@/components/kyc/LiveSelfieScanner";

function KYCVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [userId, setUserId] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Step 1: Personal Details
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Pakistan");

  // Step 2: Original ID Document
  const [documentType, setDocumentType] = useState<"cnic" | "passport" | "license">("cnic");
  const [documentNumber, setDocumentNumber] = useState("");
  const [frontImage, setFrontImage] = useState<string>("");
  const [backImage, setBackImage] = useState<string>("");

  // Step 3: Live Selfie
  const [selfieImage, setSelfieImage] = useState<string>("");

  // Step 4: Proof of Address (Optional)
  const [proofOfAddressImage, setProofOfAddressImage] = useState<string>("");
  const [skipProofOfAddress, setSkipProofOfAddress] = useState(false);

  useEffect(() => {
    const qUserId = searchParams.get("userId");
    if (qUserId) {
      setUserId(qUserId);
    }

    const checkAndPoll = () => {
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            const u = data.user;
            setUserId(u.id);
            if (u.fullName) setFullName(u.fullName);
            if (u.dateOfBirth) setDob(u.dateOfBirth);
            if (u.country) setCountry(u.country);
            if (u.city) setCity(u.city);

            // AUTO-REDIRECT TO HOMEPAGE ONCE APPROVED BY ADMIN
            if (u.kycStatus === "approved") {
              localStorage.setItem("ekonnet_user", JSON.stringify(u));
              router.replace("/?kyc=approved");
              return;
            }
          } else if (!qUserId) {
            router.replace("/?auth=login&from=/kyc/verify");
          }
        })
        .catch(() => {
          if (!qUserId) {
            router.replace("/?auth=login&from=/kyc/verify");
          }
        });
    };

    checkAndPoll();

    // Live auto-polling every 2.5 seconds
    const interval = setInterval(checkAndPoll, 2500);
    return () => clearInterval(interval);
  }, [router, searchParams]);

  // Helper to handle image file to Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please select a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!fullName || !dob || !residentialAddress) {
      setErrorMessage("Please complete all personal details as printed on your official ID.");
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!documentNumber || !frontImage) {
      setErrorMessage("Please enter your Document Number and upload the Front Photo of your Original ID.");
      return;
    }
    if (documentType !== "passport" && !backImage) {
      setErrorMessage("Please upload the Back Photo of your Smart CNIC or Driving License.");
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!selfieImage) {
      setErrorMessage("Please take or upload a clear live selfie for facial identity verification.");
      return;
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        userId: userId || "EKON-ANON",
        fullName,
        dob,
        residentialAddress: `${residentialAddress}, ${city}, ${country}`,
        documentType,
        documentNumber,
        documentFrontUrl: frontImage,
        documentBackUrl: backImage || null,
        selfieUrl: selfieImage,
        proofOfAddressUrl: proofOfAddressImage || null
      };

      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit KYC");
      }

      // Update local storage status
      try {
        const stored = localStorage.getItem("ekonnet_user");
        if (stored) {
          const u = JSON.parse(stored);
          u.kycStatus = "pending";
          u.kycDocumentUrl = frontImage;
          localStorage.setItem("ekonnet_user", JSON.stringify(u));
          window.dispatchEvent(new Event("auth-changed"));
        }
      } catch (e) {}

      setCurrentStep(5);
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try submitting again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Mobile-Friendly Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0c1222]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 px-4 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
            EKONNET<span className="text-orange-500">KYC</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TLS 1.3 ENCRYPTED</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 sm:py-8 space-y-6">
        
        {/* Progress Header */}
        {currentStep < 5 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-orange-600 dark:text-orange-400 font-mono uppercase">
                Step {currentStep} of 4
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono">
                UID: <strong className="text-slate-900 dark:text-white">{userId || "Active Session"}</strong>
              </span>
            </div>

            {/* Stepper Bar */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div 
                  key={step} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep >= step 
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 shadow-sm shadow-orange-500/30" 
                      : "bg-slate-200 dark:bg-white/10"
                  }`} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: PERSONAL DETAILS */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className="p-6 rounded-3xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase mb-2">
                <User className="w-3 h-3" />
                <span>1. Personal Information</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Enter Your Legal Details</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your exact legal name and residential address as written on your official ID.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Legal Name (As printed on ID)
                </label>
                <div className="flex items-center rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 focus-within:border-orange-500">
                  <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Ahmad"
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Date of Birth (Must be 18+)
                </label>
                <div className="flex items-center rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 focus-within:border-orange-500">
                  <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Residential Address
                </label>
                <div className="flex items-start rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 focus-within:border-orange-500">
                  <MapPin className="w-4 h-4 text-slate-400 mr-2 mt-0.5 shrink-0" />
                  <textarea
                    required
                    rows={2}
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    placeholder="House / Flat No, Street, Colony or Sector"
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore / Karachi"
                    className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition"
            >
              <span>Continue to ID Document Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: ORIGINAL ID DOCUMENT */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Submit} className="p-6 rounded-3xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase mb-2">
                <FileCheck className="w-3 h-3" />
                <span>2. Original ID Document</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Select & Upload ID</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Accepted: Smart National ID, Passport, or Driving License.
              </p>
            </div>

            {/* Document Type Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "cnic", label: "Smart CNIC", sub: "National ID" },
                { id: "passport", label: "Passport", sub: "International" },
                { id: "license", label: "Driving Lic", sub: "Govt Issued" }
              ].map((doc) => (
                <button
                  type="button"
                  key={doc.id}
                  onClick={() => setDocumentType(doc.id as any)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                    documentType === doc.id
                      ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold"
                      : "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-xs font-bold">{doc.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{doc.sub}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                {documentType === "cnic" ? "CNIC Number (with dashes)" : documentType === "passport" ? "Passport Number" : "License Number"}
              </label>
              <input
                type="text"
                required
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder={documentType === "cnic" ? "35201-1234567-1" : "e.g. AB1234567"}
                className="w-full rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            {/* Front Photo Scanner */}
            <DocumentScanner
              label="Front Side Photo (Original ID)"
              subLabel={`Hold ${documentType === "cnic" ? "Smart CNIC" : documentType === "passport" ? "Passport Bio Page" : "Driving License"} inside frame`}
              documentType={documentType}
              side="front"
              value={frontImage}
              onChange={setFrontImage}
            />

            {/* Back Photo Scanner (Passport doesn't strictly need back) */}
            {documentType !== "passport" && (
              <DocumentScanner
                label="Back Side Photo (Original ID)"
                subLabel="Ensure barcode and official government stamp are clearly visible"
                documentType={documentType}
                side="back"
                value={backImage}
                onChange={setBackImage}
              />
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
              >
                <span>Continue to Live Selfie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: LIVE SELFIE */}
        {currentStep === 3 && (
          <form onSubmit={handleStep3Submit} className="p-6 rounded-3xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase mb-2">
                <Camera className="w-3 h-3" />
                <span>3. Live Selfie Verification</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Face Biometric Check</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Take a direct selfie with good lighting. Please remove sunglasses, caps, or face masks.
              </p>
            </div>

            {/* Live Facial Biometric Scanner Component */}
            <LiveSelfieScanner
              value={selfieImage}
              onChange={setSelfieImage}
            />

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
              >
                <span>Continue to Step 4</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: PROOF OF ADDRESS (OPTIONAL) */}
        {currentStep === 4 && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-xl space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase mb-2">
                <Sparkles className="w-3 h-3" />
                <span>4. Proof of Address (Optional)</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">High-Tier Limit Clearance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Optional for standard trading. Upload a utility bill or bank statement (issued within last 90 days) to unlock high-tier limits ($100,000+).
              </p>
            </div>

            {/* Address Proof Upload Box */}
            <div className="relative border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-5 text-center hover:border-orange-500 transition cursor-pointer bg-slate-50/50 dark:bg-black/20">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileUpload(e, setProofOfAddressImage)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {proofOfAddressImage ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 mx-auto text-emerald-500" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block">
                    ✓ Document Attached (Click to Change)
                  </span>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <Upload className="w-8 h-8 mx-auto text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Upload Electricity / Gas Bill or Bank Statement
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Issued within last 90 days matching your registered name
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              💡 <strong>Note:</strong> If you don&apos;t have a proof of address right now, you can skip and submit below. Your standard trading account will be verified directly.
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting KYC Dossier...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Complete KYC</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SUBMISSION SUCCESS SCREEN */}
        {currentStep === 5 && (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0c1222]/90 border border-emerald-500/30 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">KYC Submitted Successfully!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your KYC dossier has been received by the Ekonnet Compliance Desk. Your verification status will update upon automated compliance review.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 space-y-2 text-left font-mono text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Account ID:</span>
                <span className="text-slate-900 dark:text-white font-bold">{userId}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Document:</span>
                <span className="text-orange-500 font-bold uppercase">{documentType}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Verification Status:</span>
                <span className="text-amber-500 font-bold">Under Review</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 transition"
              >
                <span>Go to User Account Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}

export default function KYCVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b14] text-xs font-mono text-slate-400">
        Loading Ekonnet KYC Verification Portal...
      </div>
    }>
      <KYCVerifyContent />
    </Suspense>
  );
}
