import type { Metadata } from "next";
import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ContactCard } from "@/components/contact/contact-card";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "تواصل معنا — أكاديمية أحمد هيثم",
  description:
    "تواصل مع فريق أكاديمية أحمد هيثم عبر واتساب أو البريد الإلكتروني. نرد عادةً خلال 24 ساعة.",
};

const WHATSAPP_NUMBER_INTL = "+20 151 571 7713";
const WHATSAPP_URL = "https://wa.me/201515717713";
const EMAIL_ADDRESS = "ahmedyoussef07472@gmail.com";

export default function ContactPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 start-1/2 -z-10 h-48 w-[80%] -translate-x-1/2 rounded-full bg-radial-red opacity-50 blur-3xl"
          />
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-wider text-[var(--color-red-300)]">
            <Sparkles className="size-3.5" />
            تواصل معنا
          </p>
          <h1 className="font-display text-balance text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            <span className="bg-gradient-to-l from-foreground via-foreground to-[var(--color-red-300)] bg-clip-text text-transparent">
              قريبون منك — اختر الطريقة الأنسب
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed text-muted sm:text-base">
            عندك سؤال عن الاشتراك، أو الدفع، أو مشكلة تقنية؟ راسلنا بإحدى
            الطريقتين وسنرد عليك بأسرع وقت.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <ContactCard
            icon={<MessageCircle className="size-7" strokeWidth={2.2} />}
            label="واتساب"
            subtitle="المحادثة الأسرع — للاستفسارات الفورية والدعم"
            value={WHATSAPP_NUMBER_INTL}
            href={WHATSAPP_URL}
            cta="افتح المحادثة في واتساب"
            accent="from-[#25d366] to-[#128c4b]"
          />
          <ContactCard
            icon={<Mail className="size-7" strokeWidth={2.2} />}
            label="البريد الإلكتروني"
            subtitle="للاستفسارات الرسمية وطلبات الاسترداد والمراجعات"
            value={EMAIL_ADDRESS}
            href={`mailto:${EMAIL_ADDRESS}`}
            cta="افتح البريد الإلكتروني"
            accent="from-[var(--color-primary)] to-[var(--color-deep-red)]"
          />
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] sm:grid-cols-3 sm:p-7">
          <InfoTile
            icon={<Clock className="size-5" />}
            title="وقت الرد"
            body="عادةً خلال 24 ساعة، وغالبًا أسرع بكثير في ساعات العمل."
          />
          <InfoTile
            icon={<ShieldCheck className="size-5" />}
            title="خصوصيتك أولًا"
            body="رسائلك تبقى سرية بالكامل ولا تُشارك مع أي طرف خارجي."
          />
          <InfoTile
            icon={<Sparkles className="size-5" />}
            title="فريق مهتم"
            body="نقرأ كل رسالة بعناية — أنت لست مجرد رقم في النظام."
          />
        </div>

        <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-elevated/40 p-6 text-center sm:p-7">
          <h2 className="font-display text-base font-bold text-foreground sm:text-lg">
            قبل ما تراسلنا
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            احتمال تلاقي إجابتك في الأسئلة الشائعة أو في صفحات السياسات.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <PolicyLink href="/#faq">{COPY.nav.faq}</PolicyLink>
            <PolicyLink href="/refund">{COPY.nav.refund}</PolicyLink>
            <PolicyLink href="/delivery">{COPY.nav.delivery}</PolicyLink>
            <PolicyLink href="/terms">{COPY.nav.terms}</PolicyLink>
            <PolicyLink href="/privacy">{COPY.nav.privacy}</PolicyLink>
          </div>
        </div>
      </div>
    </Container>
  );
}

function InfoTile({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-[var(--color-red-300)]">
        {icon}
      </div>
      <h3 className="font-display text-sm font-bold text-foreground">
        {title}
      </h3>
      <p className="text-xs leading-relaxed text-muted-2">{body}</p>
    </div>
  );
}

function PolicyLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-full border border-[var(--color-border-strong)] bg-card px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-primary/40 hover:bg-elevated hover:text-foreground"
    >
      {children}
    </Link>
  );
}
