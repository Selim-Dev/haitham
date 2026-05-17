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

  const subject = `🔥 تم قبولك في ${COPY.brand.academy} — رحلتك تبدأ الآن`;
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

function approvalEmailHtml(params: { name: string; loginUrl: string }): string {
  const { name, loginUrl } = params;
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>تم قبولك في ${COPY.brand.academy}</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Tahoma,Arial,sans-serif;color:#f5f5f7;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0b0f;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:linear-gradient(180deg,#15151b 0%,#0f0f15 100%);border:1px solid rgba(75,188,99,0.18);border-radius:20px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#4bbc63 0%,#2d8541 100%);padding:36px 32px;text-align:center;">
                <p style="margin:0;font-size:13px;letter-spacing:0.18em;color:#edf9f0;text-transform:uppercase;">${COPY.brand.academy}</p>
                <h1 style="margin:14px 0 0;font-size:30px;line-height:1.25;font-weight:900;color:#ffffff;">
                  مبروك يا ${escapeHtml(name)} — أنت داخل اللعبة
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px;text-align:right;">
                <p style="margin:0 0 16px;font-size:18px;line-height:1.7;color:#f5f5f7;font-weight:600;">
                  قرارك بالانضمام تمت الموافقة عليه. من اللحظة دي، رحلتك في تغيير حياتك بدأت رسميًا.
                </p>
                <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#c9c9d4;">
                  المنصة دلوقتي مفتوحة لك بالكامل: محتوى مركّز، أدوات تطبيقية، ووصول مدى الحياة.
                  ما عليك إلا خطوة واحدة — سجّل دخول وابدأ.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="right" style="margin:28px 0;">
                  <tr>
                    <td style="border-radius:12px;background:#4bbc63;box-shadow:0 12px 28px -8px rgba(75,188,99,0.55);">
                      <a href="${loginUrl}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:800;color:#ffffff;text-decoration:none;border-radius:12px;">
                        ابدأ رحلتك الآن ←
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#8a8a96;">
                  لو الزر مش شغال، افتح الرابط ده مباشرة:<br/>
                  <span dir="ltr" style="color:#c9c9d4;word-break:break-all;">${loginUrl}</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
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
  return `مبروك يا ${params.name} — أنت داخل اللعبة.

تمت الموافقة على انضمامك إلى ${COPY.brand.academy}.
المنصة دلوقتي مفتوحة لك بالكامل، ووصولك مدى الحياة.

ابدأ رحلتك من هنا: ${params.loginUrl}

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
