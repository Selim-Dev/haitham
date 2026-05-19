import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "@/components/ui/container";
import { COPY } from "@/lib/arabic";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-20 border-t border-[var(--color-border)] bg-surface">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              أكاديمية أحمد هيثم: لإعداد رجال حقيقيين.. في عالم نسي معنى
              الرجولة.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-foreground">روابط</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li>
                <Link href="/courses" className="hover:text-foreground">
                  {COPY.nav.courses}
                </Link>
              </li>
              <li>
                <Link href="/#how" className="hover:text-foreground">
                  {COPY.nav.howItWorks}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  {COPY.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-foreground">
                  {COPY.nav.faq}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  {COPY.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-foreground">الحساب</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li>
                <Link href="/login" className="hover:text-foreground">
                  {COPY.nav.login}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground">
                  {COPY.nav.register}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground">
                  {COPY.nav.dashboard}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-foreground">
              {COPY.nav.policies}
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  {COPY.nav.terms}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  {COPY.nav.privacy}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-foreground">
                  {COPY.nav.refund}
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-foreground">
                  {COPY.nav.delivery}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-muted-2 sm:flex-row sm:items-center">
          <span>
            © {year} {COPY.brand.academy}. جميع الحقوق محفوظة.
          </span>
          <span className="opacity-70">
            صُنع بعناية للرجال الحقيقيين.
          </span>
        </div>
      </Container>
    </footer>
  );
}
