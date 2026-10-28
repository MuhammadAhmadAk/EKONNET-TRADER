import { NextResponse } from "next/server";
import { generateEkonnetId, calculateAge } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, fullName, dob, emails, phones, agreedTerms } = body;

    if (!username || !fullName || !dob || !emails?.length) {
      return NextResponse.json({ error: "Missing required registration fields." }, { status: 400 });
    }

    // Section 63: Strict 18+ validation
    const age = calculateAge(dob);
    if (age < 18) {
      return NextResponse.json(
        { error: "Section 63 Regulatory Notice: Registration strictly prohibited for persons under 18." },
        { status: 403 }
      );
    }

    // Section 35: Mandatory agreement
    if (!agreedTerms) {
      return NextResponse.json(
        { error: "Section 35 Notice: Terms & conditions agreement checkbox is mandatory." },
        { status: 400 }
      );
    }

    const autoId = generateEkonnetId("EKON");

    const createdUser = {
      id: autoId,
      username,
      fullName,
      age,
      emails,
      phones: phones || [],
      kycStatus: "pending",
      role: "user",
      createdAt: new Date().toISOString(),
      walletBalances: { USD: 0, BTC: 0, XRP: 0, ETH: 0, BCH: 0 }
    };

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please upload KYC note for activation.",
      user: createdUser
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Registration processing failed." }, { status: 500 });
  }
}
