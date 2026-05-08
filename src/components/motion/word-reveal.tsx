"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function WordReveal({
  text,
  className,
  highlight,
  highlightClassName,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  highlight?: string;
  highlightClassName?: string;
  as?: "h1" | "h2" | "h3" | "span" | "p";
}) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={container}
      className={cn("inline-block", className)}
    >
      {React.createElement(
        Tag,
        { className: "inline" },
        words.map((word, i) => {
          const isHighlight = highlight && word.includes(highlight);
          return (
            <span key={i} className="inline-block whitespace-pre">
              <motion.span
                variants={wordVariants}
                className={cn(
                  "inline-block",
                  isHighlight && highlightClassName,
                )}
                style={{ transformOrigin: "0% 100%" }}
              >
                {word}
              </motion.span>
              {i < words.length - 1 && " "}
            </span>
          );
        }),
      )}
    </motion.span>
  );
}
