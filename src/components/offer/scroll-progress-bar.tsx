"use client";

import * as React from "react";

/**
 * Thin reading-progress bar pinned to the top of the offer pages. RTL-aware:
 * it fills from the right (origin-right). Scoped to these pages only — the
 * global ScrollProgress was removed because it clashed with the homepage hero.
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        className="h-full origin-right bg-gradient-to-l from-[var(--color-red-300)] via-primary to-[var(--color-red-700)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
