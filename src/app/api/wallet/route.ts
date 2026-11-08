import { NextResponse } from "next/server";
import { getUserById, executeWalletTransfer } from "@/lib/dbService";
import { getSessionPayload } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSessionPayload();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to access wallet balances." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId") || session.userId;

    const isAdmin =
      session.role === "master_admin" ||
      session.role === "management" ||
      session.role === "staff";

    // Regular users are strictly quarantined to their own wallet
    if (requestedUserId !== session.userId && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to view this wallet." },
        { status: 403 }
      );
    }

    const user = await getUserById(requestedUserId);
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
    const session = await getSessionPayload();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to execute wallet transfers." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { senderId, receiverId, currency, amount } = body;

    if (!receiverId || !currency || typeof amount !== "number") {
      return NextResponse.json(
        { error: "receiverId, currency, and numerical amount are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Transfer amount must be greater than zero." },
        { status: 400 }
      );
    }

    const isAdmin =
      session.role === "master_admin" ||
      session.role === "management" ||
      session.role === "staff";

    // Security Invariant: The authenticated user can only spend from their own wallet
    const effectiveSenderId = isAdmin && senderId ? senderId : session.userId;

    const validCurrencies = ["USD", "BTC", "XRP", "ETH", "BCH"];
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json({ error: `Currency must be one of: ${validCurrencies.join(", ")}` }, { status: 400 });
    }

    const result = await executeWalletTransfer(effectiveSenderId, receiverId, currency as any, amount);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const sender = await getUserById(effectiveSenderId);

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        feeCharged: result.feeCharged,
        netAmount: result.netAmount,
        currency,
        remainingBalance: sender?.walletBalances?.[currency as "USD" | "BTC" | "XRP" | "ETH" | "BCH"] || 0
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process wallet transfer" }, { status: 500 });
  }
}
