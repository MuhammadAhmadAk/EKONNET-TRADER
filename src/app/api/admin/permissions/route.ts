import { NextResponse } from "next/server";
import { MOCK_STAFF_PERMISSIONS } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_STAFF_PERMISSIONS
  });
}

export async function PUT(request: Request) {
  try {
    const updatedMatrix = await request.json();
    return NextResponse.json({
      success: true,
      message: "Staff permissions successfully updated.",
      data: updatedMatrix
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to persist permissions" }, { status: 500 });
  }
}
