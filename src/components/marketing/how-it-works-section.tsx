import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { COPY } from "@/lib/arabic";

export function HowItWorksSection() {
  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-l from-transparent via-[var(--color-border-strong)] to-transparent"
      />
      <Container>
        <SectionTitle
          eyebrow="كيف تعمل المنصة"
          title={COPY.howItWorks.title}
          subtitle={COPY.howItWorks.subtitle}
        />

        <div className="relative mt-16">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-1/2 -z-10 hidden h-12 w-full -translate-y-1/2 lg:block"
          >
            <path
              d="M 970 30 C 800 5, 600 55, 500 30 S 200 5, 30 30"
              fill="none"
              stroke="url(#how-grad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="how-grad"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(75,188,99,0.0)" />
                <stop offset="20%" stopColor="rgba(75,188,99,0.6)" />
                <stop offset="80%" stopColor="rgba(75,188,99,0.6)" />
                <stop offset="100%" stopColor="rgba(75,188,99,0.0)" />
              </linearGradient>
            </defs>
          </svg>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {COPY.howItWorks.steps.map((step) => (
              <div
                key={step.num}
                className="group relative h-full rounded-2xl border border-[var(--color-border)] bg-card p-6 transition-colors duration-200 hover:border-primary/40 hover:bg-elevated"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-display text-3xl font-black text-primary/30 transition-colors group-hover:text-primary/70">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-2">
                    خطوة {step.num}
                  </span>
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
