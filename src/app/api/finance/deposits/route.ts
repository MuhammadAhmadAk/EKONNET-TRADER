import { NextResponse } from "next/server";
import { getPendingDeposits } from "@/lib/services/ledgerService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const deposits = await getPendingDeposits();
    return NextResponse.json({
      success: true,
      deposits,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch deposits." },
      { status: 500 }
    );
  }
}
