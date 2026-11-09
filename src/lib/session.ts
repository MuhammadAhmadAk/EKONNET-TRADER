import { cookies } from "next/headers";
import { verifyAuthToken, AUTH_COOKIE_NAME, AUTH_ADMIN_COOKIE_NAME, AuthTokenPayload } from "./jwt";

/**
 * Retrieve and verify the current customer session's JWT payload from httpOnly cookie.
 * Safe for use in Next.js Server Components and Route Handlers (Node.js runtime).
 */
export async function getSessionPayload(): Promise<AuthTokenPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    return await verifyAuthToken(token);
  } catch (error) {
    return null;
  }
}

/**
 * Retrieve and verify the current administrative session's JWT payload.
 * Checks dedicated AUTH_ADMIN_COOKIE_NAME first, with fallback to AUTH_COOKIE_NAME.
 */
export async function getAdminSessionPayload(): Promise<AuthTokenPayload | null> {
  try {
    const cookieStore = cookies();
    // 1. Check dedicated admin cookie
    const adminToken = cookieStore.get(AUTH_ADMIN_COOKIE_NAME)?.value;
    if (adminToken) {
      const payload = await verifyAuthToken(adminToken);
      if (payload && (payload.role === "master_admin" || payload.role === "management" || payload.role === "staff")) {
        return payload;
      }
    }

    // 2. Fallback to auth cookie if user role has administrative clearance
    const fallbackToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (fallbackToken) {
      const payload = await verifyAuthToken(fallbackToken);
      if (payload && (payload.role === "master_admin" || payload.role === "management" || payload.role === "staff")) {
        return payload;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Verify whether the incoming request is from an authenticated administrative staff member.
 */
export async function requireAdminSession(): Promise<AuthTokenPayload | null> {
  return await getAdminSessionPayload();
}
