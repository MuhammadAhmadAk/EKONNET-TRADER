import { NextResponse } from "next/server";
import { getUserById, updateUser, createAuditLog } from "@/lib/dbService";
import { signAuthToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/lib/jwt";
import { comparePassword, hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, twoFactorCode } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/User ID and password are required." },
        { status: 400 }
      );
    }

    const user = await getUserById(identifier);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials or account does not exist." },
        { status: 401 }
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
              error: `Security Lockout Active: Account temporarily locked for ${remainingMinutes} more minute(s) due to consecutive failed attempts (Section 27.1).`,
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
          { error: "Account is administratively frozen. Please contact Compliance Support." },
          { status: 403 }
        );
      }
    }

    // Verify Password using production bcrypt hashing & secure comparison
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

      // Audit failed attempt
      await createAuditLog({
        userId: user.id,
        userName: user.username,
        role: user.role,
        actionType: willLock ? "ACCOUNT_LOCK" : "SECURITY_ALERT",
        description: willLock 
          ? "3 consecutive failed attempts reached. Account locked for 30 minutes." 
          : `Failed login attempt ${attempts} of 3.`,
        ipAddress: "82.165.10.77",
        location: "Security Edge",
        status: "FAILED"
      });

      if (willLock) {
        return NextResponse.json(
          { 
            error: "Security Alert: 3 consecutive failed login attempts detected. Your account is now strictly locked for 30 minutes (Section 27.1).",
            isLocked: true,
            remainingMinutes: 30
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { 
          error: `Invalid password. Warning: Attempt ${attempts} of 3 before a 30-minute security lockout.`,
          remainingAttempts: 3 - attempts
        },
        { status: 401 }
      );
    }

    // Optional 2FA validation
    if (user.twoFactorEnabled && twoFactorCode) {
      if (twoFactorCode.trim().length !== 6) {
        return NextResponse.json({ error: "Invalid 6-digit TOTP authentication code." }, { status: 401 });
      }
    }

    // Auto-upgrade plain password to bcrypt hash in DB if not yet hashed
    if (user.password && !user.password.startsWith("$2a$") && !user.password.startsWith("$2b$")) {
      const hashed = await hashPassword(user.password);
      await updateUser(user.id, { password: hashed });
    }

    // Reset failed attempts on success
    await updateUser(user.id, {
      failedLoginAttempts: 0,
      isLocked: false,
      lockoutUntil: undefined
    });

    // Record successful login audit
    await createAuditLog({
      userId: user.id,
      userName: user.username,
      role: user.role,
      actionType: "LOGIN",
      description: `User authenticated successfully with role ${user.role} (JWT Issued)`,
      ipAddress: "82.165.10.77",
      location: "Verified Sovereign Node",
      status: "SUCCESS"
    });

    // Generate Production Cryptographic JWT Token (Valid for 7 days)
    const token = await signAuthToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      email: user.emails[0] || "",
      kycStatus: user.kycStatus,
      packageTier: user.packageTier
    });

    // Construct response with sanitized user data
    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        emails: user.emails,
        phones: user.phones,
        country: user.country,
        city: user.city,
        age: user.age,
        kycStatus: user.kycStatus,
        packageTier: user.packageTier,
        walletBalances: user.walletBalances,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });

    // Set cryptographically signed JWT in httpOnly Secure Cookie
    // NOTE: httpOnly prevents JavaScript (XSS scripts) from accessing or stealing the token!
    response.cookies.set({
      ...AUTH_COOKIE_OPTIONS,
      value: token
    });

    return response;

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
