import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CourseForm } from "@/components/admin/course-form";
import { COPY } from "@/lib/arabic";

export const metadata = { title: COPY.admin.addCourse };

export default function NewCoursePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-muted-2">
        <Link href="/admin/courses" className="hover:text-foreground">
          {COPY.admin.courses}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{COPY.admin.addCourse}</span>
      </div>
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.admin.addCourse}
        </h1>
      </header>
      <CourseForm mode="create" />
    </div>
  );
}
