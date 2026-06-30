"use client";

import * as React from "react";
import Image from "next/image";
import Script from "next/script";
import { toast } from "sonner";
import { Check, Clock, Copy } from "lucide-react";
import { Reveal } from "@/components/offer/reveal";

declare global {
  interface Window {
    confetti?: (opts?: Record<string, unknown>) => void;
  }
}

// Page-scoped keyframes only (no element selectors → safe to inject globally).
const KEYFRAMES = `
@keyframes ty-pop-in {
  0% { transform: scale(0) rotate(-15deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(4deg); }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
@keyframes ty-wa-pulse {
  0%, 100% { box-shadow: 0 6px 24px rgba(37,211,102,0.4); }
  50% { box-shadow: 0 6px 36px rgba(37,211,102,0.65); }
}`;

const COURSE_COVER = "/eternal-game-cover.jpeg";
const WHATSAPP_URL = "https://wa.me/201515717713";
const COURSE_URL = "https://www.ahmedhaitham.com/eternal-game";
const SITE_URL = "https://www.ahmedhaitham.com";
const SUPPORT_EMAIL = "enter@ahmedhaitham.com";

const DIFFS: { strong: string; rest: string }[] = [
  { strong: "ما قبل الدخلات", rest: "لغة الجسد القوية، نبرة الصوت الذكوري، وإزاي تدخل على أي بنت بثقة كاملة" },
  { strong: "سيستم الدخلات", rest: "المعادلة السرية لفتح كلام مع أي بنت بدون ما تبان غريب أو ملزق" },
  { strong: "مفاتيح الانجذاب", rest: "إزاي تخليها مشدودة ليك بدون ما هي تكون عارفة السبب" },
  { strong: "بناء الراحة", rest: "تكنيكات سرية عشان تزرع نفسك في عقلها وأفكارها للأبد" },
  { strong: "القفلة والعلاقة الجادة", rest: "من أخد الرقم لحد تكوين علاقة بنية حلال ناجحة ومستمرة" },
];

const FEATURES: { icon: string; h: string; p: string }[] = [
  { icon: "⏱", h: "+٥ ساعات ونص محتوى", p: "٩ أجزاء متسلسلة من الصفر للاحتراف الكامل" },
  { icon: "🎙", h: "لايفات حصرية دورية", p: "جلسات مباشرة مع أحمد هيثم لمناقشة ومتابعة" },
  { icon: "💬", h: "مجتمع خاص للطلاب", p: "مجموعة مقفولة لتبادل التجارب والأسئلة" },
  { icon: "🎬", h: "تطبيقات من أرض الواقع", p: "تسجيلات حقيقية لمحادثات وردود أفعال البنات" },
];

const PILLS = ["♾ وصول دائم", "🛡 ضمان استرداد كامل", "🔒 قبول محدود", "📲 جميع طرق الدفع", "🆓 التحديثات مجانًا"];

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function fireConfetti() {
  const c = window.confetti;
  if (!c) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const gold = ["#F5C518", "#FDD068", "#C8971A", "#FFFDE7"];
  const greens = ["#1E8B44", "#4DC864"];
  const all = [...gold, ...greens, "#FFFFFF"];
  c({ particleCount: 130, spread: 85, origin: { y: 0.25 }, colors: all, startVelocity: 50, gravity: 0.75, scalar: 1.15, ticks: 200 });
  setTimeout(() => {
    c({ particleCount: 70, angle: 55, spread: 65, origin: { x: 0.05, y: 0.45 }, colors: gold, gravity: 0.8 });
    c({ particleCount: 70, angle: 125, spread: 65, origin: { x: 0.95, y: 0.45 }, colors: gold, gravity: 0.8 });
  }, 450);
  setTimeout(() => {
    c({ particleCount: 40, spread: 100, origin: { y: 0.2 }, colors: ["#F5C518", "#FFFFFF"], startVelocity: 25, scalar: 0.8, shapes: ["circle"] });
  }, 900);
}

export function Celebration() {
  const fired = React.useRef(false);
  const fire = React.useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    fireConfetti();
  }, []);

  React.useEffect(() => {
    if (window.confetti) fire();
  }, [fire]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      toast.success("📋 تم نسخ الإيميل!");
    } catch {
      toast.error("تعذر النسخ — انسخ الإيميل يدويًا");
    }
  }

  return (
    <div className="bg-white text-[#111111]">
      <style>{KEYFRAMES}</style>
      <Script
        src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"
        strategy="afterInteractive"
        onLoad={fire}
      />

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-[100] flex items-center justify-between border-b border-white/[0.06] bg-[#0A0A0A] px-5 py-3.5 sm:px-7">
        <span className="text-base font-bold text-white">
          أكاديمية <span className="text-[#F5C518]">أحمد هيثم</span>
        </span>
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          dir="ltr"
          className="text-[0.82rem] text-white/40 transition-colors hover:text-[#F5C518]"
        >
          ahmedhaitham.com
        </a>
      </header>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A0A0A] px-6 py-14 text-center sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(245,197,24,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative z-[1]">
          {/* Animated celebrate ring */}
          <div
            className="relative mx-auto mb-5 size-[110px]"
            style={{ animation: "ty-pop-in 0.7s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <svg viewBox="0 0 110 110" className="size-full">
              <circle cx="55" cy="55" r="50" fill="none" stroke="rgba(245,197,24,0.15)" strokeWidth="2" />
              <circle
                cx="55"
                cy="55"
                r="50"
                fill="none"
                stroke="url(#tyGoldArc)"
                strokeWidth="3"
                strokeDasharray="200 115"
                strokeDashoffset="-30"
                strokeLinecap="round"
              >
                <animateTransform attributeName="transform" type="rotate" values="0 55 55;360 55 55" dur="5s" repeatCount="indefinite" />
              </circle>
              <defs>
                <linearGradient id="tyGoldArc" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5C518" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FFF0A0" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-5xl">🎉</div>
          </div>

          <span
            className="mb-4 inline-block rounded-full border border-[#F5C518]/30 bg-[#F5C518]/12 px-3.5 py-[5px] text-[0.78rem] font-bold tracking-[0.08em] text-[#F5C518]"
            style={{ animation: "fade-up 0.6s 0.35s ease both" }}
          >
            ✅ عملية الشراء تمت بنجاح
          </span>

          <h1
            className="mb-3 text-[clamp(3rem,10vw,5.5rem)] font-black leading-none text-[#F5C518]"
            style={{ animation: "fade-up 0.6s 0.5s ease both", textShadow: "0 0 60px rgba(245,197,24,0.35)" }}
          >
            مبرووك!
          </h1>
          <p className="mb-1.5 text-[clamp(1rem,3.5vw,1.25rem)] font-bold text-white" style={{ animation: "fade-up 0.6s 0.65s ease both" }}>
            إنت خدت الخطوة الأولى الصح في فهمك للعبة العلاقات
          </p>
          <p className="mb-9 text-[0.9rem] text-white/45" style={{ animation: "fade-up 0.6s 0.8s ease both" }}>
            الكتاب هيوصلك على إيميلك في أسرع وقت خلال ٢٤ ساعة
          </p>

          {/* Book confirmation */}
          <div
            className="mx-auto flex max-w-[440px] items-center gap-4 rounded-[18px] border-[1.5px] border-[#F5C518]/25 bg-white/[0.04] p-5 text-start backdrop-blur-sm max-[480px]:flex-col max-[480px]:text-center"
            style={{ animation: "fade-up 0.6s 1s ease both" }}
          >
            <div
              className="grid size-[60px] shrink-0 place-items-center rounded-[14px] text-3xl"
              style={{ background: "linear-gradient(135deg,#F5C518,#C8971A)", boxShadow: "0 8px 24px rgba(245,197,24,0.35)" }}
            >
              📖
            </div>
            <div className="max-[480px]:text-center">
              <h3 className="text-[1.05rem] font-extrabold text-white">لعبة الاختبارات</h3>
              <p className="text-[0.82rem] text-white/50">افهم دماغ البنات — فك شفرة العلاقات</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#22c55e]/35 bg-[#22c55e]/15 px-2.5 py-[3px] text-[0.75rem] font-bold text-[#4ADE80]">
                <Check className="size-3" strokeWidth={3} />
                تم الشراء بنجاح
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* gold divider */}
      <div className="h-[5px]" style={{ background: "linear-gradient(90deg,transparent,#F5C518,#C8971A,#F5C518,transparent)" }} />

      {/* ─── DELIVERY STEPS ─────────────────────────────────── */}
      <section className="bg-white px-6 py-14 sm:py-16">
        <div className="mx-auto max-w-[680px]">
          <Reveal>
            <span className="mb-3.5 inline-flex items-center gap-[7px] rounded-full border border-[#F5C518]/35 bg-[#FFFBEB] px-3.5 py-1.5 text-[0.78rem] font-extrabold tracking-[0.06em] text-[#C8971A]">
              📬 خطوات استلام الكتاب
            </span>
            <h2 className="mb-2.5 text-[clamp(1.7rem,5vw,2.6rem)] font-black leading-[1.15] text-[#111111]">
              إزاي تستلم الكتاب؟
            </h2>
            <div className="mb-5 inline-flex items-center gap-[7px] rounded-full border-[1.5px] border-[#86EFAC] bg-[#F0FFF4] px-3.5 py-[7px] text-[0.82rem] font-bold text-[#15803D]">
              <Clock className="size-3.5" strokeWidth={2.5} />
              الكتاب بيوصل على إيميلك خلال ٢٤ ساعة
            </div>
            <p className="mb-10 text-[1rem] leading-[1.75] text-[#6B7280]">
              الإيميل بيوصل في أسرع وقت ممكن. اتبع الخطوات دي عشان تلاقيه.
            </p>
          </Reveal>

          <Reveal>
            <div className="relative flex flex-col">
              <div
                aria-hidden
                className="absolute end-[23px] top-6 bottom-6 w-0.5"
                style={{ background: "linear-gradient(to bottom,#F5C518,rgba(245,197,24,0.1))" }}
              />

              {/* Step 1 */}
              <div className="flex items-start gap-5 border-b border-[#E5E7EB] py-6">
                <div
                  className="relative z-[1] grid size-12 shrink-0 place-items-center rounded-full text-[1.1rem] font-black text-[#0A0A0A]"
                  style={{ background: "linear-gradient(135deg,#F5C518,#C8971A)", boxShadow: "0 4px 16px rgba(245,197,24,0.35)" }}
                >
                  ١
                </div>
                <div className="flex-1 pt-1.5">
                  <h4 className="mb-1.5 text-[1.05rem] font-extrabold text-[#111111]">افتح إيميلك وابحث في كل المجلدات</h4>
                  <p className="text-[0.92rem] leading-[1.65] text-[#6B7280]">
                    ادخل على البريد الإلكتروني اللي دفعت بيه — ابحث في صندوق الوارد{" "}
                    <strong className="text-[#111111]">وكمان في مجلد الـ Spam / Junk</strong>.
                  </p>
                  <div className="mt-3.5 flex items-start gap-3 rounded-xl border-2 border-[#FECACA] bg-[#FEF2F2] px-4 py-3.5">
                    <span aria-hidden className="text-[1.4rem] leading-tight">⚠️</span>
                    <div className="flex flex-col gap-0.5">
                      <strong className="text-[0.92rem] font-extrabold text-[#991B1B]">تنبيه مهم جداً</strong>
                      <span className="text-[0.85rem] leading-[1.6] text-[#7F1D1D]">
                        الإيميل بيروح الـ Spam عند كتير من الناس! لو مش لاقيه في الوارد، افتح مجلد الـ{" "}
                        <strong className="text-[#991B1B]">Spam</strong> أو <strong className="text-[#991B1B]">Junk</strong> فوراً.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-5 border-b border-[#E5E7EB] py-6">
                <div
                  className="relative z-[1] grid size-12 shrink-0 place-items-center rounded-full text-[1.1rem] font-black text-[#0A0A0A]"
                  style={{ background: "linear-gradient(135deg,#F5C518,#C8971A)", boxShadow: "0 4px 16px rgba(245,197,24,0.35)" }}
                >
                  ٢
                </div>
                <div className="flex-1 pt-1.5">
                  <h4 className="mb-1.5 text-[1.05rem] font-extrabold text-[#111111]">دور على إيميل من أحمد هيثم</h4>
                  <p className="text-[0.92rem] leading-[1.65] text-[#6B7280]">
                    هتلاقي رسالة من الإيميل الرسمي المعتمد. اضغط على الإيميل ده عشان تنسخه:
                  </p>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label={`نسخ الإيميل: ${SUPPORT_EMAIL}`}
                    className="mt-3 flex w-full items-center gap-2.5 rounded-[10px] border-[1.5px] border-[#F5C518]/50 bg-[#FFFBEB] px-4 py-2.5 text-start transition-colors hover:border-[#F5C518] hover:bg-[#FFF3C4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]/60"
                  >
                    <span aria-hidden className="text-[1.1rem]">📧</span>
                    <code dir="ltr" className="text-[0.95rem] font-bold text-[#C8971A]">{SUPPORT_EMAIL}</code>
                    <span className="ms-auto inline-flex items-center gap-1 text-[0.72rem] font-semibold text-[#C8971A]/70">
                      <Copy className="size-3" />
                      انسخ
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-5 border-b border-[#E5E7EB] py-6">
                <div
                  className="relative z-[1] grid size-12 shrink-0 place-items-center rounded-full text-[1.1rem] font-black text-[#0A0A0A]"
                  style={{ background: "linear-gradient(135deg,#F5C518,#C8971A)", boxShadow: "0 4px 16px rgba(245,197,24,0.35)" }}
                >
                  ٣
                </div>
                <div className="flex-1 pt-1.5">
                  <h4 className="mb-1.5 text-[1.05rem] font-extrabold text-[#111111]">افتح الإيميل وحمّل الكتاب</h4>
                  <p className="text-[0.92rem] leading-[1.65] text-[#6B7280]">
                    في الإيميل هتلاقي لينك مباشر لتحميل الكتاب بصيغة PDF. اضغط عليه وحمّله على جهازك.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-5 py-6">
                <div
                  className="relative z-[1] grid size-12 shrink-0 place-items-center rounded-full text-[1.1rem] font-black text-[#0A0A0A]"
                  style={{ background: "linear-gradient(135deg,#F5C518,#C8971A)", boxShadow: "0 4px 16px rgba(245,197,24,0.35)" }}
                >
                  ٤
                </div>
                <div className="flex-1 pt-1.5">
                  <h4 className="mb-1.5 text-[1.05rem] font-extrabold text-[#111111]">أبدأ رحلتك في فهم لعبة الاختبارات 🔥</h4>
                  <p className="text-[0.92rem] leading-[1.65] text-[#6B7280]">
                    لو الإيميل تأخر أكتر من ٢٤ ساعة، تواصل معنا على واتساب فورًا!
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── WHATSAPP SUPPORT ───────────────────────────────── */}
      <div className="border-y border-[#E5E7EB] bg-[#F8F8F8] px-6 py-10 text-center">
        <p className="mb-4 text-[0.95rem] text-[#6B7280]">
          مجاش الإيميل؟ أو عندك <strong className="text-[#111111]">أي مشكلة في الاستلام</strong>؟
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 text-[1rem] font-extrabold text-white transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60 focus-visible:ring-offset-2"
          style={{ animation: "ty-wa-pulse 2.4s ease-in-out infinite" }}
        >
          <WhatsAppIcon className="size-[22px]" />
          تواصل معنا على واتساب
        </a>
      </div>

      {/* green divider */}
      <div className="h-[5px]" style={{ background: "linear-gradient(90deg,transparent,#1E8B44,#4DC864,#1E8B44,transparent)" }} />

      {/* ─── CROSS-SELL: اللعبة الأزلية ─────────────────────── */}
      <section className="relative overflow-hidden bg-[#131313] px-6 py-16 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(30,139,68,0.22) 0%, transparent 65%), radial-gradient(ellipse 40% 30% at 80% 10%, rgba(245,197,24,0.07) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-[1] mx-auto max-w-[680px]">
          <Reveal>
            <span className="mb-3.5 inline-flex items-center gap-[7px] rounded-full border border-[#1E8B44]/30 bg-[#E8F5ED] px-3.5 py-1.5 text-[0.78rem] font-extrabold tracking-[0.06em] text-[#155E30]">
              🌟 الخطوة التالية في رحلتك
            </span>
            <h2 className="mb-2.5 text-[clamp(2rem,7vw,3.8rem)] font-black leading-[1.1] text-white">
              <span className="text-[#F5C518]">لعبة الاختبارات</span>
              <br />
              جزء من <span className="text-[#4DC864]">لعبة أكبر</span>..
            </h2>
          </Reveal>

          <Reveal className="my-8 flex justify-center">
            <div
              className="relative aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-[20px]"
              style={{ boxShadow: "0 0 0 1px rgba(30,139,68,0.25), 0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(30,139,68,0.18)" }}
            >
              <Image src={COURSE_COVER} alt="اللعبة الأزلية — أحمد هيثم" fill sizes="300px" className="object-cover" />
            </div>
          </Reveal>

          <Reveal>
            <p className="mb-9 max-w-[580px] text-[1rem] leading-[1.8] text-white/[0.62]">
              إنت دلوقتي بدأت تفهم إزاي تتعامل مع <em className="font-bold not-italic text-[#F5C518]">اختبارات البنات</em>.. لكن في الصورة الكبيرة —{" "}
              <strong className="font-bold text-[#4DC864]">اللعبة الأزلية</strong> بتعلمك القوانين الفطرية الأزلية اللي بتتحكم في الانجذاب والعلاقات من{" "}
              <em className="font-bold not-italic text-[#F5C518]">ما قبل التعارف</em> لحد ما تبني علاقة جادة ناجحة مستمرة.
            </p>
          </Reveal>

          {/* Journey */}
          <Reveal className="mb-9">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-6 py-5">
              <p className="mb-2.5 w-full text-center text-[0.72rem] font-bold tracking-[0.06em] text-white/35">
                رحلتك الكاملة مع أحمد هيثم
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="min-w-[130px] rounded-xl border-[1.5px] border-[#F5C518]/30 bg-[#F5C518]/10 px-5 py-3 text-center">
                  <span className="mb-1 block text-2xl">📖</span>
                  <span className="block text-[0.82rem] font-extrabold text-[#F5C518]">لعبة الاختبارات</span>
                  <span className="mt-0.5 block text-[0.72rem] text-white/40">اشتريتها ✓</span>
                </div>
                <span aria-hidden className="text-[1.4rem] text-white/25">←</span>
                <div className="min-w-[130px] rounded-xl border-[1.5px] border-[#1E8B44]/40 bg-[#1E8B44]/15 px-5 py-3 text-center">
                  <span className="mb-1 block text-2xl">♾️</span>
                  <span className="block text-[0.82rem] font-extrabold text-[#4DC864]">اللعبة الأزلية</span>
                  <span className="mt-0.5 block text-[0.72rem] text-white/40">الخطوة التالية</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* What's not in the book */}
          <Reveal className="mb-8">
            <div className="rounded-2xl border border-[#1E8B44]/22 bg-[#1E8B44]/6 p-6">
              <h4 className="mb-4 text-[0.9rem] font-extrabold tracking-[0.04em] text-[#4DC864]">
                🔓 إيه اللي هتتعلمه في اللعبة الأزلية ومش موجود في الكتاب:
              </h4>
              <div className="flex flex-col gap-2.5">
                {DIFFS.map((d) => (
                  <div key={d.strong} className="flex items-start gap-3.5">
                    <span className="mt-0.5 grid size-[22px] shrink-0 place-items-center rounded-full border border-[#4DC864]/40 bg-[#4DC864]/15 text-[0.6rem] font-black text-[#4DC864]">
                      ✓
                    </span>
                    <p className="text-[0.88rem] leading-[1.55] text-white/70">
                      <strong className="text-white">{d.strong}</strong> — {d.rest}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Features */}
          <Reveal className="mb-9">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.h}
                  className="rounded-[14px] border border-[#1E8B44]/20 bg-white/[0.04] px-[18px] py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1E8B44]/45 hover:bg-[#1E8B44]/8"
                >
                  <span className="mb-2.5 block text-[1.7rem]">{f.icon}</span>
                  <h5 className="mb-1.5 text-[0.92rem] font-extrabold text-white">{f.h}</h5>
                  <p className="text-[0.8rem] leading-[1.55] text-white/45">{f.p}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Pills */}
          <Reveal className="mb-8">
            <div className="flex flex-wrap gap-2">
              {PILLS.map((p) => (
                <span key={p} className="rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-[7px] text-[0.8rem] text-white/65">
                  {p}
                </span>
              ))}
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal>
            <a
              href={COURSE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[58px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#1E8B44] px-8 py-[18px] text-[1.1rem] font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#155E30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4DC864]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131313]"
              style={{ boxShadow: "0 8px 32px rgba(30,139,68,0.45)" }}
            >
              اعرف أكتر واتقدم للانضمام
              <span aria-hidden className="text-xl">←</span>
            </a>
            <p className="mt-2.5 text-center text-[0.8rem] text-white/30">
              الانضمام بالقبول فقط — طلبك يُراجع خلال ٢٤ ساعة
            </p>
          </Reveal>

          {/* Quote */}
          <Reveal>
            <div className="mt-10 rounded-2xl border-s-[3px] border-[#1E8B44] bg-white/[0.03] p-5 ps-6">
              <p className="mb-3 text-[0.97rem] italic leading-[1.85] text-white/[0.72]">
                «إنت مش ناقص طول أو فلوس أو شكل حلو. إللي ناقصك فعلًا إنك تفهم قوانين لعبة العلاقات الأزلية.. وده اللي هعلمهولك.»
              </p>
              <cite className="text-[0.85rem] font-bold not-italic text-[#4DC864]">— أحمد هيثم</cite>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] bg-[#0A0A0A] px-6 py-7 text-center">
        <p className="text-[0.82rem] text-white/25">
          © ٢٠٢٦{" "}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="text-[#F5C518] hover:underline">
            أحمد هيثم
          </a>
          . جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}
