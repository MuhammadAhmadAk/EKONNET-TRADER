/**
 * Ekonnet Modular Multi-Database Architecture Schema
 * Strict separation of concerns across enterprise micro-domains:
 * - IAM & Access Control (ekonnet_iam)
 * - Treasury Ledger & Double-Entry Accounting (ekonnet_ledger)
 * - Direct P2P Settlement Vault (ekonnet_p2p)
 * - Spot Trading Execution Engine (ekonnet_trading)
 * - Compliance & Support (ekonnet_compliance)
 */

export const DB_NAMES = {
  IAM: process.env.DB_IAM || "ekonnet_iam",
  LEDGER: process.env.DB_LEDGER || "ekonnet_ledger",
  P2P: process.env.DB_P2P || "ekonnet_p2p",
  TRADING: process.env.DB_TRADING || "ekonnet_trading",
  COMPLIANCE: process.env.DB_COMPLIANCE || "ekonnet_compliance",
  LEGACY: "ekonnet_trader_db",
} as const;

// 1. IAM & ACCESS CONTROL
export interface UserRecord {
  id: string;
  username: string;
  fullName: string;
  role: "master_admin" | "management" | "staff" | "user";
  emails: string[];
  phones?: string[];
  dateOfBirth?: string;
  country?: string;
  city?: string;
  kycStatus: "unverified" | "pending" | "approved" | "rejected";
  kycDocumentUrl?: string;
  password: string; // Salted Bcrypt Hash
  packageTier: "Free" | "Pro Trader" | "Enterprise";
  isLocked: boolean;
  failedLoginAttempts: number;
  twoFactorEnabled: boolean;
  twoFactorType?: "totp" | "sms" | "email";
  walletBalances: {
    USD: number;
    BTC: number;
    XRP: number;
    ETH: number;
    BCH: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface StaffPermissionRecord {
  staffId: string;
  staffName: string;
  role: "master_admin" | "management" | "staff";
  canViewUsers: boolean;
  canApproveKYC: boolean;
  canFreezeAccounts: boolean;
  canManageTickets: boolean;
  canAccessLiveChat: boolean;
  canWriteInternalNotes: boolean;
  canViewAuditLogs: boolean;
  canExecuteReimbursements: boolean;
  sectionPermissions?: Record<string, Record<string, boolean>>;
  lastUpdatedBy: string;
  updatedAt: string;
}

export interface AuditLogRecord {
  id?: string;
  userId: string;
  userName: string;
  role: string;
  actionType: string;
  description: string;
  ipAddress: string;
  location?: string;
  status: "SUCCESS" | "FAILURE";
  timestamp: string;
}

// 2. TREASURY LEDGER & SETTLEMENT
export interface WalletRecord {
  userId: string;
  username: string;
  balances: {
    USD: number;
    BTC: number;
    XRP: number;
    ETH: number;
    BCH: number;
  };
  lockedBalances?: {
    USD: number;
    BTC: number;
    XRP: number;
    ETH: number;
    BCH: number;
  };
  updatedAt: string;
}

export interface DepositRequestRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: "USD" | "PKR" | "EUR" | "GBP" | "BTC" | "ETH" | "USDT";
  paymentRail: "Direct Wire" | "Raast" | "Local Bank" | "Wise" | "Revolut" | "Crypto";
  transactionRef: string;
  slipImageUrl?: string;
  cvVerification?: {
    status: "PASS" | "WARN" | "FAIL";
    confidenceScore: number;
    sharpnessScore: number;
    details: string;
    verifiedAt: string;
  };
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface WithdrawalRequestRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  destinationAccount: string;
  destinationRail: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  authorizedByOfficer1?: string;
  authorizedByOfficer2?: string;
  createdAt: string;
  processedAt?: string;
}

export interface LedgerJournalRecord {
  id: string;
  transactionType: "DEPOSIT" | "WITHDRAWAL" | "TRADE_SETTLEMENT" | "P2P_RELEASE" | "PLATFORM_FEE";
  debitAccount: string;
  creditAccount: string;
  amount: number;
  currency: string;
  referenceId: string;
  description: string;
  timestamp: string;
}

// 3. P2P DIRECT SETTLEMENT VAULT
export interface P2POfferRecord {
  id: string;
  offerType: "BUY" | "SELL";
  creatorId: string;
  creatorName: string;
  cryptoSymbol: "BTC" | "ETH" | "XRP" | "BCH";
  fiatCurrency: string;
  amount: number;
  pricePerUnit: number;
  totalFiat: number;
  paymentRail: string;
  status: "OPEN" | "LOCKED" | "COMPLETED" | "CANCELLED" | "DISPUTED";
  createdAt: string;
}

export interface P2POrderRecord {
  id: string;
  offerId: string;
  makerId: string;
  takerId: string;
  cryptoSymbol: string;
  amount: number;
  fiatAmount: number;
  status: "VAULT_LOCKED" | "PAYMENT_SENT" | "RELEASED" | "DISPUTED" | "CANCELLED";
  lockedAt: string;
  releasedAt?: string;
}

// 4. SPOT TRADING & MATCHING
export interface TradingOrderRecord {
  id: string;
  userId: string;
  symbol: string;
  side: "BUY" | "SELL";
  type: "LIMIT" | "MARKET";
  price: number;
  amount: number;
  filled: number;
  status: "OPEN" | "PARTIAL" | "FILLED" | "CANCELLED";
  createdAt: string;
}

export interface TradeExecutionRecord {
  id: string;
  symbol: string;
  makerOrderId: string;
  takerOrderId: string;
  price: number;
  amount: number;
  feeCollected: number;
  timestamp: string;
}
