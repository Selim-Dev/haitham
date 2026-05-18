import * as React from "react";
import { cn } from "@/lib/utils";

// Previously animated each word in with a stagger. The per-word framer-motion
// nodes were the main source of headline flicker on hydration — every word
// briefly rendered at opacity 0. Now a plain inline span.

export function WordReveal({
  text,
  className,
  highlight,
  highlightClassName,
}: {
  text: string;
  className?: string;
  highlight?: string;
  highlightClassName?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}) {
  if (!highlight) {
    return <span className={cn("inline", className)}>{text}</span>;
  }
  const parts = text.split(highlight);
  return (
    <span className={cn("inline", className)}>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className={highlightClassName}>{highlight}</span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}
