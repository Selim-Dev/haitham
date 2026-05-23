import type { Metadata } from "next";
import { Landing } from "./landing";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "اللعبة الأزلية | أحمد هيثم",
  description:
    "اللعبة الأزلية — برنامج أحمد هيثم لفهم قوانين الانجذاب وبناء العلاقة الجادة.",
  openGraph: {
    title: "اللعبة الأزلية | أحمد هيثم",
    description:
      "فهم القوانين الأزلية اللي بتتحكم في التعارف والانجذاب.",
    type: "website",
    locale: "ar_EG",
    images: ["/eternal-game-cover.jpeg"],
  },
};

export default function EternalGamePage() {
  return <Landing />;
}
