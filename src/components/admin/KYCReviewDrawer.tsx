"use client";

import React, { useState } from "react";
import { User } from "@/lib/types";
import { 
  X, 
  Check, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone,
  ZoomIn
} from "lucide-react";

interface KYCReviewDrawerProps {
  user: User | null;
  onClose: () => void;
  onUpdateStatus: (userId: string, newStatus: "approved" | "rejected") => void;
}

export default function KYCReviewDrawer({ user, onClose, onUpdateStatus }: KYCReviewDrawerProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#111827] border border-[#1F293D] p-7 shadow-2xl glow-blue space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SECTION 27 & 30 COMPLIANT: IDENTITY & PHOTO VERIFICATION</span>
          </div>
          <h3 className="text-xl font-black text-white">KYC Dossier: {user.fullName}</h3>
          <div className="text-xs text-gray-400 font-mono">
            User ID: <span className="text-emerald-400 font-bold">{user.id}</span> | Username: @{user.username}
          </div>
        </div>

        {/* Document Inspection Card */}
        <div className="p-4 rounded-2xl bg-[#0B0F19] border border-gray-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-200">Mandatory Selfie with Handwritten Note:</span>
            <span className="text-[10px] text-gray-500 font-mono">Resolution: 1920x1080</span>
          </div>

          {user.kycDocumentUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-800 group">
              <img 
                src={user.kycDocumentUrl} 
                alt="KYC ID and Handwritten Note" 
                className="w-full h-52 object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white text-xs font-bold">
                <ZoomIn className="w-4 h-4" />
                <span>High-Resolution Inspection</span>
              </div>
            </div>
          ) : (
            <div className="h-40 rounded-xl bg-gray-900 border border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 text-xs space-y-1">
              <span>No document uploaded by user</span>
              <span className="text-[10px]">Awaiting initial photo upload</span>
            </div>
          )}

          {/* Validation Checklist as mandated in Section 27 */}
          <div className="p-3 bg-[#111827] rounded-xl space-y-1.5 text-xs text-gray-300 font-mono">
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Face and facial features clearly visible without glare</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Driver License / Passport text match registered name</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Handwritten note confirms: &quot;{user.fullName}, Ekonnet, {user.createdAt.split('T')[0]}&quot;</span>
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#0B0F19] rounded-xl border border-gray-800">
            <span className="text-gray-500 block text-[10px]">Verified Age:</span>
            <span className="text-white font-bold">{user.age} Years (Born {user.dateOfBirth})</span>
          </div>
          <div className="p-3 bg-[#0B0F19] rounded-xl border border-gray-800">
            <span className="text-gray-500 block text-[10px]">Location:</span>
            <span className="text-white font-bold">{user.city}, {user.country}</span>
          </div>
          <div className="p-3 bg-[#0B0F19] rounded-xl border border-gray-800">
            <span className="text-gray-500 block text-[10px]">Primary Email:</span>
            <span className="text-white font-bold">{user.emails[0]}</span>
          </div>
          <div className="p-3 bg-[#0B0F19] rounded-xl border border-gray-800">
            <span className="text-gray-500 block text-[10px]">Phone:</span>
            <span className="text-white font-bold">{user.phones[0]}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-gray-800 flex items-center justify-between space-x-3">
          <button
            onClick={() => {
              onUpdateStatus(user.id, "rejected");
              onClose();
            }}
            className="w-1/2 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject KYC Submission</span>
          </button>

          <button
            onClick={() => {
              onUpdateStatus(user.id, "approved");
              onClose();
            }}
            className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Approve & Verify Account</span>
          </button>
        </div>

      </div>
    </div>
  );
}
