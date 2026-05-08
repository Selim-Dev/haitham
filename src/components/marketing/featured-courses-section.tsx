import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/motion/fade-in";
import { TiltCard } from "@/components/motion/tilt-card";
import { CourseCard, type CourseCardData } from "@/components/courses/course-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { COPY } from "@/lib/arabic";

export function FeaturedCoursesSection({
  courses,
}: {
  courses: CourseCardData[];
}) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle
              eyebrow="مختاراتنا"
              title="كورسات مميزة"
              subtitle="اختر من بين أقوى الكورسات على المنصة وابدأ رحلتك."
              align="start"
            />
            <Button asChild variant="ghost" size="md">
              <Link href="/courses">
                عرض الكل
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        {courses.length === 0 ? (
          <FadeIn className="mt-12">
            <EmptyState
              title="قريبًا"
              description="نحضّر لك كورسات مميزة. تابعنا قريبًا."
            />
          </FadeIn>
        ) : (
          <StaggerChildren className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <StaggerItem key={c.id} className="h-full">
                <TiltCard intensity={6}>
                  <CourseCard course={c} />
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </Container>
    </section>
  );
}
