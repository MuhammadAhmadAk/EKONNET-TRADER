import { NextRequest, NextResponse } from "next/server";
import { approveDeposit } from "@/lib/services/ledgerService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { depositId, staffName } = body;

    if (!depositId) {
      return NextResponse.json(
        { error: "depositId is required." },
        { status: 400 }
      );
    }

    const result = await approveDeposit(depositId, staffName || "Compliance Officer");

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to approve deposit." },
      { status: 500 }
    );
  }
}
