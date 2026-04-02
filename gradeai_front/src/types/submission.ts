import type { Student } from "./student";

export interface Submission {
  _id: string;
  student: Student;
  task: string;
  answer_image: string;
  ai_score: number;
  ai_comment: string;
  ai_full_response: string;
  override_score?: number;
  override_by?: string;
  override_at?: string;
  status: "graded" | "complained" | "overridden";
  createdAt: string;
  updatedAt: string;
}
