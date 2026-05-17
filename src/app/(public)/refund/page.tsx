import type { Metadata } from "next";
import {
  RotateCcw,
  Mail,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Gift,
  Clock,
  ListChecks,
  Scale,
} from "lucide-react";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LegalSection } from "@/components/legal/legal-section";
import { Callout } from "@/components/legal/callout";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "سياسة الاسترجاع — أكاديمية أحمد هيثم",
  description:
    "ضمان استرداد الأموال لمدة 14 يومًا داخل أكاديمية أحمد هيثم — مبني على التجربة والتطبيق.",
};

export default function RefundPage() {
  return (
    <LegalPageShell
      eyebrow={
        <>
          <RotateCcw className="size-3.5" /> سياسة الاسترجاع
        </>
      }
      title="ضمان استرداد لمدة ١٤ يومًا"
      subtitle="مبني على التجربة والتطبيق — لأننا واثقون من قيمة المحتوى."
    >
      <Callout
        variant="success"
        icon={<ShieldCheck className="size-4" />}
        title="ضمان استرداد الأموال"
      >
        <p>
          نوفّر ضمان استرداد الأموال لمدة <strong>14 يومًا</strong> من تاريخ
          الاشتراك في أي كورس، وفقًا للشروط أدناه.
        </p>
      </Callout>

      <LegalSection number={1} title="طبيعة المنتج الرقمي">
        <p>
          كورسات {COPY.brand.academy} منتج رقمي بالكامل — يصلك الوصول لمحتوى
          فيديو محمي داخل حسابك بعد موافقة الإدارة على الدفع. بما أن المحتوى
          الرقمي يمكن استهلاكه فور الوصول، سياسة الاسترجاع مصممة لحماية حقوق
          الملكية الفكرية مع ضمان رضا العملاء الجادين في الوقت نفسه.
        </p>
      </LegalSection>

      <LegalSection number={2} title="نوع الضمان والمدة">
        <Callout
          variant="warning"
          icon={<AlertTriangle className="size-4" />}
          title="ضمان مبني على التجربة والتطبيق"
        >
          <p>
            سياستنا <strong>ليست &quot;بدون أسئلة&quot;</strong> (No Questions
            Asked) — بل ضمان قائم على الإثبات{" "}
            <strong>(Action-Based Guarantee)</strong>. طلب الاسترداد يُقبَل
            فقط عند إثبات أنك حاولت تطبيق المحتوى بشكل جاد ولم تحصل على
            النتيجة المتوقعة.
          </p>
        </Callout>
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-elevated/40 p-4">
          <Clock className="size-5 shrink-0 text-[var(--color-red-300)]" />
          <p className="text-sm">
            يحق لك تقديم طلب استرداد خلال <strong>14 يومًا فقط</strong> من
            تاريخ الاشتراك الأصلي. أي طلب بعد هذه المدة يُرفض تلقائيًا دون
            استثناء.
          </p>
        </div>
      </LegalSection>

      <LegalSection
        number={3}
        title={
          <>
            <Mail className="me-2 inline-block size-5 align-text-bottom" />
            خطوات تقديم طلب الاسترداد
          </>
        }
      >
        <p>
          لتقديم طلب صحيح ومقبول، أرسل بريدًا إلكترونيًا إلى:
        </p>
        <Callout
          variant="highlight"
          icon={<Mail className="size-4" />}
          title="البريد الإلكتروني"
        >
          <p>
            <a
              href="mailto:ahmedyoussef07472@gmail.com"
              dir="ltr"
              className="font-mono"
            >
              ahmedyoussef07472@gmail.com
            </a>
          </p>
          <p className="mt-2 text-xs">
            عنوان البريد:{" "}
            <span dir="ltr" className="font-mono">
              &quot;طلب استرداد — [اسم الكورس] — [رقم العملية / Transaction
              ID]&quot;
            </span>
          </p>
        </Callout>

        <p>
          <strong>يجب أن يتضمن البريد العناصر التالية:</strong>
        </p>

        <Step
          number={1}
          icon={<ListChecks className="size-4" />}
          title="إثبات التطبيق العملي"
        >
          <p>قدّم شرحًا تفصيليًا (نصي أو بالصور/الفيديو) يوضح:</p>
          <ul>
            <li>أيّ من تكتيكات الكورس قمت بتطبيقها.</li>
            <li>الموقف الحقيقي الذي طبّقت فيه التكتيك.</li>
            <li>كيف طبّقته بالضبط (التفاصيل مهمة).</li>
            <li>رد فعل الطرف الآخر.</li>
          </ul>
          <Callout variant="warning" title="تنبيه">
            <p>
              الإثبات لا يعني أنك شاهدت الفيديوهات فقط — بل أنك حاولت التطبيق
              فعلًا في الواقع.
            </p>
          </Callout>
        </Step>

        <Step
          number={2}
          icon={<XCircle className="size-4" />}
          title="توضيح النتيجة السلبية"
        >
          <ul>
            <li>ما هي النتيجة التي حصلت عليها من التطبيق.</li>
            <li>لماذا تعتقد أن الكورس لم يحقق التوقعات.</li>
            <li>
              ما هو الجزء المحدد من المحتوى الذي تعتقد أنه غير عملي أو غير
              فعال.
            </li>
          </ul>
        </Step>

        <Step
          number={3}
          icon={<ShieldAlert className="size-4" />}
          title="إقرار كتابي بالحذف والتعهد"
        >
          <p>انسخ الإقرار التالي بالكامل داخل البريد:</p>
          <Callout variant="info">
            <p className="font-mono text-sm leading-loose">
              &quot;أُقرّ بأنني قمت بإلغاء وصولي إلى الكورس وحذف أي مواد
              نُسخت محليًا، وأتعهد بعدم مشاركة المحتوى مع أي طرف آخر بأي شكل
              من الأشكال. وأفهم أن أي مخالفة لهذا التعهد تُعتبر انتهاكًا
              لحقوق الملكية الفكرية وقد تعرّضني للمساءلة القانونية.&quot;
            </p>
          </Callout>
        </Step>

        <Step
          number={4}
          icon={<ListChecks className="size-4" />}
          title="بيانات الطلب الأصلي"
        >
          <ul>
            <li>اسم الكورس ورقم العملية أو Transaction ID.</li>
            <li>البريد الإلكتروني المستخدم في الاشتراك.</li>
            <li>تاريخ الاشتراك.</li>
          </ul>
        </Step>
      </LegalSection>

      <LegalSection number={4} title="معالجة الطلبات">
        <p>
          بعد استلام طلبك المكتمل، يتم مراجعته خلال{" "}
          <strong>3–5 أيام عمل</strong>. سنتواصل معك عبر البريد لإبلاغك
          بالقبول أو الرفض.
        </p>
        <Callout
          variant="success"
          icon={<CheckCircle2 className="size-4" />}
          title="في حالة القبول"
        >
          <p>
            يتم استرداد المبلغ كاملًا إلى نفس طريقة الدفع الأصلية. قد تستغرق
            عملية ظهور المبلغ في حسابك من <strong>5 إلى 10 أيام عمل</strong>{" "}
            حسب سياسة البنك أو PayPal.
          </p>
        </Callout>
      </LegalSection>

      <LegalSection number={5} title="حالات رفض طلب الاسترداد">
        <Callout
          variant="danger"
          icon={<XCircle className="size-4" />}
          title="سيتم رفض طلبك تلقائيًا في الحالات التالية"
        >
          <ul>
            <li>عدم تقديم إثبات التطبيق العملي.</li>
            <li>تقديم الطلب بعد مرور 14 يومًا من تاريخ الاشتراك.</li>
            <li>عدم الالتزام بصيغة البريد المطلوبة أو نقص المعلومات الأساسية.</li>
            <li>إثبات مشاركة المحتوى مع آخرين أو إعادة بيعه.</li>
            <li>محاولة طلب الاسترداد لأكثر من كورس واحد (يُعتبر سوء استخدام).</li>
            <li>
              طلبات الاسترداد بناءً على &quot;عدم الإعجاب&quot; دون محاولة
              تطبيق فعلية.
            </li>
          </ul>
        </Callout>
      </LegalSection>

      <LegalSection number={6} title="الحالات الاستثنائية">
        <p>نقدّم الدعم الكامل والاسترداد الفوري في الحالات التالية:</p>

        <h3>1. مشاكل تقنية في تفعيل الاشتراك</h3>
        <ul>
          <li>لم يتم تفعيل الكورس بعد موافقة الإدارة خلال 48 ساعة.</li>
          <li>خطأ في معالجة الدفع (تم خصم المبلغ ولم يُسجَّل في حسابك).</li>
          <li>
            مشكلة مستمرة في تشغيل الفيديوهات لم نتمكن من حلها بعد التواصل
            معك.
          </li>
        </ul>
        <Callout variant="success" title="الحل">
          <p>
            راسلنا فورًا على{" "}
            <a
              href="mailto:ahmedyoussef07472@gmail.com"
              dir="ltr"
              className="font-mono"
            >
              ahmedyoussef07472@gmail.com
            </a>{" "}
            وسنحل المشكلة أو نسترد المبلغ خلال 48 ساعة.
          </p>
        </Callout>

        <h3>2. الشراء الخاطئ المتكرر</h3>
        <p>قمت بالاشتراك في الكورس نفسه مرّتين بالخطأ في اليوم نفسه.</p>
        <Callout variant="success" title="الحل">
          <p>سنقوم بإلغاء الطلب المكرر واسترجاع المبلغ كاملًا.</p>
        </Callout>
      </LegalSection>

      <LegalSection
        number={7}
        title={
          <>
            <Gift className="me-2 inline-block size-5 align-text-bottom" />
            بدلًا من الاسترداد
          </>
        }
      >
        <p>إذا لم يلبِّ الكورس توقعاتك، نقدّم لك بدائل قد تكون أفضل:</p>
        <Callout variant="highlight" title="البدائل المتاحة">
          <ul>
            <li>
              استشارة قصيرة عبر البريد حول كيفية تطبيق المحتوى على حالتك
              الشخصية.
            </li>
            <li>
              خصم خاص على كورسات مستقبلية أو محتوى حصري قادم.
            </li>
          </ul>
        </Callout>
        <p>
          نحن مهتمّون بنجاحك الفعلي وليس فقط بإتمام عملية البيع. راسلنا إذا
          كنت تواجه صعوبة في التطبيق وسنساعدك شخصيًا.
        </p>
      </LegalSection>

      <LegalSection number={8} title="حالات مستثناة من سياسة الاسترداد">
        <ul>
          <li>
            <strong>المشكلات التقنية البسيطة:</strong> إذا كانت المشكلة
            تقنية، تواصل معنا أولًا — نقدّم دعمًا مجانيًا قبل أي طلب
            استرداد.
          </li>
          <li>
            <strong>عدم مشاهدة الكورس:</strong> لا يمكن طلب الاسترداد بحجة
            &quot;لم يكن لدي وقت&quot;. مدة الـ14 يومًا كافية لتجربة محتوى
            مناسب واتخاذ قرار.
          </li>
          <li>
            <strong>التوقعات غير الواقعية:</strong> الكورسات تقدّم أدوات
            ومبادئ مُجربة، لكنها ليست &quot;عصا سحرية&quot; — النتائج تعتمد
            على التطبيق الصحيح والسياق الشخصي.
          </li>
        </ul>
      </LegalSection>

      <LegalSection
        number={9}
        title={
          <>
            <ShieldAlert className="me-2 inline-block size-5 align-text-bottom" />
            التبعات القانونية والإدارية
          </>
        }
      >
        <Callout
          variant="danger"
          icon={<AlertTriangle className="size-4" />}
          title="الحظر الدائم من المنصة"
        >
          <p>
            بمجرد قبول طلب الاسترداد واسترجاع مبلغك بالكامل، سيتم{" "}
            <strong>حظر بريدك الإلكتروني وبياناتك الشخصية بشكل نهائي</strong>{" "}
            من:
          </p>
          <ul>
            <li>الاشتراك في أي كورسات مستقبلية.</li>
            <li>الوصول لأي محتوى حصري أو قوائم بريدية للأكاديمية.</li>
          </ul>
          <p className="mt-2">
            <strong>السبب:</strong> نبحث عن طلاب جادين يؤمنون بمنهجنا
            ويرغبون في التطوير الحقيقي. طلب الاسترداد يعني أن أسلوبنا لا
            يتناسب معك، ولذلك نفضّل تركيز طاقتنا على من يستفيد فعلًا من
            المحتوى.
          </p>
        </Callout>

        <Callout variant="warning" title="حماية الملكية الفكرية">
          <p>
            فيديوهات الأكاديمية محمية بعلامات مائية تحمل بيانات المشترك. أي
            محاولة لإعادة توزيع المحتوى بعد الاسترداد ستعرّضك لإجراءات
            قانونية وفقًا لقوانين حماية الملكية الفكرية في مصر ودول مجلس
            التعاون الخليجي.
          </p>
        </Callout>
      </LegalSection>

      <LegalSection
        number={10}
        title={
          <>
            <Scale className="me-2 inline-block size-5 align-text-bottom" />
            الالتزام بالقوانين المحلية
          </>
        }
      >
        <p>
          تلتزم سياسة الاسترداد بقوانين التجارة الإلكترونية في{" "}
          <strong>جمهورية مصر العربية ودول مجلس التعاون الخليجي</strong>.
          بموجب قوانين حماية المستهلك للمنتجات الرقمية، يحق للبائع وضع شروط
          خاصة للاسترداد بما أن المنتج قابل للاستهلاك الكامل فور الوصول.
        </p>
      </LegalSection>

      <Callout variant="success" title="💎 رضاك هدفنا الأول">
        <p>
          نحن واثقون من قيمة المحتوى داخل {COPY.brand.academy} بناءً على
          تجارب الطلاب الجادين. بإتمامك الاشتراك فأنت توافق على سياسة
          الاسترداد المذكورة في هذه الصفحة.
        </p>
      </Callout>
    </LegalPageShell>
  );
}

function Step({
  number,
  icon,
  title,
  children,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-elevated/30 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-primary/15 text-xs font-extrabold text-[var(--color-red-300)]">
          {number}
        </span>
        <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-[var(--color-red-300)]">
          {icon}
        </div>
        <h4 className="font-display text-sm font-bold text-foreground sm:text-base">
          {title}
        </h4>
      </div>
      <div className="flex flex-col gap-2 text-sm leading-[1.85] text-foreground/85">
        {children}
      </div>
    </div>
  );
}
