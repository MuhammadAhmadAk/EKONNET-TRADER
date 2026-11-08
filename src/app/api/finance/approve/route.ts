import { NextRequest, NextResponse } from "next/server";
import { approveDeposit } from "@/lib/services/ledgerService";
import { requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const adminSession = await requireAdminSession();
    if (!adminSession) {
      return NextResponse.json(
        { error: "Forbidden: Administrative authentication required to approve clearing slips." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { depositId } = body;

    if (!depositId) {
      return NextResponse.json(
        { error: "depositId is required." },
        { status: 400 }
      );
    }

    const staffDisplayName = adminSession.fullName || adminSession.username || "Compliance Officer";
    const result = await approveDeposit(depositId, staffDisplayName);

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
