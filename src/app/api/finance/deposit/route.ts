import { NextRequest, NextResponse } from "next/server";
import { submitDepositRequest } from "@/lib/services/ledgerService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, amount, currency, paymentRail, transactionRef, slipBase64 } = body;

    if (!userId || !amount || !paymentRail || !transactionRef) {
      return NextResponse.json(
        { error: "Missing required fields: userId, amount, paymentRail, and transactionRef are required." },
        { status: 400 }
      );
    }

    const deposit = await submitDepositRequest({
      userId,
      userName: userName || "Valued Trader",
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
