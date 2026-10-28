// Ekonnet Platform Core Types & Interfaces

export type UserRole = 'master_admin' | 'management' | 'staff' | 'user' | 'visitor';

export type KYCStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string; // Auto-generated e.g. "EKON-948210"
  username: string;
  fullName: string;
  role: UserRole;
  emails: string[]; // Primary, secondary, tertiary (Section 30)
  phones: string[]; // 2 phone numbers
  dateOfBirth: string;
  age: number;
  country: string;
  city: string;
  kycStatus: KYCStatus;
  kycDocumentUrl?: string;
  kycNoteVerified?: boolean;
  packageTier: 'Free' | 'Pro Trader' | 'Institutional' | 'Enterprise';
  isLocked: boolean;
  lockoutUntil?: string;
  failedLoginAttempts: number;
  twoFactorEnabled: boolean;
  twoFactorType?: 'totp' | 'email' | 'hardware';
  createdAt: string;
  walletBalances: {
    USD: number;
    BTC: number;
    XRP: number;
    ETH: number;
    BCH: number;
  };
}

export interface StaffPermission {
  staffId: string;
  staffName: string;
  canViewUsers: boolean;
  canApproveKYC: boolean;
  canFreezeAccounts: boolean;
  canManageTickets: boolean;
  canAccessLiveChat: boolean;
  canWriteInternalNotes: boolean;
  canViewAuditLogs: boolean;
  canExecuteReimbursements: boolean;
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  category: 'Crypto' | 'Forex' | 'Shares';
  basePair: 'USD' | 'BTC' | 'XRP' | 'ETH' | 'BCH';
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  sparkline: number[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  subject: string;
  category: 'Trading' | 'KYC Verification' | 'Deposit/Withdrawal' | 'Security Issue' | 'General';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  aiSummary?: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    text: string;
    attachments?: string[];
    timestamp: string;
  }>;
}

export interface InternalStaffNote {
  id: string;
  targetUserId: string;
  staffId: string;
  staffName: string;
  noteText: string;
  actionTaken: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  actionType: 'LOGIN' | 'TRADE_EXEC' | 'KYC_REVIEW' | 'WALLET_TRANSFER' | 'PERM_CHANGE' | 'ACCOUNT_LOCK';
  description: string;
  ipAddress: string;
  location: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  timestamp: string;
}
