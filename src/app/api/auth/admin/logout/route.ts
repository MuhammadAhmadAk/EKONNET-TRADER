import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_ADMIN_COOKIE_NAME, verifyAuthToken } from "@/lib/jwt";
import { createAuditLog } from "@/lib/dbService";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_ADMIN_COOKIE_NAME)?.value;

    if (token) {
      const payload = await verifyAuthToken(token);
      if (payload) {
        await createAuditLog({
          userId: payload.userId,
          userName: payload.username,
          role: payload.role,
          actionType: "LOGIN",
          description: `Admin explicitly logged out from management gate.`,
          ipAddress: "82.165.10.77",
          location: "Verified Sovereign Node",
          status: "SUCCESS"
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Admin session cleared successfully"
    });

    // Clear dedicated admin cookie
    response.cookies.set({
      name: AUTH_ADMIN_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0
    });

    return response;

  } catch (error) {
    console.error("Admin Logout API error:", error);
    return NextResponse.json({ error: "Failed to log out admin session" }, { status: 500 });
  }
}
