"use client";

import React, { useState } from "react";
import { MOCK_SUPPORT_TICKETS } from "@/lib/mockData";
import { SupportTicket } from "@/lib/types";
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  UserCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  FileText
} from "lucide-react";

export default function LiveTicketsManager() {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [activeTicket, setActiveTicket] = useState<SupportTicket>(MOCK_SUPPORT_TICKETS[0]);
  const [replyText, setReplyText] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Section 34: Gorelo-Style AI Summarization Trigger
  const handleGenerateAiSummary = (ticketId: string) => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const generated = `AI Executive Summary (FastAPI Engine): User ${activeTicket.userName} opened ticket regarding ${activeTicket.subject}. All timestamps are verified. Immediate resolution recommended by staff within 30 minutes.`;
      
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, aiSummary: generated } : t));
      setActiveTicket(prev => ({ ...prev, aiSummary: generated }));
      setIsGeneratingAi(false);
    }, 800);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;

    // Section 49: Basic vulgarity check
    const vulgarWords = ["spam", "scam", "idiot", "fraud"];
    const hasVulgar = vulgarWords.some(w => replyText.toLowerCase().includes(w));
    if (hasVulgar) {
      alert("SECTION 49 FILTER: Prohibited words detected in message body. Message rejected by Ekonnet NLP scanner.");
      return;
    }

    const newMsg = {
      senderId: "EKON-ROOT",
      senderName: "Master Admin",
      senderRole: "master_admin" as const,
      text: replyText,
      timestamp: "Just now",
    };

    const updated = {
      ...activeTicket,
      messages: [...activeTicket.messages, newMsg],
      updatedAt: "Just now",
    };

    setTickets(prev => prev.map(t => t.id === activeTicket.id ? updated : t));
    setActiveTicket(updated);
    setReplyText("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
      
      {/* Left Column: Tickets Directory */}
      <div className="lg:col-span-5 rounded-3xl bg-[#111827] border border-[#1F293D] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F293D]">
          <div>
            <h3 className="text-sm font-bold text-white">Support Tickets & Inquiries</h3>
            <p className="text-[11px] text-gray-400">Sections 33 & 34 Gorelo Support Engine</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
            {tickets.length} Active
          </span>
        </div>

        <div className="space-y-2.5 overflow-y-auto max-h-[500px]">
          {tickets.map(ticket => {
            const isSelected = activeTicket.id === ticket.id;
            return (
              <div
                key={ticket.id}
                onClick={() => setActiveTicket(ticket)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-[#161F33] border-blue-500/50 shadow-md" 
                    : "bg-[#0B0F19] border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-blue-400">{ticket.ticketNumber}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                    ticket.priority === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-gray-800 text-gray-300'
                  }`}>
                    {ticket.priority} Priority
                  </span>
                </div>

                <div className="text-xs font-bold text-white line-clamp-1">{ticket.subject}</div>
                <div className="text-[11px] text-gray-400 mt-1 flex justify-between">
                  <span>From: {ticket.userName}</span>
                  <span>{ticket.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Conversation & AI Summarizer */}
      <div className="lg:col-span-7 rounded-3xl bg-[#111827] border border-[#1F293D] p-6 flex flex-col justify-between space-y-5">
        
        <div className="space-y-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F293D] gap-3">
            <div>
              <div className="text-xs font-mono text-blue-400 font-bold">{activeTicket.ticketNumber} — {activeTicket.category}</div>
              <h3 className="text-base font-bold text-white mt-0.5">{activeTicket.subject}</h3>
              <div className="text-[11px] text-gray-400">Assigned Staff: {activeTicket.assignedStaffName || "Unassigned"}</div>
            </div>

            {/* AI Summary Button (Gorelo-style, Section 34) */}
            <button
              onClick={() => handleGenerateAiSummary(activeTicket.id)}
              disabled={isGeneratingAi}
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center space-x-1.5 transition-colors shrink-0 disabled:opacity-50"
              title="Summarize thread using Python NLP microservice"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{isGeneratingAi ? "Summarizing..." : "Generate AI Summary"}</span>
            </button>
          </div>

          {/* AI Summary Box */}
          {activeTicket.aiSummary && (
            <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1">
              <div className="flex items-center space-x-2 text-purple-400 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GORELO-STYLE AI THREAD SUMMARY (SECTION 34)</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-[11px]">
                {activeTicket.aiSummary}
              </p>
            </div>
          )}

          {/* Messages Feed */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {activeTicket.messages.map((msg, idx) => {
              const isAdmin = msg.senderRole === "master_admin" || msg.senderRole === "staff";
              return (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-2xl max-w-[85%] space-y-1 text-xs ${
                    isAdmin 
                      ? "ml-auto bg-blue-600/20 border border-blue-500/30 text-white" 
                      : "mr-auto bg-[#0B0F19] border border-gray-800 text-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span className="font-bold text-blue-400">{msg.senderName} ({msg.senderRole})</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Reply Composer */}
        <form onSubmit={handleSendReply} className="pt-3 border-t border-[#1F293D] flex space-x-2">
          <input
            type="text"
            required
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your official administrative reply (protected by Section 49 content scanner)..."
            className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 shrink-0 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

      </div>

    </div>
  );
}
