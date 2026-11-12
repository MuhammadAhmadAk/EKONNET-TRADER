"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  Layers,
  Users,
  UserCog,
  CheckSquare,
  Square,
} from "lucide-react";
import { StaffPermission } from "@/lib/types";
import {
  EKONNET_SECTIONS,
  SectionPermissionsMap,
  countEnabledBoxes,
  createEmptySectionPermissions,
  createFullSectionPermissions,
} from "@/lib/permissionRegistry";

interface SectionPermissionsMatrixProps {
  permissions: StaffPermission[];
  registeredUsersCount: number;
  onUpdatePermissions: (updatedList: StaffPermission[]) => void;
  showToast: (msg: string) => void;
}

function deriveLegacyBooleans(
  existing: StaffPermission,
  sectionPerms: SectionPermissionsMap
): Partial<StaffPermission> {
  return {
    canViewUsers: !!sectionPerms.users_governance?.view_profiles,
    canFreezeAccounts: !!sectionPerms.users_governance?.freeze_accounts,
    canWriteInternalNotes: !!sectionPerms.users_governance?.write_internal_notes,
    canApproveKYC: !!sectionPerms.kyc_compliance?.approve_kyc,
    canExecuteReimbursements: !!sectionPerms.payments_deposits?.execute_reimbursements,
    canAccessLiveChat: !!sectionPerms.support_desk?.access_live_chat,
    canManageTickets: !!sectionPerms.support_desk?.manage_tickets,
    canViewAuditLogs: !!sectionPerms.security_audit?.view_audit_logs,
  };
}

function hydrateSectionPermissions(account: StaffPermission): SectionPermissionsMap {
  const base = createEmptySectionPermissions();
  if (account.sectionPermissions) {
    for (const section of EKONNET_SECTIONS) {
      for (const box of section.boxes) {
        if (typeof account.sectionPermissions[section.id]?.[box.key] === "boolean") {
          base[section.id][box.key] = account.sectionPermissions[section.id][box.key];
        }
      }
    }
    return base;
  }

  // Fallback mapping from legacy 8 booleans if account has no sectionPermissions yet
  base.users_governance.view_profiles = !!account.canViewUsers;
  base.users_governance.freeze_accounts = !!account.canFreezeAccounts;
  base.users_governance.write_internal_notes = !!account.canWriteInternalNotes;
  base.kyc_compliance.approve_kyc = !!account.canApproveKYC;
  base.kyc_compliance.view_kyc_docs = !!account.canApproveKYC;
  base.payments_deposits.execute_reimbursements = !!account.canExecuteReimbursements;
  base.support_desk.access_live_chat = !!account.canAccessLiveChat;
  base.support_desk.manage_tickets = !!account.canManageTickets;
  base.security_audit.view_audit_logs = !!account.canViewAuditLogs;
  return base;
}

export default function SectionPermissionsMatrix({
  permissions,
  registeredUsersCount,
  onUpdatePermissions,
  showToast,
}: SectionPermissionsMatrixProps) {
  const [roleFilter, setRoleFilter] = useState<"all" | "management" | "staff">("all");
  const [selectedAccount, setSelectedAccount] = useState<StaffPermission | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const s of EKONNET_SECTIONS) initial[s.id] = true;
    return initial;
  });
  const [saving, setSaving] = useState(false);

  const managementCount = permissions.filter((p) => p.role === "management").length;
  const staffCount = permissions.filter((p) => p.role !== "management").length;

  const filteredAccounts = permissions.filter((p) => {
    if (roleFilter === "management") return p.role === "management";
    if (roleFilter === "staff") return p.role !== "management";
    return true;
  });

  const openAccountDrawer = (account: StaffPermission) => {
    const hydrated: StaffPermission = {
      ...account,
      role: account.role || "staff",
      sectionPermissions: hydrateSectionPermissions(account),
    };
    setSelectedAccount(hydrated);
  };

  const toggleBox = (sectionId: string, boxKey: string) => {
    if (!selectedAccount) return;
    const currentMap = hydrateSectionPermissions(selectedAccount);
    const updatedMap: SectionPermissionsMap = {
      ...currentMap,
      [sectionId]: {
        ...currentMap[sectionId],
        [boxKey]: !currentMap[sectionId]?.[boxKey],
      },
    };
    const updatedAccount: StaffPermission = {
      ...selectedAccount,
      ...deriveLegacyBooleans(selectedAccount, updatedMap),
      sectionPermissions: updatedMap,
      updatedAt: new Date().toLocaleTimeString(),
      lastUpdatedBy: "Master Admin (EKON-000001)",
    };
    setSelectedAccount(updatedAccount);
  };

  const toggleWholeSection = (sectionId: string, grantAll: boolean) => {
    if (!selectedAccount) return;
    const section = EKONNET_SECTIONS.find((s) => s.id === sectionId);
    if (!section) return;

    const currentMap = hydrateSectionPermissions(selectedAccount);
    const updatedSection: Record<string, boolean> = {};
    for (const box of section.boxes) {
      updatedSection[box.key] = grantAll;
    }
    const updatedMap: SectionPermissionsMap = {
      ...currentMap,
      [sectionId]: updatedSection,
    };
    setSelectedAccount({
      ...selectedAccount,
      ...deriveLegacyBooleans(selectedAccount, updatedMap),
      sectionPermissions: updatedMap,
      updatedAt: new Date().toLocaleTimeString(),
      lastUpdatedBy: "Master Admin (EKON-000001)",
    });
  };

  const handleSelectAllGlobal = (grantAll: boolean) => {
    if (!selectedAccount) return;
    const updatedMap = grantAll
      ? createFullSectionPermissions()
      : createEmptySectionPermissions();
    setSelectedAccount({
      ...selectedAccount,
      ...deriveLegacyBooleans(selectedAccount, updatedMap),
      sectionPermissions: updatedMap,
      updatedAt: new Date().toLocaleTimeString(),
      lastUpdatedBy: "Master Admin (EKON-000001)",
    });
  };

  const handleSaveAccount = async () => {
    if (!selectedAccount) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: selectedAccount.staffId,
          permissions: selectedAccount,
          updatedBy: "Master Admin (EKON-000001)",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          onUpdatePermissions(data.data);
        } else {
          onUpdatePermissions(
            permissions.map((p) =>
              p.staffId === selectedAccount.staffId ? selectedAccount : p
            )
          );
        }
        showToast(
          `Section permissions for ${selectedAccount.staffName} saved to MongoDB!`
        );
      } else {
        onUpdatePermissions(
          permissions.map((p) =>
            p.staffId === selectedAccount.staffId ? selectedAccount : p
          )
        );
        showToast(`Permissions updated locally for ${selectedAccount.staffName}.`);
      }
      setSelectedAccount(null);
    } catch {
      onUpdatePermissions(
        permissions.map((p) =>
          p.staffId === selectedAccount.staffId ? selectedAccount : p
        )
      );
      showToast(`Permissions updated locally for ${selectedAccount.staffName}.`);
      setSelectedAccount(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[4px] bg-white/[0.02] dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[4px] bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>EKONNET SECTION-WISE RBAC MATRIX</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Management &amp; Staff Section-by-Section Permissions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Assign an entire platform section to one account holder, or split individual tasks inside a section across multiple staff members. Each section has tool-specific tick boxes.
          </p>
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-black/40 p-1 rounded-[4px] border border-slate-200 dark:border-white/10">
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition ${
              roleFilter === "all"
                ? "bg-orange-500 text-white shadow"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All ({permissions.length})
          </button>
          <button
            onClick={() => setRoleFilter("management")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition ${
              roleFilter === "management"
                ? "bg-orange-500 text-white shadow"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Management ({managementCount})
          </button>
          <button
            onClick={() => setRoleFilter("staff")}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold transition ${
              roleFilter === "staff"
                ? "bg-orange-500 text-white shadow"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Staff ({staffCount})
          </button>
        </div>
      </div>

      {/* 4-Tier Account Hierarchy Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-[4px] bg-purple-950/10 dark:bg-purple-950/20 border border-purple-500/20 dark:border-purple-800/30">
          <span className="text-[10px] text-purple-600 dark:text-purple-400 uppercase font-bold tracking-wider block">
            Tier 1: Master Admin
          </span>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">1 Account</div>
          <span className="text-[11px] text-purple-500 dark:text-purple-300 font-mono">
            EKON-000001 (Full Control)
          </span>
        </div>
        <div className="p-4 rounded-[4px] bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20">
          <span className="text-[10px] text-orange-600 dark:text-orange-400 uppercase font-bold tracking-wider block">
            Tier 2: Management
          </span>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {managementCount} Sub-Admins
          </div>
          <span className="text-[11px] text-orange-600 dark:text-orange-400 font-mono">
            Section &amp; Staff Delegation
          </span>
        </div>
        <div className="p-4 rounded-[4px] bg-cyan-950/10 dark:bg-cyan-950/20 border border-cyan-500/20 dark:border-cyan-800/30">
          <span className="text-[10px] text-cyan-600 dark:text-cyan-400 uppercase font-bold tracking-wider block">
            Tier 3: Employee Staff
          </span>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {staffCount} Staff
          </div>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-300 font-mono">
            Task-Level Execution
          </span>
        </div>
        <div className="p-4 rounded-[4px] bg-emerald-950/10 dark:bg-emerald-950/20 border border-emerald-500/20 dark:border-emerald-800/30">
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider block">
            Ekonnet Sections
          </span>
          <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
            {EKONNET_SECTIONS.length} Sections
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-300 font-mono">
            {registeredUsersCount} Traders Governed
          </span>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Click any Management or Staff account to open the section-by-section tick-box matrix.
          </span>
          <span className="font-mono text-emerald-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live MongoDB Sync
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="py-3.5 px-4">Account Holder &amp; ID</th>
                <th className="py-3.5 px-3">Account Tier</th>
                <th className="py-3.5 px-3">Active Sections</th>
                <th className="py-3.5 px-3">Ticked Tasks</th>
                <th className="py-3.5 px-3">Last Updated By</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredAccounts.map((acc) => {
                const hydrated = hydrateSectionPermissions(acc);
                const stats = countEnabledBoxes(hydrated);
                const isMgmt = acc.role === "management";

                return (
                  <tr
                    key={acc.staffId}
                    onClick={() => openAccountDrawer(acc)}
                    className="hover:bg-orange-500/5 dark:hover:bg-orange-500/10 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className={`w-8 h-8 rounded-[4px] border flex items-center justify-center font-black text-xs ${
                            isMgmt
                              ? "bg-orange-500/20 border-orange-500/30 text-orange-600 dark:text-orange-400"
                              : "bg-cyan-500/20 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                          }`}
                        >
                          {isMgmt ? <UserCog className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        </span>
                        <div>
                          <div className="text-slate-900 dark:text-white">{acc.staffName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{acc.staffId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase ${
                          isMgmt
                            ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30"
                            : "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
                        }`}
                      >
                        {isMgmt ? "Management" : "Staff"}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <span className="text-slate-900 dark:text-white font-bold">
                        {stats.activeSections}
                      </span>{" "}
                      <span className="text-slate-400">/ {stats.totalSections} Sections</span>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-rose-500"
                            style={{
                              width: `${Math.round(
                                (stats.enabledBoxes / Math.max(1, stats.totalBoxes)) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                          {stats.enabledBoxes}/{stats.totalBoxes}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {acc.lastUpdatedBy}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => openAccountDrawer(acc)}
                        className="px-3 py-1.5 rounded-[4px] bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[11px] font-semibold transition"
                      >
                        Assign Sections &amp; Tasks &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section-Wise Granular Permissions Drawer / Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[4px] bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/10 p-5 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold uppercase ${
                      selectedAccount.role === "management"
                        ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30"
                        : "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    {selectedAccount.role === "management"
                      ? "Tier 2: Management Account Holder"
                      : "Tier 3: Employee Staff"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Platform: EKONNET
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedAccount.staffName}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {selectedAccount.staffId} &bull; Last Updated: {selectedAccount.updatedAt}
                </span>
              </div>

              <button
                onClick={() => setSelectedAccount(null)}
                className="p-1.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Global Controls Bar */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-black/30 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Tick entire sections or individual tasks within any section:
                <strong className="ml-2 text-slate-900 dark:text-white font-mono">
                  {countEnabledBoxes(selectedAccount.sectionPermissions).enabledBoxes} /{" "}
                  {countEnabledBoxes(selectedAccount.sectionPermissions).totalBoxes} Tasks Enabled
                </strong>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectAllGlobal(true)}
                  className="px-2.5 py-1 rounded-[4px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold transition flex items-center gap-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  Select All Sections
                </button>
                <button
                  onClick={() => handleSelectAllGlobal(false)}
                  className="px-2.5 py-1 rounded-[4px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[11px] font-semibold transition flex items-center gap-1"
                >
                  <Square className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Scrollable Section Accordions */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {EKONNET_SECTIONS.map((section) => {
                const secState = selectedAccount.sectionPermissions?.[section.id] || {};
                const tickedCount = section.boxes.filter((b) => !!secState[b.key]).length;
                const allTicked = tickedCount === section.boxes.length;
                const isExpanded = expandedSections[section.id] ?? true;

                return (
                  <div
                    key={section.id}
                    className="rounded-[4px] border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-slate-950/60 overflow-hidden"
                  >
                    {/* Section Header */}
                    <div
                      onClick={() =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          [section.id]: !isExpanded,
                        }))
                      }
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-100/80 dark:bg-white/[0.03] cursor-pointer hover:bg-slate-200/60 dark:hover:bg-white/[0.05] transition"
                    >
                      <div className="flex items-center gap-2.5">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {section.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-[4px] bg-slate-200 dark:bg-slate-800 text-[9px] font-mono uppercase text-slate-600 dark:text-slate-300">
                              {section.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {section.description}
                          </p>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          className={`px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold ${
                            tickedCount > 0
                              ? "bg-orange-500/15 text-orange-600 dark:text-orange-400"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {tickedCount} / {section.boxes.length} Ticked
                        </span>
                        <button
                          onClick={() => toggleWholeSection(section.id, !allTicked)}
                          className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold transition border ${
                            allTicked
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                          }`}
                        >
                          {allTicked ? "Clear Section" : "Select Whole Section"}
                        </button>
                      </div>
                    </div>

                    {/* Section Boxes Grid */}
                    {isExpanded && (
                      <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {section.boxes.map((box) => {
                          const checked = !!secState[box.key];
                          return (
                            <label
                              key={box.key}
                              className={`flex items-start space-x-2.5 p-3 rounded-[4px] border cursor-pointer transition ${
                                checked
                                  ? "bg-orange-500/10 border-orange-500/40 dark:bg-orange-500/10"
                                  : "bg-white dark:bg-slate-900/70 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleBox(section.id, box.key)}
                                className="mt-0.5 w-4 h-4 rounded accent-orange-500 cursor-pointer shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-slate-900 dark:text-white block">
                                  {box.label}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">
                                  {box.description}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center px-5 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 shrink-0">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Changes persist to MongoDB &amp; record an immutable audit trail entry
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="px-4 py-2 rounded-[4px] bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:opacity-90 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAccount}
                  disabled={saving}
                  className="px-5 py-2 rounded-[4px] bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition flex items-center space-x-1.5 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Section Permissions"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
