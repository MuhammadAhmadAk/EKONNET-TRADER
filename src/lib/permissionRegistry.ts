// Ekonnet Section-Wise Granular Permission Registry
// Supports different tick-boxes per section (where tools differ) and shared templates (where tools are similar),
// for both Management Account Holders (Tier 2) and Employee Staff (Tier 3).

export interface PermissionBoxDefinition {
  key: string;
  label: string;
  description: string;
  accent?: "orange" | "emerald" | "rose" | "purple" | "blue";
}

export interface PlatformSectionDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  boxes: PermissionBoxDefinition[];
}

// Shared trading boxes template for sections with similar market/order tools
const SHARED_TRADING_BOXES: PermissionBoxDefinition[] = [
  {
    key: "view_orders",
    label: "View Orders & Positions",
    description: "Inspect live order book and user positions",
    accent: "blue",
  },
  {
    key: "toggle_module_maintenance",
    label: "Pause / Resume Module",
    description: "Toggle selective maintenance mode for this market",
    accent: "rose",
  },
];

export const EKONNET_SECTIONS: PlatformSectionDefinition[] = [
  {
    id: "users_governance",
    name: "User & Account Governance",
    category: "Core",
    description: "Profile inspection, security lockouts, 2FA resets, and staff delegation",
    boxes: [
      {
        key: "view_profiles",
        label: "View User Profiles",
        description: "Access registered trader details and tier info",
        accent: "blue",
      },
      {
        key: "freeze_accounts",
        label: "Freeze / Lock Accounts",
        description: "Trigger security lockouts or account suspensions",
        accent: "rose",
      },
      {
        key: "reset_2fa",
        label: "Reset User 2FA",
        description: "Assist locked users with TOTP / 2FA recovery",
        accent: "orange",
      },
      {
        key: "write_internal_notes",
        label: "Write Confidential Notes",
        description: "Add private staff-only notes on user profiles",
        accent: "purple",
      },
      {
        key: "delegate_staff_tasks",
        label: "Assign Staff Checkboxes",
        description: "Delegate permitted section tasks to staff members",
        accent: "emerald",
      },
    ],
  },
  {
    id: "kyc_compliance",
    name: "KYC & Identity Compliance",
    category: "Compliance",
    description: "4-step ID verification, Python computer vision scan, and tier approvals",
    boxes: [
      {
        key: "view_kyc_docs",
        label: "View ID & Address Docs",
        description: "Inspect uploaded CNIC, Passport, and utility bills",
        accent: "blue",
      },
      {
        key: "run_vision_scan",
        label: "Run AI / Vision Check",
        description: "Trigger automated clarity & biometric selfie scan",
        accent: "purple",
      },
      {
        key: "approve_kyc",
        label: "Approve KYC Tier",
        description: "Verify and upgrade trader compliance status",
        accent: "emerald",
      },
      {
        key: "reject_kyc",
        label: "Reject KYC Submission",
        description: "Decline invalid documents with audit reason",
        accent: "rose",
      },
    ],
  },
  {
    id: "payments_deposits",
    name: "Payments & Deposit Pipeline",
    category: "Finance",
    description: "In-house multi-rail deposits, bank slip verification, and wallet crediting",
    boxes: [
      {
        key: "view_deposits",
        label: "View Deposit Requests",
        description: "Monitor incoming Swift, SEPA, and Wise transfers",
        accent: "blue",
      },
      {
        key: "verify_receipts",
        label: "Verify Bank Receipts",
        description: "Validate uploaded payment slips and proof hashes",
        accent: "orange",
      },
      {
        key: "approve_credit_wallet",
        label: "Approve & Credit Wallet",
        description: "Release funds to user multi-currency ledger",
        accent: "emerald",
      },
      {
        key: "reject_deposit",
        label: "Reject Deposit",
        description: "Flag and decline unverified deposit proofs",
        accent: "rose",
      },
      {
        key: "execute_reimbursements",
        label: "Execute Reimbursements",
        description: "Process settlement refunds and ledger adjustments",
        accent: "purple",
      },
    ],
  },
  {
    id: "crypto_trading",
    name: "Crypto P2P & Direct Settlement",
    category: "Trading",
    description: "P2P order book oversight, dispute resolution, and direct coin settlement",
    boxes: [
      ...SHARED_TRADING_BOXES,
      {
        key: "manage_p2p_disputes",
        label: "Resolve P2P Disputes",
        description: "Intervene and settle contested P2P trades",
        accent: "orange",
      },
      {
        key: "execute_direct_settlement",
        label: "Direct Coin Settlement",
        description: "Authorize direct inventory crypto settlement",
        accent: "emerald",
      },
    ],
  },
  {
    id: "forex_trading",
    name: "Forex Trading Desk",
    category: "Trading",
    description: "Major/minor FX pairs, spread controls, and leverage limits",
    boxes: [
      ...SHARED_TRADING_BOXES,
      {
        key: "adjust_spreads_leverage",
        label: "Adjust Spreads & Leverage",
        description: "Configure pip spreads and 1:30–1:500 leverage tiers",
        accent: "orange",
      },
    ],
  },
  {
    id: "shares_trading",
    name: "Shares & Equities Desk",
    category: "Trading",
    description: "Global equity quotes, fractional share limits, and market feeds",
    boxes: [
      ...SHARED_TRADING_BOXES,
      {
        key: "manage_fractional_limits",
        label: "Manage Fractional Limits",
        description: "Set minimum/maximum fractional equity order limits",
        accent: "emerald",
      },
    ],
  },
  {
    id: "support_desk",
    name: "Live Support & Ticketing",
    category: "Support",
    description: "24/7 floating live chat, support tickets, ratings, and abuse filter",
    boxes: [
      {
        key: "access_live_chat",
        label: "Live Chat Operator",
        description: "Respond to real-time user chat sessions",
        accent: "blue",
      },
      {
        key: "manage_tickets",
        label: "Handle Support Tickets",
        description: "Assign, reply, and close customer tickets",
        accent: "emerald",
      },
      {
        key: "view_staff_ratings",
        label: "View 0–10 Staff Ratings",
        description: "Review post-chat customer evaluation scores",
        accent: "orange",
      },
      {
        key: "manage_abuse_scanner",
        label: "Manage Abuse Filter",
        description: "Review flagged vulgarity and abuse reports",
        accent: "rose",
      },
    ],
  },
  {
    id: "security_audit",
    name: "Security & Audit Logs",
    category: "Governance",
    description: "Immutable admin/staff audit trail and system-wide telemetry",
    boxes: [
      {
        key: "view_audit_logs",
        label: "View Immutable Audit Logs",
        description: "Inspect IP, timestamp, and action history",
        accent: "blue",
      },
      {
        key: "export_compliance_reports",
        label: "Export Compliance Reports",
        description: "Download CSV/PDF audit and ledger summaries",
        accent: "emerald",
      },
      {
        key: "manage_system_status",
        label: "Global System Switchboard",
        description: "Control platform-wide maintenance and API status",
        accent: "rose",
      },
    ],
  },
];

export type SectionPermissionsMap = Record<string, Record<string, boolean>>;

export function createEmptySectionPermissions(): SectionPermissionsMap {
  const map: SectionPermissionsMap = {};
  for (const section of EKONNET_SECTIONS) {
    map[section.id] = {};
    for (const box of section.boxes) {
      map[section.id][box.key] = false;
    }
  }
  return map;
}

export function createFullSectionPermissions(): SectionPermissionsMap {
  const map: SectionPermissionsMap = {};
  for (const section of EKONNET_SECTIONS) {
    map[section.id] = {};
    for (const box of section.boxes) {
      map[section.id][box.key] = true;
    }
  }
  return map;
}

export function countEnabledBoxes(sectionPerms?: SectionPermissionsMap): {
  enabledBoxes: number;
  totalBoxes: number;
  activeSections: number;
  totalSections: number;
} {
  let enabledBoxes = 0;
  let totalBoxes = 0;
  let activeSections = 0;

  for (const section of EKONNET_SECTIONS) {
    let sectionHasAny = false;
    for (const box of section.boxes) {
      totalBoxes++;
      if (sectionPerms?.[section.id]?.[box.key]) {
        enabledBoxes++;
        sectionHasAny = true;
      }
    }
    if (sectionHasAny) activeSections++;
  }

  return {
    enabledBoxes,
    totalBoxes,
    activeSections,
    totalSections: EKONNET_SECTIONS.length,
  };
}
