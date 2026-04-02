import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Edit, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { SubmissionsTable } from "@/components/tasks/submissions-table";
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog";
import { useTask } from "@/hooks/use-tasks";

export function TaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const { data: task, isLoading, error } = useTask(taskId!);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (error || !task) return <ErrorAlert message="Topshiriqni yuklashda xatolik" />;

  const groupName = typeof task.group === "object" ? task.group.name : "—";

  return (
    <div className="space-y-6">
      <Link
        to="/tasks"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Topshiriqlar
      </Link>

      <PageHeader
        title={task.name}
        action={
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Tahrirlash
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{groupName}</Badge>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(task.deadline), "dd.MM.yyyy HH:mm")}
              </span>
            </div>
            {task.topic && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Mavzu</p>
                <p className="text-sm">{task.topic}</p>
              </div>
            )}
            {task.context && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Kontekst (AI tahlili)
                </p>
                <p className="whitespace-pre-wrap text-sm">{task.context}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {task.image_url && (
          <Card>
            <CardContent className="p-4">
              <p className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5" />
                Topshiriq rasmi
              </p>
              <img
                src={`/${task.image_url}`}
                alt="Topshiriq"
                className="max-h-64 rounded-lg border object-contain"
              />
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">
          Javoblar ({task.submissions.length})
        </h2>
        <SubmissionsTable submissions={task.submissions} />
      </div>

      <EditTaskDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        task={task}
      />
    </div>
  );
}
