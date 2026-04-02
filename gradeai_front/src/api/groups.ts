import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";
import type {
  CreateGroupRequest,
  GroupDetail,
  GroupWithCount,
  InviteLinkResponse,
  UpdateGroupRequest,
} from "@/types/group";

export async function getGroups(): Promise<GroupWithCount[]> {
  const res =
    await apiClient.get<ApiResponse<GroupWithCount[]>>("/api/group/get-all");
  return res.data.data!;
}

export async function getGroup(id: string): Promise<GroupDetail> {
  const res = await apiClient.get<ApiResponse<GroupDetail>>(
    `/api/group/get/${id}`
  );
  return res.data.data!;
}

export async function createGroup(
  data: CreateGroupRequest
): Promise<ApiResponse> {
  const res = await apiClient.post<ApiResponse>("/api/group/create", data);
  return res.data;
}

export async function updateGroup(
  id: string,
  data: UpdateGroupRequest
): Promise<ApiResponse> {
  const res = await apiClient.put<ApiResponse>(
    `/api/group/update/${id}`,
    data
  );
  return res.data;
}

export async function freezeStudent(
  groupId: string,
  studentId: string
): Promise<ApiResponse> {
  const res = await apiClient.patch<ApiResponse>(
    `/api/group/freeze/${groupId}/${studentId}`
  );
  return res.data;
}

export async function removeStudent(
  groupId: string,
  studentId: string
): Promise<ApiResponse> {
  const res = await apiClient.delete<ApiResponse>(
    `/api/group/remove/${groupId}/${studentId}`
  );
  return res.data;
}

export async function getInviteLink(
  id: string
): Promise<InviteLinkResponse> {
  const res = await apiClient.get<ApiResponse<InviteLinkResponse>>(
    `/api/group/invite-link/${id}`
  );
  return res.data.data!;
}
