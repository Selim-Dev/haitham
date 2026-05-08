import Link from "next/link";
import { LogIn, Upload, PlayCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COPY } from "@/lib/arabic";

export type AccessState =
  | "GUEST"
  | "NONE"
  | "PENDING"
  | "REJECTED"
  | "ENROLLED";

export function CourseCta({
  state,
  courseId,
  courseSlug,
}: {
  state: AccessState;
  courseId: string;
  courseSlug: string;
}) {
  switch (state) {
    case "GUEST":
      return (
        <Button asChild size="lg" variant="primary" className="w-full">
          <Link href={`/login?next=/courses/${courseSlug}`}>
            <LogIn className="size-4" />
            {COPY.courseDetail.notLoggedIn}
          </Link>
        </Button>
      );

    case "ENROLLED":
      return (
        <div className="flex flex-col gap-3">
          <Badge variant="success" className="w-fit px-3 py-1.5">
            لديك وصول مدى الحياة
          </Badge>
          <Button asChild size="lg" variant="primary" className="w-full">
            <Link href={`/dashboard/my-courses/${courseSlug}`}>
              <PlayCircle className="size-4" />
              {COPY.courseDetail.startLearning}
            </Link>
          </Button>
        </div>
      );

    case "PENDING":
      return (
        <div className="flex flex-col gap-3">
          <Badge variant="warning" className="w-fit px-3 py-1.5">
            <Clock className="size-3.5" />
            {COPY.courseDetail.pendingReview}
          </Badge>
          <Button size="lg" variant="secondary" disabled className="w-full">
            بانتظار موافقة الإدارة
          </Button>
        </div>
      );

    case "REJECTED":
      return (
        <div className="flex flex-col gap-3">
          <Badge variant="danger" className="w-fit px-3 py-1.5">
            <XCircle className="size-3.5" />
            {COPY.courseDetail.rejected}
          </Badge>
          <Button asChild size="lg" variant="primary" className="w-full">
            <Link href={`/dashboard/payment-proofs/new?courseId=${courseId}`}>
              <Upload className="size-4" />
              ارفع إيصال جديد
            </Link>
          </Button>
        </div>
      );

    case "NONE":
    default:
      return (
        <Button asChild size="lg" variant="primary" className="w-full">
          <Link href={`/dashboard/payment-proofs/new?courseId=${courseId}`}>
            <Upload className="size-4" />
            {COPY.courseDetail.uploadProof}
          </Link>
        </Button>
      );
  }
}
