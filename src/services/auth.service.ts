import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { SessionUser } from "@/lib/auth";

export async function registerStudent(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<SessionUser> {
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
  });

  return {
    id: String(created._id),
    name: created.name,
    email: created.email,
    phone: created.phone,
    role: created.role,
    isBlocked: created.isBlocked,
  };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<SessionUser> {
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

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isBlocked: user.isBlocked,
  };
}
