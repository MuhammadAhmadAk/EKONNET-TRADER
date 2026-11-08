import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken, signAuthToken, AUTH_COOKIE_NAME } from "@/lib/jwt";
import { getUserById } from "@/lib/dbService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a secure transfer ticket valid for 24 hours
    const ticketPayload = {
      userId: user.id,
      username: user.username,
      role: (user.role as any) || "user",
      fullName: user.fullName,
      email: user.emails?.[0],
      kycStatus: user.kycStatus
    };

    const ticket = await signAuthToken(ticketPayload, 24 * 60 * 60);
    const host = request.headers.get("host") || "ekonnet.com";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const kycUrl = `${protocol}://${host}/kyc/verify?ticket=${ticket}&userId=${user.id}`;

    return NextResponse.json({
      success: true,
      ticket,
      kycUrl,
      userId: user.id
    });
  } catch (error: any) {
    console.error("GET /api/kyc/ticket error:", error);
    return NextResponse.json({ error: "Failed to generate ticket" }, { status: 500 });
  }
}
