import type { Metadata } from "next";
import { BundleOffer } from "@/components/offer/bundle-offer";
import { PaypalHostedButton } from "@/components/offer/paypal-hosted-button";
import type { OfferPricing } from "@/lib/offer-content";

export const metadata: Metadata = {
  title: "Game of Tests Bundle Offer — International",
  description:
    "Get the complete لعبة الاختبارات bundle (3 books) for $17. Pay securely with PayPal, or via STC Pay, Barq, bank transfer & crypto.",
};

// Hosted button id + alternative-methods order form from the source page.
const PAYPAL_HOSTED_BUTTON_ID = "KZXLAWVMTU4MY";
const TALLY_URL = "https://tally.so/r/ZjEKja";

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
          <a
            href={TALLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl bg-gradient-to-l from-[#0f9d57] to-[#0a5c34] px-6 py-3.5 text-center font-display text-sm font-bold text-white shadow-[0_14px_34px_-12px_rgba(10,92,52,0.6)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f9d57]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <span>📱 طرق تحويل أخرى</span>
            <span className="text-xs font-semibold text-white/90">
              (STC Pay • برق • انجاز • تحويل بنكي • Crypto)
            </span>
          </a>
        </div>
      }
    />
  );
}
