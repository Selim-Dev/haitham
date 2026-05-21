import type { Metadata } from "next";
import {
  FileText,
  Ban,
  Scale,
  Copyright,
  Share2,
  Cloud,
  Users,
  CircleDollarSign,
  Printer,
  Megaphone,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LegalSection } from "@/components/legal/legal-section";
import { Callout } from "@/components/legal/callout";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "شروط الاستخدام — أكاديمية أحمد هيثم",
  description:
    "شروط استخدام كورسات أكاديمية أحمد هيثم. اقرأها بعناية قبل الاشتراك في أي كورس.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow={
        <>
          <FileText className="size-3.5" /> شروط الاستخدام
        </>
      }
      title="اقرأ الشروط قبل الاشتراك"
      subtitle="بإتمامك التسجيل أو شراء أي كورس داخل أكاديمية أحمد هيثم، فإنك توافق على الشروط التالية."
    >
      <Callout variant="highlight" title="ما الذي يحكم هذه الشروط؟">
        <p>
          بشرائك أي كورس داخل {COPY.brand.academy} فإنك توافق على الالتزام
          بالشروط أدناه. كل البنود تخضع لقوانين جمهورية مصر العربية.
        </p>
      </Callout>

      <LegalSection number={1} title="حقوق الملكية الفكرية">
        <p>
          جميع الكورسات والفيديوهات والمواد المرفقة محميّة بموجب{" "}
          <strong>قوانين حقوق النشر والملكية الفكرية المصرية والدولية</strong>،
          وكل المحتوى مُرخَّص <strong>للاستخدام الشخصي غير التجاري فقط</strong>.
        </p>
        <Callout variant="highlight" title="© جميع الحقوق محفوظة">
          <p>{COPY.brand.academy} — أحمد هيثم.</p>
        </Callout>
      </LegalSection>

      <LegalSection number={2} title="حظر التوزيع والمشاركة">
        <p>يُحظر تمامًا أيٌّ من التصرفات التالية تجاه محتوى الأكاديمية:</p>
        <div className="my-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ProhibitedItem
            icon={<Share2 className="size-5" />}
            label="المشاركة عبر واتساب أو تليجرام"
          />
          <ProhibitedItem
            icon={<Cloud className="size-5" />}
            label="الرفع على مواقع التحميل"
          />
          <ProhibitedItem
            icon={<Users className="size-5" />}
            label="المشاركة في جروبات أو قنوات"
          />
          <ProhibitedItem
            icon={<CircleDollarSign className="size-5" />}
            label="البيع أو التأجير"
          />
          <ProhibitedItem
            icon={<Printer className="size-5" />}
            label="الطباعة التجارية"
          />
          <ProhibitedItem
            icon={<Megaphone className="size-5" />}
            label="النشر على منصات عامة"
          />
        </div>
        <Callout
          variant="warning"
          icon={<AlertTriangle className="size-4" />}
          title="تنبيه"
        >
          <p>
            يُسمح فقط بالاقتباسات القصيرة (أقل من 50 كلمة) داخل سياق تعليمي أو
            نقدي مع ذكر المصدر صراحةً (أكاديمية أحمد هيثم).
          </p>
        </Callout>
      </LegalSection>

      <LegalSection number={3} title="الإجراءات القانونية ضد المخالفين">
        <Callout
          variant="danger"
          icon={<Scale className="size-4" />}
          title="في حال ثبوت الانتهاك سنتخذ:"
        >
          <ul>
            <li>
              <strong>إجراءات مدنية:</strong> تعويض مالي يصل إلى{" "}
              <strong>50,000 جنيه مصري</strong> عن كل نسخة موزَّعة، بالإضافة
              إلى أتعاب المحاماة.
            </li>
            <li>
              <strong>إجراءات جنائية:</strong> بلاغ لوحدة مكافحة جرائم
              الملكية الفكرية — قد تصل العقوبة للسجن والغرامة وفقًا للقانون
              المصري.
            </li>
            <li>
              <strong>الحظر الدائم:</strong> من شراء أو الوصول لأي محتوى
              مستقبلي على المنصة.
            </li>
          </ul>
        </Callout>
        <Callout variant="info" title="🔍 تقنيات الحماية">
          <p>
            فيديوهات الدروس محمية بروابط مؤقتة موقَّعة وعلامات مائية رقمية
            تحمل بيانات المشترك، بالإضافة إلى أنظمة مراقبة آلية لتتبع
            المحتوى المسروق على الإنترنت.
          </p>
        </Callout>
      </LegalSection>

      <LegalSection number={4} title="الوصول إلى الكورسات">
        <ul>
          <li>
            <strong>الموافقة على الاشتراك:</strong> الوصول للكورس يتم بعد
            موافقة الإدارة على إيصال الدفع أو عملية PayPal التي تخصّك.
          </li>
          <li>
            <strong>وصول مدى الحياة:</strong> بعد الموافقة، يبقى الكورس
            متاحًا في حسابك دون قيد زمني.
          </li>
          <li>
            <strong>حساب شخصي واحد:</strong> الوصول مرتبط بحسابك الشخصي ولا
            يجوز مشاركته مع أي شخص آخر.
          </li>
          <li>
            <strong>إيقاف الحساب:</strong> الأكاديمية تحتفظ بحقها في إيقاف
            أي حساب يثبت استخدامه بشكل مخالف للشروط.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number={5} title="أحكام قانونية عامة">
        <ul>
          <li>
            <strong>طبيعة المحتوى:</strong> المحتوى تعليمي ولأغراض التطوير
            الشخصي، وليس بديلًا عن استشارة متخصصين مرخصين عند الحاجة.
          </li>
          <li>
            <strong>السرية:</strong> أي معلومات تشاركها أثناء التسجيل أو
            داخل استمارة الانضمام تبقى سرية ولن تُستخدم خارج نطاق الخدمة.
          </li>
          <li>
            <strong>إخلاء المسؤولية:</strong> لا تتحمّل الأكاديمية مسؤولية
            النتائج الناتجة عن تطبيق المحتوى — النتائج تختلف من شخص لآخر.
          </li>
          <li>
            <strong>القانون المطبق:</strong> تخضع هذه الشروط حصرًا لقوانين
            جمهورية مصر العربية، وأي نزاع يُنظر أمام محاكمها المختصة.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        number={6}
        title={
          <>
            <Copyright className="me-2 inline-block size-5 align-text-bottom" />
            الترخيص التجاري
          </>
        }
      >
        <p>
          إذا كنت ترغب في استخدام محتوى الأكاديمية لأغراض تجارية، أو ترجمته،
          أو إعادة نشره — يجب الحصول على ترخيص مكتوب مسبق من الإدارة.
        </p>
        <Callout
          variant="highlight"
          icon={<Mail className="size-4" />}
          title="للحصول على ترخيص"
        >
          <p>
            راسلنا على:{" "}
            <a
              href="mailto:enter@ahmedhaitham.com"
              dir="ltr"
              className="font-mono"
            >
              enter@ahmedhaitham.com
            </a>
          </p>
        </Callout>
      </LegalSection>

      <Callout variant="success" title="✅ موافقتك">
        <p>
          بإتمامك عملية التسجيل أو الشراء، فإنك تُقرّ بأنك قرأت وفهمت ووافقت
          على جميع شروط الاستخدام أعلاه.
        </p>
      </Callout>

      <LegalSection
        title={
          <>
            <Ban className="me-2 inline-block size-5 align-text-bottom" />
            ساعدنا في حماية المحتوى
          </>
        }
      >
        <p>
          عندما تحترم حقوق الملكية الفكرية فإنك تساهم في استمرار إنتاج محتوى
          عالي الجودة يفيد آلاف المتعلمين الجادين. الأكاديمية مبنية على
          الثقة، والثقة طريق ذو اتجاهين.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}

function ProhibitedItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-3">
      <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--color-danger)]/15 text-[var(--color-danger)]">
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground/90">{label}</p>
    </div>
  );
}
