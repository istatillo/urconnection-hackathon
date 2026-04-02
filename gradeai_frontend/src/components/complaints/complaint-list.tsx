import type { Complaint } from "@/types/complaint";
import { ComplaintCard } from "./complaint-card";
import { EmptyState } from "@/components/shared/empty-state";

interface ComplaintListProps {
  complaints: Complaint[];
}

export function ComplaintList({ complaints }: ComplaintListProps) {
  if (complaints.length === 0) {
    return <EmptyState title="Shikoyatlar yo'q" />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {complaints.map((c) => (
        <ComplaintCard key={c._id} complaint={c} />
      ))}
    </div>
  );
}
