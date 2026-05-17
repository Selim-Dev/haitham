import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { COPY } from "@/lib/arabic";

export function Logo({
  className,
  size = "md",
  withWordmark = true,
  href = "/",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  withWordmark?: boolean;
  href?: string | null;
}) {
  const dim = size === "sm" ? 36 : size === "lg" ? 56 : 44;
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  const inner = (
    <span
      className={cn(
        "inline-flex items-center gap-3 group",
        className,
      )}
    >
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full overflow-hidden",
          "ring-1 ring-[var(--color-border-strong)] transition-all duration-300",
          "group-hover:ring-primary/60 group-hover:shadow-[0_0_24px_-4px_rgba(75,188,99,0.5)]",
        )}
        style={{ width: dim, height: dim }}
      >
        <Image
          src="/logo.png"
          alt={COPY.brand.academy}
          width={dim}
          height={dim}
          priority
          className="object-cover"
        />
      </span>
      {withWordmark && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              "font-display font-extrabold tracking-tight text-foreground",
              textSize,
            )}
          >
            {COPY.brand.name}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-2">
            ACADEMY
          </span>
        </span>
      )}
    </span>
  );

  if (href === null) return inner;
  return (
    <Link
      href={href}
      aria-label={COPY.brand.academy}
      className="inline-flex"
    >
      {inner}
    </Link>
  );
}
