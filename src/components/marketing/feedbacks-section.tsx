import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import {
  FEEDBACKS,
  FeedbackGallery,
} from "@/components/feedbacks/feedback-gallery";
import { COPY } from "@/lib/arabic";
import { toArabicNumerals } from "@/lib/utils";

export function FeedbacksSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-[60%] max-w-5xl -translate-y-1/2 rounded-full bg-radial-red opacity-25 blur-3xl"
      />
      <Container>
        <SectionTitle
          eyebrow={
            <>
              <Quote className="size-3.5" />
              {COPY.feedbacks.eyebrow}
            </>
          }
          title={COPY.feedbacks.title}
          subtitle={COPY.feedbacks.subtitle}
        />

        <p className="mt-4 text-center text-xs font-medium text-muted-2">
          {COPY.feedbacks.note} ·{" "}
          <span className="text-[var(--color-red-300)]">
            {toArabicNumerals(FEEDBACKS.length)} {COPY.feedbacks.counter}
          </span>
        </p>

        <div className="mt-14">
          <FeedbackGallery />
        </div>
      </Container>
    </section>
  );
}
