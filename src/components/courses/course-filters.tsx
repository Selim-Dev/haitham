"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { COURSE_LEVELS, COURSE_LEVEL_AR } from "@/lib/constants";
import { COPY } from "@/lib/arabic";
import { cn } from "@/lib/utils";

export function CourseFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "";
  const level = params.get("level") ?? "";
  const sort = params.get("sort") ?? "newest";

  const [searchInput, setSearchInput] = React.useState(search);

  function update(next: Record<string, string | undefined>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (!v) sp.delete(k);
      else sp.set(k, v);
    }
    router.push(`/courses${sp.toString() ? `?${sp.toString()}` : ""}`);
  }

  function onSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    update({ search: searchInput.trim() || undefined });
  }

  const hasFilters = search || category || level || sort !== "newest";

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={onSubmitSearch} className="relative">
        <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-2" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={COPY.courses.searchPlaceholder}
          className="h-12 pr-11"
          aria-label="بحث"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              update({ search: undefined });
            }}
            className="absolute left-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-card text-muted hover:bg-elevated"
            aria-label="مسح البحث"
          >
            <X className="size-3.5" />
          </button>
        )}
      </form>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => update({ category: undefined })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
              !category
                ? "border-primary bg-primary text-primary-foreground"
                : "border-[var(--color-border-strong)] bg-card text-muted hover:text-foreground hover:border-primary/40",
            )}
          >
            الكل
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => update({ category: c === category ? undefined : c })}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors",
                category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-[var(--color-border-strong)] bg-card text-muted hover:text-foreground hover:border-primary/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
            {COPY.courses.filterLevel}:
          </span>
          {Object.values(COURSE_LEVELS).map((lv) => (
            <button
              key={lv}
              onClick={() => update({ level: lv === level ? undefined : lv })}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                level === lv
                  ? "border-[var(--color-red-300)] bg-primary/15 text-[var(--color-red-300)]"
                  : "border-[var(--color-border)] bg-card text-muted hover:text-foreground",
              )}
            >
              {COURSE_LEVEL_AR[lv]}
            </button>
          ))}

          <div className="ms-auto flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
              {COPY.courses.sort.label}:
            </span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="h-9 rounded-lg border border-[var(--color-border-strong)] bg-card px-3 text-xs font-semibold text-foreground focus-visible:border-primary/60 focus-visible:outline-none"
            >
              <option value="newest">{COPY.courses.sort.newest}</option>
              <option value="price-low">{COPY.courses.sort.priceLow}</option>
              <option value="price-high">{COPY.courses.sort.priceHigh}</option>
            </select>
          </div>
        </div>

        {hasFilters && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
                router.push("/courses");
              }}
            >
              <X className="size-3.5" />
              مسح كل الفلاتر
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
