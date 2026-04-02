import type { Student } from "./student";

export interface Complaint {
  _id: string;
  student: Student;
  task: {
    _id: string;
    name: string;
    topic?: string;
    context?: string;
    image_url?: string;
    deadline?: string;
  };
  submission: {
    _id: string;
    ai_score: number;
    ai_comment: string;
    ai_full_response?: string;
    answer_image?: string;
    override_score?: number;
    status: string;
  };
  reason: string;
  status: "pending" | "reviewed" | "resolved";
  resolved_by?: string;
  resolved_at?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OverrideRequest {
  new_score: number;
}
