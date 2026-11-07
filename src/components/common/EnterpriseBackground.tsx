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

    // Multi-harmonic liquidity stream waves (Fintech / Direct P2P / Multi-Asset)
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
        const baseHeight = height * (0.32 + i * 0.095);
        const amplitude = 34 + i * 14;
        const wavelength = 0.0016 - i * 0.00018;
        const phase = step + (i * Math.PI) / 3.2;

        ctx.moveTo(0, baseHeight + Math.sin(phase) * amplitude);

        for (let x = 0; x <= width; x += 6) {
          const y =
            baseHeight +
            Math.sin(x * wavelength + phase) * amplitude +
            Math.cos(x * 0.0008 - phase * 0.55) * 16;
          ctx.lineTo(x, y);
        }

        // Palette tailored for Ekonnet Fintech: Vibrant Orange/Rose/Cyan
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        if (isDark) {
          gradient.addColorStop(0, `rgba(249, 115, 22, 0)`);
          gradient.addColorStop(0.25, `rgba(244, 63, 94, ${0.16 + i * 0.035})`);
          gradient.addColorStop(0.55, `rgba(99, 102, 241, ${0.18 + i * 0.035})`);
          gradient.addColorStop(0.85, `rgba(6, 182, 212, ${0.14 + i * 0.03})`);
          gradient.addColorStop(1, `rgba(6, 182, 212, 0)`);
        } else {
          // Warm vibrant palette for light mode (Browzzit aesthetic)
          gradient.addColorStop(0, `rgba(249, 115, 22, 0)`);
          gradient.addColorStop(0.25, `rgba(249, 115, 22, ${0.12 + i * 0.025})`);
          gradient.addColorStop(0.55, `rgba(244, 63, 94, ${0.11 + i * 0.025})`);
          gradient.addColorStop(0.85, `rgba(59, 130, 246, ${0.08 + i * 0.02})`);
          gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.3 + (i % 2) * 0.6;
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
      {/* 1. Base Canvas Background (Light: #FAFAFC, Dark: #070A14) */}
      <div className="absolute inset-0 bg-[#FAFAFC] dark:bg-[#070A14] transition-colors duration-500" />

      {/* 2. Top-Right Ambient Warm Spotlight Bloom (Browzzit Warm 3D Glow) */}
      <div
        className="absolute -top-32 right-[-10%] sm:right-[5%] w-[600px] sm:w-[900px] h-[550px] rounded-full blur-[120px] sm:blur-[160px] opacity-40 dark:opacity-30 pointer-events-none transition-all duration-700"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(249,115,22,0.30) 0%, rgba(244,63,94,0.22) 40%, rgba(99,102,241,0.12) 75%, transparent 100%)",
        }}
      />

      {/* 3. Top-Left Ambient Diffuser */}
      <div
        className="absolute -top-40 -left-32 w-[650px] h-[550px] rounded-full blur-[140px] opacity-25 dark:opacity-20 pointer-events-none transition-all duration-700"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% 30%, rgba(59,130,246,0.25) 0%, rgba(6,182,212,0.15) 50%, transparent 100%)",
        }}
      />

      {/* 4. Precision Architectural Engineering Grid */}
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.20]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          color: "rgba(100, 116, 139, 0.20)",
          maskImage: "radial-gradient(ellipse 80% 65% at 50% 20%, black 25%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 65% at 50% 20%, black 25%, transparent 90%)",
        }}
      />

      {/* 5. Smooth Flowing Liquidity Waves Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-90 dark:opacity-100"
      />

      {/* 6. Ambient Floating Fintech Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Top-Right Ambient Crypto Node */}
        <div 
          className="absolute top-[18%] right-[8%] sm:right-[14%] animate-float-slow text-orange-500/80 dark:text-orange-400/60 drop-shadow-[0_0_15px_rgba(249,115,22,0.35)]"
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
          className="absolute top-[52%] right-[5%] sm:right-[9%] animate-float-slow text-rose-500/80 dark:text-rose-400/50 drop-shadow-[0_0_15px_rgba(244,63,94,0.35)]"
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
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/40 dark:via-cyan-400/35 to-transparent" />

      {/* 8. Organic Matte Film Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.020] dark:opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
