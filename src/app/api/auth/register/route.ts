import { NextResponse } from "next/server";
import { generateEkonnetId, calculateAge } from "@/lib/utils";
import { createUser, getUserById, createAuditLog } from "@/lib/dbService";
import { User } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      username, 
      password,
      fullName, 
      dob, 
      emails, 
      phones, 
      country = "United States", 
      city = "New York", 
      agreedTerms,
      packageTier = "Free" 
    } = body;

    if (!username || !fullName || !dob || !emails?.length) {
      return NextResponse.json({ error: "Missing required registration fields (username, full name, DOB, and primary email)." }, { status: 400 });
    }

    if (password && password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // Check if username already exists
    const existing = await getUserById(username);
    if (existing) {
      return NextResponse.json({ error: "Username is already registered. Please choose another username." }, { status: 409 });
    }

    // Strict 18+ validation (Section 30)
    const age = calculateAge(dob);
    if (age < 18) {
      return NextResponse.json(
        { error: "Regulatory Notice: Under Section 30 compliance, registration is strictly prohibited for persons under 18 years of age." },
        { status: 403 }
      );
    }

    // Mandatory terms agreement (Section 31)
    if (!agreedTerms) {
      return NextResponse.json(
        { error: "Please accept the Terms of Service, Risk Disclosure, and Privacy Policy to proceed." },
        { status: 400 }
      );
    }

    const autoId = generateEkonnetId("EKON");

    // Standardize 3 personal emails and 2 phone numbers
    const cleanEmails = Array.isArray(emails) ? emails.filter(Boolean) : [emails];
    const cleanPhones = Array.isArray(phones) ? phones.filter(Boolean) : phones ? [phones] : [];

    const newUser: User = {
      id: autoId,
      username: username.toLowerCase().trim(),
      password: password || "Ekonnet2026!",
      fullName,
      role: "user",
      emails: cleanEmails,
      phones: cleanPhones,
      dateOfBirth: dob,
      age,
      country,
      city,
      kycStatus: "pending",
      packageTier: packageTier as User["packageTier"],
      isLocked: false,
      failedLoginAttempts: 0,
      twoFactorEnabled: false,
      twoFactorType: "totp",
      createdAt: new Date().toISOString(),
      walletBalances: {
        USD: 1000.00, // Initial onboarding balance for testing
        BTC: 0.05,
        XRP: 500,
        ETH: 0.5,
        BCH: 2.0
      }
    };

    await createUser(newUser);

    // Audit registration
    await createAuditLog({
      userId: newUser.id,
      userName: newUser.username,
      role: "user",
      actionType: "LOGIN",
      description: `New user account created with 18+ age verification (${age} yrs)`,
      ipAddress: "82.165.10.77",
      location: `${city}, ${country}`,
      status: "SUCCESS"
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Unique Ekonnet ID assigned.",
      user: newUser
    }, { status: 201 });

  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: error?.message || "Registration processing failed." }, { status: 500 });
  }
}
