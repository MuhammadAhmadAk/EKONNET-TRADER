"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Paperclip, 
  Star, 
  ShieldCheck, 
  Smile, 
  Check, 
  AlertTriangle,
  User,
  Headphones
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  senderName: string;
  text: string;
  timestamp: string;
  fileAttachment?: string;
}

const PROFANITY_WORDS = ["scam", "fraud", "idiot", "stupid", "bastard", "bitch", "fuck", "shit"];

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "agent",
      senderName: "Ekonnet Support (Sarah)",
      text: "Hello! Welcome to Ekonnet Trades & Payments Desk. How can our compliance or trade team assist you today?",
      timestamp: "Just now"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingScore, setRatingScore] = useState<number>(10);
  const [ratingFeedback, setRatingFeedback] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Automated Profanity Filter (Section 49)
    let cleanedText = inputText;
    PROFANITY_WORDS.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      cleanedText = cleanedText.replace(regex, "***");
    });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      senderName: "You",
      text: cleanedText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Automated intelligent bot / agent reply
    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "agent",
        senderName: "Ekonnet Support (Sarah)",
        text: "Thank you for reaching out. Your request is being reviewed under Ekonnet Institutional Protocols. An agent will verify your account status shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 1200);
  };

  const handleRatingSubmit = () => {
    setRatingSubmitted(true);
    setTimeout(() => {
      setShowRatingModal(false);
      setRatingSubmitted(false);
      setIsOpen(false);
    }, 1800);
  };

  return (
    <>
      {/* Floating Circular Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-2xl shadow-orange-500/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2.5 group"
          aria-label="Open 24/7 Live Support Chat"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-[#070b14] animate-pulse" />
          </div>
          <span className="hidden sm:inline font-bold text-xs tracking-wide pr-1">
            24/7 Live Support
          </span>
        </button>
      )}

      {/* Floating Chat Drawer Box */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 rounded-3xl bg-white dark:bg-[#0c1222] border border-slate-200/90 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden max-h-[580px] h-[520px] transition-all animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-transparent border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs shadow">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white dark:border-[#0c1222]" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Ekonnet Support Desk</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  ● Agent Online • TLS 1.3
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowRatingModal(true)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                title="End Chat & Rate Staff"
              >
                End & Rate
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50 dark:bg-black/20">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <span className="text-[9px] text-slate-400 font-mono mb-1 px-1">
                  {msg.senderName} • {msg.timestamp}
                </span>
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-tr-none shadow-md shadow-orange-500/20"
                      : "bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-[#0c1222] border-t border-slate-200/80 dark:border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white disabled:opacity-40 transition shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Rating Modal Prompt (Section 34) */}
          {showRatingModal && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-30 p-6 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500">
                <Star className="w-6 h-6 fill-orange-500 text-orange-500" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Rate Support Service</h4>
                <p className="text-xs text-slate-400">
                  Section 34 Quality Assurance: Rate your staff member (0 to 10 points).
                </p>
              </div>

              {ratingSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono">
                  ✓ Thank you! Your feedback has been logged to Management.
                </div>
              ) : (
                <>
                  {/* Rating Selector */}
                  <div className="flex items-center gap-1.5 justify-center flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRatingScore(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition ${
                          ratingScore === num
                            ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-110"
                            : "bg-white/5 hover:bg-white/10 text-slate-400"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={ratingFeedback}
                    onChange={(e) => setRatingFeedback(e.target.value)}
                    placeholder="Optional feedback for Ekonnet Management..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-2 text-xs text-white placeholder:text-slate-500 focus:outline-none resize-none"
                  />

                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => setShowRatingModal(false)}
                      className="w-1/2 py-2 rounded-xl bg-white/5 text-slate-400 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRatingSubmit}
                      className="w-1/2 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-bold shadow"
                    >
                      Submit Rating
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      )}
    </>
  );
}
