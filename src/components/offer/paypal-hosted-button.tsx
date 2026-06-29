"use client";

import * as React from "react";
import Script from "next/script";
import { Loader2, ShieldCheck } from "lucide-react";

// Same client-id resolution as the course international checkout, so a single
// NEXT_PUBLIC_PAYPAL_CLIENT_ID env drives every PayPal surface on the site.
const PAYPAL_CLIENT_ID =
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
  "BAAfzHP3KHRLtrIMQaGopoG8HlWvPsrNIqsbGxHg-SGFELurasC0ECt330vOGg-5Y3VxJ9Q0U7fcUGuYbo";

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (opts: { hostedButtonId: string }) => {
        render: (selector: string) => void;
      };
    };
  }
}

/**
 * Renders a PayPal hosted button (USD). Drops the SDK in via next/script and
 * mounts the button into a container keyed by its id. Shows a loading state
 * until the SDK is ready.
 */
export function PaypalHostedButton({
  hostedButtonId,
}: {
  hostedButtonId: string;
}) {
  const [sdkReady, setSdkReady] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(true);
  const renderedRef = React.useRef(false);

  React.useEffect(() => {
    if (!sdkReady || renderedRef.current) return;
    if (!window.paypal?.HostedButtons) return;
    try {
      window.paypal
        .HostedButtons({ hostedButtonId })
        .render(`#paypal-container-${hostedButtonId}`);
      renderedRef.current = true;
      // Defer hiding the loader out of the synchronous effect body.
      const id = requestAnimationFrame(() => setShowLoader(false));
      return () => cancelAnimationFrame(id);
    } catch (err) {
      console.error("[paypal] hosted button render failed", err);
    }
  }, [sdkReady, hostedButtonId]);

  return (
    <>
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=hosted-buttons&disable-funding=venmo&currency=USD`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={() => setSdkReady(true)}
        onReady={() => setSdkReady(true)}
      />
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <div className="relative min-h-[52px]">
          {showLoader && (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-4 text-sm text-neutral-500">
              <Loader2 className="size-4 animate-spin" />
              جاري تحميل زر الدفع الآمن...
            </div>
          )}
          <div id={`paypal-container-${hostedButtonId}`} className="w-full" />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] leading-relaxed text-neutral-500">
          <ShieldCheck className="size-3.5 text-[#2d8541]" />
          بعد إتمام الدفع يوصلك الكتاب والهدايا على الإيميل أو واتساب أو تليجرام
          خلال دقائق.
        </p>
      </div>
    </>
  );
}
