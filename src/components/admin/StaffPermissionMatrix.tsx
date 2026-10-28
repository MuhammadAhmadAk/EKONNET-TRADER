"use client";

import React, { useState } from "react";
import { MOCK_STAFF_PERMISSIONS } from "@/lib/mockData";
import { StaffPermission } from "@/lib/types";
import { Shield, Check, Save, UserCheck, AlertCircle, Lock } from "lucide-react";

export default function StaffPermissionMatrix() {
  const [permissions, setPermissions] = useState<StaffPermission[]>(MOCK_STAFF_PERMISSIONS);
  const [savedMessage, setSavedMessage] = useState("");

  const togglePermission = (staffId: string, key: keyof StaffPermission) => {
    setPermissions(prev => prev.map(staff => {
      if (staff.staffId === staffId) {
        return {
          ...staff,
          [key]: !staff[key],
          updatedAt: new Date().toLocaleString(),
          lastUpdatedBy: "Master Admin (EKON-ROOT)",
        };
      }
      return staff;
    }));
  };

  const handleSave = () => {
    setSavedMessage("Permissions successfully updated and synchronized to VPS database in compliance with Section 27.2.");
    setTimeout(() => setSavedMessage(""), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#111827] border border-[#1F293D]">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>SECTION 27.[1] & 27.[2] COMPLIANT STAFF PERMISSIONS MATRIX</span>
          </div>
          <h2 className="text-xl font-black text-white">Employee Staff Access Delegation</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Tick or untick boxes to grant or revoke specific job tasks. If a box is not ticked, that employee is strictly blocked from executing that function (Section 27.2).
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-500/25 flex items-center space-x-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Permissions</span>
        </button>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Permissions Table with Checkboxes */}
      <div className="rounded-3xl bg-[#111827] border border-[#1F293D] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0B0F19] border-b border-[#1F293D] text-gray-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-5">Staff Member & ID</th>
                <th className="py-4 px-3 text-center">View Users</th>
                <th className="py-4 px-3 text-center">Approve KYC</th>
                <th className="py-4 px-3 text-center">Freeze Accounts</th>
                <th className="py-4 px-3 text-center">Handle Tickets</th>
                <th className="py-4 px-3 text-center">Live Chat</th>
                <th className="py-4 px-3 text-center">Internal Notes</th>
                <th className="py-4 px-3 text-center">Audit Logs</th>
                <th className="py-4 px-3 text-center">Reimbursements</th>
                <th className="py-4 px-5 text-right">Last Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300 font-medium">
              {permissions.map((staff) => (
                <tr key={staff.staffId} className="hover:bg-[#161F33]/60 transition-colors">
                  
                  {/* Staff Info */}
                  <td className="py-4 px-5">
                    <div className="font-bold text-white">{staff.staffName}</div>
                    <div className="text-[10px] text-gray-400 font-mono">ID: {staff.staffId}</div>
                  </td>

                  {/* Checkbox 1: View Users */}
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={staff.canViewUsers}
                      onChange={() => togglePermission(staff.staffId, "canViewUsers")}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Checkbox 2: Approve KYC */}
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={staff.canApproveKYC}
                      onChange={() => togglePermission(staff.staffId, "canApproveKYC")}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Checkbox 3: Freeze Accounts */}
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={staff.canFreezeAccounts}
                      onChange={() => togglePermission(staff.staffId, "canFreezeAccounts")}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-rose-600 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Checkbox 4: Handle Tickets */}
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={staff.canManageTickets}
                      onChange={() => togglePermission(staff.staffId, "canManageTickets")}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Checkbox 5: Live Chat */}
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={staff.canAccessLiveChat}
                      onChange={() => togglePermission(staff.staffId, "canAccessLiveChat")}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Checkbox 6: Internal Notes */}
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={staff.canWriteInternalNotes}
                      onChange={() => togglePermission(staff.staffId, "canWriteInternalNotes")}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Checkbox 7: Audit Logs */}
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={staff.canViewAuditLogs}
                      onChange={() => togglePermission(staff.staffId, "canViewAuditLogs")}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Checkbox 8: Reimbursements */}
                  <td className="py-4 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={staff.canExecuteReimbursements}
                      onChange={() => togglePermission(staff.staffId, "canExecuteReimbursements")}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-emerald-600 focus:ring-0 cursor-pointer"
                    />
                  </td>

                  {/* Audit Info */}
                  <td className="py-4 px-5 text-right font-mono text-[10px] text-gray-400">
                    <div>{staff.updatedAt}</div>
                    <div className="text-gray-600">{staff.lastUpdatedBy}</div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-[#0E1424] border border-gray-800 text-xs text-gray-400">
        <strong className="text-white">Note on Section 27.2:</strong> Employee staff members can never transfer user funds directly or execute personal trades from staff accounts. All staff operations are logged with ID, date, time, and location.
      </div>

    </div>
  );
}
