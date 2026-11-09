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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(10);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"video" | "guide">("video");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(Math.floor(videoRef.current.currentTime));
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(Math.floor(videoRef.current.duration));
      }
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Replay from beginning
  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Scrubber Seek
  const handleSeek = (newSeconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = newSeconds;
    setCurrentTime(newSeconds);
  };

  // When changing lesson, jump to relevant segment
  const handleSelectLesson = (lesson: TutorialLesson, idx: number) => {
    setSelectedLesson(lesson);
    if (videoRef.current) {
      const timestamps = [0, 3, 6, 8];
      const targetTime = timestamps[idx % timestamps.length] || 0;
      videoRef.current.currentTime = targetTime;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setCurrentTime(targetTime);
    }
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
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 group transition-colors">
              
              {/* Institutional Video Container */}
              <div className="relative w-full aspect-video bg-black flex flex-col justify-between overflow-hidden group/vid">
                
                {/* HTML5 Video Element playing the generated 10s video */}
                <video
                  ref={videoRef}
                  src="/videos/trading-intro.mp4"
                  playsInline
                  autoPlay
                  loop
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Top Overlay Badge Bar */}
                <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="px-2.5 py-1 rounded-md bg-black/70 border border-white/10 text-[11px] font-mono text-emerald-400 font-bold backdrop-blur-md shadow-xs">
                      HD 720P • {selectedLesson.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-mono bg-black/70 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-md shadow-xs">
                    MATCHING ENGINE DEMO • 10 SEC
                  </span>
                </div>

                {/* Center Play Indicator when paused */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 z-20 m-auto w-16 h-16 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white backdrop-blur-md shadow-2xl hover:scale-105 transition"
                  >
                    <Play className="w-8 h-8 text-emerald-400 ml-1" />
                  </button>
                )}

                {/* Bottom Video Controls Bar */}
                <div className="relative z-10 m-3 sm:m-4 bg-black/80 backdrop-blur-xl border border-white/15 rounded-2xl p-3 sm:p-4 space-y-2 shadow-2xl">
                  
                  {/* Progress Bar / Scrubber */}
                  <div 
                    className="relative w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer group/bar"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newPct = clickX / rect.width;
                      handleSeek(Math.floor(newPct * duration));
                    }}
                  >
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 via-rose-500 to-emerald-400 rounded-full transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Playback Controls & Timestamp */}
                  <div className="flex items-center justify-between text-xs text-white pt-1">
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause Button */}
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="p-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 transition cursor-pointer"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      {/* Replay Button */}
                      <button
                        type="button"
                        onClick={handleReplay}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Replay from start"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      {/* Time Counter Highlighted (00:04 / 00:10) */}
                      <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10 shadow-inner">
                        <span className="text-emerald-400 font-bold">{formatSeconds(currentTime)}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-300">{formatSeconds(duration)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Mute/Unmute */}
                      <button 
                        type="button"
                        onClick={toggleMute}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-200" />}
                      </button>

                      {/* Fullscreen */}
                      <button 
                        type="button"
                        onClick={() => {
                          if (videoRef.current) {
                            if (videoRef.current.requestFullscreen) {
                              videoRef.current.requestFullscreen();
                            }
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Fullscreen"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Accompanying Lesson Written Instructions */}
            <div className="rounded-2xl p-6 sm:p-8 bg-white/95 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-6">
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
            <div className="rounded-2xl p-6 bg-white/95 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-4">
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
                      onClick={() => handleSelectLesson(lesson, idx)}
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
