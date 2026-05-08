export type GeoInfo = {
  ip?: string;
  country?: string;
  countryName?: string;
  city?: string;
  region?: string;
};

export function getClientIp(headers: Headers): string | undefined {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    headers.get("x-vercel-forwarded-for") ||
    undefined
  );
}

function getCountryFromHeaders(headers: Headers): string | undefined {
  return (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    undefined
  );
}

function getCityFromHeaders(headers: Headers): string | undefined {
  const raw =
    headers.get("x-vercel-ip-city") ||
    headers.get("cf-ipcity") ||
    undefined;
  return raw ? safeDecode(raw) : undefined;
}

function getRegionFromHeaders(headers: Headers): string | undefined {
  return (
    headers.get("x-vercel-ip-country-region") ||
    headers.get("cf-region") ||
    undefined
  );
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  if (ip === "127.0.0.1" || ip === "::1" || ip === "localhost") return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  if (ip.startsWith("169.254.")) return true;
  if (ip.startsWith("fc00:") || ip.startsWith("fd")) return true;
  return false;
}

export function countryCodeToName(
  code: string | undefined,
  locale: string = "ar",
): string | undefined {
  if (!code || code.length !== 2) return undefined;
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(
      code.toUpperCase(),
    );
  } catch {
    return undefined;
  }
}

export function countryCodeToFlag(code: string | undefined): string {
  if (!code || code.length !== 2) return "";
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return "";
  const codePoints = upper.split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

async function lookupViaApi(ip: string): Promise<GeoInfo> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "AhmedHaithamAcademy/1.0",
      },
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });
    if (!res.ok) return { ip };
    const json = (await res.json()) as {
      country_code?: string;
      country_name?: string;
      city?: string;
      region?: string;
      error?: boolean;
    };
    if (json.error) return { ip };
    return {
      ip,
      country: json.country_code,
      countryName:
        countryCodeToName(json.country_code, "ar") ||
        json.country_name ||
        undefined,
      city: json.city || undefined,
      region: json.region || undefined,
    };
  } catch {
    return { ip };
  }
}

export async function lookupGeo(headers: Headers): Promise<GeoInfo> {
  const ip = getClientIp(headers);
  const headerCountry = getCountryFromHeaders(headers);

  if (headerCountry) {
    return {
      ip,
      country: headerCountry.toUpperCase(),
      countryName: countryCodeToName(headerCountry, "ar"),
      city: getCityFromHeaders(headers),
      region: getRegionFromHeaders(headers),
    };
  }

  if (!ip || isPrivateIp(ip)) return { ip };
  return lookupViaApi(ip);
}
