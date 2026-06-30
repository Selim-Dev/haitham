import type { Viewport } from "next";

// Standalone landing shell: no site navbar/footer. The thank-you page opens on
// a dark header/hero, so the mobile browser chrome is dark to match.
export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

export default function TestGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen flex-col bg-white text-neutral-900"
      style={{ colorScheme: "light" }}
    >
      {children}
    </div>
  );
}
