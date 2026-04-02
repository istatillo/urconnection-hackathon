import { Snowflake, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GroupMember } from "@/types/group";
import { MEMBER_STATUS_LABELS } from "@/lib/constants";

interface MemberRowProps {
  member: GroupMember;
  onFreeze: (studentId: string) => void;
  onRemove: (studentId: string) => void;
}

export function MemberRow({ member, onFreeze, onRemove }: MemberRowProps) {
  const student = member.student;
  const isActive = member.status === "active";
  const isFrozen = member.status === "frozen";

  return (
    <tr className="border-b">
      <td className="px-4 py-3 text-sm">
        {student.first_name} {student.last_name}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {student.username ? `@${student.username}` : "—"}
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={
            isActive ? "default" : isFrozen ? "secondary" : "destructive"
          }
          className="text-xs"
        >
          {MEMBER_STATUS_LABELS[member.status]}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          {isActive && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Muzlatish"
              onClick={() => onFreeze(student._id)}
            >
              <Snowflake className="h-4 w-4 text-blue-500" />
            </Button>
          )}
          {(isActive || isFrozen) && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="O'chirish"
              onClick={() => onRemove(student._id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
