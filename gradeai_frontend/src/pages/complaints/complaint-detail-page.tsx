import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ImageIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorAlert } from "@/components/shared/error-alert";
import { ScoreBadge } from "@/components/shared/score-badge";
import { OverrideScoreForm } from "@/components/complaints/override-score-dialog";
import { useComplaint } from "@/hooks/use-complaints";
import { COMPLAINT_STATUS_LABELS } from "@/lib/constants";

export function ComplaintDetailPage() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const { data: complaint, isLoading, error } = useComplaint(complaintId!);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error || !complaint)
    return <ErrorAlert message="Shikoyatni yuklashda xatolik" />;

  const student = complaint.student;
  const isPending = complaint.status === "pending";

  return (
    <div className="space-y-6">
      <Link
        to="/complaints"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Shikoyatlar
      </Link>

      <PageHeader
        title={`${student.first_name} ${student.last_name} shikoyati`}
        description={
          <Badge
            variant={
              isPending
                ? "destructive"
                : complaint.status === "resolved"
                  ? "default"
                  : "secondary"
            }
          >
            {COMPLAINT_STATUS_LABELS[complaint.status]}
          </Badge>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shikoyat ma'lumoti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Sabab</p>
              <p className="text-sm">{complaint.reason}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Topshiriq
              </p>
              <p className="text-sm">{complaint.task.name}</p>
              {complaint.task.topic && (
                <p className="text-xs text-muted-foreground">
                  Mavzu: {complaint.task.topic}
                </p>
              )}
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  AI ball
                </p>
                <ScoreBadge score={complaint.submission.ai_score} />
              </div>
              {complaint.submission.override_score != null && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Yangi ball
                  </p>
                  <ScoreBadge score={complaint.submission.override_score} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {complaint.task.image_url && (
            <Card>
              <CardContent className="p-4">
                <p className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Topshiriq rasmi
                </p>
                <img
                  src={`/${complaint.task.image_url}`}
                  alt="Topshiriq"
                  className="max-h-48 cursor-pointer rounded-lg border object-contain transition-opacity hover:opacity-80"
                  onClick={() => setLightboxSrc(`/${complaint.task.image_url}`)}
                />
              </CardContent>
            </Card>
          )}

          {complaint.submission.answer_image && (
            <Card>
              <CardContent className="p-4">
                <p className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Talaba javobi
                </p>
                <img
                  src={`/${complaint.submission.answer_image}`}
                  alt="Javob"
                  className="max-h-48 cursor-pointer rounded-lg border object-contain transition-opacity hover:opacity-80"
                  onClick={() => setLightboxSrc(`/${complaint.submission.answer_image}`)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {complaint.submission.ai_comment && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI izohi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">
              {complaint.submission.ai_comment}
            </p>
          </CardContent>
        </Card>
      )}

      {isPending && (
        <OverrideScoreForm
          complaintId={complaintId!}
          currentScore={complaint.submission.ai_score}
        />
      )}

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            onClick={() => setLightboxSrc(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={lightboxSrc}
            alt="To'liq ko'rinish"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
