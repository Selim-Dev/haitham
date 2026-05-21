"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { COPY } from "@/lib/arabic";
import { cn } from "@/lib/utils";

type NavbarUser = {
  name: string;
  role: "STUDENT" | "ADMIN";
} | null;

const NAV_LINKS = [
  { href: "/", label: COPY.nav.home },
  { href: "/courses", label: COPY.nav.courses },
  { href: "/sessions", label: "الجلسات" },
  { href: "/#how", label: COPY.nav.howItWorks },
  { href: "/#instructor", label: COPY.nav.about },
  { href: "/#faq", label: COPY.nav.faq },
];

export function Navbar({ user = null }: { user?: NavbarUser }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-[var(--color-border)] bg-background/70 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        <Container>
          <nav
            className="flex h-16 items-center justify-between gap-4 sm:h-18"
            aria-label="التنقل الرئيسي"
          >
            <Logo size="md" />

            <ul className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "text-foreground"
                          : "text-muted hover:text-foreground hover:bg-card",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden items-center gap-2 md:flex">
              {user ? (
                <Button asChild variant="secondary" size="sm">
                  <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"}>
                    <LayoutDashboard className="size-4" />
                    {user.role === "ADMIN" ? COPY.nav.admin : COPY.nav.dashboard}
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">
                      <LogIn className="size-4" />
                      {COPY.nav.login}
                    </Link>
                  </Button>
                  <Button asChild variant="primary" size="sm">
                    <Link href="/register">{COPY.nav.start}</Link>
                  </Button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden rounded-lg border border-[var(--color-border-strong)] bg-card p-2 text-foreground"
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </nav>
        </Container>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/85 backdrop-blur-2xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="relative pt-20 pb-8"
            >
              <Container>
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-xl border border-[var(--color-border)] bg-card px-5 py-4 text-base font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-elevated"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-2">
                  {user ? (
                    <Button asChild variant="primary" size="lg" className="w-full">
                      <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"}>
                        {user.role === "ADMIN" ? COPY.nav.admin : COPY.nav.dashboard}
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="primary" size="lg" className="w-full">
                        <Link href="/register">{COPY.nav.start}</Link>
                      </Button>
                      <Button asChild variant="secondary" size="lg" className="w-full">
                        <Link href="/login">{COPY.nav.login}</Link>
                      </Button>
                    </>
                  )}
                </div>
              </Container>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
