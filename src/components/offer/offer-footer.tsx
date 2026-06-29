import Link from "next/link";
import { Container } from "@/components/ui/container";

const LINKS = [
  { href: "/delivery", label: "سياسة التسليم" },
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/terms", label: "شروط الاستخدام" },
  { href: "/refund", label: "سياسة الاسترجاع" },
  { href: "/contact", label: "تواصل معنا" },
];

const SOCIAL = [
  { href: "https://instagram.com/ahaitham74", icon: "📸", label: "Instagram" },
  { href: "https://www.youtube.com/@AHaitham74", icon: "▶️", label: "YouTube" },
  { href: "https://www.tiktok.com/@ahaitham74", icon: "🎵", label: "TikTok" },
  { href: "https://www.facebook.com/AHaitham74/", icon: "📘", label: "Facebook" },
];

/** Light footer for the standalone offer landing pages (no global site chrome). */
export function OfferFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container className="py-12 text-center">
        <p className="font-display text-2xl font-extrabold text-[#2d8541]">
          أحمد هيثم
        </p>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-[#2d8541]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-center gap-3">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="grid size-10 place-items-center rounded-full border border-neutral-200 bg-white text-lg transition-colors hover:border-[#4bbc63]/50 hover:bg-green-50"
            >
              <span aria-hidden>{s.icon}</span>
            </a>
          ))}
        </div>

        <p className="mt-6 border-t border-neutral-200 pt-6 text-xs text-neutral-500">
          © ٢٠٢٦ أحمد هيثم. جميع الحقوق محفوظة.
        </p>
      </Container>
    </footer>
  );
}
