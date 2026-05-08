import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUser } from "@/lib/auth";
import { getAdminStats } from "@/services/analytics.service";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/dashboard");

  const stats = await getAdminStats().catch(() => ({
    totalUsers: 0,
    totalCourses: 0,
    pendingPayments: 0,
    activeEnrollments: 0,
  }));

  const pendingApplications = await (async () => {
    try {
      await connectDB();
      return UserModel.countDocuments({
        role: "STUDENT",
        approvalStatus: "PENDING_REVIEW",
      });
    } catch {
      return 0;
    }
  })();

  return (
    <AdminShell
      user={{ name: user.name, email: user.email }}
      pendingCount={stats.pendingPayments}
      pendingApplications={pendingApplications}
    >
      {children}
    </AdminShell>
  );
}
