import { NextResponse } from "next/server";
import { getSettlementOffers, createSettlementOffer, advanceSettlementState, createAuditLog } from "@/lib/dbService";
import { getSessionPayload } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const offers = await getSettlementOffers();
    return NextResponse.json({
      success: true,
      data: offers
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settlement trades" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionPayload();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to create settlement offers." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      offerType, 
      cryptoSymbol, 
      fiatCurrency = "USD", 
      amount, 
      pricePerUnit, 
      paymentRail 
    } = body;

    if (!offerType || !cryptoSymbol || !amount || !pricePerUnit || !paymentRail) {
      return NextResponse.json({ error: "Missing required offer fields" }, { status: 400 });
    }

    const totalFiat = Number((amount * pricePerUnit).toFixed(2));
    const creatorId = session.userId;
    const creatorName = session.fullName || session.username || "Trader";

    const newOffer = await createSettlementOffer({
      offerType,
      creatorId,
      creatorName,
      cryptoSymbol,
      fiatCurrency,
      amount,
      pricePerUnit,
      totalFiat,
      paymentRail
    });

    await createAuditLog({
      userId: creatorId,
      userName: creatorName,
      role: session.role,
      actionType: "SETTLEMENT",
      description: `Offer created: ${offerType} ${amount} ${cryptoSymbol} at ${pricePerUnit} USD via ${paymentRail}`,
      ipAddress: "82.165.10.77",
      location: "Direct Clearing P2P Desk",
      status: "SUCCESS"
    });

    return NextResponse.json({
      success: true,
      message: "Direct milestone settlement offer listed successfully.",
      data: newOffer
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create settlement offer" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionPayload();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to advance settlement state." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { offerId, action } = body;

    if (!offerId || !action) {
      return NextResponse.json({ error: "offerId and action are required" }, { status: 400 });
    }

    const validActions = ["lock", "confirm_payment", "release", "dispute"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `Action must be one of: ${validActions.join(", ")}` }, { status: 400 });
    }

    const actorId = session.userId;
    const actorName = session.fullName || session.username || "Trader";

    const result = await advanceSettlementState(offerId, action, actorId, actorName);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    await createAuditLog({
      userId: actorId,
      userName: actorName,
      role: session.role,
      actionType: "SETTLEMENT",
      description: `Settlement action '${action}' executed on trade ${offerId}`,
      ipAddress: "82.165.10.77",
      location: "Smart Settlement Ledger",
      status: "SUCCESS"
    });

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.offer
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to advance settlement state" }, { status: 500 });
  }
}
