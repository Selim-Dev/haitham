import { HeroSection } from "@/components/marketing/hero-section";
import { MarqueeStrip } from "@/components/marketing/marquee-strip";
import { FeaturedCoursesSection } from "@/components/marketing/featured-courses-section";
import { StatsSection } from "@/components/marketing/stats-section";
import { BenefitsSection } from "@/components/marketing/benefits-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { InstructorSection } from "@/components/marketing/instructor-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaFooterSection } from "@/components/marketing/cta-footer-section";
import { getFeaturedCourses } from "@/services/course.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await getFeaturedCourses(3);

  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <FeaturedCoursesSection courses={featured} />
      <StatsSection />
      <BenefitsSection />
      <HowItWorksSection />
      <InstructorSection />
      <FaqSection />
      <CtaFooterSection />
    </>
  );
}
