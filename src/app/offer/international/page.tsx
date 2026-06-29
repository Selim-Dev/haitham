import type { Metadata } from "next";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { BundleOffer } from "@/components/offer/bundle-offer";
import { PaypalHostedButton } from "@/components/offer/paypal-hosted-button";
import type { OfferPricing } from "@/lib/offer-content";

export const metadata: Metadata = {
  title: "Game of Tests Bundle Offer — International",
  description:
    "Get the complete لعبة الاختبارات bundle (3 books) for $17. Pay securely with PayPal, or reach out for STC Pay, Barq, bank transfer & crypto.",
};

// Hosted button id from the source international sales page.
const PAYPAL_HOSTED_BUTTON_ID = "KZXLAWVMTU4MY";

const pricing: OfferPricing = {
  variant: "international",
  amountLabel: "$17",
  ltr: true,
  urgencyTitle: "🚨 سعر الإطلاق الخاص ($17) متاح لأول ١٠٠ نسخة فقط.",
  urgencySub:
    "أنت تحصل على دبلومة كاملة في لعبة الاختبارات بأقل من سعر «وجبة غداء». هذا السعر غير منطقي ومتاح لفترة محدودة فقط.",
  trustBadges: ["PayPal", "Visa", "Mastercard", "Amex"],
};

export default function OfferInternationalPage() {
  return (
    <BundleOffer
      pricing={pricing}
      checkout={
        <div className="flex flex-col gap-4">
          <PaypalHostedButton hostedButtonId={PAYPAL_HOSTED_BUTTON_ID} />
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-center text-sm font-bold text-neutral-700 transition-colors hover:border-[#4bbc63]/40 hover:bg-neutral-50"
          >
            <Wallet className="size-4 shrink-0 text-[#2d8541]" />
            طرق تحويل أخرى (STC Pay • برق • انجاز • تحويل بنكي • Crypto)
          </Link>
        </div>
      }
    />
  );
}
