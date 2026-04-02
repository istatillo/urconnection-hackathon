import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/shared/score-badge";
import type { Complaint } from "@/types/complaint";
import { COMPLAINT_STATUS_LABELS } from "@/lib/constants";

interface ComplaintCardProps {
  complaint: Complaint;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const student = complaint.student;
  const statusVariant =
    complaint.status === "pending"
      ? "destructive"
      : complaint.status === "reviewed"
        ? "secondary"
        : "default";

  return (
    <Link to={`/complaints/${complaint._id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">
                {student.first_name} {student.last_name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {complaint.task.name}
              </p>
            </div>
            <Badge variant={statusVariant}>
              {COMPLAINT_STATUS_LABELS[complaint.status]}
            </Badge>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {complaint.reason}
            </p>
            <ScoreBadge score={complaint.submission.ai_score} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
