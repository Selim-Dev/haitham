import type { Viewport } from "next";

// White mobile browser chrome for these pages (overrides the app's dark
// themeColor from the root layout, which would otherwise frame the white
// funnel with a near-black address bar).
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// Landing-page shell for the offer funnel. These pages live OUTSIDE the
// (public) route group on purpose: no site navbar/footer, and a light (white)
// theme that overrides the app's dark canvas. `colorScheme: light` keeps form
// controls / scrollbars light within this subtree.
export default function OfferLayout({
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
