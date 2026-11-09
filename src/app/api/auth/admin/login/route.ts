import { NextResponse } from "next/server";
import { getUserById, updateUser, createAuditLog } from "@/lib/dbService";
import { signAuthToken, AUTH_ADMIN_COOKIE_OPTIONS } from "@/lib/jwt";
import { comparePassword, hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, twoFactorCode } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Admin Identifier and Root Key are required." },
        { status: 400 }
      );
    }

    const user = await getUserById(identifier);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials or administrative identity does not exist." },
        { status: 401 }
      );
    }

    // STRICT ROLE GATE: Normal users/traders can NEVER authenticate via admin gate
    if (user.role === "user" || (user.role !== "master_admin" && user.role !== "management" && user.role !== "staff")) {
      return NextResponse.json(
        { error: "ACCESS DENIED: Trader accounts do not possess administrative clearance." },
        { status: 403 }
      );
    }

    const now = new Date();

    // Check if account is locked
    if (user.isLocked) {
      if (user.lockoutUntil) {
        const lockExpiry = new Date(user.lockoutUntil);
        if (now < lockExpiry) {
          const remainingMinutes = Math.ceil((lockExpiry.getTime() - now.getTime()) / (60 * 1000));
          return NextResponse.json(
            { 
              error: `Security Lockout Active: Account locked for ${remainingMinutes} more minute(s) (Section 27.1).`,
              isLocked: true,
              remainingMinutes 
            },
            { status: 403 }
          );
        } else {
          // Lockout expired - auto unlock
          await updateUser(user.id, {
            isLocked: false,
            failedLoginAttempts: 0,
            lockoutUntil: undefined
          });
          user.isLocked = false;
          user.failedLoginAttempts = 0;
        }
      } else {
        return NextResponse.json(
          { error: "Administrative identity is frozen. Contact Security Operations." },
          { status: 403 }
        );
      }
    }

    // Verify Password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      const willLock = attempts >= 3;
      const lockoutTime = willLock ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : undefined;

      await updateUser(user.id, {
        failedLoginAttempts: attempts,
        isLocked: willLock,
        lockoutUntil: lockoutTime
      });

      await createAuditLog({
        userId: user.id,
        userName: user.username,
        role: user.role,
        actionType: willLock ? "ACCOUNT_LOCK" : "SECURITY_ALERT",
        description: willLock 
          ? "3 consecutive failed admin attempts reached. Locked for 30 minutes." 
          : `Failed admin login attempt ${attempts} of 3.`,
        ipAddress: "82.165.10.77",
        location: "Admin Management Gate",
        status: "FAILED"
      });

      if (willLock) {
        return NextResponse.json(
          { 
            error: "Security Alert: 3 consecutive failed admin attempts. Account locked for 30 minutes.",
            isLocked: true,
            remainingMinutes: 30
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { 
          error: `Invalid root key. Warning: Attempt ${attempts} of 3 before security lockout.`,
          remainingAttempts: 3 - attempts
        },
        { status: 401 }
      );
    }

    // Optional 2FA validation
    if (user.twoFactorEnabled && twoFactorCode) {
      if (twoFactorCode.trim().length !== 6) {
        return NextResponse.json({ error: "Invalid 6-digit TOTP code." }, { status: 401 });
      }
    }

    // Auto upgrade hash if needed
    if (user.password && !user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
      const hashed = await hashPassword(user.password);
      await updateUser(user.id, { password: hashed });
    }

    // Reset failed attempts
    await updateUser(user.id, {
      failedLoginAttempts: 0,
      isLocked: false,
      lockoutUntil: undefined
    });

    await createAuditLog({
      userId: user.id,
      userName: user.username,
      role: user.role,
      actionType: "LOGIN",
      description: `Administrator authenticated successfully with role ${user.role}`,
      ipAddress: "82.165.10.77",
      location: "Verified Sovereign Node",
      status: "SUCCESS"
    });

    // Sign Admin-Specific Token
    const token = await signAuthToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      email: user.emails[0] || "",
      kycStatus: user.kycStatus,
      packageTier: user.packageTier
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        emails: user.emails,
        phones: user.phones,
        country: user.country,
        city: user.city,
        kycStatus: user.kycStatus,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });

    // Set dedicated Admin httpOnly Secure Cookie (DOES NOT OVERWRITE CUSTOMER COOKIE)
    response.cookies.set({
      ...AUTH_ADMIN_COOKIE_OPTIONS,
      value: token
    });

    return response;

  } catch (error) {
    console.error("Admin Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
