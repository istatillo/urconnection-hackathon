import { Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InviteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteLink: string;
  inviteCode: string;
}

export function InviteLinkDialog({
  open,
  onOpenChange,
  inviteLink,
  inviteCode,
}: InviteLinkDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Taklif havolasi</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Bu havolani talabalar bilan ulashing
            </p>
            <div className="flex gap-2">
              <Input readOnly value={inviteLink} className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Kod: <span className="font-mono font-medium">{inviteCode}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
