"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  Filter,
  Flame,
  Globe,
  HardDrive,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  Moon,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Save,
  Sliders,
  Sparkles,
  Terminal,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  Wifi,
  X,
  XCircle,
  Zap,
  Coins,
  CreditCard,
  MessageSquare,
  FileCheck,
  Check
} from "lucide-react";
import { MOCK_USERS, MOCK_SUPPORT_TICKETS, MOCK_AUDIT_LOGS, MOCK_STAFF_PERMISSIONS } from "@/lib/mockData";
import { User, SupportTicket, AuditLogItem, StaffPermission } from "@/lib/types";
import { TradingPlatformStatus, INITIAL_PLATFORM_STATUSES, getPlatformStatus, setPlatformStatus } from "@/lib/systemStatus";

// Navigation Item Keys matching enterprise SE-Platform design
type NavKey = 
  | "overview" 
  | "telemetry" 
  | "reserves"
  | "users" 
  | "kyc"
  | "permissions" 
  | "tickets" 
  | "audit" 
  | "settings";

interface SystemService {
  name: string;
  type: string;
  port: number;
  status: "Healthy" | "Degraded" | "Offline";
  latency: string;
  uptime: string;
}

export default function AdminPortalPage() {
  const [activeNav, setActiveNav] = useState<NavKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Platform state
  const [emergencyLockActive, setEmergencyLockActive] = useState(false);
  const [platformStatuses, setPlatformStatuses] = useState<TradingPlatformStatus[]>(INITIAL_PLATFORM_STATUSES);

  React.useEffect(() => {
    setPlatformStatuses(INITIAL_PLATFORM_STATUSES.map(p => ({
      ...p,
      status: getPlatformStatus(p.id)
    })));
  }, []);

  const handleTogglePlatformStatus = (platformId: string) => {
    setPlatformStatuses(prev => prev.map(p => {
      if (p.id === platformId) {
        const nextStatus = p.status === "Online" ? "Maintenance" : "Online";
        setPlatformStatus(platformId, nextStatus);
        showToast(`${p.name} switched to ${nextStatus.toUpperCase()}.`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [permissions, setPermissions] = useState<StaffPermission[]>(MOCK_STAFF_PERMISSIONS);
  const [selectedStaffForModal, setSelectedStaffForModal] = useState<StaffPermission | null>(null);

  // Live cluster data fetch
  React.useEffect(() => {
    async function loadClusterData() {
      try {
        const [uRes, pRes, aRes] = await Promise.all([
          fetch("/api/admin/users").then(r => r.ok ? r.json() : null),
          fetch("/api/admin/permissions").then(r => r.ok ? r.json() : null),
          fetch("/api/admin/audit").then(r => r.ok ? r.json() : null)
        ]);
        if (uRes?.data?.length) setUsers(uRes.data);
        if (pRes?.data?.length) setPermissions(pRes.data);
        if (aRes?.data?.length) setAuditLogs(aRes.data);
      } catch (e) {
        console.warn("API cluster data fallback", e);
      }
    }
    loadClusterData();
  }, []);
  const [selectedKycUser, setSelectedKycUser] = useState<User | null>(null);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(MOCK_SUPPORT_TICKETS[0]);
  const [summarizedTicketId, setSummarizedTicketId] = useState<string | null>(null);
  const [internalNoteText, setInternalNoteText] = useState("");
  const [selectedNoteUser, setSelectedNoteUser] = useState<User | null>(null);

  // System Services Telemetry
  const services: SystemService[] = [
    { name: "FastAPI Core Microservice", type: "Python 3.11", port: 8000, status: "Healthy", latency: "12ms", uptime: "99.98%" },
    { name: "Matching & Routing Engine", type: "Next.js Edge API", port: 3000, status: "Healthy", latency: "4ms", uptime: "99.99%" },
    { name: "P2P Settlement Vault", type: "Direct P2P Architecture", port: 5432, status: "Healthy", latency: "2ms", uptime: "100%" },
    { name: "Primary Database Cluster", type: "PostgreSQL 16", port: 5432, status: "Healthy", latency: "1.2ms", uptime: "100%" },
    { name: "Secondary Failover Node", type: "Plesk VPS Mirror", port: 8443, status: "Healthy", latency: "22ms", uptime: "99.95%" },
    { name: "In-Memory Session Broker", type: "Redis 7 Alpine", port: 6379, status: "Healthy", latency: "0.6ms", uptime: "100%" },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleStaffPermission = (staffId: string, key: keyof StaffPermission) => {
    setPermissions(prev => prev.map(staff => {
      if (staff.staffId === staffId) {
        const updated = {
          ...staff,
          [key]: !staff[key],
          updatedAt: new Date().toLocaleTimeString(),
          lastUpdatedBy: "Master Admin (EKON-000001)"
        };
        if (selectedStaffForModal && selectedStaffForModal.staffId === staffId) {
          setSelectedStaffForModal(updated);
        }
        return updated;
      }
      return staff;
    }));
  };

  const handleSaveStaffPermissions = async (staffToSave?: StaffPermission) => {
    const target = staffToSave || selectedStaffForModal;
    if (!target) {
      try {
        await Promise.all(
          permissions.map(p =>
            fetch("/api/admin/permissions", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                staffId: p.staffId,
                permissions: p,
                updatedBy: "Master Admin (EKON-000001)"
              })
            })
          )
        );
        showToast("All permissions synchronized to MongoDB (ekonnet_trader_db)!");
      } catch (err) {
        showToast("Permissions updated locally.");
      }
      return;
    }
    try {
      const res = await fetch("/api/admin/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: target.staffId,
          permissions: target,
          updatedBy: "Master Admin (EKON-000001)"
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) setPermissions(data.data);
      }
      showToast(`Permissions for ${target.staffName} saved to MongoDB!`);
      setSelectedStaffForModal(null);
    } catch (err) {
      showToast(`Permissions saved locally for ${target.staffName}.`);
    }
  };

  const handleToggleFreeze = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextState = !u.isLocked;
          showToast(`Account ${u.username} (${u.id}) has been ${nextState ? "SUSPENDED" : "REACTIVATED"} .`);
          return { ...u, isLocked: nextState };
        }
        return u;
      })
    );
  };

  const handleUpdateKYC = (userId: string, status: "approved" | "rejected") => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          showToast(`KYC for ${u.fullName} marked as ${status.toUpperCase()} .`);
          return { ...u, kycStatus: status };
        }
        return u;
      })
    );
    setSelectedKycUser(null);
  };

  const handleEmergencyFreezeToggle = () => {
    const nextState = !emergencyLockActive;
    setEmergencyLockActive(nextState);
    if (nextState) {
      showToast("EMERGENCY FREEZE ENGAGED: Withdrawals & Outbound Trades Locked.");
    } else {
      showToast("Emergency freeze lifted by Master Admin.");
    }
  };

  const handleSummarizeTicket = (ticketId: string) => {
    setSummarizedTicketId(ticketId);
    showToast("Gorelo AI conversation summary generated successfully .");
  };

  const handleSaveInternalNote = () => {
    if (!selectedNoteUser || !internalNoteText.trim()) return;
    showToast(`Internal staff note logged for ${selectedNoteUser.username} .`);
    setSelectedNoteUser(null);
    setInternalNoteText("");
  };

  // Filtered users for table
  const filteredUsers = users.filter((u) => {
    const matchesQuery = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.emails.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = userRoleFilter === "all" || u.packageTier.toLowerCase() === userRoleFilter.toLowerCase();
    return matchesQuery && matchesRole;
  });

  const pendingKycCount = users.filter((u) => u.kycStatus === "pending").length;
  const openTicketsCount = tickets.filter((t) => t.status.toLowerCase() === "open").length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-transparent text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ENTERPRISE COLLAPSIBLE SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 ease-in-out shrink-0 bg-slate-950/60 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between z-40 select-none`}
      >
        {/* Sidebar Header & Brand */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
                EK
              </div>
              {sidebarOpen && (
                <div className="truncate">
                  <div className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                    Ekonnet <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Root</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">v1.0.0 &bull; Cluster OK</span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Nav Links */}
          <div className="px-3 py-4 space-y-5 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
            {/* Group 1: CORE PLATFORM */}
            <div className="space-y-1">
              {sidebarOpen && (
                <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                  Core Platform
                </div>
              )}
              <button
                onClick={() => setActiveNav("overview")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeNav === "overview"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="Overview Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Dashboard Overview</span>}
              </button>

              <button
                onClick={() => setActiveNav("telemetry")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeNav === "telemetry"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="System Telemetry"
              >
                <Activity className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Live Telemetry</span>}
              </button>

              <button
                onClick={() => setActiveNav("reserves")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeNav === "reserves"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="5 Base Pairs Reserves"
              >
                <Coins className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>5 Base Pairs Reserves</span>}
              </button>
            </div>

            {/* Group 2: USERS & COMPLIANCE */}
            <div className="space-y-1">
              {sidebarOpen && (
                <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                  Users & Compliance
                </div>
              )}
              <button
                onClick={() => setActiveNav("users")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeNav === "users"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="User Accounts & RBAC"
              >
                <Users className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Users & RBAC (Sec 50)</span>}
              </button>

              <button
                onClick={() => setActiveNav("kyc")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeNav === "kyc"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="KYC Photo Verification"
              >
                <div className="flex items-center gap-3 truncate">
                  <FileCheck className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span>KYC Dossier Review</span>}
                </div>
                {sidebarOpen && pendingKycCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                    {pendingKycCount}
                  </span>
                )}
              </button>
            </div>

            {/* Group 3: GOVERNANCE & AUDIT */}
            <div className="space-y-1">
              {sidebarOpen && (
                <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                  Governance & Security
                </div>
              )}
              <button
                onClick={() => setActiveNav("permissions")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeNav === "permissions"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="Staff Permissions Matrix"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Staff Matrix (Sec 27)</span>}
              </button>

              <button
                onClick={() => setActiveNav("audit")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeNav === "audit"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="Immutable Audit Logs"
              >
                <Database className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Audit Trail (Sec 60)</span>}
              </button>
            </div>

            {/* Group 4: SUPPORT & SYSTEM */}
            <div className="space-y-1">
              {sidebarOpen && (
                <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-2">
                  Support & AI
                </div>
              )}
              <button
                onClick={() => setActiveNav("tickets")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeNav === "tickets"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="Gorelo AI Support Tickets"
              >
                <div className="flex items-center gap-3 truncate">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span>Gorelo AI Tickets</span>}
                </div>
                {sidebarOpen && openTicketsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                    {openTicketsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveNav("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  activeNav === "settings"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title="Platform Settings"
              >
                <Settings className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Settings & Freeze</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-white/10 bg-transparent">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
              MA
            </div>
            {sidebarOpen && (
              <div className="flex-1 truncate">
                <div className="text-xs font-bold text-white truncate">Muhammad Ahmad</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Super Administrator
                </div>
              </div>
            )}
            {sidebarOpen && (
              <Link href="/" title="Exit to Public Trader" className="text-slate-400 hover:text-white p-1">
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN ADMIN CONTENT WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-transparent">
        
        {/* Top App Bar */}
        <header className="h-16 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 z-30">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-white transition">Platform Root</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-300">Admin Console</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-blue-400 capitalize font-semibold">{activeNav}</span>
          </div>

          {/* Quick Actions & Telemetry Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Base Liquidity: <strong className="text-emerald-400 font-mono">$1,280,450</strong></span>
            </div>

            {/* Emergency Freeze Button */}
            <button
              onClick={handleEmergencyFreezeToggle}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                emergencyLockActive 
                  ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse" 
                  : "bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 border border-slate-700"
              }`}
              title="EMERGENCY Platform Freeze"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{emergencyLockActive ? "LIFT FREEZE" : "EMERGENCY FREEZE"}</span>
            </button>

            <button
              onClick={() => showToast("Cache flushed & secondary database mirror synchronized.")}
              className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              Flush Cache
            </button>

            <Link
              href="/"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              Public Site ↗
            </Link>

            <button
              onClick={() => showToast("All system alert monitors nominal.")}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-2 right-2"></span>
            </button>
          </div>
        </header>

        {/* Global Emergency Banner if engaged */}
        {emergencyLockActive && (
          <div className="bg-rose-600 text-white py-2.5 px-6 text-xs font-black tracking-wider flex items-center justify-between shrink-0 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>EMERGENCY FREEZE ACTIVE — ALL OUTBOUND TRADING & TRANSFERS QUARANTINED</span>
            </div>
            <button
              onClick={handleEmergencyFreezeToggle}
              className="px-2.5 py-0.5 bg-black/40 hover:bg-black/60 rounded text-[10px] font-mono font-bold"
            >
              LIFT FREEZE
            </button>
          </div>
        )}

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {/* ========================================================================= */}
          {activeNav === "overview" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span>Total Registered Users</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">1,428</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> +14.2% this month
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span>24h Platform Volume</span>
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">$4,892,100</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> +8.7% vs yesterday
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span>Pending KYC Verifications</span>
                    <FileCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{pendingKycCount} Dossiers</div>
                  <div className="text-[11px] text-amber-400 font-semibold">
                    Handwritten notes await review
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span>System Health & Node Status</span>
                    <Server className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">100% ONLINE</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    VPS-Plesk-EU #01 (Synced)
                  </div>
                </div>
              </div>

              {/* Service Cluster Health Matrix */}
              <div className="p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span>Microservice Cluster & Secondary Node Status </span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Autoscaling Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {services.map((svc) => (
                    <div key={svc.name} className="p-4 rounded-2xl bg-white/[0.02] dark:bg-black/20 border border-white/10 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-white">{svc.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{svc.type} &bull; Port {svc.port}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {svc.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                        <span>Latency: <strong className="text-slate-200">{svc.latency}</strong></span>
                        <span>Uptime: <strong className="text-emerald-400">{svc.uptime}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Audit Stream */}
              <div className="p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span>Recent Immutable Audit Events </span>
                  </h3>
                  <button 
                    onClick={() => setActiveNav("audit")}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    View All Logs &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/[0.02] dark:bg-black/20 text-slate-400 uppercase text-[10px] border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Event ID</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Operator / User</th>
                        <th className="py-2.5 px-3">Action Type</th>
                        <th className="py-2.5 px-3">IP Address</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {auditLogs.slice(0, 5).map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.03] transition">
                          <td className="py-2 px-3 text-blue-400 font-bold">{log.id}</td>
                          <td className="py-2 px-3 text-slate-400">{log.timestamp.split("T")[1]?.slice(0, 8)}</td>
                          <td className="py-2 px-3 text-white font-bold">{log.userId}</td>
                          <td className="py-2 px-3 text-slate-300">{log.actionType}</td>
                          <td className="py-2 px-3 text-slate-400">{log.ipAddress}</td>
                          <td className="py-2 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LIVE TELEMETRY & SYSTEM NODES */}
          {/* ========================================================================= */}
          {activeNav === "telemetry" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white">Live Cluster Telemetry & Failover Mirror</h2>
                  <p className="text-xs text-slate-400">High-availability secondary backup server synchronization.</p>
                </div>
                <button
                  onClick={() => showToast("Health heartbeat ping dispatched to all 6 nodes.")}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Ping Nodes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Primary Node: VPS-Plesk-EU #01</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ACTIVE MASTER</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between"><span>CPU Core Usage (8 vCPU):</span><span className="text-white font-bold">24.2%</span></div>
                    <div className="flex justify-between"><span>RAM Allocated (32 GB):</span><span className="text-white font-bold">11.4 GB (35%)</span></div>
                    <div className="flex justify-between"><span>NVMe Disk IOPS:</span><span className="text-white font-bold">14,200 IOPS</span></div>
                    <div className="flex justify-between"><span>Database WAL Sync Delay:</span><span className="text-emerald-400 font-bold">0.00ms</span></div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Secondary Backup Node: VPS-Plesk-US #02</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">STANDBY REPLICA</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between"><span>Replication Latency:</span><span className="text-emerald-400 font-bold">18ms</span></div>
                    <div className="flex justify-between"><span>Hot Standby Readiness:</span><span className="text-emerald-400 font-bold">100%</span></div>
                    <div className="flex justify-between"><span>Automated Failover Trigger:</span><span className="text-white font-bold">&lt; 30 seconds</span></div>
                    <div className="flex justify-between"><span>Nightly Cold Archive:</span><span className="text-slate-300 font-bold">02:00 UTC (Encrypted)</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: 5 BASE PAIRS RESERVES  */}
          {/* ========================================================================= */}
          {activeNav === "reserves" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-white">5 Core Base Pairs Liquidity Reserves</h2>
                <p className="text-xs text-slate-400">All trades execute strictly across USD, BTC, XRP, ETH, and BCH liquidity pools.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { pair: "USD", name: "US Dollar Fiat", balance: "$450,000.00", hot: "25%", cold: "75%", color: "text-emerald-400" },
                  { pair: "BTC", name: "Bitcoin Vault", balance: "12.4500 BTC", hot: "15%", cold: "85%", color: "text-amber-400" },
                  { pair: "XRP", name: "Ripple XRP Rail", balance: "185,400 XRP", hot: "30%", cold: "70%", color: "text-cyan-400" },
                  { pair: "ETH", name: "Ethereum Pool", balance: "94.2000 ETH", hot: "20%", cold: "80%", color: "text-purple-400" },
                  { pair: "BCH", name: "Bitcoin Cash", balance: "340.500 BCH", hot: "25%", cold: "75%", color: "text-emerald-300" },
                ].map((pool) => (
                  <div key={pool.pair} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-base font-black font-mono ${pool.color}`}>{pool.pair}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Sec 19</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">{pool.name}</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5">{pool.balance}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between">
                      <span>Hot: {pool.hot}</span>
                      <span>Cold: {pool.cold}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: USERS & RBAC  */}
          {/* ========================================================================= */}
          {activeNav === "users" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-base font-bold text-white">User Accounts Directory & RBAC</h2>
                  <p className="text-xs text-slate-400">Search by User ID, verify age 18+, freeze accounts, or view internal staff notes.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search EKON-ID, name, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.03] dark:bg-black/25 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-64"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="py-1.5 px-3 rounded-xl bg-white/[0.04] dark:bg-black/25 border border-white/10 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="all">All Tiers</option>
                    <option value="free">Free</option>
                    <option value="pro trader">Pro Trader</option>
                    <option value="institutional">Institutional</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.02] dark:bg-black/20 text-slate-400 uppercase text-[10px] font-mono border-b border-white/10">
                      <tr>
                        <th className="py-3 px-4">User ID & Username</th>
                        <th className="py-3 px-4">Full Name & Age (18+)</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">KYC Status</th>
                        <th className="py-3 px-4">Tier</th>
                        <th className="py-3 px-4">Account State</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.03] transition">
                          <td className="py-3 px-4 font-mono">
                            <span className="text-emerald-400 font-bold">{u.id}</span>
                            <div className="text-[11px] text-slate-400">@{u.username}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{u.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Age: {u.age} yrs (Born {u.dateOfBirth})</div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {u.city}, {u.country}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.kycStatus === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              u.kycStatus === "pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}>
                              {u.kycStatus.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">
                            {u.packageTier}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.isLocked ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {u.isLocked ? "FROZEN" : "ACTIVE"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedNoteUser(u)}
                              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-[11px] text-blue-400 border border-blue-500/20 transition"
                            >
                              Notes
                            </button>
                            <button
                              onClick={() => handleToggleFreeze(u.id)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                                u.isLocked 
                                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30"
                                  : "bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30"
                              }`}
                            >
                              {u.isLocked ? "Unfreeze" : "Freeze"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: KYC DOSSIER REVIEW  */}
          {/* ========================================================================= */}
          {activeNav === "kyc" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-white">Mandatory KYC Verification Queue</h2>
                <p className="text-xs text-slate-400">Strict compliance with Verification of official photo holding handwritten note (&quot;Full Name, Ekonnet, Date&quot;) and strict age 18+ enforcement.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {users.filter(u => u.kycStatus === "pending").map((u) => (
                  <div key={u.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white font-mono">{u.id}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">PENDING REVIEW</span>
                    </div>

                    {u.kycDocumentUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-800 h-40 bg-slate-950">
                        <img src={u.kycDocumentUrl} alt="KYC Document" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-white">{u.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Age: {u.age} yrs &bull; {u.country}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">Note: &quot;{u.fullName}, Ekonnet, {u.createdAt.split('T')[0]}&quot;</div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleUpdateKYC(u.id, "rejected")}
                        className="flex-1 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleUpdateKYC(u.id, "approved")}
                        className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
                      >
                        Approve (18+)
                      </button>
                    </div>
                  </div>
                ))}

                {users.filter(u => u.kycStatus === "pending").length === 0 && (
                  <div className="col-span-3 p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="text-sm font-bold text-white">All KYC Submissions Cleared!</div>
                    <div className="text-xs text-slate-400">No pending verification queues. New submissions will notify staff in real-time.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: STAFF PERMISSION MATRIX  */}
          {/* ========================================================================= */}
          {activeNav === "permissions" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header and 4-Tier Badges */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/40 border border-white/10 backdrop-blur-xl">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SECTION 27.[1] & 27.[2] 4-TIER ACCESS DELEGATION</span>
                  </div>
                  <h2 className="text-xl font-black text-white">Staff Operational Permissions Matrix</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Click on any staff member to open their individual account drawer and assign specific jobs by ticking boxes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveStaffPermissions()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save All to MongoDB</span>
                  </button>
                </div>
              </div>

              {/* 4-Tier Account Hierarchy Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/30">
                  <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider block">Tier 1: Master Admin</span>
                  <div className="text-lg font-black text-white mt-1">1 Account</div>
                  <span className="text-[11px] text-purple-300 font-mono">EKON-000001 (Root)</span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/30">
                  <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider block">Tier 2: Management</span>
                  <div className="text-lg font-black text-white mt-1">1 Sub-Admin</div>
                  <span className="text-[11px] text-blue-300 font-mono">EKON-749201</span>
                </div>
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/30">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">Tier 3: Employee Staff</span>
                  <div className="text-lg font-black text-white mt-1">{permissions.length} Staff</div>
                  <span className="text-[11px] text-cyan-300 font-mono">Compliance & Support</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/30">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Tier 4: Traders / Users</span>
                  <div className="text-lg font-black text-white mt-1">{users.filter(u => u.role === 'user').length} Registered</div>
                  <span className="text-[11px] text-emerald-300 font-mono">Active On-Chain</span>
                </div>
              </div>

              {/* Staff Accounts Table with Row-Click Drawer Opening */}
              <div className="rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>💡 Tip: Click any row or &quot;Inspect Account&quot; to open the dedicated permission drawer.</span>
                  <span className="font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live MongoDB Sync
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4 font-sans">Staff Member & ID</th>
                        <th className="py-3.5 px-2 text-center">Users</th>
                        <th className="py-3.5 px-2 text-center">KYC</th>
                        <th className="py-3.5 px-2 text-center">Freeze</th>
                        <th className="py-3.5 px-2 text-center">Tickets</th>
                        <th className="py-3.5 px-2 text-center">Live Chat</th>
                        <th className="py-3.5 px-2 text-center">Notes</th>
                        <th className="py-3.5 px-2 text-center">Audit</th>
                        <th className="py-3.5 px-2 text-center">Refunds</th>
                        <th className="py-3.5 px-4 text-right font-sans">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {permissions.map((p) => (
                        <tr 
                          key={p.staffId} 
                          className="hover:bg-blue-600/10 cursor-pointer transition-colors"
                          onClick={() => setSelectedStaffForModal(p)}
                        >
                          <td className="py-3.5 px-4 font-bold text-white font-sans">
                            <div className="flex items-center space-x-2">
                              <span className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xs">
                                {p.staffName.charAt(0)}
                              </span>
                              <div>
                                <div className="text-white hover:text-blue-400 transition">{p.staffName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{p.staffId}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canViewUsers} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canViewUsers")} 
                              className="rounded accent-blue-600 cursor-pointer w-4 h-4" 
                            />
                          </td>
                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canApproveKYC} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canApproveKYC")} 
                              className="rounded accent-blue-600 cursor-pointer w-4 h-4" 
                            />
                          </td>
                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canFreezeAccounts} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canFreezeAccounts")} 
                              className="rounded accent-rose-600 cursor-pointer w-4 h-4" 
                            />
                          </td>
                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canManageTickets} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canManageTickets")} 
                              className="rounded accent-blue-600 cursor-pointer w-4 h-4" 
                            />
                          </td>
                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canAccessLiveChat} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canAccessLiveChat")} 
                              className="rounded accent-blue-600 cursor-pointer w-4 h-4" 
                            />
                          </td>
                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canWriteInternalNotes} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canWriteInternalNotes")} 
                              className="rounded accent-purple-600 cursor-pointer w-4 h-4" 
                            />
                          </td>
                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canViewAuditLogs} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canViewAuditLogs")} 
                              className="rounded accent-blue-600 cursor-pointer w-4 h-4" 
                            />
                          </td>
                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canExecuteReimbursements} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canExecuteReimbursements")} 
                              className="rounded accent-emerald-600 cursor-pointer w-4 h-4" 
                            />
                          </td>

                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedStaffForModal(p)}
                              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[11px] font-sans font-semibold transition"
                            >
                              Inspect Account &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: SUPPORT TICKETS & GORELO AI  */}
          {/* ========================================================================= */}
          {activeNav === "tickets" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-white">Gorelo-Style AI Support Desk</h2>
                <p className="text-xs text-slate-400">Support ticketing system with Gorelo-style AI conversation summarization.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-2">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setActiveTicket(t)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        activeTicket?.id === t.id
                          ? "bg-blue-600/10 border-blue-500/50"
                          : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-white font-mono">{t.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === "Critical" ? "bg-rose-500/10 text-rose-400" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {t.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200 truncate">{t.subject}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">User: {t.userId}</div>
                    </div>
                  ))}
                </div>

                {activeTicket && (
                  <div className="lg:col-span-7 p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-4">
                    <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                      <div>
                        <div className="text-sm font-bold text-white">{activeTicket.subject}</div>
                        <div className="text-xs text-slate-400 font-mono">Ticket ID: {activeTicket.id} &bull; Category: {activeTicket.category}</div>
                      </div>
                      <button
                        onClick={() => handleSummarizeTicket(activeTicket.id)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-purple-600/30 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        AI Summarize
                      </button>
                    </div>

                    {summarizedTicketId === activeTicket.id && (
                      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-purple-300">
                          <Sparkles className="w-3.5 h-3.5" />
                          Gorelo AI Summary :
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          {activeTicket.aiSummary || "User submitted proof of Wire payment ($5,000 USD). Sender bank confirmed transit. Transaction verified against Wise API rail. Ready for manual approval or automated clearing."}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {activeTicket.messages.map((m, idx) => (
                        <div key={idx} className={`p-3 rounded-xl text-xs space-y-1 ${
                          m.senderRole === "user" ? "bg-white/[0.02] dark:bg-black/20 border border-white/10" : "bg-blue-950/30 border border-blue-800/40"
                        }`}>
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span className="font-bold text-slate-300">{m.senderName} ({m.senderRole})</span>
                            <span>{m.timestamp.split("T")[1]?.slice(0, 5)}</span>
                          </div>
                          <p className="text-slate-200 text-xs">{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: AUDIT TRAIL  */}
          {/* ========================================================================= */}
          {activeNav === "audit" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-white">Immutable Audit Trail</h2>
                <p className="text-xs text-slate-400">Cryptographically verifiable log of all administrative actions, logins, and trades.</p>
              </div>

              <div className="rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Event ID</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">IP & Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.03] transition">
                        <td className="py-2.5 px-4 text-blue-400 font-bold">{log.id}</td>
                        <td className="py-2.5 px-4 text-slate-400">{log.timestamp.replace("T", " ").slice(0, 19)}</td>
                        <td className="py-2.5 px-4 text-white font-bold">{log.userId}</td>
                        <td className="py-2.5 px-4 text-emerald-400">{log.actionType}</td>
                        <td className="py-2.5 px-4 text-slate-300">{log.description}</td>
                        <td className="py-2.5 px-4 text-slate-400">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: SETTINGS & EMERGENCY CONTROLS  */}
          {/* ========================================================================= */}
          {activeNav === "settings" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-white">Platform Settings & Emergency Lockdown Controls</h2>
                <p className="text-xs text-slate-400">EMERGENCY killswitches, 2FA hardware policies, and Plesk server failovers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Emergency Master Killswitch </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Immediately suspends all outbound funds withdrawal requests, P2P releases, and external CEX order routing.
                  </p>
                  <button
                    onClick={handleEmergencyFreezeToggle}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                      emergencyLockActive
                        ? "bg-rose-600 hover:bg-rose-500 text-white"
                        : "bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30"
                    }`}
                  >
                    {emergencyLockActive ? "LIFT EMERGENCY FREEZE" : "ENGAGE EMERGENCY FREEZE NOW"}
                  </button>
                </div>

                <div className="p-6 rounded-3xl bg-white/[0.02] dark:bg-slate-900/20 border border-white/10 backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Lock className="w-4 h-4 text-blue-400" />
                    <span>Security & 2FA Enforcement </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Enforces 30-minute lockout after 3 failed login attempts and mandates TOTP hardware authenticator for all staff.
                  </p>
                  <button
                    onClick={() => showToast("Strict 2FA enforcement confirmed active across all staff.")}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition"
                  >
                    Enforce Staff 2FA Policy
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Clickable Staff Account Inspection & Permission Assignment Drawer */}
      {selectedStaffForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 p-6 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono font-bold uppercase mb-1">
                  <span>Staff Account Profile</span>
                </div>
                <h3 className="text-lg font-black text-white">{selectedStaffForModal.staffName}</h3>
                <span className="text-xs text-slate-400 font-mono">Staff ID: {selectedStaffForModal.staffId} &bull; Updated: {selectedStaffForModal.updatedAt}</span>
              </div>
              <button 
                onClick={() => setSelectedStaffForModal(null)} 
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Role & Authority Banner */}
            <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/40 flex items-center justify-between text-xs">
              <span className="text-blue-300 font-medium">Delegated by: <strong className="text-white">{selectedStaffForModal.lastUpdatedBy}</strong></span>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold">Active Staff Node</span>
            </div>

            {/* Checkbox Task Assignment Matrix (Section 27.2) */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Assigned Platform Tasks (Tick boxes to grant permission):
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canViewUsers}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canViewUsers")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">View Users</span>
                    <span className="text-[10px] text-slate-400">Access registered profiles</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canApproveKYC}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canApproveKYC")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">Approve KYC</span>
                    <span className="text-[10px] text-slate-400">Verify 18+ handwritten selfies</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canFreezeAccounts}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canFreezeAccounts")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">Freeze Accounts</span>
                    <span className="text-[10px] text-slate-400">Security lockouts & suspensions</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canManageTickets}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canManageTickets")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">Handle Tickets</span>
                    <span className="text-[10px] text-slate-400">Resolve customer issues</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canAccessLiveChat}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canAccessLiveChat")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">Live Chat Operator</span>
                    <span className="text-[10px] text-slate-400">Real-time messaging desk</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canWriteInternalNotes}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canWriteInternalNotes")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">Internal Notes</span>
                    <span className="text-[10px] text-slate-400">Confidential staff notes</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canViewAuditLogs}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canViewAuditLogs")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">View Audit Logs</span>
                    <span className="text-[10px] text-slate-400">Immutable security logs</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canExecuteReimbursements}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canExecuteReimbursements")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-white block">Reimbursements</span>
                    <span className="text-[10px] text-slate-400">Execute settlement refunds</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">Changes persist to MongoDB cluster</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStaffForModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveStaffPermissions(selectedStaffForModal)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Permissions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internal Staff Notes Modal  */}
      {selectedNoteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Staff Internal Notes: @{selectedNoteUser.username}</h3>
              <button onClick={() => setSelectedNoteUser(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={4}
              value={internalNoteText}
              onChange={(e) => setInternalNoteText(e.target.value)}
              placeholder="Record confidential staff observation ..."
              className="w-full rounded-xl bg-white/[0.02] dark:bg-black/20 border border-white/10 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedNoteUser(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInternalNote}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
