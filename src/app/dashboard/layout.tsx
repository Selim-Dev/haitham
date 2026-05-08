import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");
  if (user.role === "ADMIN") return <>{children}</>;

  switch (user.approvalStatus) {
    case "PENDING_APPLICATION":
      redirect("/register/application");
    case "PENDING_REVIEW":
    case "REJECTED":
      redirect("/awaiting-approval");
    case "APPROVED":
    default:
      return <>{children}</>;
  }
}
