import * as React from "react";

// These used to wrap framer-motion `whileInView` reveals. The SSR pattern
// (initial=hidden + animate on view) caused a flash-of-hidden-content on
// hydration, plus a constant IntersectionObserver workload. They are now
// transparent pass-throughs — content renders in its final state immediately.
// Keeping the components (and their props) avoids touching every caller.

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article";
};

export function FadeIn({ children, className, as = "div" }: FadeInProps) {
  const Comp = as;
  return <Comp className={className}>{children}</Comp>;
}

export function StaggerChildren({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
