import { HeroSection } from "@/components/marketing/hero-section";
import { MarqueeStrip } from "@/components/marketing/marquee-strip";
import { FeaturedCoursesSection } from "@/components/marketing/featured-courses-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { InstructorSection } from "@/components/marketing/instructor-section";
import { FeedbacksSection } from "@/components/marketing/feedbacks-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaFooterSection } from "@/components/marketing/cta-footer-section";
import { getFeaturedCourses } from "@/services/course.service";
import { getViewerCountry } from "@/lib/viewer-country";

// Country-aware pricing needs request headers, so the homepage can't be
// statically revalidated globally — keep it dynamic.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, viewerCountry] = await Promise.all([
    getFeaturedCourses(3),
    getViewerCountry(),
  ]);

  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <FeaturedCoursesSection courses={featured} viewerCountry={viewerCountry} />
      <InstructorSection />
      <FeedbacksSection />
      <HowItWorksSection />
      <FaqSection />
      <CtaFooterSection />
    </>
  );
}
