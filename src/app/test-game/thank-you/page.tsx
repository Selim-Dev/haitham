import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Mail,
  AlertTriangle,
  Check,
  ArrowLeft,
} from "lucide-react";
import { toArabicNumerals } from "@/lib/utils";

export const metadata: Metadata = {
  title: "شكراً لشرائك!",
  description: "تم استلام طلبك بنجاح",
};

const WHATSAPP_URL =
  "https://wa.me/201515717713?text=" +
  encodeURIComponent("مرحبًا، اشتريت الكتاب ومحتاج مساعدة");

const STEPS = [
  "افتح البريد الإلكتروني اللي اشتريت بيه",
  "افحص الـ Inbox أول حاجة",
  "لو مش موجود، روح على Spam / Junk",
  "اضغط «ليس رسالة مزعجة» علشان الرسائل الجاية توصل في Inbox",
];

const BENEFITS = [
  "تحليل شخصي لحالتك وعلاقاتك",
  "حلول عملية مباشرة لمشاكلك الحقيقية",
  "مكالمة خاصة — صوت أو فيديو حسب اختيارك",
  "نتائج حقيقية من أول جلسة",
];

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden {...props}>
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.22 6.346L4.5 28.5l7.338-1.7A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10c-1.83 0-3.54-.49-5.01-1.35l-.36-.21-3.73.865.892-3.64-.23-.37A9.956 9.956 0 0 1 6 15c0-5.523 4.477-10 10-10Zm-3.5 5.5a1 1 0 0 0-.75.375l-.375.375C10.625 12 10 13 10 14.5c0 1.625 1.125 3.125 1.25 3.375.125.25 2 3.25 4.875 4.5C18 23.5 18 23 18.875 22.875c.875-.125 2-.875 2.25-1.625.25-.75.25-1.375.125-1.5-.125-.125-.375-.25-.875-.5-.5-.25-2.625-1.375-3-1.5-.375-.125-.75 0-1.125.375l-.75.875C15.25 19.375 15 19.5 14.625 19.25c-.375-.25-1.625-.625-3.125-2a11.6 11.6 0 0 1-2.125-2.75c-.25-.5-.125-.75.125-1l.625-.75c.25-.25.25-.75.125-1L9.5 9.75C9.25 9.25 9 9 8.5 8.5Z" />
    </svg>
  );
}

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-start justify-center px-4 py-10 sm:items-center sm:py-16">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-[0_30px_70px_-30px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#2d8541] text-white shadow-[0_10px_28px_-8px_rgba(45,133,65,0.6)]">
            <CheckCircle2 className="size-9" />
          </div>

          <h1 className="mt-4 font-display text-2xl font-extrabold text-neutral-900">
            🎉 تم الشراء بنجاح!
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 sm:text-base">
            مبروك — أنت على أول خطوة نحو تغيير حياتك للأفضل
          </p>

          <hr className="my-6 border-neutral-200" />

          {/* Delivery info */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-start">
            <h2 className="flex items-center gap-2 font-display text-sm font-bold text-neutral-900 sm:text-base">
              <Mail className="size-4 shrink-0 text-[#2d8541]" />
              الكتاب في طريقه إليك
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
              <strong className="text-neutral-800">
                هيوصلك على إيميلك أو الوسيلة المختارة خلال ٢٤ ساعة.
              </strong>{" "}
              تأكد إنك فاتح الإيميل وجاهز للاستقبال!
            </p>
          </div>

          {/* Spam warning */}
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-start">
            <h3 className="flex items-center gap-2 font-display text-sm font-bold text-red-700">
              <AlertTriangle className="size-4 shrink-0" />
              مهم جداً — اقرأ ده!
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700">
              أغلب العملاء بيلاقوا الكتاب في الـ <strong>Spam</strong> مش في الـ
              Inbox. لو مش موجود في Inbox، روح على Spam فورًا 📩 واضغط «ليس رسالة
              مزعجة».
            </p>
          </div>

          {/* Steps */}
          <div className="mt-5 text-start">
            <h3 className="font-display text-sm font-bold text-neutral-900">
              ⚡ خطوات ضمان وصول الكتاب:
            </h3>
            <ol className="mt-3 flex flex-col gap-2.5">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-start gap-2.5">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#2d8541] text-[11px] font-bold text-white">
                    {toArabicNumerals(i + 1)}
                  </span>
                  <span className="text-sm leading-relaxed text-neutral-600">
                    {s}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <hr className="my-6 border-neutral-200" />

          {/* Upsell — consultation */}
          <div className="rounded-2xl border-2 border-[#4bbc63]/30 bg-green-50/60 p-5 text-center">
            <span className="inline-block rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              🔥 عرض خاص ليك بس
            </span>
            <h2 className="mt-3 font-display text-lg font-extrabold leading-snug text-neutral-900">
              عايز نتائج أسرع؟
              <br />
              احجز جلسة استشارية خاصة معايا
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-start">
              {BENEFITS.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-neutral-700"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-[#2d8541]" />
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/sessions"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#3aa551] to-[#1f5d2e] px-6 py-3.5 font-display text-sm font-bold text-white shadow-[0_14px_34px_-12px_rgba(31,93,46,0.6)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d8541]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              اطلع على الجلسات الاستشارية 🗓️
              <ArrowLeft className="size-4" />
            </Link>
            <p className="mt-2 text-xs text-neutral-500">
              المقاعد محدودة — احجز دلوقتي قبل ما تمتلئ
            </p>
          </div>

          {/* WhatsApp support */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#128c4b] to-[#0b6b39] px-5 py-3.5 font-display text-sm font-bold text-white shadow-md transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#128c4b]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <WhatsAppIcon className="size-5" />
            تواصل معانا عبر واتساب
          </a>
          <p className="mt-2 text-xs leading-relaxed text-neutral-500">
            لو بياناتك غلط أو الكتاب ما وصلش بعد ٢٤ ساعة — ابعت لينا هنا مباشرةً
          </p>

          <p className="mt-6 text-xs text-neutral-500">
            شكراً لثقتك في أحمد هيثم ❤️
          </p>
        </div>
      </div>
    </main>
  );
}
