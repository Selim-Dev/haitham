import type { Metadata } from "next";
import { BundleOffer } from "@/components/offer/bundle-offer";
import type { OfferPricing } from "@/lib/offer-content";

export const metadata: Metadata = {
  title: "عرض كتاب لعبة الاختبارات — مصر",
  description:
    "احصل على باقة لعبة الاختبارات الكاملة (٣ كتب) بـ ٣٥٠ جنيه. الدفع عبر فودافون كاش، انستاباي، أو تحويل بنكي.",
};

// Egypt checkout collects payment through the Tally order form (Vodafone Cash,
// Instapay, bank transfer) — same as the source sales page.
const TALLY_URL = "https://tally.so/r/eqDaOo";

const pricing: OfferPricing = {
  variant: "egypt",
  amountLabel: "٣٥٠ جنيه",
  originalLabel: "٤٠٠ جنيه",
  saveLabel: "وفّر ٥٠ جنيه 🎉",
  urgencyTitle: "🚨 سعر الإطلاق الخاص (٣٥٠ جنيه) متاح لأول ١٠٠ نسخة فقط.",
  urgencySub:
    "أنت تحصل على ٣ كتب بسعر أقل من قهوتك! هذا السعر غير منطقي ومتاح لفترة محدودة فقط.",
  packagePrices: ["٢٠٠ جنيه", "١٠٠ جنيه", "١٠٠ جنيه"],
  trustBadges: ["فودافون كاش", "انستاباي", "تحويل بنكي"],
};

export default function OfferEgyptPage() {
  return (
    <BundleOffer
      pricing={pricing}
      checkout={
        <a
          href={TALLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#3aa551] to-[#1f5d2e] px-6 py-4 text-center font-display text-base font-bold text-white shadow-[0_14px_34px_-12px_rgba(31,93,46,0.6)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d8541]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          💳 اشتري دلوقتي (فودافون كاش، انستاباي، تحويل بنكي) 🚀
        </a>
      }
    />
  );
}
