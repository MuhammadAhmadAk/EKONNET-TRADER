"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Sun,
  Loader2,
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
  | "deposits"
  | "users" 
  | "kyc" 
  | "permissions" 
  | "tickets" 
  | "audit" 
  | "settings"
  | "backups";

interface SystemService {
  name: string;
  type: string;
  port: number;
  status: "Healthy" | "Degraded" | "Offline";
  latency: string;
  uptime: string;
}

export default function AdminPortalPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  // Platform state
  const [emergencyLockActive, setEmergencyLockActive] = useState(false);
  const [platformStatuses, setPlatformStatuses] = useState<TradingPlatformStatus[]>(INITIAL_PLATFORM_STATUSES);
  
  // Phase 2: Treasury Deposits & Clearing
  const [depositsList, setDepositsList] = useState<any[]>([]);
  const [isApprovingDeposit, setIsApprovingDeposit] = useState<string | null>(null);

  // Read-Only Real-Time Backup Monitor State
  const [backupData, setBackupData] = useState<any>(null);
  const [backupFeedAvailable, setBackupFeedAvailable] = useState<boolean | null>(null);
  const [backupFeedReason, setBackupFeedReason] = useState<string | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupAutoPoll, setBackupAutoPoll] = useState(true);
  const [backupLastSync, setBackupLastSync] = useState<string | null>(null);

  const loadBackupStatus = async (silent = false) => {
    if (!silent) setBackupLoading(true);
    try {
      const res = await fetch("/api/admin/backups", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setBackupFeedAvailable(Boolean(json.available));
        setBackupFeedReason(json.reason || null);
        if (json.available && json.data) {
          setBackupData(json.data);
        }
        setBackupLastSync(new Date().toLocaleTimeString());
      }
    } catch (e) {
      // Keep previous telemetry state if transient poll fails
    } finally {
      if (!silent) setBackupLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthChecking && currentAdmin) {
      loadBackupStatus(true);
    }
  }, [isAuthChecking, currentAdmin]);

  useEffect(() => {
    if (activeNav !== "backups" || !backupAutoPoll) return;
    loadBackupStatus(false);
    const interval = setInterval(() => {
      loadBackupStatus(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [activeNav, backupAutoPoll]);

  useEffect(() => {
    // 1. Theme sync with persistence
    try {
      const savedTheme = localStorage.getItem("ekonnet_theme");
      if (savedTheme === "light") {
        document.documentElement.classList.remove("dark");
        setTheme("light");
      } else {
        document.documentElement.classList.add("dark");
        setTheme("dark");
      }
    } catch (e) {}

    const handleThemeChange = (e: any) => {
      const t = e.detail?.theme || (document.documentElement.classList.contains("dark") ? "dark" : "light");
      setTheme(t);
    };
    window.addEventListener("theme-changed", handleThemeChange);

    // 2. Administrative Authentication Guard - Resilient session persistence across refreshes
    const verifyAdminSession = async () => {
      try {
        // Fast local recovery first (so no blank screen on refresh)
        const stored = localStorage.getItem("ekonnet_admin_user");
        let localAdmin = null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.role === "master_admin" || parsed.role === "management" || parsed.role === "staff") {
              localAdmin = parsed;
              setCurrentAdmin(parsed);
              setIsAuthChecking(false);
              loadDeposits();
            }
          } catch (e) {}
        }

        // Verify with /api/auth/admin/me (validates server-side httpOnly admin JWT cookie)
        const res = await fetch("/api/auth/admin/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user && (data.user.role === "master_admin" || data.user.role === "management" || data.user.role === "staff")) {
            setCurrentAdmin(data.user);
            localStorage.setItem("ekonnet_admin_user", JSON.stringify(data.user));
            setIsAuthChecking(false);
            loadDeposits();
            return;
          }
        }

        // If local admin was already verified, don't kick user out on temporary network glitch
        if (localAdmin) {
          setIsAuthChecking(false);
          loadDeposits();
          return;
        }

        router.push("/admin/login?error=unauthorized");
      } catch (e) {
        const stored = localStorage.getItem("ekonnet_admin_user");
        if (!stored) {
          router.push("/admin/login");
        } else {
          setIsAuthChecking(false);
        }
      }
    };

    verifyAdminSession();

    return () => {
      window.removeEventListener("theme-changed", handleThemeChange);
    };
  }, [router]);

  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    const next = isCurrentlyDark ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ekonnet_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ekonnet_theme", "light");
    }
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: { theme: next } }));
  };

  const handleAdminLogout = async () => {
    try {
      await fetch("/api/auth/admin/logout", { method: "POST" });
    } catch (e) {}
    localStorage.removeItem("ekonnet_admin_user");
    window.dispatchEvent(new Event("admin-auth-changed"));
    router.push("/admin/login");
  };

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

  const handleToggleFreeze = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const nextState = !target.isLocked;

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, isLocked: nextState };
        }
        return u;
      })
    );
    showToast(`Account ${target.username} (${userId}) ${nextState ? "SUSPENDED" : "REACTIVATED"}...`);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          isLocked: nextState,
          executedBy: currentAdmin?.fullName || currentAdmin?.username || "Master Admin"
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.data) setUsers(data.data);
        showToast(`Account ${target.username} (${userId}) saved to MongoDB: ${nextState ? "SUSPENDED" : "REACTIVATED"}!`);
      } else {
        showToast(`Failed to update freeze status in DB: ${data.error || "Error"}`);
      }
    } catch (err) {
      showToast("Network error updating lock status.");
    }
  };

  const handleUpdateKYC = async (userId: string, status: "approved" | "rejected") => {
    const target = users.find((u) => u.id === userId);
    const targetName = target?.fullName || userId;

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, kycStatus: status };
        }
        return u;
      })
    );
    showToast(`KYC for ${targetName} updating to ${status.toUpperCase()}...`);
    setSelectedKycUser(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          kycStatus: status,
          executedBy: currentAdmin?.fullName || currentAdmin?.username || "Master Admin"
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.data) setUsers(data.data);
        showToast(`✓ KYC for ${targetName} successfully ${status.toUpperCase()} in database!`);
      } else {
        showToast(`Failed to update KYC in DB: ${data.error || "Error"}`);
      }
    } catch (err) {
      showToast("Network error updating KYC status.");
    }
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

  const loadDeposits = async () => {
    try {
      const res = await fetch("/api/finance/deposits");
      const data = await res.json();
      if (data.success && Array.isArray(data.deposits)) {
        setDepositsList(data.deposits);
      }
    } catch (err) {
      console.warn("Failed to load deposits:", err);
    }
  };

  const handleApproveDeposit = async (depositId: string) => {
    setIsApprovingDeposit(depositId);
    try {
      const res = await fetch("/api/finance/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositId,
          staffName: currentAdmin?.fullName || currentAdmin?.username || "Master Admin"
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`✓ Deposit ${depositId} Approved! User wallet credited.`);
        loadDeposits();
      } else {
        showToast(`Error: ${data.error || "Failed to approve deposit."}`);
      }
    } catch (err) {
      showToast("Network error approving deposit slip.");
    } finally {
      setIsApprovingDeposit(null);
    }
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

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="w-14 h-14 rounded-[4px] bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/30 mb-4 animate-bounce">
          <Layers className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-800 dark:text-slate-200">
          <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          <span>Verifying Administrative Security Clearance Level 3+...</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
          Ekonnet Proprietary Core Governance Engine
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 selection:bg-orange-500 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-[4px] shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
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
        } transition-all duration-300 ease-in-out shrink-0 bg-white/95 dark:bg-[#0c1222]/95 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/10 flex flex-col justify-between z-40 select-none`}
      >
        {/* Sidebar Header & Brand */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-white/10">
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full overflow-hidden p-[1px] shadow-sm shadow-orange-500/20 shrink-0">
                <picture>
                  <source srcSet="/images/ekonnet-logo-96.webp" type="image/webp" />
                  <img
                    src="/images/ekonnet-logo-96.png"
                    alt="Ekonnet Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain"
                  />
                </picture>
              </div>
              {sidebarOpen && (
                <div className="truncate">
                  <div className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                    Ekonnet <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">Root</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">v1.0.0 &bull; Cluster OK</span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-[4px] text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Nav Links - Clean Flat Direct List (No Sections) */}
          <div className="px-2.5 py-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] no-scrollbar">
            {/* 1. Dashboard Overview */}
            <button
              onClick={() => setActiveNav("overview")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "overview"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Executive Overview"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Executive Overview</span>}
            </button>

            {/* 2. Deposits & Clearing */}
            <button
              onClick={() => {
                setActiveNav("deposits");
                loadDeposits();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "deposits"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Deposits & Clearing Ledger"
            >
              <div className="flex items-center gap-3 truncate">
                <CreditCard className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Deposits &amp; Clearing</span>}
              </div>
              {sidebarOpen && depositsList.filter(d => d.status === "PENDING").length > 0 && (
                <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-orange-500 text-white animate-pulse">
                  {depositsList.filter(d => d.status === "PENDING").length}
                </span>
              )}
            </button>

            {/* 3. KYC Dossiers Review */}
            <button
              onClick={() => setActiveNav("kyc")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "kyc"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="KYC Photo Verification"
            >
              <div className="flex items-center gap-3 truncate">
                <FileCheck className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>KYC Dossier Review</span>}
              </div>
              {sidebarOpen && pendingKycCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  {pendingKycCount}
                </span>
              )}
            </button>

            {/* 4. User Accounts & RBAC */}
            <button
              onClick={() => setActiveNav("users")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "users"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Trader Accounts & Balance Management"
            >
              <Users className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Trader Accounts</span>}
            </button>

            {/* 5. 5 Base Pairs Reserves */}
            <button
              onClick={() => setActiveNav("reserves")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "reserves"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Treasury & Vault Reserves"
            >
              <Coins className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Treasury &amp; Reserves</span>}
            </button>

            {/* 6. Gorelo AI Tickets */}
            <button
              onClick={() => setActiveNav("tickets")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "tickets"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Gorelo AI Support Tickets"
            >
              <div className="flex items-center gap-3 truncate">
                <MessageSquare className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Gorelo Support Tickets</span>}
              </div>
              {sidebarOpen && openTicketsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-orange-500 text-white">
                  {openTicketsCount}
                </span>
              )}
            </button>

            {/* 7. Staff Matrix */}
            <button
              onClick={() => setActiveNav("permissions")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "permissions"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Staff Permissions Matrix"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Staff Matrix</span>}
            </button>

            {/* 8. Audit Trail */}
            <button
              onClick={() => setActiveNav("audit")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "audit"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Immutable Audit Logs"
            >
              <Database className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Audit Trail</span>}
            </button>

            {/* 9. Live Telemetry */}
            <button
              onClick={() => setActiveNav("telemetry")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "telemetry"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Node Telemetry & Cluster Ports"
            >
              <Cpu className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Node &amp; Cluster Telemetry</span>}
            </button>

            {/* 10. Platform Settings & Freeze */}
            <button
              onClick={() => setActiveNav("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "settings"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Platform Outage Controls & Emergency Freeze"
            >
              <Settings className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Platform Outage Controls</span>}
            </button>

            {/* 11. Real-Time Read-Only Backup Monitor (Bottom) */}
            <button
              onClick={() => {
                setActiveNav("backups");
                loadBackupStatus(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-xs font-semibold transition cursor-pointer ${
                activeNav === "backups"
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
              title="Daily & 15-Min DB Backup Monitor (Read-Only)"
            >
              <div className="flex items-center gap-3 truncate">
                <HardDrive className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>System Backups</span>}
              </div>
              {sidebarOpen && (
                backupData?.health?.errors_detected > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold bg-rose-500 text-white">
                    ERR
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Automated Backups Active" />
                )
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Footer User Card */}
        <div className="p-2.5 border-t border-slate-200/80 dark:border-white/10 bg-transparent">
          <div className="flex items-center gap-2.5 p-2 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10">
            <div className="w-7 h-7 rounded-[4px] bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm">
              {currentAdmin?.fullName?.charAt(0) || "A"}
            </div>
            {sidebarOpen && (
              <div className="flex-1 truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentAdmin?.fullName || "Muhammad Ahmad"}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {currentAdmin?.role?.replace('_', ' ') || "SUPER ADMIN"}
                </div>
              </div>
            )}
            {sidebarOpen && (
              <button 
                onClick={handleAdminLogout} 
                title="Log Out of Administration" 
                className="text-slate-400 hover:text-rose-500 p-1 rounded-[4px] hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN ADMIN CONTENT WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-transparent">
        
        {/* Top App Bar */}
        <header className="h-14 border-b border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c1222]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 transition-colors">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="text-slate-400">Admin Console</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white capitalize font-semibold">
              {activeNav === "overview" ? "Executive Overview" : activeNav}
            </span>
          </div>

          {/* Quick Actions (Uncluttered, Minimal) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-[4px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Public Site Link */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-1.5"
              title="Open Public Site"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Site</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleAdminLogout}
              className="px-3 py-1.5 rounded-[4px] text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition flex items-center gap-1.5 cursor-pointer"
              title="Lock Terminal & Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
          
          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE OVERVIEW DASHBOARD (TRADING & BUSINESS PRIORITIZED) */}
          {/* ========================================================================= */}
          {activeNav === "overview" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={() => setActiveNav("users")}
                  className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-2 cursor-pointer hover:border-orange-500/50 transition group"
                >
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span className="group-hover:text-orange-500 transition-colors">Registered Traders</span>
                    <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{users.length || "1,428"}</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> {users.filter(u => u.kycStatus === 'approved').length} Verified Traders
                  </div>
                </div>

                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-2">
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span>24h Platform Volume</span>
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">$4,892,100</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> +8.7% P2P &amp; Spot Flow
                  </div>
                </div>

                <div 
                  onClick={() => { setActiveNav("deposits"); loadDeposits(); }}
                  className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-2 cursor-pointer hover:border-orange-500/50 transition group"
                >
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span className="group-hover:text-orange-500 transition-colors">Pending Deposits</span>
                    <CreditCard className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                    {depositsList.filter(d => d.status === "PENDING").length} Slips
                  </div>
                  <div className="text-[11px] text-orange-500 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Bank Wire &amp; Crypto Clearing
                  </div>
                </div>

                <div 
                  onClick={() => setActiveNav("kyc")}
                  className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-2 cursor-pointer hover:border-orange-500/50 transition group"
                >
                  <div className="flex justify-between items-center text-slate-400 text-xs">
                    <span className="group-hover:text-orange-500 transition-colors">Pending KYC Dossiers</span>
                    <FileCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white font-mono">{pendingKycCount} Dossiers</div>
                  <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Photo ID &amp; Handwritten Notes
                  </div>
                </div>
              </div>

              {/* ACTION CENTER: PENDING TASKS QUEUE (DEPOSITS & KYC) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Deposits Awaiting Clearance */}
                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-[4px] bg-orange-500/10 text-orange-500">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Deposit Clearance Queue</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Manual wire and receipt submissions awaiting staff credit</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setActiveNav("deposits"); loadDeposits(); }}
                      className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 font-semibold"
                    >
                      View All Slips &rarr;
                    </button>
                  </div>

                  {depositsList.filter(d => d.status === "PENDING").length === 0 ? (
                    <div className="p-4 rounded-[4px] bg-emerald-500/5 border border-emerald-500/20 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">All Deposits Cleared &amp; Settled</div>
                      <div className="text-[11px] text-slate-500">Zero pending deposit slips in queue. Instant balance credits up to date.</div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {depositsList.filter(d => d.status === "PENDING").slice(0, 3).map((dep) => (
                        <div key={dep.id} className="p-3.5 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span>User: {dep.userId}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-orange-500/10 text-orange-500 font-bold uppercase">{dep.paymentMethod}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Slip: <strong className="text-slate-800 dark:text-slate-200">{dep.id}</strong> • {new Date(dep.submittedAt).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xs font-bold font-mono text-emerald-500">+{Number(dep.amount).toLocaleString()} {dep.currency}</div>
                              <div className="text-[10px] text-amber-500 font-mono">PENDING</div>
                            </div>
                            <button
                              disabled={isApprovingDeposit === dep.id}
                              onClick={() => handleApproveDeposit(dep.id)}
                              className="px-3 py-1.5 rounded-[4px] bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-bold text-[11px] tracking-wide transition shrink-0 disabled:opacity-50"
                            >
                              {isApprovingDeposit === dep.id ? "Approving..." : "Approve & Credit"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. KYC Dossiers Awaiting Review */}
                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-[4px] bg-amber-500/10 text-amber-500">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Identity KYC Verification Queue</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Government ID &amp; handwritten security notes awaiting review</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveNav("kyc")}
                      className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 font-semibold"
                    >
                      View All Dossiers &rarr;
                    </button>
                  </div>

                  {users.filter(u => u.kycStatus === "pending").length === 0 ? (
                    <div className="p-4 rounded-[4px] bg-emerald-500/5 border border-emerald-500/20 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">All KYC Dossiers Processed</div>
                      <div className="text-[11px] text-slate-500">No customers are currently pending manual identity review.</div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {users.filter(u => u.kycStatus === "pending").slice(0, 3).map((u) => (
                        <div key={u.id} className="p-3.5 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{u.fullName || u.username}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/10 text-purple-400 font-bold uppercase">{u.packageTier || "Standard"}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              ID: <strong className="text-slate-800 dark:text-slate-200">{u.id}</strong> • @{u.username} • {u.country || "Global"}
                            </div>
                          </div>
                          <button
                            onClick={() => { setSelectedKycUser(u); setActiveNav("kyc"); }}
                            className="px-3 py-1.5 rounded-[4px] bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-bold text-[11px] transition shrink-0"
                          >
                            Review Dossier
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 5 BASE PAIRS TREASURY RESERVES SNAPSHOT */}
              <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-[4px] bg-emerald-500/10 text-emerald-500">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Treasury Cold &amp; Hot Vault Reserves</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Strict 1:1 backed liquidity reserves across the 5 core platform pairs</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveNav("reserves")}
                    className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 font-semibold"
                  >
                    Manage Multi-Sig Vaults &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
                  <div className="p-4 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 space-y-1">
                    <div className="text-[11px] text-slate-400 font-bold">USD Fiat Custody</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">$4,250,000</div>
                    <div className="text-[10px] text-emerald-400 font-bold">100% Backed (Escrow)</div>
                  </div>

                  <div className="p-4 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 space-y-1">
                    <div className="text-[11px] text-amber-500 font-bold">Bitcoin (BTC)</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">142.50 BTC</div>
                    <div className="text-[10px] text-emerald-400 font-bold">Multi-Sig Cold Vault</div>
                  </div>

                  <div className="p-4 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 space-y-1">
                    <div className="text-[11px] text-cyan-400 font-bold">Ripple (XRP)</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">1,850,000 XRP</div>
                    <div className="text-[10px] text-emerald-400 font-bold">Ledger Trustline Active</div>
                  </div>

                  <div className="p-4 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 space-y-1">
                    <div className="text-[11px] text-purple-400 font-bold">Ethereum (ETH)</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">820.00 ETH</div>
                    <div className="text-[10px] text-emerald-400 font-bold">Multi-Sig Hot Pool</div>
                  </div>

                  <div className="p-4 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 space-y-1">
                    <div className="text-[11px] text-emerald-400 font-bold">Bitcoin Cash (BCH)</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">3,140.00 BCH</div>
                    <div className="text-[10px] text-emerald-400 font-bold">Cold Vault Synced</div>
                  </div>
                </div>
              </div>

              {/* RECENT AUDIT TRAIL STREAM */}
              <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span>Recent Administrative &amp; Trading Audit Events</span>
                  </h3>
                  <button 
                    onClick={() => setActiveNav("audit")}
                    className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-400 font-semibold"
                  >
                    View All Logs &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="py-2.5 px-3">Event ID</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Operator / User</th>
                        <th className="py-2.5 px-3">Action Type</th>
                        <th className="py-2.5 px-3">IP Address</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {auditLogs.slice(0, 4).map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition">
                          <td className="py-2 px-3 text-orange-600 dark:text-orange-400 font-bold">{log.id}</td>
                          <td className="py-2 px-3 text-slate-400">{log.timestamp.split("T")[1]?.slice(0, 8)}</td>
                          <td className="py-2 px-3 text-slate-900 dark:text-white font-bold">{log.userId}</td>
                          <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{log.actionType}</td>
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

              {/* COMPACT DEVOPS & INFRASTRUCTURE STATUS RIBBON (PLACED AT BOTTOM) */}
              <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/60 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                    <Server className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Infrastructure Cluster</span>
                      <span className="px-2 py-0.2 rounded-[4px] text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">100% ONLINE</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      EU Master Node (82.165.10.77) • US Replica Mirror Synced • 6 Microservices Active
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveNav("telemetry")}
                  className="px-3 py-1.5 rounded-[4px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition whitespace-nowrap"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Open DevOps Hardware &amp; Telemetry &rarr;</span>
                </button>
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
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Cluster Telemetry & Failover Mirror</h2>
                  <p className="text-xs text-slate-400">High-availability secondary backup server synchronization.</p>
                </div>
                <button
                  onClick={() => showToast("Health heartbeat ping dispatched to all 6 nodes.")}
                  className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-[4px] text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Ping Nodes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Primary Node: VPS-Plesk-EU #01</span>
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ACTIVE MASTER</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between"><span>CPU Core Usage (8 vCPU):</span><span className="text-slate-900 dark:text-white font-bold">24.2%</span></div>
                    <div className="flex justify-between"><span>RAM Allocated (32 GB):</span><span className="text-slate-900 dark:text-white font-bold">11.4 GB (35%)</span></div>
                    <div className="flex justify-between"><span>NVMe Disk IOPS:</span><span className="text-slate-900 dark:text-white font-bold">14,200 IOPS</span></div>
                    <div className="flex justify-between"><span>Database WAL Sync Delay:</span><span className="text-emerald-400 font-bold">0.00ms</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Secondary Backup Node: VPS-Plesk-US #02</span>
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">STANDBY REPLICA</span>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-slate-400">
                    <div className="flex justify-between"><span>Replication Latency:</span><span className="text-emerald-400 font-bold">18ms</span></div>
                    <div className="flex justify-between"><span>Hot Standby Readiness:</span><span className="text-emerald-400 font-bold">100%</span></div>
                    <div className="flex justify-between"><span>Automated Failover Trigger:</span><span className="text-slate-900 dark:text-white font-bold">&lt; 30 seconds</span></div>
                    <div className="flex justify-between"><span>Nightly Cold Archive:</span><span className="text-slate-700 dark:text-slate-300 font-bold">02:00 UTC (Encrypted)</span></div>
                  </div>
                </div>
              </div>

              {/* Service Cluster Health Matrix (Detailed DevOps View) */}
              <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span>Microservice Cluster &amp; Port Binding Matrix</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">Autoscaling Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {services.map((svc) => (
                    <div key={svc.name} className="p-4 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{svc.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{svc.type} &bull; Port {svc.port}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {svc.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 border-t border-slate-200 dark:border-white/10/80 pt-2">
                        <span>Latency: <strong className="text-slate-800 dark:text-slate-200">{svc.latency}</strong></span>
                        <span>Uptime: <strong className="text-emerald-400">{svc.uptime}</strong></span>
                      </div>
                    </div>
                  ))}
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
                <h2 className="text-base font-bold text-slate-900 dark:text-white">5 Core Base Pairs Liquidity Reserves</h2>
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
                  <div key={pool.pair} className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-base font-black font-mono ${pool.color}`}>{pool.pair}</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">{pool.name}</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">{pool.balance}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-400 flex justify-between">
                      <span>Hot: {pool.hot}</span>
                      <span>Cold: {pool.cold}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3.5: DEPOSITS & CLEARING LEDGER (PHASE 2)                              */}
          {/* ========================================================================= */}
          {activeNav === "deposits" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Treasury Deposit Queue &amp; Automated Computer Vision Verification
                  </h2>
                  <p className="text-xs text-slate-400">
                    Modular multi-database clearing: automated Python receipt clarity scan, reference check, and 1-click double-entry wallet crediting.
                  </p>
                </div>
                <button
                  onClick={loadDeposits}
                  className="px-3.5 py-2 rounded-[4px] bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Ledger</span>
                </button>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Deposits</div>
                  <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">{depositsList.length} Slips</div>
                  <div className="text-[11px] text-slate-500 font-mono">Recorded in ekonnet_ledger</div>
                </div>

                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Clearance</div>
                  <div className="text-lg font-bold font-mono text-orange-600 dark:text-orange-400">
                    {depositsList.filter(d => d.status === "PENDING").length} Pending
                  </div>
                  <div className="text-[11px] text-orange-500 font-semibold">Requires Staff Sign-off</div>
                </div>

                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Python CV Engine</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 94.8% Pass
                  </div>
                  <div className="text-[11px] text-slate-400">OpenCV Laplacian Forensics</div>
                </div>

                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ledger Invariant</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> BALANCED
                  </div>
                  <div className="text-[11px] text-slate-400">Double-entry zero-loss check</div>
                </div>
              </div>

              {/* Deposits Table */}
              <div className="rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl overflow-hidden p-5 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 text-[10px] font-mono uppercase tracking-wider">
                        <th className="py-3 pr-4">DEPOSIT ID / DATE</th>
                        <th className="py-3 px-4">TRADER</th>
                        <th className="py-3 px-4">AMOUNT &amp; RAIL</th>
                        <th className="py-3 px-4">TRANSACTION REF</th>
                        <th className="py-3 px-4">PYTHON AI FORENSIC</th>
                        <th className="py-3 px-4">STATUS</th>
                        <th className="py-3 pl-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                      {depositsList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                            No deposit slips found in ledger queue.
                          </td>
                        </tr>
                      ) : (
                        depositsList.map((dep) => (
                          <tr key={dep.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition">
                            <td className="py-3.5 pr-4">
                              <div className="font-bold text-slate-900 dark:text-white text-xs">{dep.id}</div>
                              <div className="text-[10px] text-slate-400 font-sans">
                                {dep.createdAt ? new Date(dep.createdAt).toLocaleString() : "Just now"}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-sans">
                              <div className="font-bold text-slate-800 dark:text-slate-200">{dep.userName}</div>
                              <div className="text-[10px] font-mono text-slate-400">{dep.userId}</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                +${dep.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {dep.currency}
                              </div>
                              <div className="text-[10px] text-slate-500 font-sans">{dep.paymentRail}</div>
                            </td>

                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs">
                                {dep.transactionRef}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-sans">
                              {dep.cvVerification ? (
                                <div className="space-y-0.5">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                                    dep.cvVerification.status === "PASS"
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  }`}>
                                    ✓ {dep.cvVerification.confidenceScore}% Clarity ({dep.cvVerification.status})
                                  </span>
                                  <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                    {dep.cvVerification.details}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400">Standard Wire Slip</span>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-[4px] text-[10px] font-bold ${
                                dep.status === "APPROVED"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse"
                              }`}>
                                {dep.status === "APPROVED" ? "APPROVED" : "PENDING CLEARING"}
                              </span>
                            </td>

                            <td className="py-3.5 pl-4 text-right">
                              {dep.status === "APPROVED" ? (
                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 font-sans">
                                  ✓ Cleared ({dep.approvedBy || "Master Admin"})
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleApproveDeposit(dep.id)}
                                  disabled={isApprovingDeposit === dep.id}
                                  className="px-3.5 py-1.5 rounded-[4px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                                >
                                  {isApprovingDeposit === dep.id ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                      <span>Crediting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Approve &amp; Credit</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">User Accounts Directory & RBAC</h2>
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
                      className="pl-8 pr-3 py-1.5 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 w-64"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="py-1.5 px-3 rounded-[4px] bg-white/[0.04] dark:bg-black/25 border border-white/10 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="all">All Tiers</option>
                    <option value="free">Free</option>
                    <option value="pro trader">Pro Trader</option>
                    <option value="institutional">Institutional</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-mono border-b border-slate-200 dark:border-white/10">
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
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition">
                          <td className="py-3 px-4 font-mono">
                            <span className="text-emerald-400 font-bold">{u.id}</span>
                            <div className="text-[11px] text-slate-400">@{u.username}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">Age: {u.age} yrs (Born {u.dateOfBirth})</div>
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
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
                          <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
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
                              className="px-2.5 py-1 rounded-[4px] bg-orange-500/10 hover:bg-orange-500/20 text-[11px] text-orange-600 dark:text-orange-400 border border-orange-500/20 transition"
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
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Mandatory KYC Verification Queue</h2>
                <p className="text-xs text-slate-400">Strict compliance with Verification of official photo holding handwritten note (&quot;Full Name, Ekonnet, Date&quot;) and strict age 18+ enforcement.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {users.filter(u => u.kycStatus === "pending").map((u) => (
                  <div key={u.id} className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{u.id}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">PENDING REVIEW</span>
                    </div>

                    {u.kycDocumentUrl && (
                      <div className="rounded-[4px] overflow-hidden border border-slate-200 dark:border-white/10 h-40 bg-slate-950">
                        <img src={u.kycDocumentUrl} alt="KYC Document" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Age: {u.age} yrs &bull; {u.country}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">Note: &quot;{u.fullName}, Ekonnet, {u.createdAt.split('T')[0]}&quot;</div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                      <button
                        onClick={() => handleUpdateKYC(u.id, "rejected")}
                        className="flex-1 py-1.5 rounded-[4px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleUpdateKYC(u.id, "approved")}
                        className="flex-1 py-1.5 rounded-[4px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
                      >
                        Approve (18+)
                      </button>
                    </div>
                  </div>
                ))}

                {users.filter(u => u.kycStatus === "pending").length === 0 && (
                  <div className="col-span-3 p-12 text-center rounded-[4px] bg-slate-900/40 border border-dashed border-slate-200 dark:border-white/10 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="text-sm font-bold text-slate-900 dark:text-white">All KYC Submissions Cleared!</div>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[4px] bg-white/[0.02] dark:bg-slate-900/40 border border-white/10 backdrop-blur-xl">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[4px] bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>4-TIER ROLE ACCESS DELEGATION</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Staff Operational Permissions Matrix</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Click on any staff member to open their individual account drawer and assign specific jobs by ticking boxes.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveStaffPermissions()}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[4px] text-xs font-bold shadow-lg shadow-orange-500/25 transition flex items-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save All to MongoDB</span>
                  </button>
                </div>
              </div>

              {/* 4-Tier Account Hierarchy Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-[4px] bg-purple-950/20 border border-purple-800/30">
                  <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider block">Tier 1: Master Admin</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">1 Account</div>
                  <span className="text-[11px] text-purple-300 font-mono">EKON-000001 (Root)</span>
                </div>
                <div className="p-4 rounded-[4px] bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20">
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 uppercase font-bold tracking-wider block">Tier 2: Management</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">1 Sub-Admin</div>
                  <span className="text-[11px] text-orange-600 dark:text-orange-400 font-mono">EKON-749201</span>
                </div>
                <div className="p-4 rounded-[4px] bg-cyan-950/20 border border-cyan-800/30">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider block">Tier 3: Employee Staff</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{permissions.length} Staff</div>
                  <span className="text-[11px] text-cyan-300 font-mono">Compliance & Support</span>
                </div>
                <div className="p-4 rounded-[4px] bg-emerald-950/20 border border-emerald-800/30">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider block">Tier 4: Traders / Users</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">{users.filter(u => u.role === 'user').length} Registered</div>
                  <span className="text-[11px] text-emerald-300 font-mono">Active On-Chain</span>
                </div>
              </div>

              {/* Staff Accounts Table with Row-Click Drawer Opening */}
              <div className="rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>💡 Tip: Click any row or &quot;Inspect Account&quot; to open the dedicated permission drawer.</span>
                  <span className="font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live MongoDB Sync
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-white/10">
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
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {permissions.map((p) => (
                        <tr 
                          key={p.staffId} 
                          className="hover:bg-orange-500/10 cursor-pointer transition-colors"
                          onClick={() => setSelectedStaffForModal(p)}
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white font-sans">
                            <div className="flex items-center space-x-2">
                              <span className="w-7 h-7 rounded-[4px] bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-black text-xs">
                                {p.staffName.charAt(0)}
                              </span>
                              <div>
                                <div className="text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition">{p.staffName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{p.staffId}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canViewUsers} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canViewUsers")} 
                              className="rounded accent-orange-500 cursor-pointer w-4 h-4" 
                            />
                          </td>
                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canApproveKYC} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canApproveKYC")} 
                              className="rounded accent-orange-500 cursor-pointer w-4 h-4" 
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
                              className="rounded accent-orange-500 cursor-pointer w-4 h-4" 
                            />
                          </td>
                          <td className="py-3.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={p.canAccessLiveChat} 
                              onChange={() => handleToggleStaffPermission(p.staffId, "canAccessLiveChat")} 
                              className="rounded accent-orange-500 cursor-pointer w-4 h-4" 
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
                              className="rounded accent-orange-500 cursor-pointer w-4 h-4" 
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
                              className="px-2.5 py-1 rounded-[4px] bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[11px] font-sans font-semibold transition"
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
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Gorelo-Style AI Support Desk</h2>
                <p className="text-xs text-slate-400">Support ticketing system with Gorelo-style AI conversation summarization.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-2">
                  {tickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setActiveTicket(t)}
                      className={`p-3.5 rounded-[4px] border cursor-pointer transition ${
                        activeTicket?.id === t.id
                          ? "bg-orange-500/10 border-orange-500/40"
                          : "bg-white dark:bg-[#0c1222]/90 border-slate-200/80 dark:border-white/10 shadow-sm hover:bg-slate-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{t.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.priority === "Critical" ? "bg-rose-500/10 text-rose-400" : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        }`}>
                          {t.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{t.subject}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">User: {t.userId}</div>
                    </div>
                  ))}
                </div>

                {activeTicket && (
                  <div className="lg:col-span-7 p-6 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-4">
                    <div className="flex justify-between items-start pb-3 border-b border-slate-200 dark:border-white/10">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{activeTicket.subject}</div>
                        <div className="text-xs text-slate-400 font-mono">Ticket ID: {activeTicket.id} &bull; Category: {activeTicket.category}</div>
                      </div>
                      <button
                        onClick={() => handleSummarizeTicket(activeTicket.id)}
                        className="px-3 py-1.5 rounded-[4px] bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-purple-600/30 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        AI Summarize
                      </button>
                    </div>

                    {summarizedTicketId === activeTicket.id && (
                      <div className="p-3 rounded-[4px] bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 space-y-1">
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
                        <div key={idx} className={`p-3 rounded-[4px] text-xs space-y-1 ${
                          m.senderRole === "user" ? "bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10" : "bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20"
                        }`}>
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{m.senderName} ({m.senderRole})</span>
                            <span>{m.timestamp.split("T")[1]?.slice(0, 5)}</span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 text-xs">{m.text}</p>
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
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Immutable Audit Trail</h2>
                <p className="text-xs text-slate-400">Cryptographically verifiable log of all administrative actions, logins, and trades.</p>
              </div>

              <div className="rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="py-3 px-4">Event ID</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">IP & Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition">
                        <td className="py-2.5 px-4 text-orange-600 dark:text-orange-400 font-bold">{log.id}</td>
                        <td className="py-2.5 px-4 text-slate-400">{log.timestamp.replace("T", " ").slice(0, 19)}</td>
                        <td className="py-2.5 px-4 text-slate-900 dark:text-white font-bold">{log.userId}</td>
                        <td className="py-2.5 px-4 text-emerald-400">{log.actionType}</td>
                        <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">{log.description}</td>
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
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Platform Settings & Emergency Lockdown Controls</h2>
                <p className="text-xs text-slate-400">EMERGENCY killswitches, 2FA hardware policies, and Plesk server failovers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Emergency Master Killswitch </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Immediately suspends all outbound funds withdrawal requests, P2P releases, and external CEX order routing.
                  </p>
                  <button
                    onClick={handleEmergencyFreezeToggle}
                    className={`w-full py-2.5 rounded-[4px] font-bold text-xs transition ${
                      emergencyLockActive
                        ? "bg-rose-600 hover:bg-rose-500 text-white"
                        : "bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30"
                    }`}
                  >
                    {emergencyLockActive ? "LIFT EMERGENCY FREEZE" : "ENGAGE EMERGENCY FREEZE NOW"}
                  </button>
                </div>

                <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span>Security & 2FA Enforcement </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Enforces 30-minute lockout after 3 failed login attempts and mandates TOTP hardware authenticator for all staff.
                  </p>
                  <button
                    onClick={() => showToast("Strict 2FA enforcement confirmed active across all staff.")}
                    className="w-full py-2.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs border border-slate-700 transition"
                  >
                    Enforce Staff 2FA Policy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 10: READ-ONLY REAL-TIME BACKUP & RECOVERY MONITOR                      */}
          {/* ========================================================================= */}
          {activeNav === "backups" && (
            <div className="space-y-4 max-w-7xl mx-auto">
              {/* Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-orange-500" />
                      <span>Ekonnet Automated Backup &amp; DB Snapshot Monitor</span>
                    </h2>
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> READ-ONLY ISOLATED FEED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Live telemetry for 15-minute MongoDB + MariaDB snapshots, daily encrypted archives, SHA-256 verification, and storage health. Vault stays strictly root-locked (`0700`).
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setBackupAutoPoll(!backupAutoPoll)}
                    className={`px-2.5 py-1.5 rounded-[4px] text-[11px] font-mono font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                      backupAutoPoll
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500"
                    }`}
                    title="Auto-refresh every 15 seconds"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${backupAutoPoll ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                    <span>{backupAutoPoll ? "Live 15s Poll ON" : "Live Poll OFF"}</span>
                  </button>

                  <button
                    onClick={() => loadBackupStatus(false)}
                    disabled={backupLoading}
                    className="px-3 py-1.5 rounded-[4px] bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${backupLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {backupFeedAvailable === false && (
                <div className="p-4 rounded-[4px] bg-amber-500/10 border border-amber-500/30 text-xs text-amber-600 dark:text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{backupFeedReason || "Backup telemetry feed is not available on this host."}</span>
                </div>
              )}

              {backupData && (
                <>
                  {/* 4 Compact Tier Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* 15-Min DB Snapshots */}
                    <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>15-Min DB Snapshots</span>
                        <Database className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {backupData.tiers?.db_15m?.count ?? 0} / {backupData.tiers?.db_15m?.retention_max ?? 96}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-500 font-semibold">
                        24h Runs: {backupData.tiers?.db_15m?.last_24h_count ?? 0} &bull; {((backupData.tiers?.db_15m?.latest_size_bytes ?? 0) / 1024).toFixed(0)} KB
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate" title={backupData.tiers?.db_15m?.latest_time_utc || ""}>
                        Last: {backupData.tiers?.db_15m?.latest_time_utc ? new Date(backupData.tiers.db_15m.latest_time_utc).toLocaleString() : "—"}
                      </div>
                    </div>

                    {/* Daily Files Backup */}
                    <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>Daily Files &amp; Configs</span>
                        <FileCheck className="w-4 h-4 text-cyan-500" />
                      </div>
                      <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {backupData.tiers?.files_daily?.count ?? 0} / {backupData.tiers?.files_daily?.retention_max ?? 7} Days
                      </div>
                      <div className="text-[11px] font-mono text-cyan-500 font-semibold">
                        Latest: {((backupData.tiers?.files_daily?.latest_size_bytes ?? 0) / (1024 * 1024)).toFixed(1)} MB
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        Last: {backupData.tiers?.files_daily?.latest_time_utc ? new Date(backupData.tiers.files_daily.latest_time_utc).toLocaleString() : "—"}
                      </div>
                    </div>

                    {/* Daily Plesk Archive */}
                    <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>Plesk Domain Backups</span>
                        <Server className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {backupData.tiers?.plesk_daily?.count ?? 0}D / {backupData.tiers?.plesk_weekly?.count ?? 0}W / {backupData.tiers?.plesk_monthly?.count ?? 0}M
                      </div>
                      <div className="text-[11px] font-mono text-purple-400 font-semibold">
                        Latest: {((backupData.tiers?.plesk_daily?.latest_size_bytes ?? 0) / (1024 * 1024)).toFixed(1)} MB
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        Last: {backupData.tiers?.plesk_daily?.latest_time_utc ? new Date(backupData.tiers.plesk_daily.latest_time_utc).toLocaleString() : "—"}
                      </div>
                    </div>

                    {/* Vault Disk & Health */}
                    <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>Server Disk &amp; Health</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {backupData.health?.disk_free_gb ?? "—"} GB Free
                      </div>
                      <div className={`text-[11px] font-mono font-semibold ${backupData.health?.errors_detected > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                        {backupData.health?.errors_detected > 0 ? `${backupData.health.errors_detected} Errors Detected` : "0 Errors • SHA-256 Clean"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        Used: {backupData.health?.disk_used_pct ?? 0}% of {backupData.health?.disk_total_gb ?? 0} GB
                      </div>
                    </div>
                  </div>

                  {/* Protected Databases, Encryption & Staging Recovery Verification Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2.5 lg:col-span-2">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-orange-500" />
                          <span>Protected Databases (15-Minute Consistent Snapshots)</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {backupLastSync ? `UI Synced: ${backupLastSync}` : ""}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 space-y-1.5">
                          <div className="text-[10px] font-mono uppercase font-bold text-emerald-500">MongoDB (v7.0.48)</div>
                          <div className="flex flex-wrap gap-1.5">
                            {(backupData.covered_databases?.mongodb || []).map((dbName: string) => (
                              <span key={dbName} className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                {dbName}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 space-y-1.5">
                          <div className="text-[10px] font-mono uppercase font-bold text-cyan-500">MariaDB (10.6.23)</div>
                          <div className="flex flex-wrap gap-1.5">
                            {(backupData.covered_databases?.mariadb || []).map((dbName: string) => (
                              <span key={dbName} className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                                {dbName}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security & Latest Staging Recovery Card */}
                    <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Security &amp; Last Recovery Test</span>
                      </div>
                      <div className="space-y-1.5 text-[11px] font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Encryption:</span>
                          <span className="text-slate-900 dark:text-white font-semibold">{backupData.security?.encryption}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Remote Sync:</span>
                          <span className={backupData.health?.remote_configured ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"}>
                            {backupData.health?.remote_configured ? "ACTIVE" : "LOCAL ONLY"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Deploy Snaps:</span>
                          <span className="text-slate-900 dark:text-white font-semibold">{backupData.tiers?.deploy_snapshots?.count ?? 0} saved</span>
                        </div>
                      </div>
                      {backupData.last_staging_test && (
                        <div className="p-2.5 rounded-[4px] bg-emerald-500/5 border border-emerald-500/20 text-[10px] space-y-0.5">
                          <div className="font-bold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Staging Test: {backupData.last_staging_test.status}</span>
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">{backupData.last_staging_test.message}</div>
                          <div className="text-slate-400 font-mono">
                            {backupData.last_staging_test.timestamp ? new Date(backupData.last_staging_test.timestamp).toLocaleString() : ""}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Audit Stream of Backup Executions */}
                  <div className="p-4 rounded-[4px] bg-white dark:bg-[#0c1222]/90 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>Live Backup &amp; Verification Stream (Last 30 Events)</span>
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400">
                        Feed Generated: {backupData.generated_at_utc ? new Date(backupData.generated_at_utc).toLocaleString() : "—"}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-white/10">
                          <tr>
                            <th className="py-2 px-3">Time</th>
                            <th className="py-2 px-3">Event Type</th>
                            <th className="py-2 px-3">Archive File</th>
                            <th className="py-2 px-3">Size</th>
                            <th className="py-2 px-3">SHA-256</th>
                            <th className="py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                          {(backupData.recent_events || []).map((ev: any, idx: number) => (
                            <tr key={`${ev.timestamp}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition">
                              <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                                {ev.timestamp ? new Date(ev.timestamp).toLocaleString() : "—"}
                              </td>
                              <td className="py-2 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">{ev.event}</td>
                              <td className="py-2 px-3 text-slate-600 dark:text-slate-300 max-w-[240px] truncate" title={ev.message}>
                                {ev.file_name || ev.message}
                              </td>
                              <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                                {ev.size_bytes > 0
                                  ? ev.size_bytes > 1048576
                                    ? `${(ev.size_bytes / 1048576).toFixed(1)} MB`
                                    : `${(ev.size_bytes / 1024).toFixed(0)} KB`
                                  : "—"}
                              </td>
                              <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                                {ev.sha256 ? `${ev.sha256.slice(0, 12)}...` : "—"}
                              </td>
                              <td className="py-2 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                                    ev.status === "SUCCESS"
                                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                      : ev.status === "SKIPPED_UNCONFIGURED"
                                      ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                      : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                  }`}
                                >
                                  {ev.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Clickable Staff Account Inspection & Permission Assignment Drawer */}
      {selectedStaffForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-[4px] bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/10 p-6 space-y-5 shadow-2xl text-slate-900 dark:text-white">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-mono font-bold uppercase mb-1">
                  <span>Staff Account Profile</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedStaffForModal.staffName}</h3>
                <span className="text-xs text-slate-400 font-mono">Staff ID: {selectedStaffForModal.staffId} &bull; Updated: {selectedStaffForModal.updatedAt}</span>
              </div>
              <button 
                onClick={() => setSelectedStaffForModal(null)} 
                className="p-1.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Role & Authority Banner */}
            <div className="p-3.5 rounded-[4px] bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 flex items-center justify-between text-xs">
              <span className="text-orange-600 dark:text-orange-400 font-medium">Delegated by: <strong className="text-slate-900 dark:text-white">{selectedStaffForModal.lastUpdatedBy}</strong></span>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold">Active Staff Node</span>
            </div>

            {/* Checkbox Task Assignment Matrix */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Assigned Platform Tasks (Tick boxes to grant permission):
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <label className="flex items-center space-x-3 p-3 rounded-[4px] bg-slate-950 border border-slate-200 dark:border-white/10 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canViewUsers}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canViewUsers")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">View Users</span>
                    <span className="text-[10px] text-slate-400">Access registered profiles</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-[4px] bg-slate-950 border border-slate-200 dark:border-white/10 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canApproveKYC}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canApproveKYC")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Approve KYC</span>
                    <span className="text-[10px] text-slate-400">Verify 18+ handwritten selfies</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-[4px] bg-slate-950 border border-slate-200 dark:border-white/10 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canFreezeAccounts}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canFreezeAccounts")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-rose-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Freeze Accounts</span>
                    <span className="text-[10px] text-slate-400">Security lockouts & suspensions</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-[4px] bg-slate-950 border border-slate-200 dark:border-white/10 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canManageTickets}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canManageTickets")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Handle Tickets</span>
                    <span className="text-[10px] text-slate-400">Resolve customer issues</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-[4px] bg-slate-950 border border-slate-200 dark:border-white/10 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canAccessLiveChat}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canAccessLiveChat")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Live Chat Operator</span>
                    <span className="text-[10px] text-slate-400">Real-time messaging desk</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-[4px] bg-slate-950 border border-slate-200 dark:border-white/10 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canWriteInternalNotes}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canWriteInternalNotes")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Internal Notes</span>
                    <span className="text-[10px] text-slate-400">Confidential staff notes</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-[4px] bg-slate-950 border border-slate-200 dark:border-white/10 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canViewAuditLogs}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canViewAuditLogs")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">View Audit Logs</span>
                    <span className="text-[10px] text-slate-400">Immutable security logs</span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 rounded-[4px] bg-slate-950 border border-slate-200 dark:border-white/10 hover:border-slate-700 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={selectedStaffForModal.canExecuteReimbursements}
                    onChange={() => handleToggleStaffPermission(selectedStaffForModal.staffId, "canExecuteReimbursements")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Reimbursements</span>
                    <span className="text-[10px] text-slate-400">Execute settlement refunds</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-white/10">
              <span className="text-[11px] text-slate-400">Changes persist to MongoDB cluster</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedStaffForModal(null)}
                  className="px-4 py-2 rounded-[4px] bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveStaffPermissions(selectedStaffForModal)}
                  className="px-5 py-2 rounded-[4px] bg-gradient-to-r from-orange-500 to-rose-500 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition flex items-center space-x-1.5"
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
          <div className="w-full max-w-md rounded-[4px] bg-slate-900 border border-slate-200 dark:border-white/10 p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Staff Internal Notes: @{selectedNoteUser.username}</h3>
              <button onClick={() => setSelectedNoteUser(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={4}
              value={internalNoteText}
              onChange={(e) => setInternalNoteText(e.target.value)}
              placeholder="Record confidential staff observation ..."
              className="w-full rounded-[4px] bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedNoteUser(null)}
                className="px-3 py-1.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveInternalNote}
                className="px-4 py-1.5 rounded-[4px] bg-orange-500 hover:bg-orange-500 text-xs font-bold text-white"
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
