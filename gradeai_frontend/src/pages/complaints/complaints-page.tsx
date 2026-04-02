import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { ComplaintList } from "@/components/complaints/complaint-list";
import { useComplaints } from "@/hooks/use-complaints";

export function ComplaintsPage() {
  const { data: complaints, isLoading, error } = useComplaints();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shikoyatlar"
        description="Talabalar shikoyatlarini ko'rib chiqing"
      />
      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message="Shikoyatlarni yuklashda xatolik" />}
      {complaints && <ComplaintList complaints={complaints} />}
    </div>
  );
}
