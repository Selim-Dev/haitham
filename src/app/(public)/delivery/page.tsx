import type { Metadata } from "next";
import {
  Package,
  Zap,
  ListChecks,
  Globe,
  HelpCircle,
  Wrench,
  RotateCcw,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LegalSection } from "@/components/legal/legal-section";
import { Callout } from "@/components/legal/callout";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "سياسة التسليم — أكاديمية أحمد هيثم",
  description:
    "كيفية تفعيل وصولك إلى كورسات أكاديمية أحمد هيثم بعد الدفع. خدمة رقمية بالكامل بلا شحن مادي.",
};

export default function DeliveryPage() {
  return (
    <LegalPageShell
      eyebrow={
        <>
          <Package className="size-3.5" /> سياسة التسليم
        </>
      }
      title="تفعيل فوري بمجرد الموافقة"
      subtitle="جميع كورسات الأكاديمية رقمية — لا يوجد شحن مادي ولا رسوم توصيل."
    >
      <Callout variant="highlight" title="باختصار">
        <p>
          كل منتجات {COPY.brand.academy} رقمية بالكامل، يتم تفعيلها داخل
          حسابك بعد موافقة الإدارة على إيصال الدفع أو عملية PayPal. لا توجد
          أي تكاليف شحن أو رسوم توصيل إضافية.
        </p>
      </Callout>

      <LegalSection
        number={1}
        title={
          <>
            <Zap className="me-2 inline-block size-5 align-text-bottom" />
            طريقة التسليم
          </>
        }
      >
        <p>
          بعد إتمام دفع رسوم الكورس بإحدى الطرق المتاحة (إنستاباي، تحويل
          بنكي، أو PayPal للمشتركين خارج مصر)، تتم العملية على ثلاث مراحل:
        </p>
        <ul>
          <li>
            <strong>المرحلة 1:</strong> ترفع الإيصال أو رقم عملية PayPal من
            صفحة الدفع داخل حسابك.
          </li>
          <li>
            <strong>المرحلة 2:</strong> تراجع الإدارة طلبك وتتحقق من العملية
            (عادةً خلال ساعات قليلة).
          </li>
          <li>
            <strong>المرحلة 3:</strong> بمجرد الموافقة، يُفعَّل وصولك مدى
            الحياة للكورس داخل لوحة التعلم.
          </li>
        </ul>
        <Callout
          variant="warning"
          icon={<AlertTriangle className="size-4" />}
          title="ملاحظة هامة"
        >
          <p>
            تأكد من إدخال بريد إلكتروني صحيح أثناء التسجيل — كل إشعارات
            تفعيل الاشتراك تصلك على نفس البريد.
          </p>
        </Callout>
      </LegalSection>

      <LegalSection
        number={2}
        title={
          <>
            <Clock className="me-2 inline-block size-5 align-text-bottom" />
            المدة الزمنية للتفعيل
          </>
        }
      >
        <h3>التفعيل السريع (خلال ساعات قليلة)</h3>
        <Callout variant="success" icon={<CheckCircle2 className="size-4" />}>
          <p>
            في غالبية الحالات، تتم مراجعة إيصال الدفع وتفعيل الاشتراك خلال{" "}
            <strong>ساعات قليلة</strong> من تقديم الطلب.
          </p>
        </Callout>

        <h3>التأخير المحتمل (حتى 24 ساعة)</h3>
        <p>في حالات نادرة قد تستغرق المراجعة وقتًا أطول بسبب:</p>
        <ul>
          <li>ازدحام طلبات المراجعة في أوقات الذروة.</li>
          <li>الحاجة للتحقق من عملية الدفع لدى البنك أو PayPal.</li>
          <li>وصول البريد إلى مجلد البريد المزعج (Spam) لديك.</li>
        </ul>
        <Callout variant="info">
          <p>
            في هذه الحالة، يرجى الانتظار حتى <strong>24 ساعة كحد أقصى</strong>{" "}
            قبل التواصل معنا.
          </p>
        </Callout>
      </LegalSection>

      <LegalSection
        number={3}
        title={
          <>
            <ListChecks className="me-2 inline-block size-5 align-text-bottom" />
            خطوات استلام الوصول بعد الدفع
          </>
        }
      >
        <Step
          number={1}
          title="تأكيد الدفع"
          body="بعد إتمام عملية الدفع، احتفظ بلقطة شاشة (Screenshot) أو رقم العملية للرجوع إليه عند الحاجة."
        />
        <Step
          number={2}
          title="رفع الإيصال أو إدخال رقم PayPal"
          body="ادخل إلى صفحة الدفع داخل حسابك وأدخل بيانات العملية. ستتلقى إشعارًا فوريًا بأن الطلب قيد المراجعة."
        />
        <Step
          number={3}
          title="انتظار الموافقة"
          body="ستصلك رسالة بريد إلكتروني فور موافقة الإدارة، تتضمن رابطًا لبدء التعلم مباشرة."
        />
        <Step
          number={4}
          title="ابدأ التعلم"
          body="ادخل إلى لوحة التعلم (Dashboard) من حسابك وستجد الكورس في قائمة كورساتك جاهزًا للمشاهدة."
        />
      </LegalSection>

      <LegalSection
        number={4}
        title={
          <>
            <Globe className="me-2 inline-block size-5 align-text-bottom" />
            المناطق الجغرافية المشمولة
          </>
        }
      >
        <p>
          نظرًا لأن المنتج رقمي ويتم توصيله عبر الإنترنت، فالخدمة متاحة
          عالميًا — لا توجد قيود جغرافية:
        </p>
        <ul>
          <li>
            <strong>مصر والوطن العربي:</strong> طريقة الدفع المعتادة (إنستاباي
            / تحويل بنكي).
          </li>
          <li>
            <strong>دول الخليج والدول الأخرى:</strong> الدفع عبر PayPal
            بالدولار الأمريكي.
          </li>
        </ul>
        <Callout variant="success">
          <p>
            ✅ كل ما تحتاجه: اتصال بالإنترنت وبريد إلكتروني نشط.
          </p>
        </Callout>
      </LegalSection>

      <LegalSection
        number={5}
        title={
          <>
            <HelpCircle className="me-2 inline-block size-5 align-text-bottom" />
            ماذا تفعل إذا لم يتم تفعيل اشتراكك؟
          </>
        }
      >
        <h3>قبل التواصل معنا</h3>
        <ul>
          <li>تأكد من أن إيصال الدفع تم رفعه بشكل صحيح من صفحة حسابك.</li>
          <li>افحص مجلد البريد المزعج (Spam) بحثًا عن إشعار التفعيل.</li>
          <li>
            انتظر <strong>24 ساعة</strong> كاملة من وقت رفع الإيصال.
          </li>
        </ul>

        <h3>إذا استمرت المشكلة</h3>
        <Callout
          variant="highlight"
          icon={<Mail className="size-4" />}
          title="تواصل معنا"
        >
          <p>
            البريد:{" "}
            <a
              href="mailto:enter@ahmedhaitham.com"
              dir="ltr"
              className="font-mono"
            >
              enter@ahmedhaitham.com
            </a>
          </p>
          <p className="mt-2 text-xs">
            عنوان البريد:{" "}
            <span dir="ltr" className="font-mono">
              &quot;مشكلة في تفعيل الاشتراك — [اسم الكورس]&quot;
            </span>
          </p>
        </Callout>

        <h3>المعلومات المطلوبة</h3>
        <ul>
          <li>البريد الإلكتروني المستخدم في الاشتراك.</li>
          <li>اسم الكورس ورقم العملية أو Transaction ID.</li>
          <li>لقطة شاشة من إيصال الدفع.</li>
          <li>تاريخ ووقت تقديم الطلب.</li>
        </ul>
        <Callout variant="info">
          <p>
            ⏱️ نرد على الاستفسارات خلال <strong>24–48 ساعة</strong> كحد أقصى.
          </p>
        </Callout>
      </LegalSection>

      <LegalSection
        number={6}
        title={
          <>
            <Wrench className="me-2 inline-block size-5 align-text-bottom" />
            مشاكل تقنية شائعة
          </>
        }
      >
        <h3>الفيديو لا يعمل أو يتوقف باستمرار</h3>
        <ul>
          <li>تأكد من سرعة الإنترنت (يفضل 5 Mbps أو أعلى).</li>
          <li>جرّب متصفحًا آخر (Chrome، Edge، Safari) أو جهازًا مختلفًا.</li>
          <li>امسح ذاكرة الكاش (Cache) في المتصفح.</li>
        </ul>

        <h3>لا أرى الكورس في حسابي بعد الموافقة</h3>
        <p>
          أعد تسجيل الدخول لتحديث بيانات الحساب. إذا استمرت المشكلة، راسلنا
          فورًا.
        </p>

        <h3>رابط فيديو منتهي الصلاحية</h3>
        <p>
          روابط الفيديو مؤقّتة لحماية المحتوى. أعد تحميل الصفحة (Refresh)
          للحصول على رابط جديد تلقائيًا.
        </p>
      </LegalSection>

      <LegalSection
        number={7}
        title={
          <>
            <RotateCcw className="me-2 inline-block size-5 align-text-bottom" />
            سياسة إعادة التفعيل
          </>
        }
      >
        <p>
          الوصول إلى الكورس مرتبط بحسابك مدى الحياة. لو فقدت الوصول لأي سبب
          (حذف الحساب بالخطأ، فقدان بيانات الدخول، إلخ)، تواصل معنا بنفس
          البريد المستخدم وقت الاشتراك وسنعيد تفعيل الوصول مجانًا.
        </p>
        <Callout variant="warning">
          <p>
            إعادة التفعيل متاحة <strong>للحساب الأصلي فقط</strong> — لا يمكن
            نقل الكورس إلى حساب شخص آخر.
          </p>
        </Callout>
      </LegalSection>

      <Callout variant="success" title="مهمتنا">
        <p>
          أن تصلك الكورسات بأسرع وقت وبأمان كامل، وأن تبدأ رحلتك التعليمية
          بثقة. لو واجهتك أي مشكلة في التفعيل، نحن مسؤولون عن حلها فورًا.
        </p>
      </Callout>
    </LegalPageShell>
  );
}

function Step({
  number,
  title,
  body,
}: {
  number: number;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-elevated/30 p-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-[var(--color-red-300)] text-sm font-extrabold text-white shadow-md">
        {number}
      </span>
      <div>
        <h4 className="font-display text-sm font-bold text-foreground sm:text-base">
          {title}
        </h4>
        <p className="mt-0.5 text-xs leading-relaxed text-muted sm:text-sm">
          {body}
        </p>
      </div>
    </div>
  );
}
