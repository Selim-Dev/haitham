import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { CourseModel } from "@/models/Course";
import { ReceiptUploader } from "@/components/forms/receipt-uploader";
import { PaymentMethodsCard } from "@/components/payment/payment-methods-card";
import { PaypalCheckoutCard } from "@/components/payment/paypal-checkout-card";
import { getViewerCountry } from "@/lib/viewer-country";
import { pickPriceForCountry } from "@/lib/pricing";
import { COPY } from "@/lib/arabic";

export const metadata: Metadata = { title: COPY.payment.title };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ courseId?: string; method?: string }>;

export default async function NewPaymentProofPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { courseId, method } = await searchParams;
  if (!courseId) redirect("/courses");

  await connectDB();
  const course = await CourseModel.findById(courseId).lean();
  if (!course) notFound();

  const viewerCountry = await getViewerCountry();
  const priced = pickPriceForCountry(
    {
      price: course.price,
      currency: course.currency,
      priceUsd: course.priceUsd,
    },
    viewerCountry,
  );
  // PayPal only when the viewer truly resolves to an international price,
  // OR when the link explicitly forces it. If the course has no USD price,
  // priced.isInternational is false and we fall through to the EG flow even
  // for non-Egypt viewers — keeps the displayed price and the payment page
  // consistent.
  const forcePaypal = method === "paypal";
  const useEgyptFlow = !(forcePaypal || priced.isInternational);

  if (useEgyptFlow) {
    return (
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {COPY.payment.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            ادفع بإحدى الطرق التالية، ثم ارفع صورة أو ملف الإيصال وستتم
            مراجعته من الإدارة.
          </p>
        </header>

        <PaymentMethodsCard />

        <section
          aria-labelledby="upload-receipt-title"
          className="flex flex-col gap-4"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-2">
              خطوة 2 من 2
            </p>
            <h2
              id="upload-receipt-title"
              className="mt-1 font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"
            >
              ارفع إيصال الدفع
            </h2>
            <p className="mt-1 text-sm text-muted">
              أرفق صورة واضحة أو ملف PDF لإيصال التحويل ليتم مطابقته.
            </p>
          </div>
          <ReceiptUploader
            course={{
              id: String(course._id),
              title: course.title,
              price: course.price,
              currency: course.currency,
              thumbnailUrl: course.thumbnailUrl,
            }}
          />
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          الاشتراك في {course.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          ادفع بأمان عبر PayPal، ثم أرسل لنا رقم العملية لتفعيل اشتراكك مدى
          الحياة.
        </p>
      </header>

      <PaypalCheckoutCard
        course={{
          id: String(course._id),
          title: course.title,
          priceUsd: course.priceUsd,
          paypalHostedButtonId: course.paypalHostedButtonId,
        }}
      />
    </div>
  );
}
