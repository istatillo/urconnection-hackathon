import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateTask } from "@/hooks/use-tasks";
import type { TaskDetail } from "@/types/task";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskDetail;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
}: EditTaskDialogProps) {
  const [name, setName] = useState(task.name);
  const [topic, setTopic] = useState(task.topic || "");
  const [context, setContext] = useState(task.context || "");
  const [deadline, setDeadline] = useState(
    task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ""
  );
  const updateTask = useUpdateTask(task._id);

  useEffect(() => {
    setName(task.name);
    setTopic(task.topic || "");
    setContext(task.context || "");
    setDeadline(
      task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ""
    );
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTask.mutateAsync({
        name: name.trim(),
        topic: topic.trim() || undefined,
        context: context.trim() || undefined,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
      });
      toast.success("Topshiriq yangilandi");
      onOpenChange(false);
    } catch {
      toast.error("Topshiriqni yangilashda xatolik");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Topshiriqni tahrirlash</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-task-name">Nomi</Label>
              <Input
                id="edit-task-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task-topic">Mavzu</Label>
              <Input
                id="edit-task-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task-context">Kontekst</Label>
              <Textarea
                id="edit-task-context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-task-deadline">Muddat</Label>
              <Input
                id="edit-task-deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={updateTask.isPending}>
              {updateTask.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Saqlash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
