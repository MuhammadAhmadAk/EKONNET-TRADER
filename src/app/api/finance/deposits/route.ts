import { NextResponse } from "next/server";
import { getPendingDeposits } from "@/lib/services/ledgerService";
import { getSessionPayload } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionPayload();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to view deposit ledger records." },
        { status: 401 }
      );
    }

    const allPending = await getPendingDeposits();

    const isAdmin =
      session.role === "master_admin" ||
      session.role === "management" ||
      session.role === "staff";

    // Admins see all pending deposits across the platform
    // Regular traders see only their own pending deposit slips
    const filteredDeposits = isAdmin
      ? allPending
      : allPending.filter((d: any) => d.userId === session.userId);

    return NextResponse.json({
      success: true,
      deposits: filteredDeposits,
      role: session.role,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch deposits." },
      { status: 500 }
    );
  }
}
