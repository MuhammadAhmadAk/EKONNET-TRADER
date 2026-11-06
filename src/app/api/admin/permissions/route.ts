import { NextResponse } from "next/server";
import { getStaffPermissions, updateStaffPermission, createAuditLog } from "@/lib/dbService";

export async function GET() {
  try {
    const data = await getStaffPermissions();
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch staff permissions" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { staffId, permissions, updatedBy = "Master Admin" } = body;

    if (!staffId || !permissions) {
      return NextResponse.json({ error: "staffId and permissions payload are required" }, { status: 400 });
    }

    await updateStaffPermission(staffId, permissions, updatedBy);

    // Record in immutable audit trail
    await createAuditLog({
      userId: updatedBy.includes("(") ? updatedBy.match(/\((.*?)\)/)?.[1] || "EKON-000001" : "EKON-000001",
      userName: "Master Admin",
      role: "master_admin",
      actionType: "PERM_CHANGE",
      description: `Permissions updated for ${staffId} by ${updatedBy}`,
      ipAddress: "82.165.10.77",
      location: "Admin Governance Gateway",
      status: "SUCCESS"
    });

    const refreshed = await getStaffPermissions();

    return NextResponse.json({
      success: true,
      message: `Permissions for staff ${staffId} successfully updated and recorded in audit log.`,
      data: refreshed
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to persist permissions" }, { status: 500 });
  }
}
