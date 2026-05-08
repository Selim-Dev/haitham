/**
 * Resolve the public origin of the app at runtime.
 *
 * Priority:
 *   1. NEXT_PUBLIC_APP_URL  (explicit override — set this only if you have a custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL  (stable prod URL on Vercel, e.g. "my-app.vercel.app")
 *   3. VERCEL_URL  (per-deployment URL, used for previews)
 *   4. http://localhost:3000  (local dev fallback)
 *
 * Server-side only — uses non-public Vercel env vars.
 */
export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
