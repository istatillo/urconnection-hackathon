import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { TaskList } from "@/components/tasks/task-list";
import { useTasks } from "@/hooks/use-tasks";
import { useGroups } from "@/hooks/use-groups";

export function TasksPage() {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const { data: tasks, isLoading, error } = useTasks(selectedGroup || undefined);
  const { data: groups } = useGroups();

  const groupItems = useMemo(() => {
    const map: Record<string, string> = { all: "Barcha guruhlar" };
    groups?.forEach((g) => { map[g._id] = g.name; });
    return map;
  }, [groups]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Topshiriqlar"
        description="Barcha topshiriqlarni boshqaring"
        action={
          <Button nativeButton={false} render={<Link to="/tasks/create" />}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi topshiriq
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <Select
          value={selectedGroup}
          onValueChange={(val) => setSelectedGroup(val === "all" ? "" : val)}
          items={groupItems}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Guruh bo'yicha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barcha guruhlar</SelectItem>
            {groups?.map((g) => (
              <SelectItem key={g._id} value={g._id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message="Topshiriqlarni yuklashda xatolik" />}
      {tasks && <TaskList tasks={tasks} />}
    </div>
  );
}
