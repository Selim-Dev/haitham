"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Receipt,
  Users,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COPY } from "@/lib/arabic";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: COPY.admin.title, icon: LayoutDashboard },
  { href: "/admin/courses", label: COPY.admin.courses, icon: BookOpen },
  { href: "/admin/payments", label: COPY.admin.payments, icon: Receipt },
  { href: "/admin/users", label: COPY.admin.users, icon: Users },
  { href: "/admin/enrollments", label: COPY.admin.enrollments, icon: GraduationCap },
];

export function AdminShell({
  user,
  children,
  pendingCount = 0,
}: {
  user: { name: string; email: string };
  children: React.ReactNode;
  pendingCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-background/85 backdrop-blur-xl">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <Badge variant="primary" className="hidden sm:inline-flex">
                لوحة الإدارة
              </Badge>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-xs text-muted-2">{user.name}</span>
              <Button onClick={logout} variant="ghost" size="sm">
                <LogOut className="size-4" />
                {COPY.nav.logout}
              </Button>
            </div>
            <button
              type="button"
              className="md:hidden rounded-lg border border-[var(--color-border-strong)] bg-card p-2"
              onClick={() => setOpen((v) => !v)}
              aria-label="القائمة"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </Container>
      </header>

      <div className="flex-1">
        <Container className="flex flex-col gap-6 py-6 md:flex-row md:gap-8 md:py-10">
          <aside className="hidden md:block md:w-64 shrink-0">
            <nav className="sticky top-24 flex flex-col gap-1 rounded-2xl border border-[var(--color-border)] bg-card p-3">
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const isPaymentsLink = item.href === "/admin/payments";
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
                    <span className="flex-1">{item.label}</span>
                    {isPaymentsLink && pendingCount > 0 && (
                      <Badge variant="warning" className="px-2 py-0.5 text-[10px]">
                        {pendingCount}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="md:hidden overflow-hidden"
              >
                <nav className="flex flex-col gap-1 rounded-2xl border border-[var(--color-border)] bg-card p-3">
                  {ADMIN_NAV.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href ||
                      (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                          active
                            ? "bg-primary/15 text-[var(--color-red-300)]"
                            : "text-muted hover:bg-elevated",
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

          <main className="min-w-0 flex-1">{children}</main>
        </Container>
      </div>
    </div>
  );
}
