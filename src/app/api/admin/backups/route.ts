import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import { verifyAuthToken, AUTH_ADMIN_COOKIE_NAME, AUTH_COOKIE_NAME } from "@/lib/jwt";

export const dynamic = "force-dynamic";

const STATUS_FEED_PATH = "/var/backups/ekonnet_status_feed/status.json";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token =
      cookieStore.get(AUTH_ADMIN_COOKIE_NAME)?.value ||
      cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin session required" },
        { status: 401 }
      );
    }

    const payload = await verifyAuthToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid admin session" },
        { status: 401 }
      );
    }

    if (
      payload.role !== "master_admin" &&
      payload.role !== "management" &&
      payload.role !== "staff"
    ) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Administrative role required" },
        { status: 403 }
      );
    }

    try {
      const raw = await fs.readFile(STATUS_FEED_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return NextResponse.json(
        {
          success: true,
          available: true,
          readOnly: true,
          data: parsed,
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          },
        }
      );
    } catch (readErr: any) {
      return NextResponse.json(
        {
          success: true,
          available: false,
          readOnly: true,
          reason:
            readErr?.code === "ENOENT"
              ? "Backup telemetry feed file is not generated yet on this host."
              : "Unable to read backup telemetry feed.",
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          },
        }
      );
    }
  } catch (error) {
    console.error("GET /api/admin/backups error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load read-only backup status" },
      { status: 500 }
    );
  }
}
