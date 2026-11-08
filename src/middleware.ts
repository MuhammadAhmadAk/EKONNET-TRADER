import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public admin login gate without checking token
  if (pathname === "/admin/login") {
    // If already logged in as admin, redirect directly to /admin
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyAuthToken(token);
      if (payload && (payload.role === "master_admin" || payload.role === "management" || payload.role === "staff")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. Protect Admin Console pages: /admin and subpaths
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyAuthToken(token);
    if (!payload) {
      // Invalid / expired JWT
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(loginUrl);
    }

    // Role Enforcement: Traders are strictly blocked from /admin
    if (payload.role !== "master_admin" && payload.role !== "management" && payload.role !== "staff") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "access_denied");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. Protect Admin APIs: /api/admin/*
  if (pathname.startsWith("/api/admin/")) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing administrative JWT cookie." },
        { status: 401 }
      );
    }

    const payload = await verifyAuthToken(token);
    if (!payload || (payload.role !== "master_admin" && payload.role !== "management" && payload.role !== "staff")) {
      return NextResponse.json(
        { error: "Forbidden: Administrative clearance required." },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  // 4. Protect Customer Dashboard: /dashboard and subpaths
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("auth", "login");
      homeUrl.searchParams.set("from", "/dashboard");
      return NextResponse.redirect(homeUrl);
    }

    const payload = await verifyAuthToken(token);
    if (!payload) {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("auth", "login");
      homeUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  // 5. Protect Treasury & Payments: /payments and subpaths
  if (pathname === "/payments" || pathname.startsWith("/payments/")) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("auth", "login");
      homeUrl.searchParams.set("from", "/payments");
      return NextResponse.redirect(homeUrl);
    }

    const payload = await verifyAuthToken(token);
    if (!payload) {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("auth", "login");
      homeUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  // 6. Protect KYC Dossier Verification: /kyc and subpaths
  if (pathname === "/kyc" || pathname.startsWith("/kyc/")) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("auth", "login");
      homeUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(homeUrl);
    }

    const payload = await verifyAuthToken(token);
    if (!payload) {
      const homeUrl = new URL("/", request.url);
      homeUrl.searchParams.set("auth", "login");
      homeUrl.searchParams.set("error", "session_expired");
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/payments",
    "/payments/:path*",
    "/kyc",
    "/kyc/:path*"
  ]
};
