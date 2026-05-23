import { Resend } from "resend";
import { COPY } from "@/lib/arabic";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

// Email links must always point to a public, long-lived URL — never localhost
// or a preview deployment, since students may open the email days later.
function getEmailBaseUrl(): string {
  if (process.env.EMAIL_LINK_BASE_URL) return process.env.EMAIL_LINK_BASE_URL;
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://ahmed-haytham.vercel.app";
}

const APP_URL = getEmailBaseUrl();

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!RESEND_API_KEY) return null;
  if (!client) client = new Resend(RESEND_API_KEY);
  return client;
}

type SendResult = { ok: boolean; id?: string; error?: string };

export async function sendApprovalEmail(input: {
  name: string;
  email: string;
}): Promise<SendResult> {
  const resend = getClient();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY not set — approval email not sent for",
      input.email,
    );
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const subject = `تم قبول طلب انضمامك إلى ${COPY.brand.academy}`;
  const loginUrl = `${APP_URL}/login`;
  const html = approvalEmailHtml({ name: input.name, loginUrl });
  const text = approvalEmailText({ name: input.name, loginUrl });

  try {
    const res = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.email,
      subject,
      html,
      text,
    });
    if (res.error) {
      return { ok: false, error: res.error.message };
    }
    return { ok: true, id: res.data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "send failed";
    return { ok: false, error: message };
  }
}

// Approval email template — intentionally styled as a transactional
// notification, not a marketing email. The previous version had a bright
// green gradient hero + glowing CTA + pep-talk copy ("أنت داخل اللعبة"),
// which read promotional to Gmail's classifier and pushed the message into
// the Promotions tab. This version mirrors the rejection email's calmer
// shape: muted dark header, factual subject + heading, plain body copy,
// modest text-style button. Domain authentication (custom From + DKIM)
// still does the heavy lifting; this template just stops contradicting it.
function approvalEmailHtml(params: { name: string; loginUrl: string }): string {
  const { name, loginUrl } = params;
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>تم قبول طلب انضمامك</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Tahoma,Arial,sans-serif;color:#f5f5f7;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0b0f;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:linear-gradient(180deg,#15151b 0%,#0f0f15 100%);border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#1f1f27 0%,#15151b 100%);padding:32px 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0;font-size:13px;letter-spacing:0.18em;color:#c9c9d4;text-transform:uppercase;">${COPY.brand.academy}</p>
                <h1 style="margin:14px 0 0;font-size:24px;line-height:1.4;font-weight:800;color:#ffffff;">
                  تم قبول طلب انضمامك
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px;text-align:right;">
                <p style="margin:0 0 18px;font-size:16px;line-height:1.85;color:#e6e6ec;font-weight:600;">
                  مرحبًا ${escapeHtml(name)}،
                </p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.95;color:#c9c9d4;">
                  تمت الموافقة على طلب انضمامك إلى ${COPY.brand.academy}. حسابك الآن مفعّل وتقدر تسجل دخولك للوصول إلى المنصة.
                </p>
                <p style="margin:24px 0 0;font-size:15px;line-height:1.85;color:#c9c9d4;">
                  للدخول إلى حسابك:
                  <a href="${loginUrl}" style="color:#85d29a;text-decoration:underline;font-weight:700;">سجّل الدخول</a>
                </p>
                <p style="margin:18px 0 0;font-size:13px;line-height:1.7;color:#8a8a96;">
                  أو افتح الرابط مباشرة:<br/>
                  <span dir="ltr" style="color:#c9c9d4;word-break:break-all;">${loginUrl}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                <p style="margin:0;font-size:12px;color:#6c6c7a;">
                  ${COPY.brand.academy} · ${COPY.brand.tagline}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function approvalEmailText(params: { name: string; loginUrl: string }): string {
  return `مرحبًا ${params.name}،

تمت الموافقة على طلب انضمامك إلى ${COPY.brand.academy}. حسابك الآن مفعّل.

للدخول إلى حسابك: ${params.loginUrl}

— ${COPY.brand.academy}`;
}

export async function sendRejectionEmail(input: {
  name: string;
  email: string;
}): Promise<SendResult> {
  const resend = getClient();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY not set — rejection email not sent for",
      input.email,
    );
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const subject = `بخصوص طلب انضمامك إلى ${COPY.brand.academy}`;
  const html = rejectionEmailHtml({ name: input.name });
  const text = rejectionEmailText({ name: input.name });

  try {
    const res = await resend.emails.send({
      from: EMAIL_FROM,
      to: input.email,
      subject,
      html,
      text,
    });
    if (res.error) {
      return { ok: false, error: res.error.message };
    }
    return { ok: true, id: res.data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "send failed";
    return { ok: false, error: message };
  }
}

// Dignified, neutral palette — no celebratory green, no CTA button. The
// recipient is being told "no" so the design stays out of the way: a muted
// dark header, a single block of body copy, and a plain footer.
function rejectionEmailHtml(params: { name: string }): string {
  const { name } = params;
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>بخصوص طلب انضمامك</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Tahoma,Arial,sans-serif;color:#f5f5f7;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0b0f;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:linear-gradient(180deg,#15151b 0%,#0f0f15 100%);border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#1f1f27 0%,#15151b 100%);padding:32px 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0;font-size:13px;letter-spacing:0.18em;color:#c9c9d4;text-transform:uppercase;">${COPY.brand.academy}</p>
                <h1 style="margin:14px 0 0;font-size:24px;line-height:1.4;font-weight:800;color:#ffffff;">
                  بخصوص طلب انضمامك
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px;text-align:right;">
                <p style="margin:0 0 18px;font-size:16px;line-height:1.85;color:#e6e6ec;font-weight:600;">
                  مرحبًا ${escapeHtml(name)}،
                </p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.95;color:#c9c9d4;">
                  بعد مراجعة إجاباتك، مش هنقدر نقبل طلبك في الوقت الحالي.
                </p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.95;color:#c9c9d4;">
                  كما نوضح دائمًا، منهجية الأكاديمية ومحتوى أحمد هيثم مصممان خصيصًا للرجال الجادين الذين يسعون لبناء علاقات حقيقية بهدف الزواج الشرعي والاستقرار. لا يتم تقديم محتوى يخدم التعارف العابر أو العلاقات غير الجادة، ونحرص على أن يصل هذا العلم لمن يتوافق مع هذه الرؤية فقط.
                </p>
                <p style="margin:24px 0 0;font-size:14px;line-height:1.85;color:#8a8a96;">
                  نشكر لك اهتمامك ووقتك.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                <p style="margin:0;font-size:12px;color:#6c6c7a;">
                  ${COPY.brand.academy} · ${COPY.brand.tagline}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function rejectionEmailText(params: { name: string }): string {
  return `مرحبًا ${params.name}،

بعد مراجعة إجاباتك، مش هنقدر نقبل طلبك في الوقت الحالي.

كما نوضح دائمًا، منهجية الأكاديمية ومحتوى أحمد هيثم مصممان خصيصًا للرجال الجادين الذين يسعون لبناء علاقات حقيقية بهدف الزواج الشرعي والاستقرار. لا يتم تقديم محتوى يخدم التعارف العابر أو العلاقات غير الجادة، ونحرص على أن يصل هذا العلم لمن يتوافق مع هذه الرؤية فقط.

نشكر لك اهتمامك ووقتك.

— ${COPY.brand.academy}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
