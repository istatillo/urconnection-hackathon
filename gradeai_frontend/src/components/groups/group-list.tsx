import type { GroupWithCount } from "@/types/group";
import { GroupCard } from "./group-card";
import { EmptyState } from "@/components/shared/empty-state";

interface GroupListProps {
  groups: GroupWithCount[];
}

export function GroupList({ groups }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <EmptyState
        title="Guruhlar yo'q"
        description="Yangi guruh yaratish uchun tugmani bosing"
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={group._id} group={group} />
      ))}
    </div>
  );
}
