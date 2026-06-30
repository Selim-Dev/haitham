import type { Metadata } from "next";
import { Celebration } from "./celebration";

export const metadata: Metadata = {
  title: "مبروك! — أكاديمية أحمد هيثم",
  description: "تم استلام طلبك بنجاح — الكتاب في طريقه إليك.",
};

export default function ThankYouPage() {
  return <Celebration />;
}
