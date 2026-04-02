import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { MembersTable } from "@/components/groups/members-table";
import { EditGroupDialog } from "@/components/groups/edit-group-dialog";
import { InviteLinkDialog } from "@/components/groups/invite-link-dialog";
import { GroupRatingTable } from "@/components/ratings/group-rating-table";
import { StudentProgress } from "@/components/ratings/student-progress";
import {
  useGroup,
  useFreezeStudent,
  useUnfreezeStudent,
  useRemoveStudent,
  useInviteLink,
} from "@/hooks/use-groups";
import { useGroupRating } from "@/hooks/use-ratings";
import { GROUP_STATUS_LABELS } from "@/lib/constants";

export function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading, error } = useGroup(groupId!);
  const freezeStudent = useFreezeStudent(groupId!);
  const unfreezeStudent = useUnfreezeStudent(groupId!);
  const removeStudent = useRemoveStudent(groupId!);
  const inviteLinkQuery = useInviteLink(groupId!);

  const { data: ratings } = useGroupRating(groupId!);

  const [editOpen, setEditOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: "freeze" | "unfreeze" | "remove";
    studentId: string;
  } | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error || !group) return <ErrorAlert message="Guruhni yuklashda xatolik" />;

  const handleInviteLink = async () => {
    const result = await inviteLinkQuery.refetch();
    if (result.data) {
      setInviteOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === "freeze") {
        await freezeStudent.mutateAsync(confirmAction.studentId);
        toast.success("Talaba muzlatildi");
      } else if (confirmAction.type === "unfreeze") {
        await unfreezeStudent.mutateAsync(confirmAction.studentId);
        toast.success("Talaba qaytarildi");
      } else {
        await removeStudent.mutateAsync(confirmAction.studentId);
        toast.success("Talaba o'chirildi");
      }
    } catch {
      toast.error("Xatolik yuz berdi");
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <Link
        to="/groups"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Guruhlar
      </Link>

      <PageHeader
        title={group.name}
        description={
          <Badge variant={group.status === "open" ? "default" : "secondary"}>
            {GROUP_STATUS_LABELS[group.status]}
          </Badge>
        }
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleInviteLink}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Taklif havolasi
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Tahrirlash
            </Button>
          </div>
        }
      />

      <div>
        <h2 className="mb-3 text-lg font-medium">
          A'zolar ({group.members.length})
        </h2>
        <MembersTable
          members={group.members}
          onFreeze={(studentId) =>
            setConfirmAction({ type: "freeze", studentId })
          }
          onUnfreeze={(studentId) =>
            setConfirmAction({ type: "unfreeze", studentId })
          }
          onRemove={(studentId) =>
            setConfirmAction({ type: "remove", studentId })
          }
        />
      </div>

      {ratings && ratings.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-medium">Reyting</h2>
          <GroupRatingTable
            ratings={ratings}
            onStudentClick={(id) => setSelectedStudentId(id)}
          />
        </div>
      )}

      {selectedStudentId && (
        <StudentProgress
          open={!!selectedStudentId}
          onOpenChange={() => setSelectedStudentId(null)}
          studentId={selectedStudentId}
        />
      )}

      <EditGroupDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        group={group}
      />

      {inviteLinkQuery.data && (
        <InviteLinkDialog
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          inviteLink={inviteLinkQuery.data.invite_link}
          inviteCode={inviteLinkQuery.data.invite_code}
        />
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
        title={
          confirmAction?.type === "freeze"
            ? "Talabani muzlatish"
            : confirmAction?.type === "unfreeze"
              ? "Talabani qaytarish"
              : "Talabani o'chirish"
        }
        description={
          confirmAction?.type === "freeze"
            ? "Bu talaba guruhda muzlatiladi va topshiriq yubora olmaydi."
            : confirmAction?.type === "unfreeze"
              ? "Bu talaba guruhda qayta faollashtiriladi."
              : "Bu talaba guruhdan o'chiriladi."
        }
        variant={confirmAction?.type === "remove" ? "destructive" : "default"}
        confirmLabel={
          confirmAction?.type === "freeze"
            ? "Muzlatish"
            : confirmAction?.type === "unfreeze"
              ? "Qaytarish"
              : "O'chirish"
        }
        loading={freezeStudent.isPending || unfreezeStudent.isPending || removeStudent.isPending}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
