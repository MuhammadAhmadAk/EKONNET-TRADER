import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/jwt";
import { createAuditLog } from "@/lib/dbService";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (token) {
      const payload = await verifyAuthToken(token);
      if (payload) {
        await createAuditLog({
          userId: payload.userId,
          userName: payload.username,
          role: payload.role,
          actionType: "LOGIN",
          description: `User logged out cleanly from session`,
          ipAddress: "82.165.10.77",
          location: "Verified Sovereign Node",
          status: "SUCCESS"
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Session terminated successfully. HttpOnly cookie purged."
    });

    // Clear the httpOnly cookie immediately
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
