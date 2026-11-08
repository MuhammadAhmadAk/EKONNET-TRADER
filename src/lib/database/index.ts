import { Db } from "mongodb";
import { getDatabase as getBaseDatabase } from "../mongodb";
import { DB_NAMES } from "./schema";

/**
 * Modular Database Resolvers
 * Each functional domain reads/writes to its dedicated database namespace.
 * Falls back gracefully to legacy single-database if a dedicated db is not yet initialized.
 */

export async function getIamDb(): Promise<Db | null> {
  const db = await getBaseDatabase(DB_NAMES.IAM);
  return db || getBaseDatabase(DB_NAMES.LEGACY);
}

export async function getLedgerDb(): Promise<Db | null> {
  const db = await getBaseDatabase(DB_NAMES.LEDGER);
  return db || getBaseDatabase(DB_NAMES.LEGACY);
}

export async function getP2pDb(): Promise<Db | null> {
  const db = await getBaseDatabase(DB_NAMES.P2P);
  return db || getBaseDatabase(DB_NAMES.LEGACY);
}

export async function getTradingDb(): Promise<Db | null> {
  const db = await getBaseDatabase(DB_NAMES.TRADING);
  return db || getBaseDatabase(DB_NAMES.LEGACY);
}

export async function getComplianceDb(): Promise<Db | null> {
  const db = await getBaseDatabase(DB_NAMES.COMPLIANCE);
  return db || getBaseDatabase(DB_NAMES.LEGACY);
}

export * from "./schema";
