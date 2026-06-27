import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { BundleOffer } from "@/components/offer/bundle-offer";
import { PaymentMethodsCard } from "@/components/payment/payment-methods-card";
import type { OfferPricing } from "@/lib/offer-content";

export const metadata: Metadata = {
  title: "عرض كتاب لعبة الاختبارات — مصر",
  description:
    "احصل على باقة لعبة الاختبارات الكاملة (٣ كتب) بـ ٣٥٠ جنيه. الدفع عبر فودافون كاش، انستاباي، أو تحويل بنكي.",
};

// Receipts come in over WhatsApp — same number as the contact page.
const WHATSAPP_URL = "https://wa.me/201515717713";

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
        <div className="flex flex-col gap-5">
          <PaymentMethodsCard />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#25d366] to-[#128c4b] px-5 py-4 text-center font-display text-sm font-bold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25d366]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-base"
          >
            <MessageCircle className="size-5 shrink-0" />
            بعد التحويل ابعت صورة الإيصال على واتساب وهيوصلك الكتاب فورًا
          </a>
        </div>
      }
    />
  );
}
