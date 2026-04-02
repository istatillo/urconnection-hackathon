import { useState } from "react";
import type { Submission } from "@/types/submission";
import { SubmissionRow } from "./submission-row";
import { EmptyState } from "@/components/shared/empty-state";
import { SubmissionDetailDialog } from "./submission-detail-dialog";

interface SubmissionsTableProps {
  submissions: Submission[];
}

export function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  const [selected, setSelected] = useState<Submission | null>(null);

  if (submissions.length === 0) {
    return <EmptyState title="Javoblar yo'q" />;
  }

  return (
    <>
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
                Ball
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Holat
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                AI izoh
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <SubmissionRow
                key={sub._id}
                submission={sub}
                onClick={() => setSelected(sub)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <SubmissionDetailDialog
        submission={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
