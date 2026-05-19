import { Marquee } from "@/components/motion/marquee";

const PHRASES = [
  "افهم القواعد",
  "العب بذكاء",
  "محتوى حقيقي من أرض الواقع",
  "وصول مدى الحياة",
  "محتوى عربي حصري",
  "غيّر مكانك",
  "نتائج حقيقية",
  "ادفع مرة، تعلّم مدى الحياة",
];

export function MarqueeStrip() {
  return (
    <div className="relative border-y border-[var(--color-border)] bg-surface/40 py-2 backdrop-blur-sm">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-primary/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-primary/30 to-transparent"
      />
      <Marquee items={PHRASES} speed={36} />
    </div>
  );
}
