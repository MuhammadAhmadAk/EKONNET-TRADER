"use client";

import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import LiveTicker from "@/components/landing/LiveTicker";
import HeroSection from "@/components/landing/HeroSection";
import TradingPillars from "@/components/landing/TradingPillars";
import PaymentRailSection from "@/components/landing/PaymentRailSection";
import PricingPackages from "@/components/landing/PricingPackages";
import BigFeatureAdvertisements from "@/components/landing/BigFeatureAdvertisements";
import SovereignEcosystemShowcase from "@/components/landing/SovereignEcosystemShowcase";
import InteractiveTradingTerminal from "@/components/landing/InteractiveTradingTerminal";
import Footer from "@/components/landing/Footer";
import UserLoginModal from "@/components/auth/UserLoginModal";
import UserRegisterModal from "@/components/auth/UserRegisterModal";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  const handleRegisterSuccess = (newUser: any) => {
    setActiveNotification(`Welcome to Ekonnet, ${newUser.fullName}! Your User ID is ${newUser.id}. Please complete photo note verification.`);
    setTimeout(() => setActiveNotification(""), 6000);
  };

  const handleLoginSuccess = () => {
    setActiveNotification("Authentication successful. Welcome to your Ekonnet Trader workspace.");
    setTimeout(() => setActiveNotification(""), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {isPageLoading && <LoadingScreen />}
      
      {/* Toast Notification */}
      {activeNotification && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-slate-900/90 dark:bg-[#080c16]/90 backdrop-blur-xl border border-emerald-500/40 text-emerald-300 text-xs shadow-2xl flex items-center space-x-3 glow-blue">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Main High-Tech Navbar */}
      <Navbar 
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Real-time Rolling Ticker (5 Base Pairs) */}
      <LiveTicker />

      {/* Main Landing Sections */}
      <main className="flex-grow">
        <HeroSection 
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
        
        <TradingPillars />
        
        <PaymentRailSection />
        
        <PricingPackages 
          onSelectPackage={() => setIsRegisterOpen(true)}
        />
        
        <BigFeatureAdvertisements 
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        {/* 5-PLATFORM SOVEREIGN ECOSYSTEM MASTER ADVERTISEMENT BILLBOARD */}
        <SovereignEcosystemShowcase 
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
        
        <InteractiveTradingTerminal 
          onOpenRegister={() => setIsRegisterOpen(true)} 
        />
      </main>

      {/* Global Informational & Legal Footer */}
      <Footer />

      {/* User Login & Registration Modals */}
      <UserLoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <UserRegisterModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegisterSuccess}
      />

    </div>
  );
}
