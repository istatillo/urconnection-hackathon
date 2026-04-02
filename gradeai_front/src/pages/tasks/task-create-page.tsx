import { PageHeader } from "@/components/shared/page-header";
import { CreateTaskForm } from "@/components/tasks/create-task-form";

export function TaskCreatePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Yangi topshiriq yaratish" />
      <CreateTaskForm />
    </div>
  );
}
