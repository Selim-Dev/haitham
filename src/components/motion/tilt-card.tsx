import * as React from "react";
import { cn } from "@/lib/utils";

// Was a 3D-tilt-on-cursor wrapper using framer-motion springs. Each card
// installed mousemove listeners and ran two springs per render frame — on the
// course grid that adds up fast. Now a plain wrapper with a cheap CSS hover
// lift handled by the card itself.

export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}) {
  return <div className={cn("h-full", className)}>{children}</div>;
}
