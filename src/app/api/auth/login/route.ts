import { NextResponse } from "next/server";
import { MOCK_USERS } from "@/lib/mockData";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, twoFactorCode } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/User ID and password are required." },
        { status: 400 }
      );
    }

    const user = MOCK_USERS.find(
      u => u.username.toLowerCase() === identifier.toLowerCase() || u.id.toLowerCase() === identifier.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (user.isLocked) {
      return NextResponse.json(
        { error: "Account temporarily locked for 30 minutes in accordance with Section 25." },
        { status: 403 }
      );
    }

    // Return authenticated session
    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        kycStatus: user.kycStatus,
        walletBalances: user.walletBalances
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
