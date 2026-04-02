import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { SUBMISSION_STATUS_LABELS } from "@/lib/constants";
import type { Submission } from "@/types/submission";

interface SubmissionDetailDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmissionDetailDialog({
  submission,
  open,
  onOpenChange,
}: SubmissionDetailDialogProps) {
  if (!submission) return null;

  const student = submission.student;
  const score =
    submission.override_score != null
      ? submission.override_score
      : submission.ai_score;
  const isOverridden = submission.override_score != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {student.first_name} {student.last_name}
            {student.username && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                @{student.username}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            <span className="inline-flex items-center gap-2">
              <ScoreBadge score={score} />
              {isOverridden && (
                <span className="text-xs text-muted-foreground">
                  (qayta baholangan)
                </span>
              )}
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
            </span>
          </DialogDescription>
        </DialogHeader>

        {submission.answer_image && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              O'quvchi yuborgan rasm
            </p>
            <img
              src={`/${submission.answer_image}`}
              alt="O'quvchi javobi"
              className="w-full rounded-lg border object-contain"
            />
          </div>
        )}

        {submission.ai_comment && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              AI izohi
            </p>
            <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-sm">
              {submission.ai_comment}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
