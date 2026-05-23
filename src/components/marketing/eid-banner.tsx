import { Moon, Star, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { COPY } from "@/lib/arabic";

// Eid Al-Adha greeting banner. Sits between the navbar and the hero on the
// home page, gated by the global theme setting (see services/settings.service).
//
// Design notes:
//  - Custom inline SVG ram silhouette (Eid Al-Adha icon). Inline SVG avoids
//    pulling an external image and stays crisp at any DPR.
//  - Gold accent layered on top of the brand verdant green via a radial
//    gradient — preserves brand consistency while reading clearly as festive.
//  - Subtle diamond-rhombus pattern overlay (data URI) evokes Islamic
//    geometry without being on-the-nose.
//  - Stars + sparkles are decorative-only (`aria-hidden`); the greeting
//    itself is a semantic h2.

export function EidBanner() {
  return (
    <div className="relative overflow-hidden border-b border-amber-400/15 bg-[radial-gradient(ellipse_60%_120%_at_50%_50%,rgba(252,211,77,0.10),rgba(75,188,99,0.05)_60%,transparent)]">
      {/* Geometric pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30Z' fill='none' stroke='%23fcd34d' stroke-width='0.6'/%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Bottom gold hairline */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-amber-300/45 to-transparent"
      />

      {/* Decorative twinkles */}
      <Sparkles
        aria-hidden="true"
        className="absolute right-[8%] top-3 size-3.5 text-amber-300/60 motion-safe:animate-pulse"
      />
      <Star
        aria-hidden="true"
        className="absolute left-[10%] bottom-4 size-3 text-amber-300/55"
      />
      <Star
        aria-hidden="true"
        className="absolute right-[28%] bottom-3 size-2.5 text-amber-300/45 hidden sm:block"
      />
      <Sparkles
        aria-hidden="true"
        className="absolute left-[26%] top-5 size-2.5 text-amber-300/45 hidden sm:block motion-safe:animate-pulse"
      />

      <Container>
        <div className="relative flex items-center justify-center gap-4 py-4 sm:gap-6 sm:py-5">
          <RamIcon className="size-12 shrink-0 text-amber-200 drop-shadow-[0_0_18px_rgba(252,211,77,0.3)] sm:size-14" />

          <div className="flex flex-col items-center text-center sm:items-start sm:text-start">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Moon
                aria-hidden="true"
                className="size-4 text-amber-300 sm:size-5"
              />
              <h2 className="font-display text-xl font-extrabold tracking-tight text-amber-100 sm:text-2xl lg:text-3xl">
                {COPY.eid.greeting}
              </h2>
              <Sparkles
                aria-hidden="true"
                className="size-3.5 text-amber-300 sm:size-4"
              />
            </div>
            <p className="mt-1 text-xs font-medium text-muted sm:text-sm">
              {COPY.eid.subtitle}
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

// Stylized ram side-profile silhouette. `currentColor` lets the parent
// drive the tint (amber on the banner, neutral elsewhere if reused).
function RamIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Body (cloud-fluffy) */}
      <ellipse cx="36" cy="34" rx="22" ry="14" fill="currentColor" />
      <circle cx="22" cy="28" r="6" fill="currentColor" />
      <circle cx="32" cy="24" r="7" fill="currentColor" />
      <circle cx="44" cy="24" r="7" fill="currentColor" />
      <circle cx="52" cy="28" r="6" fill="currentColor" />

      {/* Head */}
      <ellipse cx="62" cy="34" rx="9" ry="7" fill="currentColor" opacity="0.85" />

      {/* Ear */}
      <ellipse
        cx="58"
        cy="28"
        rx="3"
        ry="4"
        fill="currentColor"
        opacity="0.85"
      />

      {/* Curled horn */}
      <path
        d="M64 28 C 69 22, 73 26, 71 32 C 69 36, 65 34, 65 32"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Eye + nose */}
      <circle cx="64" cy="33" r="0.9" fill="#0d0d0d" />
      <ellipse cx="69.5" cy="35" rx="1.6" ry="1" fill="#0d0d0d" opacity="0.55" />

      {/* Legs */}
      <rect
        x="22"
        y="45"
        width="2.5"
        height="10"
        rx="1.2"
        fill="currentColor"
        opacity="0.85"
      />
      <rect
        x="32"
        y="46"
        width="2.5"
        height="10"
        rx="1.2"
        fill="currentColor"
        opacity="0.85"
      />
      <rect
        x="42"
        y="46"
        width="2.5"
        height="10"
        rx="1.2"
        fill="currentColor"
        opacity="0.85"
      />
      <rect
        x="50"
        y="45"
        width="2.5"
        height="10"
        rx="1.2"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}
