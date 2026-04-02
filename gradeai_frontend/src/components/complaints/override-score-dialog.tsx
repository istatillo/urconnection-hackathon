import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOverrideScore } from "@/hooks/use-complaints";

interface OverrideScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaintId: string;
  currentScore: number;
}

export function OverrideScoreDialog({
  open,
  onOpenChange,
  complaintId,
  currentScore,
}: OverrideScoreDialogProps) {
  const [score, setScore] = useState(currentScore.toString());
  const override = useOverrideScore(complaintId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      toast.error("Ball 0 dan 10 gacha bo'lishi kerak");
      return;
    }
    try {
      await override.mutateAsync({ new_score: numScore });
      toast.success("Ball yangilandi");
      onOpenChange(false);
    } catch {
      toast.error("Ballni yangilashda xatolik");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ballni qayta belgilash</DialogTitle>
          <DialogDescription>
            Yangi ball kiriting (0 dan 10 gacha)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-score">Yangi ball</Label>
              <Input
                id="new-score"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={score}
                onChange={(e) => setScore(e.target.value)}
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
            <Button type="submit" disabled={override.isPending}>
              {override.isPending && (
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
