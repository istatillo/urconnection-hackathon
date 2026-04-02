import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { useStudentProgress } from "@/hooks/use-ratings";
import { SUBMISSION_STATUS_LABELS } from "@/lib/constants";

interface StudentProgressProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
}

export function StudentProgress({
  open,
  onOpenChange,
  studentId,
}: StudentProgressProps) {
  const { data, isLoading } = useStudentProgress(studentId, open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Talaba natijalari</DialogTitle>
        </DialogHeader>
        {isLoading && <LoadingSpinner />}
        {data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
              <StatBlock label="Javoblar" value={data.total_submissions} />
              <StatBlock label="Topshiriqlar" value={data.total_tasks} />
              <StatBlock label="Yuborilmagan" value={data.not_submitted} />
              <StatBlock
                label="O'rtacha ball"
                value={data.average_score.toFixed(1)}
              />
            </div>
            <div className="max-h-64 overflow-y-auto rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      Topshiriq
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      Ball
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      Holat
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      Sana
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.progress.map((entry, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-3 py-2 text-xs">{entry.task.name}</td>
                      <td className="px-3 py-2">
                        <ScoreBadge score={entry.score} />
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="text-xs">
                          {SUBMISSION_STATUS_LABELS[entry.status]}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        {format(new Date(entry.submitted_at), "dd.MM.yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
