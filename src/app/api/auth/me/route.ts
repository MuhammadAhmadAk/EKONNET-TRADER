import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/jwt";
import { getUserById } from "@/lib/dbService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const payload = await verifyAuthToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = await getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
    }

    if (user.isLocked) {
      return NextResponse.json({ authenticated: false, error: "Account locked" }, { status: 403 });
    }

    const sanitizedUser = { ...user };
    delete sanitizedUser.password;

    return NextResponse.json({
      authenticated: true,
      user: sanitizedUser,
      tokenPayload: {
        userId: payload.userId,
        username: payload.username,
        role: payload.role
      }
    });

  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json({ authenticated: false, error: "Failed to verify session" }, { status: 500 });
  }
}
