import { headers } from "next/headers";
import { lookupGeo } from "@/services/geoip.service";
import { getCurrentUser } from "@/lib/auth";

/**
 * Resolves the viewer's country code (ISO-2, uppercase) for use in
 * price selection. Prefers the logged-in user's `registrationCountry`,
 * falls back to edge headers / IP geo for anonymous visitors.
 *
 * Returns `undefined` when no country can be detected — callers should
 * default to the EGP price in that case.
 */
export async function getViewerCountry(): Promise<string | undefined> {
  try {
    const me = await getCurrentUser();
    if (me?.registrationCountry) return me.registrationCountry.toUpperCase();
  } catch {
    // ignore — auth failures shouldn't break public pages
  }

  try {
    const geo = await lookupGeo(await headers());
    if (geo.country) return geo.country.toUpperCase();
  } catch {
    // ignore — geo lookup failure shouldn't break public pages
  }

  return undefined;
}
