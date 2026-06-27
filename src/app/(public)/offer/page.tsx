import type { Metadata } from "next";
import { ShieldCheck, Zap, BadgeCheck, RefreshCw, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { RegionCards } from "@/components/offer/region-cards";
import { getViewerCountry } from "@/lib/viewer-country";
import { isEgyptianCountry } from "@/lib/pricing";

// Country detection picks which region card to highlight — keep it dynamic.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "اختر بلدك — عرض كتاب لعبة الاختبارات",
  description:
    "اختر منطقتك لتحصل على السعر وطريقة الدفع الأنسب لك على باقة لعبة الاختبارات والهدايا.",
};

const TRUST = [
  { icon: ShieldCheck, label: "دفع آمن ١٠٠٪" },
  { icon: Zap, label: "وصول فوري" },
  { icon: BadgeCheck, label: "آلاف العملاء الراضين" },
  { icon: RefreshCw, label: "ضمان استرجاع" },
];

export default async function RegionSelectPage() {
  let country: string | undefined;
  try {
    country = await getViewerCountry();
  } catch {
    country = undefined;
  }
  const recommended = country
    ? isEgyptianCountry(country)
      ? "egypt"
      : "international"
    : null;

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-20 bg-redpill-grad" />
      <div
        aria-hidden
        className="absolute -start-32 top-10 -z-10 size-[30rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -end-32 bottom-0 -z-10 size-[26rem] rounded-full bg-violet-600/10 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
        <Logo href="/" size="lg" className="mb-10" />

        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-bold text-amber-200">
          <Sparkles className="size-3.5" />
          عرض حصري محدود الوقت
        </span>

        <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-balance text-foreground sm:text-5xl">
          <span className="block">اختار بلدك</span>
          <span className="block bg-gradient-to-l from-[var(--color-red-300)] via-primary to-[var(--color-red-700)] bg-clip-text text-transparent">
            واحصل على العرض الأمثل ليك
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
          السعر والطريقة مخصّصين حسب منطقتك — اختار دلوقتي واحجز مكانك.
        </p>

        <div
          aria-hidden
          className="my-10 h-[3px] w-16 rounded-full bg-gradient-to-l from-primary to-[var(--color-red-700)]"
        />

        <RegionCards recommended={recommended} />

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {TRUST.map((t) => (
            <li
              key={t.label}
              className="flex items-center gap-2 text-sm font-medium text-muted"
            >
              <t.icon className="size-4 text-[var(--color-red-300)]" />
              {t.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
