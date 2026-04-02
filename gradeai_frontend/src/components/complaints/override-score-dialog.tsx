import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useOverrideScore } from "@/hooks/use-complaints";

interface OverrideScoreFormProps {
  complaintId: string;
  currentScore: number;
}

export function OverrideScoreForm({
  complaintId,
  currentScore,
}: OverrideScoreFormProps) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(currentScore.toString());
  const [message, setMessage] = useState("");
  const override = useOverrideScore(complaintId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      toast.error("Ball 0 dan 10 gacha bo'lishi kerak");
      return;
    }
    try {
      await override.mutateAsync({
        new_score: numScore,
        message: message.trim() || undefined,
      });
      toast.success("Ball yangilandi va o'quvchiga xabar yuborildi");
      setOpen(false);
      setMessage("");
    } catch {
      toast.error("Ballni yangilashda xatolik");
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>Ballni qayta belgilash</Button>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-score">Yangi ball (0–10)</Label>
            <Input
              id="new-score"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="Yangi ball kiriting"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher-message">
              O'quvchiga xabar{" "}
              <span className="text-muted-foreground font-normal">
                (ixtiyoriy)
              </span>
            </Label>
            <Textarea
              id="teacher-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="O'quvchiga xabar yozing..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={override.isPending}>
              {override.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Saqlash va yuborish
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Bekor qilish
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
