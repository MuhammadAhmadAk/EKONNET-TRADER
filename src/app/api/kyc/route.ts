import { NextResponse } from "next/server";
import { getUsers, updateUser, createAuditLog } from "@/lib/dbService";

export async function GET() {
  try {
    const users = await getUsers();
    const pending = users.filter(u => u.kycStatus === "pending" || u.kycStatus === "unverified");
    return NextResponse.json({
      success: true,
      data: pending
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch KYC dossier queue" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, documentUrl, handwrittenNoteText = "Full Name, Ekonnet, Registration Date" } = body;

    if (!userId || !documentUrl) {
      return NextResponse.json({ error: "userId and documentUrl are required" }, { status: 400 });
    }

    await updateUser(userId, {
      kycDocumentUrl: documentUrl,
      kycStatus: "pending",
      kycNoteVerified: false
    });

    await createAuditLog({
      userId,
      userName: userId,
      role: "user",
      actionType: "KYC_REVIEW",
      description: "User submitted identity document alongside handwritten note holding selfie",
      ipAddress: "82.165.10.77",
      location: "Client Portal",
      status: "SUCCESS"
    });

    return NextResponse.json({
      success: true,
      message: "KYC Dossier submitted successfully. Pending Compliance Staff review."
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit KYC dossier" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, action, staffId = "STAFF-101", staffName = "Compliance Staff", reason = "" } = body;

    if (!userId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "userId and action ('approve' | 'reject') are required" }, { status: 400 });
    }

    const nextStatus = action === "approve" ? "approved" : "rejected";

    await updateUser(userId, {
      kycStatus: nextStatus,
      kycNoteVerified: action === "approve"
    });

    await createAuditLog({
      userId: staffId,
      userName: staffName,
      role: "staff",
      actionType: "KYC_REVIEW",
      description: `${staffName} (${staffId}) set KYC status to ${nextStatus}. Notes: ${reason || "Standard Verification"}`,
      ipAddress: "82.165.10.77",
      location: "Compliance Desk",
      status: "SUCCESS"
    });

    return NextResponse.json({
      success: true,
      message: `KYC dossier for ${userId} successfully ${action}d.`,
      status: nextStatus
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process KYC review action" }, { status: 500 });
  }
}
