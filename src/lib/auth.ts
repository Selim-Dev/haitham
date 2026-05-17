import { cookies } from "next/headers";
import { connectDB } from "./db";
import { UserModel } from "@/models/User";
import { signSession, verifySession, type SessionPayload } from "./jwt";
import { AUTH } from "./constants";
import type { ApprovalStatus } from "./constants";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "STUDENT" | "ADMIN";
  isBlocked: boolean;
  approvalStatus: ApprovalStatus;
  registrationCountry?: string;
};

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(AUTH.COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getCurrentSession();
  if (!session) return null;
  await connectDB();
  const user = await UserModel.findById(session.sub).lean();
  if (!user) return null;
  if (user.isBlocked) return null;
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isBlocked: user.isBlocked,
    approvalStatus: user.approvalStatus ?? "APPROVED",
    registrationCountry: user.registrationCountry,
  };
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    const err = new Error("UNAUTHORIZED") as Error & { status?: number };
    err.status = 401;
    throw err;
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    const err = new Error("FORBIDDEN") as Error & { status?: number };
    err.status = 403;
    throw err;
  }
  return user;
}

export async function requireStudent(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "STUDENT" && user.role !== "ADMIN") {
    const err = new Error("FORBIDDEN") as Error & { status?: number };
    err.status = 403;
    throw err;
  }
  return user;
}

export async function requireApprovedStudent(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role === "ADMIN") return user;
  if (user.approvalStatus !== "APPROVED") {
    const err = new Error("APPROVAL_REQUIRED") as Error & { status?: number };
    err.status = 403;
    throw err;
  }
  return user;
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await signSession({
    sub: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });
  const store = await cookies();
  store.set(AUTH.COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH.TOKEN_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(AUTH.COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
