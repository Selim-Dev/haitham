import { connectDB } from "@/lib/db";
import { PaymentProofModel } from "@/models/PaymentProof";
import { CourseModel } from "@/models/Course";
import { getStorageProvider } from "@/services/storage/storage.service";
import { RECEIPT_UPLOAD, type PaymentMethod } from "@/lib/constants";

const ALLOWED_MIME = new Set<string>(RECEIPT_UPLOAD.ALLOWED_MIME_TYPES);

export async function createPaymentProof(input: {
  userId: string;
  courseId: string;
  amount: number;
  currency?: string;
  paymentMethod?: PaymentMethod;
  transactionReference?: string;
  userNote?: string;
  file: { buffer: Buffer; filename: string; mimeType: string; size: number };
}) {
  await connectDB();

  if (!ALLOWED_MIME.has(input.file.mimeType)) {
    const err = new Error("نوع الملف غير مدعوم. JPG, PNG, أو PDF فقط.") as Error & {
      status?: number;
    };
    err.status = 400;
    throw err;
  }

  if (input.file.size > RECEIPT_UPLOAD.MAX_SIZE_BYTES) {
    const err = new Error("حجم الملف أكبر من المسموح (٥ ميجابايت).") as Error & {
      status?: number;
    };
    err.status = 400;
    throw err;
  }

  const course = await CourseModel.findById(input.courseId).lean();
  if (!course) {
    const err = new Error("الكورس غير موجود") as Error & { status?: number };
    err.status = 404;
    throw err;
  }

  const storage = getStorageProvider();
  const stored = await storage.upload({
    buffer: input.file.buffer,
    filename: input.file.filename,
    mimeType: input.file.mimeType,
    folder: `ahmed-haitham/receipts/${input.userId}`,
  });

  const method: PaymentMethod = input.paymentMethod ?? "WALLET";

  const proof = await PaymentProofModel.create({
    userId: input.userId,
    courseId: input.courseId,
    amount: input.amount,
    currency: (input.currency || course.currency || "EGP").toUpperCase(),
    paymentMethod: method,
    receiptUrl: stored.url,
    receiptStorageKey: stored.storageKey,
    transactionReference: input.transactionReference?.trim() || undefined,
    userNote: input.userNote?.trim() || undefined,
    status: "PENDING",
  });

  return {
    id: String(proof._id),
    status: proof.status,
  };
}

export async function createPaypalPaymentProof(input: {
  userId: string;
  courseId: string;
  transactionReference: string;
  userNote?: string;
}) {
  await connectDB();

  const course = await CourseModel.findById(input.courseId).lean();
  if (!course) {
    const err = new Error("الكورس غير موجود") as Error & { status?: number };
    err.status = 404;
    throw err;
  }

  if (typeof course.priceUsd !== "number" || course.priceUsd <= 0) {
    const err = new Error(
      "البيع الدولي لهذا الكورس غير مفعّل. تواصل مع الإدارة.",
    ) as Error & { status?: number };
    err.status = 400;
    throw err;
  }

  const ref = input.transactionReference.trim();
  if (ref.length < 4) {
    const err = new Error("رقم العملية غير صحيح") as Error & {
      status?: number;
    };
    err.status = 400;
    throw err;
  }

  const duplicate = await PaymentProofModel.findOne({
    paymentMethod: "PAYPAL",
    transactionReference: ref,
  }).lean();
  if (duplicate) {
    const err = new Error("رقم العملية مستخدم بالفعل") as Error & {
      status?: number;
    };
    err.status = 409;
    throw err;
  }

  const proof = await PaymentProofModel.create({
    userId: input.userId,
    courseId: input.courseId,
    amount: course.priceUsd,
    currency: "USD",
    paymentMethod: "PAYPAL",
    transactionReference: ref,
    userNote: input.userNote?.trim() || undefined,
    status: "PENDING",
  });

  return { id: String(proof._id), status: proof.status };
}

export async function listMyPaymentProofs(userId: string) {
  await connectDB();
  const proofs = await PaymentProofModel.find({ userId })
    .sort({ createdAt: -1 })
    .lean();
  if (proofs.length === 0) return [];

  const courseIds = [...new Set(proofs.map((p) => String(p.courseId)))];
  const courses = await CourseModel.find({ _id: { $in: courseIds } }).lean();
  const map = new Map(courses.map((c) => [String(c._id), c]));

  return proofs.map((p) => {
    const course = map.get(String(p.courseId));
    return {
      id: String(p._id),
      amount: p.amount,
      currency: p.currency,
      paymentMethod: p.paymentMethod,
      status: p.status,
      adminNote: p.adminNote,
      transactionReference: p.transactionReference,
      receiptUrl: p.receiptUrl,
      createdAt: p.createdAt,
      course: course
        ? {
            id: String(course._id),
            slug: course.slug,
            title: course.title,
            thumbnailUrl: course.thumbnailUrl,
          }
        : null,
    };
  });
}
