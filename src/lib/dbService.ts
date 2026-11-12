import { getDatabase } from "./mongodb";
import { User, StaffPermission, SupportTicket, InternalStaffNote, AuditLogItem } from "./types";
import { MOCK_USERS, MOCK_STAFF_PERMISSIONS, MOCK_SUPPORT_TICKETS, MOCK_AUDIT_LOGS } from "./mockData";

// In-memory fallback caches
let memoryUsers: User[] = [...MOCK_USERS];
let memoryPermissions: StaffPermission[] = [...MOCK_STAFF_PERMISSIONS];
let memoryTickets: SupportTicket[] = [...MOCK_SUPPORT_TICKETS];
let memoryNotes: InternalStaffNote[] = [
  {
    id: "NOTE-1",
    targetUserId: "EKON-739102",
    staffId: "STAFF-101",
    staffName: "Sarah Jenkins",
    noteText: "Examined passport and handwritten note. Note text matches date format. Pending secondary signature check.",
    actionTaken: "KYC Review Ongoing",
    createdAt: "2026-10-27 11:50 AM",
  }
];
let memoryAuditLogs: AuditLogItem[] = [...MOCK_AUDIT_LOGS];

export interface SettlementOffer {
  id: string;
  offerType: "BUY" | "SELL";
  creatorId: string;
  creatorName: string;
  cryptoSymbol: "BTC" | "ETH" | "XRP" | "BCH";
  fiatCurrency: "USD";
  amount: number;
  pricePerUnit: number;
  totalFiat: number;
  paymentRail: "Direct Wire" | "Wise" | "Revolut" | "SEPA" | "Local Bank";
  status: "OPEN" | "LOCKED" | "PAYMENT_SENT" | "COMPLETED" | "CANCELLED" | "DISPUTED";
  buyerId?: string;
  buyerName?: string;
  createdAt: string;
  lockedAt?: string;
  releasedAt?: string;
}

let memoryOffers: SettlementOffer[] = [
  {
    id: "SETTLE-84910",
    offerType: "SELL",
    creatorId: "EKON-819204",
    creatorName: "Alexander Vance",
    cryptoSymbol: "BTC",
    fiatCurrency: "USD",
    amount: 0.25,
    pricePerUnit: 67200,
    totalFiat: 16800,
    paymentRail: "Direct Wire",
    status: "OPEN",
    createdAt: "2026-11-06T10:00:00Z"
  },
  {
    id: "SETTLE-84911",
    offerType: "BUY",
    creatorId: "EKON-912847",
    creatorName: "Tariq Al-Mansoor",
    cryptoSymbol: "ETH",
    fiatCurrency: "USD",
    amount: 5.0,
    pricePerUnit: 3500,
    totalFiat: 17500,
    paymentRail: "Wise",
    status: "OPEN",
    createdAt: "2026-11-06T11:15:00Z"
  }
];

// --- USERS ---
export async function getUsers(): Promise<User[]> {
  try {
    const db = await getDatabase();
    if (db) {
      const dbUsers = await db.collection("users").find({}).toArray();
      if (dbUsers.length > 0) {
        return dbUsers.map(u => ({
          id: u.id,
          username: u.username,
          password: u.password,
          fullName: u.fullName,
          role: u.role,
          emails: u.emails || [u.email],
          phones: u.phones || [u.phone],
          dateOfBirth: u.dateOfBirth || "1990-01-01",
          age: u.age || 30,
          country: u.country || "Global",
          city: u.city || "Hub",
          kycStatus: u.kycStatus || "pending",
          kycDocumentUrl: u.kycDocumentUrl,
          kycNoteVerified: u.kycNoteVerified,
          packageTier: u.packageTier || "Free",
          isLocked: !!u.isLocked,
          lockoutUntil: u.lockoutUntil,
          failedLoginAttempts: u.failedLoginAttempts || 0,
          twoFactorEnabled: !!u.twoFactorEnabled,
          twoFactorType: u.twoFactorType || "totp",
          createdAt: u.createdAt || new Date().toISOString(),
          walletBalances: u.walletBalances || { USD: 0, BTC: 0, XRP: 0, ETH: 0, BCH: 0 }
        }));
      }
    }
  } catch (err) {
    console.warn("DB fallback: users", err);
  }
  return memoryUsers;
}

export async function getUserById(identifier: string): Promise<User | null> {
  const users = await getUsers();
  const lower = identifier.toLowerCase();
  return users.find(u => u.id.toLowerCase() === lower || u.username.toLowerCase() === lower || u.emails.some(e => e.toLowerCase() === lower)) || null;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("users").updateOne({ id: userId }, { $set: updates });
    }
  } catch (err) {
    console.warn("DB fallback updateUser", err);
  }
  // Update memory
  memoryUsers = memoryUsers.map(u => u.id === userId ? { ...u, ...updates } : u);
  return true;
}

export async function createUser(user: User): Promise<User> {
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("users").insertOne(user);
      await db.collection("wallets").insertOne({
        userId: user.id,
        balances: user.walletBalances,
        createdAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.warn("DB fallback createUser", err);
  }
  memoryUsers.unshift(user);
  return user;
}

// --- STAFF PERMISSIONS ---
export async function getStaffPermissions(): Promise<StaffPermission[]> {
  try {
    const db = await getDatabase();
    if (db) {
      const perms = await db.collection("staff_permissions").find({}).toArray();
      if (perms.length > 0) {
        return perms.map(p => ({
          staffId: p.staffId,
          staffName: p.staffName,
          role: p.role || "staff",
          canViewUsers: !!p.canViewUsers,
          canApproveKYC: !!p.canApproveKYC,
          canFreezeAccounts: !!p.canFreezeAccounts,
          canManageTickets: !!p.canManageTickets,
          canAccessLiveChat: !!p.canAccessLiveChat,
          canWriteInternalNotes: !!p.canWriteInternalNotes,
          canViewAuditLogs: !!p.canViewAuditLogs,
          canExecuteReimbursements: !!p.canExecuteReimbursements,
          sectionPermissions: p.sectionPermissions || undefined,
          lastUpdatedBy: p.lastUpdatedBy || "Master Admin",
          updatedAt: p.updatedAt || new Date().toISOString()
        }));
      }
    }
  } catch (err) {
    console.warn("DB fallback: staff_permissions", err);
  }
  return memoryPermissions;
}

export async function updateStaffPermission(staffId: string, perms: Partial<StaffPermission>, updatedBy: string): Promise<boolean> {
  const { ...cleanPerms } = perms;
  const payload = {
    ...cleanPerms,
    staffId,
    updatedAt: new Date().toISOString(),
    lastUpdatedBy: updatedBy
  };
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("staff_permissions").updateOne(
        { staffId },
        { $set: payload },
        { upsert: true }
      );
    }
  } catch (err) {
    console.warn("DB fallback updateStaffPermission", err);
  }
  const exists = memoryPermissions.some(p => p.staffId === staffId);
  if (exists) {
    memoryPermissions = memoryPermissions.map(p => p.staffId === staffId ? { ...p, ...payload } : p);
  } else {
    memoryPermissions = [...memoryPermissions, payload as StaffPermission];
  }
  return true;
}

// --- INTERNAL STAFF NOTES ---
export async function getInternalNotes(targetUserId?: string): Promise<InternalStaffNote[]> {
  try {
    const db = await getDatabase();
    if (db) {
      const query = targetUserId ? { targetUserId } : {};
      const notes = await db.collection("internal_notes").find(query).sort({ createdAt: -1 }).toArray();
      if (notes.length > 0) {
        return notes.map(n => ({
          id: n.id || n._id.toString(),
          targetUserId: n.targetUserId,
          staffId: n.staffId,
          staffName: n.staffName,
          noteText: n.noteText,
          actionTaken: n.actionTaken || "Internal Observation",
          createdAt: n.createdAt
        }));
      }
    }
  } catch (err) {
    console.warn("DB fallback getInternalNotes", err);
  }
  return targetUserId ? memoryNotes.filter(n => n.targetUserId === targetUserId) : memoryNotes;
}

export async function addInternalNote(note: Omit<InternalStaffNote, "id" | "createdAt">): Promise<InternalStaffNote> {
  const newNote: InternalStaffNote = {
    id: `NOTE-${Date.now()}`,
    ...note,
    createdAt: new Date().toLocaleString()
  };
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("internal_notes").insertOne(newNote);
    }
  } catch (err) {
    console.warn("DB fallback addInternalNote", err);
  }
  memoryNotes.unshift(newNote);
  return newNote;
}

// --- AUDIT LOGS ---
export async function getAuditLogs(): Promise<AuditLogItem[]> {
  try {
    const db = await getDatabase();
    if (db) {
      const logs = await db.collection("audit_logs").find({}).sort({ timestamp: -1 }).limit(100).toArray();
      if (logs.length > 0) {
        return logs.map(l => ({
          id: l.id || l._id.toString(),
          userId: l.userId || l.actorId || "EKON-000001",
          userName: l.userName || l.actorName || "Master Admin",
          role: l.role || l.actorRole || "master_admin",
          actionType: (l.actionType || "LOGIN") as any,
          description: l.description || l.details || l.detailsJson || "System event",
          ipAddress: l.ipAddress || "82.165.10.77",
          location: l.location || "Sovereign Node",
          status: l.status === "FAILURE" ? "FAILED" : (l.status || "SUCCESS"),
          timestamp: l.timestamp || new Date().toISOString()
        }));
      }
    }
  } catch (err) {
    console.warn("DB fallback getAuditLogs", err);
  }
  return memoryAuditLogs;
}

export async function createAuditLog(log: Omit<AuditLogItem, "id" | "timestamp">): Promise<AuditLogItem> {
  const newLog: AuditLogItem = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...log
  };
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("audit_logs").insertOne(newLog);
    }
  } catch (err) {
    console.warn("DB fallback createAuditLog", err);
  }
  memoryAuditLogs.unshift(newLog);
  return newLog;
}

// --- SUPPORT TICKETS ---
export async function getSupportTickets(): Promise<SupportTicket[]> {
  try {
    const db = await getDatabase();
    if (db) {
      const tickets = await db.collection("support_tickets").find({}).sort({ updatedAt: -1 }).toArray();
      if (tickets.length > 0) {
        return tickets.map(t => ({
          id: t.id || t._id.toString(),
          ticketNumber: t.ticketNumber,
          userId: t.userId,
          userName: t.userName,
          assignedStaffId: t.assignedStaffId,
          assignedStaffName: t.assignedStaffName,
          subject: t.subject,
          category: t.category,
          status: t.status,
          priority: t.priority,
          aiSummary: t.aiSummary,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          messages: t.messages || []
        }));
      }
    }
  } catch (err) {
    console.warn("DB fallback getSupportTickets", err);
  }
  return memoryTickets;
}

export async function addTicketMessage(ticketId: string, message: {
  senderId: string;
  senderName: string;
  senderRole: User["role"];
  text: string;
}): Promise<boolean> {
  const msgObj = {
    ...message,
    timestamp: new Date().toISOString()
  };
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("support_tickets").updateOne(
        { id: ticketId },
        { 
          $push: { messages: msgObj as any },
          $set: { updatedAt: new Date().toISOString() }
        }
      );
    }
  } catch (err) {
    console.warn("DB fallback addTicketMessage", err);
  }
  memoryTickets = memoryTickets.map(t => {
    if (t.id === ticketId) {
      return {
        ...t,
        updatedAt: new Date().toISOString(),
        messages: [...t.messages, msgObj]
      };
    }
    return t;
  });
  return true;
}

// --- DIRECT MILESTONE SETTLEMENT (P2P) ---
export async function getSettlementOffers(): Promise<SettlementOffer[]> {
  try {
    const db = await getDatabase();
    if (db) {
      const offers = await db.collection("settlement_offers").find({}).sort({ createdAt: -1 }).toArray();
      if (offers.length > 0) {
        return offers.map(o => ({
          id: o.id || o._id.toString(),
          offerType: o.offerType,
          creatorId: o.creatorId,
          creatorName: o.creatorName,
          cryptoSymbol: o.cryptoSymbol,
          fiatCurrency: o.fiatCurrency,
          amount: o.amount,
          pricePerUnit: o.pricePerUnit,
          totalFiat: o.totalFiat,
          paymentRail: o.paymentRail,
          status: o.status,
          buyerId: o.buyerId,
          buyerName: o.buyerName,
          createdAt: o.createdAt,
          lockedAt: o.lockedAt,
          releasedAt: o.releasedAt
        }));
      }
    }
  } catch (err) {
    console.warn("DB fallback getSettlementOffers", err);
  }
  return memoryOffers;
}

export async function createSettlementOffer(offerData: Omit<SettlementOffer, "id" | "createdAt" | "status">): Promise<SettlementOffer> {
  const newOffer: SettlementOffer = {
    id: `SETTLE-${Date.now().toString().slice(-6)}`,
    ...offerData,
    status: "OPEN",
    createdAt: new Date().toISOString()
  };
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("settlement_offers").insertOne(newOffer);
    }
  } catch (err) {
    console.warn("DB fallback createSettlementOffer", err);
  }
  memoryOffers.unshift(newOffer);
  return newOffer;
}

export async function advanceSettlementState(offerId: string, action: "lock" | "confirm_payment" | "release" | "dispute", actorId: string, actorName?: string): Promise<{ success: boolean; message: string; offer?: SettlementOffer }> {
  const offers = await getSettlementOffers();
  const offer = offers.find(o => o.id === offerId);
  if (!offer) return { success: false, message: "Settlement trade not found." };

  let nextStatus: SettlementOffer["status"] = offer.status;
  const updates: Partial<SettlementOffer> = {};

  if (action === "lock") {
    if (offer.status !== "OPEN") return { success: false, message: "Trade is not open for settlement lock." };
    nextStatus = "LOCKED";
    updates.status = "LOCKED";
    updates.buyerId = actorId;
    updates.buyerName = actorName || "Buyer";
    updates.lockedAt = new Date().toISOString();
  } else if (action === "confirm_payment") {
    if (offer.status !== "LOCKED") return { success: false, message: "Trade is not in locked state." };
    nextStatus = "PAYMENT_SENT";
    updates.status = "PAYMENT_SENT";
  } else if (action === "release") {
    if (offer.status !== "PAYMENT_SENT" && offer.status !== "LOCKED") return { success: false, message: "Payment must be indicated before release." };
    nextStatus = "COMPLETED";
    updates.status = "COMPLETED";
    updates.releasedAt = new Date().toISOString();
  } else if (action === "dispute") {
    nextStatus = "DISPUTED";
    updates.status = "DISPUTED";
  }

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection("settlement_offers").updateOne({ id: offerId }, { $set: updates });
    }
  } catch (err) {
    console.warn("DB fallback advanceSettlementState", err);
  }

  memoryOffers = memoryOffers.map(o => o.id === offerId ? { ...o, ...updates } : o);
  return { success: true, message: `Trade successfully advanced to ${nextStatus}`, offer: { ...offer, ...updates } };
}

// --- WALLET TRANSFERS & AUTOMATED FEES ---
export async function executeWalletTransfer(
  senderId: string,
  receiverId: string,
  currency: "USD" | "BTC" | "XRP" | "ETH" | "BCH",
  amount: number
): Promise<{ success: boolean; message: string; feeCharged: number; netAmount: number }> {
  if (amount <= 0) return { success: false, message: "Amount must be positive", feeCharged: 0, netAmount: 0 };

  const sender = await getUserById(senderId);
  const receiver = await getUserById(receiverId);

  if (!sender) return { success: false, message: "Sender not found", feeCharged: 0, netAmount: 0 };
  if (!receiver) return { success: false, message: "Receiver not found", feeCharged: 0, netAmount: 0 };

  const currentBalance = sender.walletBalances[currency] || 0;
  // Automated Platform Fee: 0.15% (Section 26 & Section 27)
  const feeCharged = Number((amount * 0.0015).toFixed(currency === "USD" ? 2 : 6));
  const totalRequired = amount;
  const netAmount = Number((amount - feeCharged).toFixed(currency === "USD" ? 2 : 6));

  if (currentBalance < totalRequired) {
    return { success: false, message: `Insufficient ${currency} balance. Required: ${totalRequired}, Available: ${currentBalance}`, feeCharged, netAmount };
  }

  const newSenderBal = Number((currentBalance - totalRequired).toFixed(currency === "USD" ? 2 : 6));
  const newReceiverBal = Number(((receiver.walletBalances[currency] || 0) + netAmount).toFixed(currency === "USD" ? 2 : 6));

  await updateUser(senderId, {
    walletBalances: {
      ...sender.walletBalances,
      [currency]: newSenderBal
    }
  });

  await updateUser(receiverId, {
    walletBalances: {
      ...receiver.walletBalances,
      [currency]: newReceiverBal
    }
  });

  // Log to audit
  await createAuditLog({
    userId: senderId,
    userName: sender.fullName,
    role: sender.role,
    actionType: "WALLET_TRANSFER",
    description: `Transfer ${amount} ${currency} to ${receiverId}. Fee collected: ${feeCharged} ${currency}`,
    ipAddress: "82.165.10.77",
    location: "Direct Clearing Node",
    status: "SUCCESS"
  });

  return { success: true, message: `Successfully transferred ${netAmount} ${currency} (Platform Fee: ${feeCharged} ${currency})`, feeCharged, netAmount };
}
