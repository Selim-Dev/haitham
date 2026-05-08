import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { UserForm } from "@/components/admin/user-form";
import { COPY } from "@/lib/arabic";

export const metadata = { title: "إضافة مستخدم" };

export default function NewUserPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-muted-2">
        <Link href="/admin/users" className="hover:text-foreground">
          {COPY.admin.users}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">إضافة مستخدم</span>
      </div>

      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          إضافة مستخدم جديد
        </h1>
        <p className="mt-2 text-sm text-muted">
          أضف طالبًا أو مديرًا مباشرة من لوحة التحكم. سيتم إنشاء الحساب
          فورًا بكلمة المرور التي تختارها.
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--color-border-strong)] bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
        <UserForm />
      </div>
    </div>
  );
}
