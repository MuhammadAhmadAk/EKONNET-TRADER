"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Sliders,
  TrendingUp,
  ShieldCheck,
  Layers,
  Zap,
  HelpCircle,
  Video,
  MonitorPlay
} from "lucide-react";

interface TutorialLesson {
  id: string;
  title: string;
  duration: string;
  category: "Bitfinex Trading" | "Bitpanda Multi-Asset" | "CMC Risk Management" | "P2P Settlement";
  summary: string;
  videoHeading: string;
  keyTakeaways: string[];
  steps: { title: string; desc: string }[];
}

const LESSONS: TutorialLesson[] = [
  {
    id: "bitfinex-orders",
    title: "How to Execute Advanced Order Types (Limit, Trailing Stop, Scaled)",
    duration: "1:05",
    category: "Bitfinex Trading",
    summary: "Learn how to use institutional order techniques including Scaled accumulation, OCO (One-Cancels-Other), and Trailing Stops to enter and exit markets without watching the screen 24/7.",
    videoHeading: "Bitfinex-Grade Order Routing & Algorithmic Scaled Orders",
    keyTakeaways: [
      "Avoid market slippage by utilizing Limit & Post-Only orders.",
      "Use Trailing Stops to lock in profits automatically as prices rally.",
      "Deploy Scaled orders to break $50,000+ orders into automated graduated ladder bids."
    ],
    steps: [
      { title: "Select Order Technique", desc: "Open the Order Form dropdown and choose between Limit, Stop-Limit, Trailing Stop, or Scaled." },
      { title: "Configure Execution Triggers", desc: "Set your Stop Trigger Price and Target Limit Price. For Scaled orders, define your price range and number of tranches." },
      { title: "Submit & Real-time Matching", desc: "Click Execute Buy/Sell. Your order is instantly dispatched to the ultra-low latency WebSocket matching engine." }
    ]
  },
  {
    id: "cmc-gslo",
    title: "Mastering Risk with Guaranteed Stop-Loss & Sentiment Analysis",
    duration: "1:15",
    category: "CMC Risk Management",
    summary: "Protect your capital during extreme volatility spikes with Guaranteed Stop-Loss Orders (GSLO) and gauge crowd psychology using live Client Sentiment indicators.",
    videoHeading: "CMC Markets-Style GSLO Slippage Immunity & Sentiment Matrix",
    keyTakeaways: [
      "Zero slippage guarantee even across weekend gaps or macroeconomic news releases.",
      "100% premium refund if your guaranteed stop-loss is not triggered.",
      "Live buy vs sell client sentiment percentages across 10,000+ active traders."
    ],
    steps: [
      { title: "Enable GSLO Protection", desc: "Tick the 'Guaranteed Stop' checkbox on your order form when trading high-beta assets." },
      { title: "Review Sentiment Heatmap", desc: "Check whether top-tier institutional accounts are net Long or Short before entering your trade." },
      { title: "Lock Position with Immunity", desc: "Execute position. If market gaps through your level, your exit is honored at the exact agreed strike price." }
    ]
  },
  {
    id: "bitpanda-assets",
    title: "One-Wallet Fractional Equities, Crypto & Precious Metals",
    duration: "0:58",
    category: "Bitpanda Multi-Asset",
    summary: "Hold Bitcoin, Euro, Physical Gold, and Apple stock in a single unified collateral balance without transferring funds between separate accounts.",
    videoHeading: "Bitpanda-Style Single Collateral Multi-Asset Ecosystem",
    keyTakeaways: [
      "No need for 3 separate brokers for Crypto, Forex, and Wall Street stocks.",
      "Invest fractionally starting from just $10 in high-value shares.",
      "Physical gold and silver backed by audited vault reserves."
    ],
    steps: [
      { title: "Deposit via Any of 14 Rails", desc: "Fund your account instantly using Card, Wire, SEPA, Wise, or Crypto." },
      { title: "Select Cross-Asset Pair", desc: "Choose your target market: BTC, SOL, EUR/USD, Gold, or S&P 500." },
      { title: "Instant Zero-Spread Swap", desc: "Execute swap directly from your central liquidity balance with instant settlement." }
    ]
  },
  {
    id: "p2p-settlement",
    title: "Direct Peer-to-Peer Trading with Instant Local Payment Rails",
    duration: "1:20",
    category: "P2P Settlement",
    summary: "Exchange local fiat currency for digital assets directly with verified peers using 14 global and local payment processors with zero platform dispute delays.",
    videoHeading: "Non-Custodial Direct Peer Settlement Protocol",
    keyTakeaways: [
      "Direct buyer-seller smart settlement without middleman holding.",
      "Support for Wise, Bank Transfer, Neteller, Skrill, Revolut, and Cash-in-Person.",
      "Reputation score badges ensuring safe transaction partners."
    ],
    steps: [
      { title: "Browse P2P Order Book", desc: "Filter offers by preferred currency, payment method, and trader rating." },
      { title: "Initiate Direct Settlement", desc: "Enter trade volume and receive buyer bank/account payment details." },
      { title: "One-Click Release", desc: "Once fiat transfer is verified in your bank app, release assets with instant on-chain finality." }
    ]
  }
];

interface TutorialVideoShowcaseProps {
  onOpenRegister?: () => void;
}

export default function TutorialVideoShowcase({ onOpenRegister }: TutorialVideoShowcaseProps = {}) {
  const [selectedLesson, setSelectedLesson] = useState<TutorialLesson>(LESSONS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(54); // default 0:54 like in Bitfinex 2 screenshot!
  const [duration, setDuration] = useState<number>(65); // 1:05
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"video" | "guide">("video");

  // Timer loop for simulated video player playback
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // When changing lesson, reset time to beginning
  const handleSelectLesson = (lesson: TutorialLesson) => {
    setSelectedLesson(lesson);
    const parts = lesson.duration.split(":");
    const totalSecs = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    setDuration(totalSecs);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  return (
    <section id="tutorials-academy" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-slate-200/80 dark:border-white/5 overflow-hidden transition-colors">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-blue-500/10 dark:bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[300px] bg-emerald-500/10 dark:bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* =====================================================================
            HEADER BADGE & TITLE (BITFINEX 2 STYLE EDUCATION SPOTLIGHT)
        ===================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider shadow-sm">
            <MonitorPlay className="w-4 h-4 text-emerald-500 dark:text-emerald-400 animate-pulse" />
            <span>Interactive Video Academy • Battle Tested Since 2012 Style</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Learn How to Master Every Tool. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-400">
              Interactive Video Tutorials & Guides
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Just like Bitfinex, Bitpanda, and CMC Markets, we provide clear video lessons and detailed written instructions so you can confidently exploit advanced order types, hedging protocols, and multi-asset liquidity.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/tutorials"
              className="px-5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-2 transition"
            >
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Browse Full Documentation & Academy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* =====================================================================
            MAIN INTERACTIVE VIDEO PLAYER CONTAINER (BITFINEX 2 SCREENSHOT EXACT REPLICATION)
        ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Video Player Screen (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 dark:border-slate-800 shadow-xl dark:shadow-2xl group">
              
              {/* Simulated Video Canvas / Live Demonstration Screen */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-slate-950 via-[#0B101E] to-slate-900 flex flex-col justify-between p-6 overflow-hidden">
                
                {/* Background Tech Grid & Watermark */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800 font-mono text-7xl font-black select-none pointer-events-none opacity-20">
                  EKONNET TRADER
                </div>

                {/* Top Video Overlay Bar */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] font-mono text-emerald-400 font-bold backdrop-blur-md">
                      HD 1080P • {selectedLesson.category}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono bg-black/40 px-3 py-1 rounded-lg border border-white/5 backdrop-blur-md">
                    BATTLE TESTED TRADING PROTOCOL
                  </span>
                </div>

                {/* Interactive Dynamic Center Graphic: Simulating Real Platform Action */}
                <div className="relative z-10 my-auto text-center space-y-4 max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                    {isPlaying ? (
                      <Sliders className="w-8 h-8 text-cyan-400 animate-spin-slow" />
                    ) : (
                      <Play className="w-8 h-8 text-emerald-400 ml-1" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                      Interactive Tutorial Lesson
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {selectedLesson.videoHeading}
                    </h4>
                  </div>
                  
                  {/* Dynamic Simulation Ticker Display */}
                  <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-slate-300">
                    <span>Order Engine: <strong className="text-emerald-400">ACTIVE</strong></span>
                    <span>•</span>
                    <span>Simulated Fill: <strong className="text-blue-400">100%</strong></span>
                    <span>•</span>
                    <span>Latency: <strong className="text-purple-400">4.2ms</strong></span>
                  </div>
                </div>

                {/* Bottom Video Controls Bar (Matches Bitfinex Screenshot 2 with Scrubber 0:54 / 1:05) */}
                <div className="relative z-10 bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 space-y-2">
                  
                  {/* Progress Bar / Scrubber */}
                  <div 
                    className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer group/bar"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newPct = clickX / rect.width;
                      setCurrentTime(Math.floor(newPct * duration));
                    }}
                  >
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Playback Controls & Timestamp */}
                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause Button */}
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition cursor-pointer"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      {/* Replay Button */}
                      <button
                        onClick={() => { setCurrentTime(0); setIsPlaying(true); }}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Replay from start"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {/* Time Counter Highlighted like Bitfinex 2 Circle (0:54 / 1:05) */}
                      <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs text-white bg-slate-900/90 px-3 py-1 rounded-lg border border-emerald-500/30 shadow-inner">
                        <span className="text-emerald-400 font-bold">{formatSeconds(currentTime)}</span>
                        <span className="text-slate-500">/</span>
                        <span className="text-slate-400">{formatSeconds(duration)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Mute/Unmute */}
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
                      </button>

                      {/* Fullscreen */}
                      <button 
                        onClick={() => alert("Video is playing in optimized responsive container.")}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Accompanying Lesson Written Instructions */}
            <div className="rounded-2xl p-6 sm:p-8 bg-white/95 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-md dark:shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Step-by-Step Written Guide</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{selectedLesson.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-mono font-medium">
                  {selectedLesson.category}
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedLesson.summary}
              </p>

              {/* 3 Action Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedLesson.steps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Key Takeaways & Trader Benefits */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
                  Trader Benefits Obtained:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedLesson.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right: Lesson Selector & Academy Chapters (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl p-6 bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-md dark:shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Course Curriculum</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">4 Lessons</span>
              </div>

              <div className="space-y-3">
                {LESSONS.map((lesson, idx) => {
                  const isSelected = selectedLesson.id === lesson.id;
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 space-y-2 ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/50 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-950/50 border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-950/80"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[10px] text-slate-500 uppercase">Lesson 0{idx + 1}</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                          {lesson.duration}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold transition ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {lesson.summary}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Call to action card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-yellow-400" />
                  <span>Need Custom Trading Mentorship?</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                  Our institutional trade desk provides 1-on-1 strategy breakdowns for scaled orders and cross-asset liquidity.
                </p>
                <Link
                  href="/tutorials"
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center block transition shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Open Comprehensive Academy
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
