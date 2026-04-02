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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateGroup } from "@/hooks/use-groups";
import type { GroupDetail } from "@/types/group";

interface EditGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: GroupDetail;
}

export function EditGroupDialog({
  open,
  onOpenChange,
  group,
}: EditGroupDialogProps) {
  const [name, setName] = useState(group.name);
  const [status, setStatus] = useState(group.status);
  const updateGroup = useUpdateGroup(group._id);

  useEffect(() => {
    setName(group.name);
    setStatus(group.status);
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateGroup.mutateAsync({ name: name.trim(), status });
      toast.success("Guruh yangilandi");
      onOpenChange(false);
    } catch {
      toast.error("Guruhni yangilashda xatolik");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Guruhni tahrirlash</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-group-name">Guruh nomi</Label>
              <Input
                id="edit-group-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Holat</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as "open" | "closed")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Ochiq</SelectItem>
                  <SelectItem value="closed">Yopiq</SelectItem>
                </SelectContent>
              </Select>
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
            <Button type="submit" disabled={updateGroup.isPending}>
              {updateGroup.isPending && (
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
