import { Link } from "react-router-dom";
import { Calendar, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TaskWithCount } from "@/types/task";
import { format } from "date-fns";

interface TaskCardProps {
  task: TaskWithCount;
}

export function TaskCard({ task }: TaskCardProps) {
  const groupName =
    typeof task.group === "object" ? task.group.name : "—";
  const isExpired = new Date(task.deadline) < new Date();

  return (
    <Link to={`/tasks/${task._id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-medium">{task.name}</h3>
            <Badge variant="outline" className="shrink-0">
              {groupName}
            </Badge>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className={isExpired ? "text-destructive" : ""}>
                {format(new Date(task.deadline), "dd.MM.yyyy HH:mm")}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              {task.submission_count} ta javob
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
