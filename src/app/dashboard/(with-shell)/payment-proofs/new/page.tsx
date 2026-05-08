import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { CourseModel } from "@/models/Course";
import { ReceiptUploader } from "@/components/forms/receipt-uploader";
import { COPY } from "@/lib/arabic";

export const metadata: Metadata = { title: COPY.payment.title };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ courseId?: string }>;

export default async function NewPaymentProofPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { courseId } = await searchParams;
  if (!courseId) redirect("/courses");

  await connectDB();
  const course = await CourseModel.findById(courseId).lean();
  if (!course) notFound();

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.payment.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          ارفع صورة أو ملف إيصال الدفع وستتم مراجعته من الإدارة.
        </p>
      </header>

      <ReceiptUploader
        course={{
          id: String(course._id),
          title: course.title,
          price: course.price,
          currency: course.currency,
          thumbnailUrl: course.thumbnailUrl,
        }}
      />
    </div>
  );
}
