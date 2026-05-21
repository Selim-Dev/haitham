import type { Metadata } from "next";
import Link from "next/link";
import {
  User,
  Target,
  GraduationCap,
  Sparkles,
  HeartHandshake,
  Eye,
  TrendingUp,
  ArrowLeft,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LegalSection } from "@/components/legal/legal-section";
import { Callout } from "@/components/legal/callout";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "عن المدرب — أكاديمية أحمد هيثم",
  description:
    "أحمد هيثم — خبير علاقات وتطوير ذاتي. +10 سنين خبرة في فهم ديناميكيات العلاقات والسيكولوجي النسائي.",
};

export default function AboutPage() {
  return (
    <LegalPageShell
      eyebrow={
        <>
          <Sparkles className="size-3.5" /> عن المدرب
        </>
      }
      title="من هو أحمد هيثم؟"
      subtitle="مؤسس أكاديمية أحمد هيثم — خبير علاقات وتطوير ذاتي."
    >
      <LegalSection number={<User className="size-4" />} title="التعريف">
        <p>
          أحمد هيثم كاتب ومقدم محتوى متخصص في فهم ديناميكية العلاقات وتطوير
          الذات، ومؤسس قناة <strong>&quot;افهم دماغ البنات&quot;</strong>{" "}
          على يوتيوب وأكاديمية {COPY.brand.academy}.
        </p>
        <p>
          بعد أكثر من <strong>+10 سنوات من الخبرة</strong> في فهم
          ديناميكيات العلاقات والسيكولوجي النسائي، قرر أحمد ينقل تجربته داخل
          أكاديمية متكاملة — كورسات مركّزة، أدوات تطبيقية، ووصول مدى الحياة
          للمشتركين الجادين.
        </p>
      </LegalSection>

      <Callout
        variant="highlight"
        icon={<Quote className="size-4" />}
        title="الرسالة"
      >
        <p className="text-lg font-bold leading-[1.8] text-foreground">
          &quot;مش بعلمك &lsquo;تشقط&rsquo; — بعلمك تفهم سيكولوجية المرأة،
          وتبني شخصية ذكورية قوية.&quot;
        </p>
      </Callout>

      <LegalSection number={<Target className="size-4" />} title="المنهج والفلسفة">
        <p>
          أحمد مش مجرد كوتش علاقات — هو بيقدم منهج واضح قائم على فهم نفسية
          الإنسان وبناء حدود صحية. المحتوى بيركّز على:
        </p>
        <ul>
          <li>فهم اختبارات العلاقات والنجاح فيها باحترام.</li>
          <li>بناء الثقة بالنفس والاستقلالية العاطفية.</li>
          <li>تطوير مهارات التواصل والحدود الصحية.</li>
          <li>تجنب الأخطاء الشائعة اللي بتدمر العلاقات.</li>
        </ul>
      </LegalSection>

      <LegalSection
        number={<GraduationCap className="size-4" />}
        title="الكورسات داخل الأكاديمية"
      >
        <p>
          الأكاديمية بتجمع كل المنهج في صورة كورسات فيديو محمية بوصول مدى
          الحياة بعد الموافقة على الدفع. كل كورس فيه دروس مركزة، بدون حشو،
          ومبنية على تجارب حقيقية.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button asChild variant="primary" size="md">
            <Link href="/courses">
              تصفح الكورسات
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="md">
            <Link href="/register">سجّل وابدأ رحلتك</Link>
          </Button>
        </div>
      </LegalSection>

      <LegalSection
        number={<Sparkles className="size-4" />}
        title="القيم الأساسية"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <ValueCard
            icon={<HeartHandshake className="size-5" />}
            title="الاحترام"
            body="كل المحتوى بيركّز على بناء علاقات صحية قائمة على الاحترام المتبادل."
          />
          <ValueCard
            icon={<Eye className="size-5" />}
            title="الشفافية"
            body="مفيش حيل ولا خدع. كل شيء بيتقال بصراحة ووضوح."
          />
          <ValueCard
            icon={<TrendingUp className="size-5" />}
            title="التطوير الحقيقي"
            body="الهدف مش إنك تشقط — الهدف إنك تبقى أفضل نسخة من نفسك."
          />
        </div>
      </LegalSection>

      <LegalSection title="نطاق الخدمة">
        <p>
          المحتوى المقدم داخل الأكاديمية تعليمي بالكامل، مصمم للتطوير الشخصي
          وبناء علاقات صحية. المحتوى <strong>لا يتضمن</strong>:
        </p>
        <ul>
          <li>خدمات مواعدة أو تعارف.</li>
          <li>محتوى للكبار أو غير أخلاقي.</li>
          <li>استشارات نفسية أو طبية متخصصة.</li>
        </ul>
        <p>
          كل المواد مصممة للاستخدام في إطار علاقات محترمة وقانونية فقط، وليست
          بديلاً عن استشارة متخصصين مرخصين عند الحاجة.
        </p>
      </LegalSection>

      <LegalSection title="تابع أحمد على المنصات">
        <div className="grid gap-3 sm:grid-cols-2">
          <SocialLink
            href="https://www.youtube.com/@AHaitham74"
            icon={<YoutubeIcon />}
            label="YouTube"
            handle="@AHaitham74"
          />
          <SocialLink
            href="https://instagram.com/ahaitham74"
            icon={<InstagramIcon />}
            label="Instagram"
            handle="@ahaitham74"
          />
          <SocialLink
            href="https://www.tiktok.com/@ahaitham74"
            icon={<TiktokIcon />}
            label="TikTok"
            handle="@ahaitham74"
          />
          <SocialLink
            href="https://www.facebook.com/AHaitham74"
            icon={<FacebookIcon />}
            label="Facebook"
            handle="AHaitham74"
          />
        </div>
      </LegalSection>

      <Callout variant="highlight" title="للتواصل المباشر">
        <p>
          البريد الإلكتروني:{" "}
          <a
            href="mailto:enter@ahmedhaitham.com"
            dir="ltr"
            className="font-mono"
          >
            enter@ahmedhaitham.com
          </a>
        </p>
      </Callout>
    </LegalPageShell>
  );
}

function ValueCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-elevated/40 p-4">
      <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-[var(--color-red-300)]">
        {icon}
      </div>
      <h3 className="mt-3 font-display text-base font-bold text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function SocialLink({
  href,
  icon,
  label,
  handle,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  handle: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border border-[var(--color-border-strong)] bg-elevated/40 p-3 transition-colors hover:border-primary/40 hover:bg-elevated"
    >
      <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-[var(--color-red-300)] transition-colors group-hover:bg-primary/20">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p dir="ltr" className="truncate text-xs text-muted">
          {handle}
        </p>
      </div>
      <ArrowLeft className="size-4 text-muted-2 transition-colors group-hover:text-foreground" />
    </a>
  );
}

function TiktokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.41a8.16 8.16 0 0 0 4.77 1.52V6.49a4.85 4.85 0 0 1-1.84-.2z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}
