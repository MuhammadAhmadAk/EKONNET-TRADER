import { NextRequest, NextResponse } from "next/server";
import { submitDepositRequest } from "@/lib/services/ledgerService";
import { getSessionPayload } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionPayload();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in before submitting deposit requests." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, currency, paymentRail, transactionRef, slipBase64 } = body;

    if (!amount || !paymentRail || !transactionRef) {
      return NextResponse.json(
        { error: "Missing required fields: amount, paymentRail, and transactionRef are required." },
        { status: 400 }
      );
    }

    if (Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Deposit amount must be a positive number." },
        { status: 400 }
      );
    }

    // Cryptographically tie deposit slip strictly to the authenticated user ID
    const deposit = await submitDepositRequest({
      userId: session.userId,
      userName: session.fullName || session.username || "Valued Trader",
      amount: Number(amount),
      currency: currency || "USD",
      paymentRail,
      transactionRef,
      slipBase64,
    });

    return NextResponse.json({
      success: true,
      message: "Deposit slip successfully submitted and queued for ledger clearing.",
      deposit,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to submit deposit request." },
      { status: 500 }
    );
  }
}
