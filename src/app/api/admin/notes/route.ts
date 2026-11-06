import { NextResponse } from "next/server";
import { getInternalNotes, addInternalNote, createAuditLog } from "@/lib/dbService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const notes = await getInternalNotes(userId);

    return NextResponse.json({
      success: true,
      data: notes
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve internal staff notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUserId, staffId = "STAFF-101", staffName = "Staff Lead", noteText, actionTaken = "Internal Observation" } = body;

    if (!targetUserId || !noteText) {
      return NextResponse.json({ error: "targetUserId and noteText are required" }, { status: 400 });
    }

    const newNote = await addInternalNote({
      targetUserId,
      staffId,
      staffName,
      noteText,
      actionTaken
    });

    // Record audit
    await createAuditLog({
      userId: staffId,
      userName: staffName,
      role: "staff",
      actionType: "INTERNAL_NOTE",
      description: `Private note on ${targetUserId} by ${staffName}: ${actionTaken}`,
      ipAddress: "82.165.10.77",
      location: "Staff Compliance Console",
      status: "SUCCESS"
    });

    const allNotes = await getInternalNotes(targetUserId);

    return NextResponse.json({
      success: true,
      message: "Internal staff note recorded securely.",
      data: allNotes
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save internal note" }, { status: 500 });
  }
}
