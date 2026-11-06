import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/dbService";

export async function GET() {
  try {
    const logs = await getAuditLogs();
    return NextResponse.json({
      success: true,
      data: logs
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve audit trail" }, { status: 500 });
  }
}
