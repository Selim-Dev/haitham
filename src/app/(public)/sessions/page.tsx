import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  MessageCircle,
  Zap,
  Target,
  ShieldCheck,
  Brain,
  GraduationCap,
  Flame,
  Check,
  X,
  Sparkles,
  Lock,
  Clock,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeedbackGallery } from "@/components/feedbacks/feedback-gallery";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "احجز جلستك الاستشارية — أكاديمية أحمد هيثم",
  description:
    "جلسات استشارية خاصة مع أحمد هيثم لتحسين علاقاتك وبناء شخصية حقيقية. سرية تامة، خصوصية كاملة، ودعم مباشر على مدار الساعة.",
};

const CALENDLY_URL = "https://calendly.com/ahaitham74/coaching-sessions";
const WHATSAPP_URL =
  "https://wa.me/201515717713?text=محتاج%20احجز%20جلسة%2C%20ايه%20المواعيد%20المتاحة%3F";

export default function SessionsPage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <TestimonialsSection />
      <MentorVsInstructorSection />
      <ComparisonTableSection />
      <BookingProcessSection />
      <FinalCtaSection />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-24 sm:pt-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-redpill-grad"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[60%] bg-[radial-gradient(ellipse_70%_70%_at_50%_0%,rgba(75,188,99,0.22),transparent_60%)]"
      />

      <Container>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="primary" className="mb-6">
            <Sparkles className="size-3.5" />
            جلسات محدودة — احجز مكانك الآن
          </Badge>

          <h1 className="font-display text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            جلسات استشارية{" "}
            <span className="bg-gradient-to-l from-[var(--color-red-300)] via-primary to-[var(--color-red-700)] bg-clip-text text-transparent">
              خاصة
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-pretty text-base leading-[1.8] text-muted sm:text-lg">
            غيّر حياتك وعلاقاتك للأبد من خلال جلسة واحدة مع أحمد هيثم. خبرة
            ميدانية حقيقية، واستراتيجيات تشتغل من أول دقيقة.
          </p>

          <CtaButtons className="mt-9" />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-2 sm:text-sm">
            <span className="flex items-center gap-2">
              <Lock className="size-3.5 text-[var(--color-red-300)]" />
              سرية تامة
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-[var(--color-red-300)]" />
              خصوصية ١٠٠٪
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-3.5 text-[var(--color-red-300)]" />
              دعم على مدار الساعة
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Benefits
// ─────────────────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon: Zap,
    title: "فهم عميق لنفسك",
    body: "هتعرف بالظبط إيه اللي كان بيخليك تخسر في علاقاتك وإزاي تصلحه.",
  },
  {
    icon: Target,
    title: "استراتيجيات تشتغل فعلًا",
    body: "خطة واضحة ومجربة تقدر تطبقها من أول يوم وتشوف نتايج فورية.",
  },
  {
    icon: ShieldCheck,
    title: "ثقة حقيقية دائمة",
    body: "هتبقى الراجل اللي كل الناس بتحترمه وشريكتك تفتخر بيك.",
  },
  {
    icon: Brain,
    title: "تحكم كامل",
    body: "هتتعلم إزاي تكون أنت اللي بتوجه العلاقة، مش العكس.",
  },
  {
    icon: GraduationCap,
    title: "معرفة للأبد",
    body: "اللي هتتعلمه معايا هيفيدك في كل علاقاتك الحالية والمستقبلية.",
  },
  {
    icon: Flame,
    title: "نتائج فورية",
    body: "من أول جلسة هتلاقي نفسك بتتصرف بطريقة مختلفة وأقوى.",
  },
];

function BenefitsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="primary" className="mb-5">
            <Flame className="size-3.5" />
            ليه تحجز جلسة؟
          </Badge>
          <h2 className="font-display text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            جلسة واحدة، حياة جديدة تمامًا
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
            مش هتسمع كلام نظري ممل — جلستك مع أحمد هيثم هتحس بعدها إنك اتولدت
            من جديد.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="group relative h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card p-6 transition-colors duration-200 hover:border-primary/40 hover:bg-elevated"
              >
                <div className="mb-4 grid size-12 place-items-center rounded-xl bg-primary/10 text-[var(--color-red-300)] ring-1 ring-primary/20 transition-colors group-hover:bg-primary/20">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {b.body}
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-14 text-center text-base font-semibold text-[var(--color-red-300)] sm:text-lg">
          الوقت اللي هتقضيه في جلسة واحدة ممكن يوفر عليك سنين من التخبط.
        </p>
        <CtaButtons className="mt-8 justify-center" />
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials — reuses the same images as the homepage feedbacks section
// ─────────────────────────────────────────────────────────────────────────────

function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[60%] max-w-5xl -translate-y-1/2 rounded-full bg-radial-red opacity-25 blur-3xl"
      />
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="primary" className="mb-5">
            <Sparkles className="size-3.5" />
            نتائج حقيقية
          </Badge>
          <h2 className="font-display text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            شوف بنفسك تجارب الطلاب
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
            مئات الرجال غيّروا حياتهم وعلاقاتهم من خلال الجلسات. دي رسائل
            حقيقية منهم.
          </p>
        </div>

        <div className="mt-14">
          <FeedbackGallery />
        </div>

        <p className="mt-10 text-center text-xs font-semibold text-[var(--color-success)] sm:text-sm">
          ✓ خصوصيتك مضمونة ١٠٠٪ · ✓ كل الجلسات سرية وآمنة تمامًا
        </p>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mentor vs Instructor
// ─────────────────────────────────────────────────────────────────────────────

const MENTOR_POINTS = [
  "خبرة ميدانية حياتية حقيقية",
  "فاهم تحدياتك الشخصية",
  "بيوجهك بناءً على تجارب حقيقية",
  "عارف امتى يشجعك وامتى يحذرك",
  "نصايح مخصصة ليك أنت بس",
];

const INSTRUCTOR_POINTS = [
  "بيعلمك مهارات من منهج جاهز",
  "مش فاهم ظروفك الخاصة",
  "نفس الطريقة لكل الناس",
  "شرح نظري بدون رد فعل حقيقي",
  "معلومات عامة مش ليك شخصيًا",
];

function MentorVsInstructorSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="primary" className="mb-5">
            <Target className="size-3.5" />
            Hire a Mentor, Fire Instructors
          </Badge>
          <h2 className="font-display text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            مدرّب يقرأ من كتاب، أم منتور عاش التجربة؟
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
            المدرب بيعلمك مهارات محددة من منهج جاهز. المنتور بيمشي معاك في
            رحلتك، فاهم تحدياتك لأنه عاشها، وبيوجهك بناءً على خبرة حقيقية.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <ComparisonCard
            variant="positive"
            title="المنتور (Mentor)"
            points={MENTOR_POINTS}
          />
          <ComparisonCard
            variant="negative"
            title="المدرب (Instructor)"
            points={INSTRUCTOR_POINTS}
          />
        </div>

        <p className="mx-auto mt-10 max-w-3xl rounded-2xl border border-primary/20 bg-card p-6 text-center text-base leading-relaxed text-foreground sm:p-7 sm:text-lg">
          أحمد هيثم مش مجرد مدرب بيشرح نظريات من منهج محفوظ. هو منتور عاش
          تجارب حقيقية، شاف فشل ونجاح حقيقي، وعرف يفك الشفرة الحقيقية للعلاقات.
        </p>
      </Container>
    </section>
  );
}

function ComparisonCard({
  variant,
  title,
  points,
}: {
  variant: "positive" | "negative";
  title: string;
  points: string[];
}) {
  const isPositive = variant === "positive";
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 sm:p-8",
        isPositive
          ? "border-primary/40 bg-card shadow-[var(--shadow-red-glow)]"
          : "border-[var(--color-border)] bg-elevated/30 opacity-90",
      )}
    >
      <h3
        className={cn(
          "font-display text-xl font-extrabold sm:text-2xl",
          isPositive ? "text-[var(--color-red-300)]" : "text-muted",
        )}
      >
        {title}
      </h3>
      <ul className="mt-5 flex flex-col gap-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm leading-relaxed sm:text-base">
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                isPositive
                  ? "bg-primary/15 text-[var(--color-red-300)]"
                  : "bg-elevated text-muted-2",
              )}
            >
              {isPositive ? <Check className="size-3" /> : <X className="size-3" />}
            </span>
            <span className={isPositive ? "text-foreground" : "text-muted"}>
              {p}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Comparison table — Ahmed vs psychologist vs family consultant
// ─────────────────────────────────────────────────────────────────────────────

type Row = [string, string, string];

const COMPARISON_ROWS: Row[] = [
  [
    "خبرة من مئات العلاقات الحقيقية",
    "علاقة واحدة أو اتنين على الأكتر",
    "غالبًا مطلق أو بدون خبرة حقيقية",
  ],
  [
    "معرفة ميدانية من الحياة الواقعية",
    "معرفة نظرية من الكتب والدراسات",
    "نصايح مكررة ومأخوذة من الآخرين",
  ],
  [
    "نصايح عملية مجربة بتشتغل فعلًا",
    "نصايح أكاديمية نظرية",
    "نصايح خيالية بعيدة عن الواقع",
  ],
  [
    "هوجهك للطريق الصح حتى لو صعب",
    "هيتبعك في طريقك حتى لو غلط",
    "بدون طريق واضح",
  ],
  [
    "حلول مخصصة لحالتك الشخصية",
    "قوالب جاهزة ومعممة",
    "خطر انكشاف أسرارك",
  ],
  [
    "قيمة حقيقية مقابل السعر",
    "مكلف جدًا بدون نتائج واضحة",
    "غالي جدًا + جلسات منتظمة إجبارية",
  ],
];

function ComparisonTableSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="primary" className="mb-5">
            <Sparkles className="size-3.5" />
            مقارنة سريعة
          </Badge>
          <h2 className="font-display text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            الفرق الحقيقي بين الخبرة والنظرية
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
            شوف بنفسك الفرق بين اللي عاش التجربة واللي قراها في كتاب.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-[var(--color-border-strong)] bg-card shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[640px] border-collapse text-sm sm:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border-strong)] bg-elevated">
                <th className="px-4 py-4 text-start font-display text-sm font-extrabold text-[var(--color-red-300)] sm:px-6 sm:py-5 sm:text-base">
                  أحمد هيثم — المنتور
                </th>
                <th className="px-4 py-4 text-start font-display text-sm font-extrabold text-muted sm:px-6 sm:py-5 sm:text-base">
                  المعالج النفسي
                </th>
                <th className="px-4 py-4 text-start font-display text-sm font-extrabold text-muted sm:px-6 sm:py-5 sm:text-base">
                  مستشار العلاقات الأسرية
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <td className="bg-primary/5 px-4 py-4 align-top text-foreground sm:px-6 sm:py-5">
                    <span className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-red-300)]" />
                      <span>{row[0]}</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 align-top text-muted sm:px-6 sm:py-5">
                    {row[1]}
                  </td>
                  <td className="px-4 py-4 align-top text-muted sm:px-6 sm:py-5">
                    {row[2]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10 text-center text-base font-semibold text-[var(--color-red-300)] sm:text-lg">
          القرار ليك: منتور بخبرة حقيقية، ولّا مدرب بمعلومات نظرية؟
        </p>
        <CtaButtons className="mt-8 justify-center" />
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Booking process — Calendly + WhatsApp + 24/7 support note
// ─────────────────────────────────────────────────────────────────────────────

function BookingProcessSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 start-1/2 -z-10 h-72 w-[80%] -translate-x-1/2 rounded-full bg-radial-red opacity-40 blur-3xl"
      />
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="primary" className="mb-5">
            <Calendar className="size-3.5" />
            خطوة واحدة
          </Badge>
          <h2 className="font-display text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            ازاي تحجز جلستك؟
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
            طريقتين سهلتين — اختار اللي يريحك.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <BookingOption
            icon={<MessageCircle className="size-7" strokeWidth={2.2} />}
            title="عبر واتساب"
            description="تكلم فريق الدعم مباشرة وهيساعدك تحجز جلستك في أسرع وقت. دعم مباشر على مدار الساعة، الرد في خلال دقائق."
            cta="افتح المحادثة"
            href={WHATSAPP_URL}
            variant="primary"
          />
          <BookingOption
            icon={<Calendar className="size-7" strokeWidth={2.2} />}
            title="عبر Calendly"
            description="احجز مكانك مباشرة أونلاين في أي وقت. سرية تامة وأنونيمية كاملة — مفيش بيانات شخصية مطلوبة سوى الإيميل."
            cta="افتح Calendly"
            href={CALENDLY_URL}
            variant="secondary"
          />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-primary/25 bg-card p-5 text-center shadow-[var(--shadow-soft)] sm:flex-row sm:justify-center sm:gap-4 sm:p-6">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-success)]/15 text-[var(--color-success)]">
            <Clock className="size-4" />
          </span>
          <p className="text-sm font-semibold text-foreground sm:text-base">
            فريق دعم متاح على مدار الساعة — الرد في دقائق.
          </p>
          <Button asChild variant="primary" size="sm" className="shrink-0">
            <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              تواصل الآن
            </Link>
          </Button>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-2 sm:text-sm">
          <Lock className="me-1 inline size-3.5 text-[var(--color-red-300)]" />
          خصوصيتك أولويتنا. كل الجلسات سرية تمامًا — تقدر تستخدم اسم مستعار
          وإيميل مجهول، ولا توجد أي تسجيلات بدون إذنك.
        </p>
      </Container>
    </section>
  );
}

function BookingOption({
  icon,
  title,
  description,
  cta,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] transition-colors hover:border-primary/40 sm:p-7">
      <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-[var(--color-red-300)] ring-1 ring-primary/20">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
      <Button asChild variant="primary" size="lg" className="mt-auto">
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {cta}
        </Link>
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────────────────────────

function FinalCtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-[#0b2814] via-[#0b0b0f] to-[#0b0b0f] p-10 sm:p-16">
          <div
            aria-hidden="true"
            className="absolute -top-40 left-1/2 -translate-x-1/2 size-[640px] rounded-full bg-radial-red opacity-70 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/60 to-transparent"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
            <Badge variant="primary" className="mb-5">
              <Flame className="size-3.5" />
              ابدأ النهارده
            </Badge>
            <h2 className="font-display text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              مستني إيه؟ خذ الخطوة الأولى دلوقتي.
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              أنت تستحق حياة أفضل وعلاقات أقوى. جلسة واحدة ممكن تغيّر مسارك.
            </p>
            <CtaButtons className="mt-8 justify-center" />
            <p className="mt-6 text-xs text-muted-2 sm:text-sm">
              ✓ مكالمة خاصة ١٠٠٪ · ✓ اختار الوقت المناسب ليك · ✓ نتائج فورية
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared CTA buttons used in 4 different sections
// ─────────────────────────────────────────────────────────────────────────────

function CtaButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <Button asChild size="xl" variant="primary">
        <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="size-5" />
          احجز عبر واتساب
        </Link>
      </Button>
      <Button asChild size="xl" variant="secondary">
        <Link href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
          <Calendar className="size-5" />
          احجز عبر Calendly
        </Link>
      </Button>
    </div>
  );
}
