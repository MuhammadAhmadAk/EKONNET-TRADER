"use client";

import React, { useState } from "react";
import { User, InternalStaffNote } from "@/lib/types";
import { 
  Lock, 
  Unlock, 
  FileCheck, 
  FileX, 
  Eye, 
  FileText, 
  ShieldAlert, 
  CheckCircle,
  Plus
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface UserManagementTableProps {
  users: User[];
  onToggleLock: (userId: string) => void;
  onOpenKYC: (user: User) => void;
  searchFilter: string;
}

export default function UserManagementTable({ users, onToggleLock, onOpenKYC, searchFilter }: UserManagementTableProps) {
  const [selectedUserForNote, setSelectedUserForNote] = useState<User | null>(null);
  const [staffNoteInput, setStaffNoteInput] = useState("");
  const [notesList, setNotesList] = useState<InternalStaffNote[]>([
    {
      id: "NOTE-1",
      targetUserId: "EKON-739102",
      staffId: "STAFF-101",
      staffName: "Sarah Jenkins",
      noteText: "Examined passport and handwritten note. Note text matches date format. Pending secondary signature check.",
      actionTaken: "KYC Review Ongoing",
      createdAt: "2026-10-27 11:50 AM",
    }
  ]);

  const filteredUsers = users.filter(u => 
    u.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.username.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.country.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffNoteInput || !selectedUserForNote) return;

    const newNote: InternalStaffNote = {
      id: `NOTE-${Date.now()}`,
      targetUserId: selectedUserForNote.id,
      staffId: "EKON-ROOT",
      staffName: "Master Admin",
      noteText: staffNoteInput,
      actionTaken: "Admin File Inspection",
      createdAt: new Date().toLocaleString(),
    };

    setNotesList([newNote, ...notesList]);
    setStaffNoteInput("");
  };

  return (
    <div className="space-y-6">
      
      {/* Table Card */}
      <div className="rounded-3xl bg-[#111827] border border-[#1F293D] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1F293D] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Registered Users Directory</h3>
            <p className="text-xs text-gray-400">Total accounts matching filter: {filteredUsers.length}</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Section 27.[3] & 30
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0B0F19] border-b border-[#1F293D] text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-5">User ID & Profile</th>
                <th className="py-4 px-4">Contact & Location</th>
                <th className="py-4 px-3">Age (18+)</th>
                <th className="py-4 px-3">KYC Status</th>
                <th className="py-4 px-4">Wallet Holdings</th>
                <th className="py-4 px-3">Account State</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#161F33]/60 transition-colors">
                  
                  {/* ID & Profile */}
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold font-mono text-blue-400 text-xs">
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-white">{user.fullName}</div>
                        <div className="text-[11px] font-mono text-blue-400 font-semibold">
                          @{user.username} <span className="text-gray-500">({user.id})</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-4 px-4">
                    <div className="text-gray-200">{user.emails[0]}</div>
                    <div className="text-[11px] text-gray-400">{user.city}, {user.country}</div>
                  </td>

                  {/* Age */}
                  <td className="py-4 px-3 font-mono font-bold text-gray-200">
                    {user.age} Yrs
                  </td>

                  {/* KYC Status */}
                  <td className="py-4 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase border ${
                      user.kycStatus === 'approved' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : user.kycStatus === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {user.kycStatus}
                    </span>
                  </td>

                  {/* Wallet */}
                  <td className="py-4 px-4 font-mono text-xs">
                    <div className="text-white font-bold">{formatCurrency(user.walletBalances.USD, "USD")}</div>
                    <div className="text-[11px] text-gray-400">{user.walletBalances.BTC} BTC</div>
                  </td>

                  {/* State */}
                  <td className="py-4 px-3">
                    {user.isLocked ? (
                      <span className="inline-flex items-center space-x-1 text-rose-400 text-[11px] font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>FROZEN (Sec 25/59)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 text-[11px] font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>ACTIVE</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right space-x-2">
                    
                    {/* KYC Inspector Button */}
                    <button
                      onClick={() => onOpenKYC(user)}
                      className="p-1.5 rounded-lg bg-[#161F33] hover:bg-[#1E2B47] text-blue-400 border border-gray-700 transition-colors"
                      title="Inspect KYC Photo & Note"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Internal Staff Notes Button (Section 46) */}
                    <button
                      onClick={() => setSelectedUserForNote(user)}
                      className="p-1.5 rounded-lg bg-[#161F33] hover:bg-[#1E2B47] text-purple-400 border border-gray-700 transition-colors"
                      title="View & Add Staff Internal Notes (Section 46)"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                    {/* Freeze / Unfreeze Button (Section 59) */}
                    <button
                      onClick={() => onToggleLock(user.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        user.isLocked 
                          ? "bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30"
                          : "bg-gray-800 text-gray-400 border-gray-700 hover:text-white"
                      }`}
                      title={user.isLocked ? "Unfreeze Account" : "Suspend / Freeze Account"}
                    >
                      {user.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Staff Notes Drawer / Section (Section 46) */}
      {selectedUserForNote && (
        <div className="p-6 rounded-3xl bg-[#111827] border-2 border-purple-500/40 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F293D]">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-400 uppercase">
                <FileText className="w-4 h-4" />
                <span>SECTION 46 COMPLIANT: STAFF NOTES & MESSAGE SECTION</span>
              </div>
              <h4 className="text-lg font-bold text-white mt-1">
                Internal Case Notes for @{selectedUserForNote.username} ({selectedUserForNote.id})
              </h4>
              <p className="text-xs text-gray-400">
                Visible exclusively to Staff and Management. The account holder can NOT view these internal logs.
              </p>
            </div>
            <button 
              onClick={() => setSelectedUserForNote(null)}
              className="px-3 py-1.5 rounded-lg bg-gray-800 text-xs font-bold text-gray-300 hover:text-white"
            >
              Close Notes
            </button>
          </div>

          {/* Add note input */}
          <form onSubmit={handleAddNote} className="space-y-3">
            <textarea
              rows={2}
              required
              value={staffNoteInput}
              onChange={(e) => setStaffNoteInput(e.target.value)}
              placeholder="Record inquiry summary, risk investigation, or assistance provided..."
              className="w-full bg-[#0B0F19] border border-[#1F293D] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Append Internal Staff Note</span>
              </button>
            </div>
          </form>

          {/* Existing notes list */}
          <div className="space-y-3 pt-3">
            <span className="text-xs font-bold text-gray-400">Recorded Case History:</span>
            {notesList
              .filter(n => n.targetUserId === selectedUserForNote.id)
              .map(note => (
                <div key={note.id} className="p-3.5 rounded-2xl bg-[#0B0F19] border border-gray-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-gray-400 text-[11px] font-mono">
                    <span className="font-bold text-purple-400">{note.staffName} ({note.staffId})</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <p className="text-gray-200">{note.noteText}</p>
                  <div className="text-[10px] text-gray-500 font-mono">Action Category: {note.actionTaken}</div>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
}
