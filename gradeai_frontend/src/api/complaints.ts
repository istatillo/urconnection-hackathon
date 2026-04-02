import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type { Complaint, OverrideRequest } from "@/types/complaint";

export async function getComplaints(): Promise<Complaint[]> {
  const res = await apiClient.get<ApiResponse<Complaint[]>>(
    "/api/complaint/get-all"
  );
  return res.data.data!;
}

export async function getComplaint(id: string): Promise<Complaint> {
  const res = await apiClient.get<ApiResponse<Complaint>>(
    `/api/complaint/get/${id}`
  );
  return res.data.data!;
}

export async function overrideScore(
  id: string,
  data: OverrideRequest
): Promise<ApiResponse> {
  const res = await apiClient.post<ApiResponse>(
    `/api/complaint/override/${id}`,
    data
  );
  return res.data;
}
