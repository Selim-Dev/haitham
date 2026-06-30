import type { Viewport } from "next";

// Same standalone white landing shell as /offer: no site navbar/footer, light
// theme + white mobile browser chrome.
export const viewport: Viewport = {
  themeColor: "#ffffff",
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
