"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Receipt,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/arabic";
import { cn } from "@/lib/utils";

const STUDENT_NAV = [
  { href: "/dashboard", label: COPY.nav.dashboard, icon: LayoutDashboard },
  { href: "/dashboard/my-courses", label: COPY.dashboard.myCourses, icon: GraduationCap },
  { href: "/dashboard/payment-proofs", label: COPY.dashboard.paymentProofs, icon: Receipt },
];

export function DashboardShell({
  user,
  children,
  navItems,
  title,
}: {
  user: { name: string; email: string; role: "STUDENT" | "ADMIN" };
  children: React.ReactNode;
  navItems?: typeof STUDENT_NAV;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const items = navItems ?? STUDENT_NAV;

  React.useEffect(() => setMobileOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-background/80 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Logo size="md" />
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-foreground">
                  {user.name}
                </span>
                <span className="text-xs text-muted-2">{user.email}</span>
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                aria-label={COPY.nav.logout}
              >
                <LogOut className="size-4" />
                {COPY.nav.logout}
              </Button>
            </div>
            <button
              type="button"
              className="md:hidden rounded-lg border border-[var(--color-border-strong)] bg-card p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "إغلاق" : "القائمة"}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>
      </header>

      <div className="flex-1">
        <Container className="flex flex-col gap-6 py-6 md:flex-row md:gap-8 md:py-10">
          {/* Sidebar — appears on the right in RTL */}
          <aside className="hidden md:block md:w-64 shrink-0">
            <nav className="sticky top-24 flex flex-col gap-1 rounded-2xl border border-[var(--color-border)] bg-card p-3">
              {items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/15 text-[var(--color-red-300)]"
                        : "text-muted hover:bg-elevated hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="md:hidden overflow-hidden"
              >
                <nav className="flex flex-col gap-1 rounded-2xl border border-[var(--color-border)] bg-card p-3">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-primary/15 text-[var(--color-red-300)]"
                            : "text-muted hover:bg-elevated hover:text-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <button
                    onClick={logout}
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger hover:bg-elevated"
                  >
                    <LogOut className="size-4" />
                    {COPY.nav.logout}
                  </button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main */}
          <main className="min-w-0 flex-1">
            {title && (
              <h1 className="mb-6 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
            )}
            {children}
          </main>
        </Container>
      </div>
    </div>
  );
}
