"use client";

import React, { useEffect, useRef } from "react";
import { 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  Coins, 
  CreditCard, 
  Globe2, 
  Layers, 
  Zap,
  ArrowUpRight
} from "lucide-react";

export default function EnterpriseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let isDark = document.documentElement.classList.contains("dark");

    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Multi-harmonic liquidity stream waves (Fintech / P2P Escrow / Multi-Asset)
    let step = 0;
    const waveCount = 5;

    const render = () => {
      if (!ctx || document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      step += 0.0065;

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        const baseHeight = height * (0.33 + i * 0.095);
        const amplitude = 35 + i * 15;
        const wavelength = 0.0017 - i * 0.00018;
        const phase = step + (i * Math.PI) / 3.3;

        ctx.moveTo(0, baseHeight + Math.sin(phase) * amplitude);

        for (let x = 0; x <= width; x += 6) {
          const y =
            baseHeight +
            Math.sin(x * wavelength + phase) * amplitude +
            Math.cos(x * 0.0008 - phase * 0.55) * 16;
          ctx.lineTo(x, y);
        }

        // Palette tailored for Ekonnet Fintech: Cyan / Royal Blue / Indigo / Emerald
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        if (isDark) {
          gradient.addColorStop(0, `rgba(6, 182, 212, 0)`);
          gradient.addColorStop(0.2, `rgba(56, 189, 248, ${0.16 + i * 0.035})`);
          gradient.addColorStop(0.5, `rgba(99, 102, 241, ${0.20 + i * 0.035})`);
          gradient.addColorStop(0.8, `rgba(16, 185, 129, ${0.14 + i * 0.03})`);
          gradient.addColorStop(1, `rgba(16, 185, 129, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(2, 132, 199, 0)`);
          gradient.addColorStop(0.2, `rgba(14, 165, 233, ${0.08 + i * 0.02})`);
          gradient.addColorStop(0.5, `rgba(79, 70, 229, ${0.10 + i * 0.02})`);
          gradient.addColorStop(0.8, `rgba(5, 150, 105, ${0.07 + i * 0.02})`);
          gradient.addColorStop(1, `rgba(5, 150, 105, 0)`);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2 + (i % 2) * 0.5;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none transition-colors duration-500"
    >
      {/* 1. Base Canvas Background (Light: #F8FAFC, Dark: #070A14) */}
      <div className="absolute inset-0 bg-[#F8FAFC] dark:bg-[#070A14] transition-colors duration-500" />

      {/* 2. Top-Center Ambient Aurora Spotlight Bloom */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1300px] h-[550px] rounded-full blur-[130px] sm:blur-[160px] opacity-45 dark:opacity-35 pointer-events-none transition-all duration-700"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 30%, var(--theme-color-glow, rgba(37,99,235,0.35)) 0%, rgba(99,102,241,0.2) 45%, rgba(16,185,129,0.12) 75%, transparent 100%)",
        }}
      />

      {/* 3. Corner Ambient Diffusers (Cyan & Indigo) */}
      <div className="absolute top-1/4 -right-48 w-[480px] h-[480px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/8 blur-[130px] pointer-events-none" />
      <div className="absolute top-2/3 -left-48 w-[520px] h-[520px] rounded-full bg-blue-500/10 dark:bg-blue-500/8 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 dark:bg-emerald-500/6 blur-[150px] pointer-events-none" />

      {/* 4. Precision Architectural Engineering Grid with Smooth Vignette Mask */}
      <div
        className="absolute inset-0 opacity-[0.38] dark:opacity-[0.22]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          color: "rgba(100, 116, 139, 0.22)",
          maskImage: "radial-gradient(ellipse 75% 60% at 50% 20%, black 25%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 20%, black 25%, transparent 85%)",
        }}
      />

      {/* 5. Smooth Flowing Liquidity Waves Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90 dark:opacity-100"
      />

      {/* 6. Ambient Floating Fintech Icons (Multi-Asset Trading, Escrow & Payment Rail Glyphs) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Top-Right Ambient Crypto Node */}
        <div 
          className="absolute top-[18%] right-[8%] sm:right-[14%] animate-float-slow text-blue-500/80 dark:text-cyan-400/60 drop-shadow-[0_0_15px_rgba(56,189,248,0.35)]"
        >
          <Coins className="w-6 h-6" />
        </div>

        {/* Top-Left Ambient Trading Trend Glyphs */}
        <div 
          className="absolute top-[28%] left-[6%] sm:left-[10%] animate-float-reverse text-emerald-500/80 dark:text-emerald-400/50 drop-shadow-[0_0_15px_rgba(16,185,129,0.35)]"
        >
          <TrendingUp className="w-5 h-5" />
        </div>

        {/* Mid-Right Payment Rail Ambient Card */}
        <div 
          className="absolute top-[52%] right-[5%] sm:right-[9%] animate-float-slow text-indigo-500/80 dark:text-indigo-400/50 drop-shadow-[0_0_15px_rgba(99,102,241,0.35)]"
        >
          <CreditCard className="w-5 h-5" />
        </div>

        {/* Mid-Left Zero-Trust Security Shield */}
        <div 
          className="absolute top-[68%] left-[7%] sm:left-[12%] animate-float-reverse text-blue-500/80 dark:text-blue-400/50 drop-shadow-[0_0_15px_rgba(59,130,246,0.35)]"
        >
          <ShieldCheck className="w-5 h-5" />
        </div>

        {/* Bottom-Right Global Network Globe */}
        <div 
          className="absolute top-[82%] right-[12%] sm:right-[18%] p-3 rounded-2xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-white/10 shadow-xl shadow-purple-500/5 animate-float-slow text-purple-500 dark:text-purple-400 opacity-45 dark:opacity-25"
        >
          <Globe2 className="w-5 h-5" />
        </div>

      </div>

      {/* 7. Top Horizon Razor Light Beam */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 dark:via-cyan-400/35 to-transparent" />

      {/* 8. Organic Matte Film Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.022] dark:opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
