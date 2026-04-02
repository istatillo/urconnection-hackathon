import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import type { Submission } from "@/types/submission";
import { SUBMISSION_STATUS_LABELS } from "@/lib/constants";

interface SubmissionRowProps {
  submission: Submission;
  onClick?: () => void;
}

export function SubmissionRow({ submission, onClick }: SubmissionRowProps) {
  const student = submission.student;
  const score =
    submission.override_score != null
      ? submission.override_score
      : submission.ai_score;
  const isOverridden = submission.override_score != null;

  return (
    <tr className="border-b cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
      <td className="px-4 py-3 text-sm">
        {student.first_name} {student.last_name}
      </td>
      <td className="px-4 py-3 text-sm">
        {student.username ? `@${student.username}` : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <ScoreBadge score={score} />
          {isOverridden && (
            <span className="text-xs text-muted-foreground">(qayta)</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={
            submission.status === "graded"
              ? "default"
              : submission.status === "complained"
                ? "destructive"
                : "secondary"
          }
          className="text-xs"
        >
          {SUBMISSION_STATUS_LABELS[submission.status]}
        </Badge>
      </td>
      <td className="max-w-[200px] truncate px-4 py-3 text-xs text-muted-foreground">
        {submission.ai_comment || "—"}
      </td>
    </tr>
  );
}
