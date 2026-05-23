import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { SessionUser } from "@/lib/auth";

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
