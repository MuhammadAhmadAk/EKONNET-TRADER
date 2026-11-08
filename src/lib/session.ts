import { cookies } from "next/headers";
import { verifyAuthToken, AUTH_COOKIE_NAME, AuthTokenPayload } from "./jwt";

/**
 * Retrieve and verify the current session's JWT payload from httpOnly cookie.
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
 * Verify whether the incoming request is from an authenticated administrative staff member.
 */
export async function requireAdminSession(): Promise<AuthTokenPayload | null> {
  const session = await getSessionPayload();
  if (!session) return null;

  if (session.role === "master_admin" || session.role === "management" || session.role === "staff") {
    return session;
  }

  return null;
}
