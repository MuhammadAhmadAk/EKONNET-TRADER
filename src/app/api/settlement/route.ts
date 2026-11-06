import { NextResponse } from "next/server";
import { getSettlementOffers, createSettlementOffer, advanceSettlementState, createAuditLog } from "@/lib/dbService";

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
    const body = await request.json();
    const { 
      offerType, 
      creatorId, 
      creatorName, 
      cryptoSymbol, 
      fiatCurrency = "USD", 
      amount, 
      pricePerUnit, 
      paymentRail 
    } = body;

    if (!offerType || !creatorId || !cryptoSymbol || !amount || !pricePerUnit || !paymentRail) {
      return NextResponse.json({ error: "Missing required offer fields" }, { status: 400 });
    }

    const totalFiat = Number((amount * pricePerUnit).toFixed(2));

    const newOffer = await createSettlementOffer({
      offerType,
      creatorId,
      creatorName: creatorName || "Trader",
      cryptoSymbol,
      fiatCurrency,
      amount,
      pricePerUnit,
      totalFiat,
      paymentRail
    });

    await createAuditLog({
      userId: creatorId,
      userName: creatorName || "Trader",
      role: "user",
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
    const body = await request.json();
    const { offerId, action, actorId, actorName } = body;

    if (!offerId || !action || !actorId) {
      return NextResponse.json({ error: "offerId, action, and actorId are required" }, { status: 400 });
    }

    const validActions = ["lock", "confirm_payment", "release", "dispute"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `Action must be one of: ${validActions.join(", ")}` }, { status: 400 });
    }

    const result = await advanceSettlementState(offerId, action, actorId, actorName);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    await createAuditLog({
      userId: actorId,
      userName: actorName || actorId,
      role: "user",
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
