import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicNumerals(value: number | string): string {
  return String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

export function formatPrice(
  amount: number,
  currency: string = "EGP",
  locale: string = "ar-EG",
): string {
  // Intl.NumberFormat with ar-EG locale should yield Arabic-Indic digits, but
  // some Node runtimes ship with reduced ICU data and silently fall back to
  // Latin digits — so we always pipe the result through toArabicNumerals to
  // guarantee ٠-٩. The regex only matches Latin 0-9, so a correct Intl
  // output passes through untouched.
  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
    return toArabicNumerals(formatted);
  } catch {
    return `${toArabicNumerals(amount)} ${currency}`;
  }
}

export function formatDate(date: Date | string, locale: string = "ar-EG"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(d);
}

export function formatDuration(seconds: number, locale: string = "ar-EG"): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) {
    return `${toArabicNumerals(h)} س ${toArabicNumerals(m)} د`;
  }
  return `${toArabicNumerals(m)} دقيقة`;
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[ً-ْ]/g, "") // strip Arabic diacritics
    .replace(/[^ء-يa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
