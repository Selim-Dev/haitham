import crypto from "node:crypto";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { SessionUser } from "@/lib/auth";

// Password reset token shape:
// - raw token = 32 random bytes hex (64 chars), sent only in the email link
// - stored = SHA-256 hash of the raw token, so a DB leak alone can't take
//   over accounts. Constant-time comparison happens implicitly via the
//   indexed equality query.
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashResetToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// Both registerStudent and loginUser now return the SessionUser plus the
// sessionVersion that should be embedded in the JWT. The cookie-setting code
// in the route handlers passes both into setSessionCookie. See
// docs / single-session enforcement in src/lib/auth.ts:getCurrentUser.
export type AuthResult = { user: SessionUser; sessionVersion: number };

export async function registerStudent(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  geo?: {
    ip?: string;
    country?: string;
    countryName?: string;
    city?: string;
    region?: string;
  };
}): Promise<AuthResult> {
  await connectDB();

  const existing = await UserModel.findOne({ email: input.email.toLowerCase() }).lean();
  if (existing) {
    const err = new Error("هذا البريد مسجل بالفعل") as Error & {
      status?: number;
    };
    err.status = 409;
    throw err;
  }

  const passwordHash = await hashPassword(input.password);

  const created = await UserModel.create({
    name: input.name,
    email: input.email.toLowerCase().trim(),
    phone: input.phone?.trim() || undefined,
    passwordHash,
    role: "STUDENT",
    isBlocked: false,
    approvalStatus: "PENDING_APPLICATION",
    // Seed at 1 so the first cookie carries sv:1 and matches the DB. Default
    // is 0 — bumping to 1 here means any pre-existing JWT lacking `sv` is
    // automatically stale.
    sessionVersion: 1,
    registrationIp: input.geo?.ip,
    registrationCountry: input.geo?.country,
    registrationCountryName: input.geo?.countryName,
    registrationCity: input.geo?.city,
    registrationRegion: input.geo?.region,
  });

  return {
    user: {
      id: String(created._id),
      name: created.name,
      email: created.email,
      phone: created.phone,
      role: created.role,
      isBlocked: created.isBlocked,
      approvalStatus: created.approvalStatus,
      registrationCountry: created.registrationCountry,
    },
    sessionVersion: created.sessionVersion,
  };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  await connectDB();

  const user = await UserModel.findOne({ email: email.toLowerCase().trim() })
    .select("+passwordHash")
    .exec();

  if (!user) {
    const err = new Error("بيانات الدخول غير صحيحة") as Error & {
      status?: number;
    };
    err.status = 401;
    throw err;
  }

  if (user.isBlocked) {
    const err = new Error("الحساب موقوف. تواصل مع الإدارة.") as Error & {
      status?: number;
    };
    err.status = 403;
    throw err;
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    const err = new Error("بيانات الدخول غير صحيحة") as Error & {
      status?: number;
    };
    err.status = 401;
    throw err;
  }

  // Bump sessionVersion for students so all older devices' JWTs become stale.
  // Admins are skipped here as a small optimization — their version is never
  // compared on read (see getCurrentUser).
  if (user.role !== "ADMIN") {
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    await user.save();
  }

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isBlocked: user.isBlocked,
      approvalStatus: user.approvalStatus ?? "APPROVED",
      registrationCountry: user.registrationCountry,
    },
    sessionVersion: user.sessionVersion ?? 0,
  };
}

// Request a password reset. Always silent w.r.t. the caller: returns null
// when no eligible user matches (no account, or blocked) so the route
// handler can return an identical success response either way and prevent
// email enumeration. When an eligible user is found, a fresh raw token is
// issued, its hash + expiry persisted, and the raw token is handed back to
// the caller to compose the email link.
export async function requestPasswordReset(
  email: string,
): Promise<{ name: string; email: string; rawToken: string } | null> {
  await connectDB();

  const user = await UserModel.findOne({
    email: email.toLowerCase().trim(),
  }).exec();

  if (!user || user.isBlocked) return null;

  const rawToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetTokenHash = hashResetToken(rawToken);
  user.passwordResetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();

  return { name: user.name, email: user.email, rawToken };
}

// Consume a reset token and rotate the password. Single-use: the token
// hash and expiry are cleared atomically with the password update. The
// sessionVersion bump invalidates every JWT previously issued for this
// user (see getCurrentUser stale-cookie path).
export async function resetPassword(
  rawToken: string,
  newPassword: string,
): Promise<void> {
  await connectDB();

  const tokenHash = hashResetToken(rawToken);
  const user = await UserModel.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetTokenExpiresAt: { $gt: new Date() },
  })
    .select("+passwordHash")
    .exec();

  if (!user) {
    const err = new Error("الرابط منتهي أو غير صحيح") as Error & {
      status?: number;
    };
    err.status = 400;
    throw err;
  }

  if (user.isBlocked) {
    const err = new Error("الحساب موقوف. تواصل مع الإدارة.") as Error & {
      status?: number;
    };
    err.status = 403;
    throw err;
  }

  user.passwordHash = await hashPassword(newPassword);
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  user.sessionVersion = (user.sessionVersion ?? 0) + 1;
  await user.save();
}
