import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { listAdminUsers } from "@/services/admin-user.service";
import { getCurrentUser } from "@/lib/auth";
import { COPY } from "@/lib/arabic";
import { formatDate, toArabicNumerals } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [me, users] = await Promise.all([
    getCurrentUser(),
    listAdminUsers().catch(() => []),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.admin.users}
        </h1>
        <p className="mt-2 text-sm text-muted">
          عرض المستخدمين، الحظر، وإلغاء الحظر.
        </p>
      </header>

      {users.length === 0 ? (
        <EmptyState icon={<Users className="size-6" />} title="لا يوجد مستخدمون" />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card">
          <table className="w-full">
            <thead className="bg-elevated text-xs uppercase tracking-wider text-muted-2">
              <tr>
                <th className="p-4 text-start font-semibold">المستخدم</th>
                <th className="hidden p-4 text-start font-semibold sm:table-cell">
                  الدور
                </th>
                <th className="hidden p-4 text-start font-semibold md:table-cell">
                  الاشتراكات
                </th>
                <th className="hidden p-4 text-start font-semibold md:table-cell">
                  التسجيل
                </th>
                <th className="p-4 text-end font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-elevated/60">
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{u.name}</div>
                    <div dir="ltr" className="text-xs text-muted-2">
                      {u.email}
                      {u.phone ? ` · ${u.phone}` : ""}
                    </div>
                  </td>
                  <td className="hidden p-4 sm:table-cell">
                    {u.role === "ADMIN" ? (
                      <Badge variant="primary">إدارة</Badge>
                    ) : (
                      <Badge variant="outline">طالب</Badge>
                    )}
                    {u.isBlocked && (
                      <Badge variant="danger" className="ms-2">
                        محظور
                      </Badge>
                    )}
                  </td>
                  <td className="hidden p-4 text-foreground md:table-cell">
                    {toArabicNumerals(u.activeEnrollments)}
                  </td>
                  <td className="hidden p-4 text-muted md:table-cell">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="p-4 text-end">
                    <UserRowActions
                      userId={u.id}
                      isBlocked={u.isBlocked}
                      isSelf={me?.id === u.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
