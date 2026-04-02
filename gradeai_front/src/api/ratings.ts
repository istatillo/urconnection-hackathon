import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type { GroupRatingEntry, StudentProgress } from "@/types/rating";

export async function getGroupRating(
  groupId: string
): Promise<GroupRatingEntry[]> {
  const res = await apiClient.get<ApiResponse<GroupRatingEntry[]>>(
    `/api/rating/group/${groupId}`
  );
  return res.data.data!;
}

export async function getStudentProgress(
  studentId: string
): Promise<StudentProgress> {
  const res = await apiClient.get<ApiResponse<StudentProgress>>(
    `/api/rating/student/${studentId}`
  );
  return res.data.data!;
}
