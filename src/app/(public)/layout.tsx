import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getCurrentUser } from "@/lib/auth";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    user = null;
  }
  return (
    <>
      <Navbar
        user={
          user
            ? { name: user.name, role: user.role }
            : null
        }
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
