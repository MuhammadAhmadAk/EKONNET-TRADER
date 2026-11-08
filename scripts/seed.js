/**
 * Ekonnet Trader Enterprise Database Seeder
 * Connects to MongoDB, seeds administrative staff, permissions, wallets, and audit trails
 * with production-grade bcrypt password hashing (cost factor 10).
 */

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ekonnet_trader_db";

async function seedDatabase() {
  console.log("=== EKONNET DATABASE SEEDER ===");
  console.log("Target Database URI:", uri);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✓ Connected to MongoDB successfully.\n");

    const db = client.db("ekonnet_trader_db");

    // 1. GENERATE PRODUCTION BCRYPT HASHES
    console.log("Generating salted bcrypt hashes...");
    const masterAdminHash = await bcrypt.hash("Admin@Ekonnet2026#", 10);
    const managementHash  = await bcrypt.hash("Mgmt@Ekonnet2026#", 10);
    const staffHash       = await bcrypt.hash("Staff@Ekonnet2026#", 10);
    const traderHash      = await bcrypt.hash("Trader@2026!", 10);
    const ahmadakHash     = await bcrypt.hash("11223344", 10);

    // 2. DEFINE USERS
    const users = [
      {
        id: "EKON-000001",
        username: "master_admin",
        fullName: "Muhammad Ahmad (Master Administrator)",
        role: "master_admin",
        emails: ["admin@ekonnet.com", "master@ekonnet.com"],
        phones: ["+92-300-1122334", "+1-800-EKONNET"],
        dateOfBirth: "1990-05-15",
        age: 36,
        country: "Global Sovereign",
        city: "Root Node",
        kycStatus: "approved",
        kycDocumentUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        kycNoteVerified: true,
        password: masterAdminHash,
        packageTier: "Enterprise",
        isLocked: false,
        lockoutUntil: null,
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        twoFactorType: "totp",
        createdAt: new Date().toISOString(),
        walletBalances: {
          USD: 1000000.00,
          BTC: 50.0,
          XRP: 250000.00,
          ETH: 200.0,
          BCH: 1500.0,
        }
      },
      {
        id: "EKON-749201",
        username: "manager_sarah",
        fullName: "Sarah Jenkins (Management Sub-Admin)",
        role: "management",
        emails: ["sarah.mgmt@ekonnet.com", "sarah.personal@gmail.com"],
        phones: ["+1-555-019-2831"],
        dateOfBirth: "1994-08-20",
        age: 32,
        country: "United Kingdom",
        city: "London",
        kycStatus: "approved",
        kycDocumentUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        kycNoteVerified: true,
        password: managementHash,
        packageTier: "Enterprise",
        isLocked: false,
        lockoutUntil: null,
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        twoFactorType: "totp",
        createdAt: new Date().toISOString(),
        walletBalances: {
          USD: 250000.00,
          BTC: 10.0,
          XRP: 50000.00,
          ETH: 45.0,
          BCH: 200.0,
        }
      },
      {
        id: "EKON-582910",
        username: "staff_alex",
        fullName: "Alex Vance (Compliance Staff Officer)",
        role: "staff",
        emails: ["alex.staff@ekonnet.com"],
        phones: ["+1-555-018-9922"],
        dateOfBirth: "1996-03-12",
        age: 30,
        country: "United States",
        city: "New York",
        kycStatus: "approved",
        kycDocumentUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        kycNoteVerified: true,
        password: staffHash,
        packageTier: "Pro Trader",
        isLocked: false,
        lockoutUntil: null,
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        twoFactorType: "totp",
        createdAt: new Date().toISOString(),
        walletBalances: {
          USD: 50000.00,
          BTC: 2.0,
          XRP: 10000.00,
          ETH: 5.0,
          BCH: 25.0,
        }
      },
      {
        id: "EKON-391824",
        username: "staff_elena",
        fullName: "Elena Rostova (Compliance Staff Officer)",
        role: "staff",
        emails: ["elena.staff@ekonnet.com"],
        phones: ["+44-7700-900123"],
        dateOfBirth: "1995-11-04",
        age: 31,
        country: "Switzerland",
        city: "Zurich",
        kycStatus: "approved",
        kycDocumentUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
        kycNoteVerified: true,
        password: staffHash,
        packageTier: "Pro Trader",
        isLocked: false,
        lockoutUntil: null,
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        twoFactorType: "totp",
        createdAt: new Date().toISOString(),
        walletBalances: {
          USD: 50000.00,
          BTC: 2.0,
          XRP: 10000.00,
          ETH: 5.0,
          BCH: 25.0,
        }
      },
      {
        id: "EKON-419836",
        username: "trader_farhan",
        fullName: "Farhan Qureshi (Crypto Trader)",
        role: "user",
        emails: ["farhan@ekonnet.com", "farhan.crypto@gmail.com"],
        phones: ["+92-321-9876543"],
        dateOfBirth: "1998-07-22",
        age: 28,
        country: "Pakistan",
        city: "Lahore",
        kycStatus: "approved",
        password: traderHash,
        packageTier: "Pro Trader",
        isLocked: false,
        lockoutUntil: null,
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        twoFactorType: "totp",
        createdAt: new Date().toISOString(),
        walletBalances: {
          USD: 14250.00,
          BTC: 0.85,
          XRP: 4200.00,
          ETH: 4.2,
          BCH: 12.0,
        }
      },
      {
        id: "EKON-178684",
        username: "ahmadak",
        fullName: "Ahmad Akhtar",
        role: "user",
        emails: ["devahmadakhtar@gmail.com"],
        phones: ["+923062635999"],
        dateOfBirth: "2000-01-01",
        age: 26,
        country: "Pakistan",
        city: "Lahore",
        kycStatus: "approved",
        password: ahmadakHash,
        packageTier: "Free",
        isLocked: false,
        lockoutUntil: null,
        failedLoginAttempts: 0,
        twoFactorEnabled: false,
        twoFactorType: "totp",
        createdAt: new Date().toISOString(),
        walletBalances: {
          USD: 1000.00,
          BTC: 0.05,
          XRP: 500.00,
          ETH: 0.5,
          BCH: 2.0,
        }
      }
    ];

    // Seed users collection
    console.log("Upserting users in MongoDB collection 'users'...");
    const usersCol = db.collection("users");
    for (const u of users) {
      await usersCol.updateOne(
        { id: u.id },
        { $set: u },
        { upsert: true }
      );
      console.log(`  ✓ Seeded User: [${u.role.toUpperCase()}] ${u.username} (${u.emails[0]})`);
    }

    // 3. SEED STAFF PERMISSIONS
    console.log("\nSeeding staff permissions collection 'staff_permissions'...");
    const permCol = db.collection("staff_permissions");
    const permissions = [
      {
        staffId: "EKON-000001",
        staffName: "Muhammad Ahmad",
        role: "master_admin",
        canViewUsers: true,
        canApproveKYC: true,
        canFreezeAccounts: true,
        canManageTickets: true,
        canAccessLiveChat: true,
        canWriteInternalNotes: true,
        canViewAuditLogs: true,
        canExecuteReimbursements: true,
        lastUpdatedBy: "SYSTEM_GENESIS",
        updatedAt: new Date().toISOString()
      },
      {
        staffId: "EKON-749201",
        staffName: "Sarah Jenkins",
        role: "management",
        canViewUsers: true,
        canApproveKYC: true,
        canFreezeAccounts: true,
        canManageTickets: true,
        canAccessLiveChat: true,
        canWriteInternalNotes: true,
        canViewAuditLogs: true,
        canExecuteReimbursements: true,
        lastUpdatedBy: "EKON-000001",
        updatedAt: new Date().toISOString()
      },
      {
        staffId: "EKON-582910",
        staffName: "Alex Vance",
        role: "staff",
        canViewUsers: true,
        canApproveKYC: true,
        canFreezeAccounts: false,
        canManageTickets: true,
        canAccessLiveChat: true,
        canWriteInternalNotes: true,
        canViewAuditLogs: false,
        canExecuteReimbursements: false,
        lastUpdatedBy: "EKON-000001",
        updatedAt: new Date().toISOString()
      },
      {
        staffId: "EKON-391824",
        staffName: "Elena Rostova",
        role: "staff",
        canViewUsers: true,
        canApproveKYC: true,
        canFreezeAccounts: false,
        canManageTickets: true,
        canAccessLiveChat: true,
        canWriteInternalNotes: true,
        canViewAuditLogs: false,
        canExecuteReimbursements: false,
        lastUpdatedBy: "EKON-000001",
        updatedAt: new Date().toISOString()
      }
    ];

    for (const p of permissions) {
      await permCol.updateOne(
        { staffId: p.staffId },
        { $set: p },
        { upsert: true }
      );
      console.log(`  ✓ Seeded Permission: ${p.staffName} (${p.role})`);
    }

    // 4. SEED WALLETS
    console.log("\nSeeding wallets collection 'wallets'...");
    const walletsCol = db.collection("wallets");
    for (const u of users) {
      await walletsCol.updateOne(
        { userId: u.id },
        {
          $set: {
            userId: u.id,
            username: u.username,
            balances: u.walletBalances,
            updatedAt: new Date().toISOString()
          }
        },
        { upsert: true }
      );
    }
    console.log(`  ✓ Synchronized ${users.length} user wallet ledgers.`);

    // 5. SEED INITIAL AUDIT LOGS
    console.log("\nSeeding audit logs collection 'audit_logs'...");
    const auditCol = db.collection("audit_logs");
    const genesisAudit = {
      userId: "EKON-000001",
      userName: "master_admin",
      role: "master_admin",
      actionType: "SYSTEM_BOOTSTRAP",
      description: "Database seeded with cryptographic bcrypt credentials and staff permission matrix.",
      ipAddress: "82.165.10.77",
      location: "Verified Sovereign Node",
      status: "SUCCESS",
      createdAt: new Date().toISOString()
    };
    await auditCol.insertOne(genesisAudit);
    console.log("  ✓ Recorded genesis audit log entry.");

    // 6. MODULAR MULTI-DATABASE PARTITIONING (IAM, LEDGER, P2P, TRADING, COMPLIANCE)
    console.log("\n--- PARTITIONING MODULAR DATABASES ---");
    
    // (a) ekonnet_iam
    const iamDb = client.db("ekonnet_iam");
    await iamDb.collection("users").createIndex({ id: 1 }, { unique: true });
    await iamDb.collection("users").createIndex({ username: 1 });
    await iamDb.collection("users").createIndex({ "emails": 1 });
    for (const u of users) {
      await iamDb.collection("users").updateOne({ id: u.id }, { $set: u }, { upsert: true });
    }
    for (const p of permissions) {
      await iamDb.collection("staff_permissions").updateOne({ staffId: p.staffId }, { $set: p }, { upsert: true });
    }
    await iamDb.collection("audit_logs").insertOne(genesisAudit);
    console.log("  ✓ Partition 'ekonnet_iam' seeded with IAM users, permissions, and audit logs.");

    // (b) ekonnet_ledger
    const ledgerDb = client.db("ekonnet_ledger");
    await ledgerDb.collection("wallets").createIndex({ userId: 1 }, { unique: true });
    for (const u of users) {
      await ledgerDb.collection("wallets").updateOne(
        { userId: u.id },
        { $set: { userId: u.id, username: u.username, balances: u.walletBalances, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    }
    await ledgerDb.collection("deposit_requests").updateOne(
      { id: "DEP-839201" },
      {
        $set: {
          id: "DEP-839201",
          userId: "EKON-419836",
          userName: "Farhan Qureshi",
          amount: 5000,
          currency: "USD",
          paymentRail: "Direct Wire",
          transactionRef: "WIRE-REF-9928194",
          status: "PENDING",
          cvVerification: {
            status: "PASS",
            confidenceScore: 92,
            sharpnessScore: 89,
            details: "Official Standard Chartered wire slip detected. Optimal clarity.",
            verifiedAt: new Date().toISOString()
          },
          createdAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );
    await ledgerDb.collection("ledger_journal").insertOne({
      id: "JRN-GENESIS",
      transactionType: "PLATFORM_INIT",
      debitAccount: "PLATFORM_RESERVE",
      creditAccount: "USER_POOLS",
      amount: 1365250.00,
      currency: "USD",
      referenceId: "BOOTSTRAP",
      description: "Genesis platform liquidity capitalization",
      timestamp: new Date().toISOString()
    });
    console.log("  ✓ Partition 'ekonnet_ledger' seeded with wallets, deposit slips, and double-entry journal.");

    // (c) ekonnet_p2p
    const p2pDb = client.db("ekonnet_p2p");
    await p2pDb.collection("p2p_offers").updateOne(
      { id: "SETTLE-84910" },
      {
        $set: {
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
          createdAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );
    console.log("  ✓ Partition 'ekonnet_p2p' seeded with active settlement contracts.");

    // (d) ekonnet_trading
    const tradingDb = client.db("ekonnet_trading");
    await tradingDb.collection("trading_orders").createIndex({ userId: 1, status: 1 });
    console.log("  ✓ Partition 'ekonnet_trading' initialized with order book indexes.");

    // (e) ekonnet_compliance
    const complianceDb = client.db("ekonnet_compliance");
    await complianceDb.collection("internal_notes").insertOne({
      id: "NOTE-1",
      targetUserId: "EKON-419836",
      staffId: "STAFF-101",
      staffName: "Sarah Jenkins",
      noteText: "Verified corporate bank account linkage. Cleared for Tier-2 high volume settlement.",
      actionTaken: "KYC Tier-2 Approved",
      createdAt: new Date().toISOString()
    });
    console.log("  ✓ Partition 'ekonnet_compliance' seeded with staff internal notes & case logs.");

    console.log("\n========================================================");
    console.log("🎉 ALL MODULAR DATABASES SEEDED SUCCESSFULLY!");
    console.log("  - ekonnet_iam (Users, Staff Permissions, Security Audits)");
    console.log("  - ekonnet_ledger (Wallets, Double-entry Journal, Deposit Slips)");
    console.log("  - ekonnet_p2p (Direct P2P Settlement Vault)");
    console.log("  - ekonnet_trading (Spot Orders & Matches)");
    console.log("  - ekonnet_compliance (Staff Notes & Support Tickets)");
    console.log("  - ekonnet_trader_db (Synchronized Legacy Fallback)");
    console.log("========================================================");

  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
