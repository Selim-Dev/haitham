import Image from "next/image";
import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { COPY } from "@/lib/arabic";

export function InstructorSection() {
  return (
    <section id="instructor" className="relative py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <FadeIn className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 bg-radial-red blur-2xl opacity-70"
            />
            <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--color-border-strong)] glass-strong p-1.5 shadow-[var(--shadow-card)]">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image
                  src="/owner-hero.jpg"
                  alt={COPY.instructor.name}
                  fill
                  sizes="(max-width: 768px) 80vw, 360px"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="flex flex-col items-start gap-5">
            <Badge variant="primary" className="px-3 py-1">
              {COPY.instructor.title}
            </Badge>
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {COPY.instructor.name}
            </h2>
            <p className="text-base text-foreground/80 leading-relaxed">
              {COPY.instructor.role}
            </p>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted">
              {COPY.instructor.bio}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="glass">+ سنوات خبرة</Badge>
              <Badge variant="glass">محتوى عربي حصري</Badge>
              <Badge variant="glass">منهج عملي</Badge>
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
