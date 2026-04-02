import type { Submission } from "./submission";

export interface Task {
  _id: string;
  name: string;
  image_url: string;
  topic: string;
  context: string;
  group: { _id: string; name: string } | string;
  teacher: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskWithCount extends Task {
  submission_count: number;
}

export interface TaskDetail extends Task {
  submissions: Submission[];
}

export interface CreateTaskRequest {
  name: string;
  group: string;
  deadline: string;
  image: File;
}

export interface UpdateTaskRequest {
  name?: string;
  topic?: string;
  context?: string;
  deadline?: string;
}
