import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { EnrollmentRowActions } from "@/components/admin/enrollment-row-actions";
import { listAdminEnrollments } from "@/services/admin-user.service";
import { COPY } from "@/lib/arabic";
import { ENROLLMENT_STATUS_AR, type EnrollmentStatus } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
  const enrollments = await listAdminEnrollments().catch(() => []);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.admin.enrollments}
        </h1>
        <p className="mt-2 text-sm text-muted">
          إدارة الاشتراكات النشطة وإلغاء الوصول عند الحاجة.
        </p>
      </header>

      {enrollments.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="size-6" />}
          title="لا توجد اشتراكات بعد"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-card">
          <table className="w-full">
            <thead className="bg-elevated text-xs uppercase tracking-wider text-muted-2">
              <tr>
                <th className="p-4 text-start font-semibold">الطالب</th>
                <th className="p-4 text-start font-semibold">الكورس</th>
                <th className="hidden p-4 text-start font-semibold sm:table-cell">
                  الحالة
                </th>
                <th className="hidden p-4 text-start font-semibold md:table-cell">
                  التاريخ
                </th>
                <th className="p-4 text-end font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-sm">
              {enrollments.map((e) => (
                <tr key={e.id} className="hover:bg-elevated/60">
                  <td className="p-4">
                    <div className="font-semibold text-foreground">
                      {e.user?.name ?? "—"}
                    </div>
                    <div dir="ltr" className="text-xs text-muted-2">
                      {e.user?.email}
                    </div>
                  </td>
                  <td className="p-4 text-foreground">
                    {e.course?.title ?? "—"}
                  </td>
                  <td className="hidden p-4 sm:table-cell">
                    <Badge
                      variant={e.status === "ACTIVE" ? "success" : "outline"}
                    >
                      {ENROLLMENT_STATUS_AR[e.status as EnrollmentStatus]}
                    </Badge>
                  </td>
                  <td className="hidden p-4 text-muted md:table-cell">
                    {formatDate(e.createdAt)}
                  </td>
                  <td className="p-4 text-end">
                    <EnrollmentRowActions
                      enrollmentId={e.id}
                      status={e.status as EnrollmentStatus}
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
