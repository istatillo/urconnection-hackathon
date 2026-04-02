import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { GroupList } from "@/components/groups/group-list";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import { useGroups } from "@/hooks/use-groups";

export function GroupsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: groups, isLoading, error } = useGroups();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guruhlar"
        description="Guruhlaringizni boshqaring"
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi guruh
          </Button>
        }
      />
      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message="Guruhlarni yuklashda xatolik" />}
      {groups && <GroupList groups={groups} />}
      <CreateGroupDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
