import type { TaskWithCount } from "@/types/task";
import { TaskCard } from "./task-card";
import { EmptyState } from "@/components/shared/empty-state";

interface TaskListProps {
  tasks: TaskWithCount[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="Topshiriqlar yo'q"
        description="Yangi topshiriq yaratish uchun tugmani bosing"
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
