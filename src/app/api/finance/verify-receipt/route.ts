import { NextRequest, NextResponse } from "next/server";
import { verifyReceiptWithPython } from "@/lib/pythonBridge";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, paymentRail, expectedAmount, currency, transactionRef } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required." },
        { status: 400 }
      );
    }

    const result = await verifyReceiptWithPython({
      imageBase64,
      paymentRail,
      expectedAmount,
      currency,
      transactionRef,
    });

    return NextResponse.json({
      success: true,
      analysis: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to analyze receipt." },
      { status: 500 }
    );
  }
}
