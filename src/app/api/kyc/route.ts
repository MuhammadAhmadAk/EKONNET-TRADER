import { NextResponse } from "next/server";
import { getUsers, updateUser, createAuditLog } from "@/lib/dbService";
import { getSessionPayload, requireAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: "Forbidden: Administrative clearance required to access KYC records." },
        { status: 403 }
      );
    }

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
    const session = await getSessionPayload();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in before submitting KYC verification." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      fullName,
      dob,
      residentialAddress,
      documentType = "cnic",
      documentNumber,
      documentFrontUrl,
      documentBackUrl,
      selfieUrl,
      proofOfAddressUrl
    } = body;

    // Cryptographically bound to the authenticated user
    const userId = session.userId;

    if (!documentFrontUrl || !selfieUrl) {
      return NextResponse.json({ 
        error: "Original ID Document and Live Selfie are mandatory for identity verification." 
      }, { status: 400 });
    }

    const updatePayload: any = {
      kycStatus: "pending",
      kycDocumentUrl: documentFrontUrl,
      kycNoteVerified: true,
      kycDetails: {
        documentType,
        documentNumber: documentNumber || "PENDING-INPUT",
        documentFrontUrl,
        documentBackUrl: documentBackUrl || null,
        selfieUrl,
        proofOfAddressUrl: proofOfAddressUrl || null,
        residentialAddress: residentialAddress || "",
        submittedAt: new Date().toISOString()
      }
    };

    if (fullName) updatePayload.fullName = fullName;
    if (dob) updatePayload.dateOfBirth = dob;
    if (residentialAddress) updatePayload.city = residentialAddress.split(",")[0] || "Verified Address";

    await updateUser(userId, updatePayload);

    await createAuditLog({
      userId,
      userName: fullName || session.fullName || session.username,
      role: "user",
      actionType: "KYC_REVIEW",
      description: `User submitted 4-step KYC dossier (${documentType.toUpperCase()}) with live selfie via mobile/browser portal.`,
      ipAddress: "Client Mobile/Web",
      location: residentialAddress || "Verified Location",
      status: "SUCCESS"
    });

    return NextResponse.json({
      success: true,
      message: "KYC Dossier submitted successfully. Compliance verification pending."
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit KYC dossier" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: "Forbidden: Administrative compliance privileges required to review KYC." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, action, reason = "" } = body;

    if (!userId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "userId and action ('approve' | 'reject') are required" }, { status: 400 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";
    const staffId = admin.userId;
    const staffName = admin.fullName || admin.username || "Compliance Officer";

    await updateUser(userId, {
      kycStatus: newStatus,
      kycNoteVerified: newStatus === "approved"
    });

    await createAuditLog({
      userId: staffId,
      userName: staffName,
      role: admin.role,
      actionType: "KYC_REVIEW",
      description: `Staff ${staffName} (${staffId}) set KYC status for user ${userId} to ${newStatus.toUpperCase()}.${reason ? " Note: " + reason : ""}`,
      ipAddress: "82.165.10.77",
      location: "Admin Compliance Desk",
      status: "SUCCESS"
    });

    return NextResponse.json({
      success: true,
      message: `User ${userId} KYC marked as ${newStatus}.`,
      status: newStatus
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update KYC status" }, { status: 500 });
  }
}
