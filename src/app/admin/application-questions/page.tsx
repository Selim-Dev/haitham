import { ApplicationQuestionsManager } from "@/components/admin/application-questions-manager";
import { listAllQuestions } from "@/services/application-question.service";
import { COPY } from "@/lib/arabic";

export const dynamic = "force-dynamic";

export default async function AdminApplicationQuestionsPage() {
  const questions = await listAllQuestions();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {COPY.admin.application.questions.listTitle}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {COPY.admin.application.questions.listSubtitle}
        </p>
      </header>

      <ApplicationQuestionsManager initial={questions} />
    </div>
  );
}
