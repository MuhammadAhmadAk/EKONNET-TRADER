import { NextResponse } from "next/server";
import { getUsers, updateUser, createAuditLog } from "@/lib/dbService";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve user directory" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, isLocked, kycStatus, executedBy = "Master Admin" } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (typeof isLocked === "boolean") {
      updates.isLocked = isLocked;
      if (!isLocked) {
        updates.failedLoginAttempts = 0;
        updates.lockoutUntil = null;
      }
    }
    if (kycStatus) {
      updates.kycStatus = kycStatus;
      if (kycStatus === "approved") {
        updates.kycNoteVerified = true;
      }
    }

    await updateUser(userId, updates);

    // Audit action
    await createAuditLog({
      userId: executedBy,
      userName: executedBy,
      role: "master_admin",
      actionType: updates.isLocked !== undefined ? "ACCOUNT_LOCK" : "KYC_REVIEW",
      description: `Administrative update on ${userId}: ${JSON.stringify(updates)}`,
      ipAddress: "82.165.10.77",
      location: "Admin Governance Gateway",
      status: "SUCCESS"
    });

    const refreshedUsers = await getUsers();

    return NextResponse.json({
      success: true,
      message: `User ${userId} successfully updated.`,
      data: refreshedUsers
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
