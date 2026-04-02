import { ScoreBadge } from "@/components/shared/score-badge";
import { EmptyState } from "@/components/shared/empty-state";
import type { GroupRatingEntry } from "@/types/rating";

interface GroupRatingTableProps {
  ratings: GroupRatingEntry[];
  onStudentClick?: (studentId: string) => void;
}

export function GroupRatingTable({
  ratings,
  onStudentClick,
}: GroupRatingTableProps) {
  if (ratings.length === 0) {
    return <EmptyState title="Reyting ma'lumoti yo'q" />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              #
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Talaba
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              Javoblar soni
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
              O'rtacha ball
            </th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((entry, index) => (
            <tr
              key={entry.student._id}
              className="cursor-pointer border-b transition-colors hover:bg-muted/50"
              onClick={() => onStudentClick?.(entry.student._id)}
            >
              <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
              <td className="px-4 py-3 text-sm">
                {entry.student.first_name} {entry.student.last_name}
              </td>
              <td className="px-4 py-3 text-sm">{entry.total_submissions}</td>
              <td className="px-4 py-3">
                <ScoreBadge score={entry.average_score} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
