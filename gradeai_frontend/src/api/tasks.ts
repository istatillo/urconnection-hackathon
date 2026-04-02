import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type {
  TaskWithCount,
  TaskDetail,
  UpdateTaskRequest,
} from "@/types/task";

export async function getTasks(groupId?: string): Promise<TaskWithCount[]> {
  const params = groupId ? { group: groupId } : {};
  const res = await apiClient.get<ApiResponse<TaskWithCount[]>>(
    "/api/task/get-all",
    { params }
  );
  return res.data.data!;
}

export async function getTask(id: string): Promise<TaskDetail> {
  const res = await apiClient.get<ApiResponse<TaskDetail>>(
    `/api/task/get/${id}`
  );
  return res.data.data!;
}

export async function createTask(data: {
  name: string;
  group: string;
  deadline: string;
  image: File;
}): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("group", data.group);
  formData.append("deadline", data.deadline);
  formData.append("image", data.image);

  const res = await apiClient.post<ApiResponse>("/api/task/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export interface ImageAnalysisResult {
  suggested_name: string;
  description: string;
  topic: string;
  task_type: string;
}

export async function analyzeTaskImage(
  image: File
): Promise<ImageAnalysisResult> {
  const formData = new FormData();
  formData.append("image", image);

  const res = await apiClient.post<ApiResponse<ImageAnalysisResult>>(
    "/api/task/analyze-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data.data!;
}

export async function updateTask(
  id: string,
  data: UpdateTaskRequest
): Promise<ApiResponse> {
  const res = await apiClient.put<ApiResponse>(
    `/api/task/update/${id}`,
    data
  );
  return res.data;
}
