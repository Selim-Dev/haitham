import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { ApplicationQuestionModel } from "@/models/ApplicationQuestion";
import { AuditLogModel } from "@/models/AuditLog";
import type {
  ApplicationQuestionInput,
  ApplicationQuestionUpdateInput,
} from "@/validators/application.validator";

export type PublicQuestion = {
  id: string;
  label: string;
  helperText?: string;
  type: "short" | "long" | "select";
  options?: string[];
  required: boolean;
  order: number;
};

export type AdminQuestion = PublicQuestion & {
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function listActiveQuestions(): Promise<PublicQuestion[]> {
  await connectDB();
  const docs = await ApplicationQuestionModel.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return docs.map((d) => ({
    id: String(d._id),
    label: d.label,
    helperText: d.helperText,
    type: d.type,
    options: d.options,
    required: d.required,
    order: d.order,
  }));
}

export async function listAllQuestions(): Promise<AdminQuestion[]> {
  await connectDB();
  const docs = await ApplicationQuestionModel.find({})
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return docs.map((d) => ({
    id: String(d._id),
    label: d.label,
    helperText: d.helperText,
    type: d.type,
    options: d.options,
    required: d.required,
    isActive: d.isActive,
    order: d.order,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));
}

export async function createQuestion(
  input: ApplicationQuestionInput,
  actorId: string,
): Promise<AdminQuestion> {
  await connectDB();
  const doc = await ApplicationQuestionModel.create({
    label: input.label,
    helperText: input.helperText || undefined,
    type: input.type,
    options: input.type === "select" ? input.options ?? [] : undefined,
    required: input.required,
    isActive: input.isActive,
    order: input.order,
  });

  await AuditLogModel.create({
    actorId: new mongoose.Types.ObjectId(actorId),
    action: "APPLICATION_QUESTION_CREATED",
    entityType: "ApplicationQuestion",
    entityId: String(doc._id),
    metadata: { label: doc.label },
  });

  return {
    id: String(doc._id),
    label: doc.label,
    helperText: doc.helperText,
    type: doc.type,
    options: doc.options,
    required: doc.required,
    isActive: doc.isActive,
    order: doc.order,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function updateQuestion(
  id: string,
  input: ApplicationQuestionUpdateInput,
  actorId: string,
): Promise<AdminQuestion> {
  await connectDB();
  const update: Record<string, unknown> = {};
  if (input.label !== undefined) update.label = input.label;
  if (input.helperText !== undefined)
    update.helperText = input.helperText || undefined;
  if (input.type !== undefined) update.type = input.type;
  if (input.options !== undefined) update.options = input.options;
  if (input.required !== undefined) update.required = input.required;
  if (input.isActive !== undefined) update.isActive = input.isActive;
  if (input.order !== undefined) update.order = input.order;

  const doc = await ApplicationQuestionModel.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true },
  ).lean();
  if (!doc) {
    throw Object.assign(new Error("السؤال غير موجود"), { status: 404 });
  }

  await AuditLogModel.create({
    actorId: new mongoose.Types.ObjectId(actorId),
    action: "APPLICATION_QUESTION_UPDATED",
    entityType: "ApplicationQuestion",
    entityId: String(doc._id),
    metadata: update,
  });

  return {
    id: String(doc._id),
    label: doc.label,
    helperText: doc.helperText,
    type: doc.type,
    options: doc.options,
    required: doc.required,
    isActive: doc.isActive,
    order: doc.order,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function deleteQuestion(
  id: string,
  actorId: string,
): Promise<void> {
  await connectDB();
  const doc = await ApplicationQuestionModel.findByIdAndDelete(id).lean();
  if (!doc) {
    throw Object.assign(new Error("السؤال غير موجود"), { status: 404 });
  }
  await AuditLogModel.create({
    actorId: new mongoose.Types.ObjectId(actorId),
    action: "APPLICATION_QUESTION_DELETED",
    entityType: "ApplicationQuestion",
    entityId: id,
    metadata: { label: doc.label },
  });
}
