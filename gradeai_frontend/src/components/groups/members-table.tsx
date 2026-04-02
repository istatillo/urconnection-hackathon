import type { GroupMember } from "@/types/group";
import { MemberRow } from "./member-row";
import { EmptyState } from "@/components/shared/empty-state";

interface MembersTableProps {
  members: GroupMember[];
  onFreeze: (studentId: string) => void;
  onRemove: (studentId: string) => void;
}

export function MembersTable({
  members,
  onFreeze,
  onRemove,
}: MembersTableProps) {
  if (members.length === 0) {
    return <EmptyState title="A'zolar yo'q" />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Ism
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Username
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Holat
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Amallar
            </th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <MemberRow
              key={member._id}
              member={member}
              onFreeze={onFreeze}
              onRemove={onRemove}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
