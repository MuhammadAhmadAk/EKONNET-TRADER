import { NextResponse } from "next/server";
import { getUserById, executeWalletTransfer } from "@/lib/dbService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId parameter is required" }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        fullName: user.fullName,
        walletBalances: user.walletBalances,
        corePairs: ["USD", "BTC", "XRP", "ETH", "BCH"]
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve wallet" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderId, receiverId, currency, amount } = body;

    if (!senderId || !receiverId || !currency || typeof amount !== "number") {
      return NextResponse.json({ error: "senderId, receiverId, currency, and numerical amount are required" }, { status: 400 });
    }

    const validCurrencies = ["USD", "BTC", "XRP", "ETH", "BCH"];
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json({ error: `Currency must be one of: ${validCurrencies.join(", ")}` }, { status: 400 });
    }

    const result = await executeWalletTransfer(senderId, receiverId, currency as any, amount);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const sender = await getUserById(senderId);

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        feeCharged: result.feeCharged,
        netAmount: result.netAmount,
        currency,
        updatedBalances: sender?.walletBalances
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Transfer execution failed" }, { status: 500 });
  }
}
