import type { Metadata, Viewport } from "next";
import { Cairo, Noto_Kufi_Arabic } from "next/font/google";
import { Toaster } from "sonner";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { getAppUrl } from "@/lib/env";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const kufi = Noto_Kufi_Arabic({
  variable: "--font-kufi",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: "أحمد هيثم — افهم اللعبة الأزلية وغيّر حياتك",
    template: "%s · أحمد هيثم",
  },
  description:
    "افهم اللعبة الأزلية وغيّر حياتك. كورسات قوية ومباشرة، بدون حشو ولا تنظير. القواعد الحقيقية للعبة، وأدوات تطبيقية تنقلك للمستوى التالي.",
  keywords: [
    "كورسات",
    "تعلم",
    "عربي",
    "أحمد هيثم",
    "تطوير الذات",
    "بيزنس",
    "عقلية",
    "انضباط",
  ],
  authors: [{ name: "Ahmed Haitham" }],
  openGraph: {
    title: "أحمد هيثم — افهم اللعبة الأزلية وغيّر حياتك",
    description:
      "كورسات قوية ومباشرة. القواعد الحقيقية للعبة، وأدوات تطبيقية تنقلك للمستوى التالي.",
    type: "website",
    locale: "ar_EG",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${kufi.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans flex flex-col">
        <ScrollProgress />
        {children}
        <Toaster
          position="top-center"
          dir="rtl"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "font-sans",
            },
          }}
        />
      </body>
    </html>
  );
}
