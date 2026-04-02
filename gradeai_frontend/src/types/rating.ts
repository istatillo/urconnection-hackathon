import type { Student } from "./student";

export interface GroupRatingEntry {
  student: Student;
  total_submissions: number;
  average_score: number;
}

export interface StudentProgress {
  total_submissions: number;
  total_tasks: number;
  not_submitted: number;
  complained: number;
  average_score: number;
  progress: StudentProgressEntry[];
}

export interface StudentProgressEntry {
  task: {
    _id: string;
    name: string;
    group: { _id: string; name: string };
  };
  score: number;
  status: "graded" | "complained" | "overridden";
  submitted_at: string;
}
