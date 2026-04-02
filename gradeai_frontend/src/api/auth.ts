import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  Teacher,
  UpdatePasswordRequest,
  UpdateProfileRequest,
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>("/api/auth/login", data);
  return res.data;
}

export async function signUp(data: SignUpRequest): Promise<ApiResponse> {
  const res = await apiClient.post<ApiResponse>("/api/auth/sign-up", data);
  return res.data;
}

export async function getMe(): Promise<Teacher> {
  const res = await apiClient.get<ApiResponse<Teacher>>("/api/auth/me");
  return res.data.data!;
}

export async function updateProfile(
  data: UpdateProfileRequest
): Promise<ApiResponse> {
  const res = await apiClient.put<ApiResponse>("/api/auth/update", data);
  return res.data;
}

export async function updatePassword(
  data: UpdatePasswordRequest
): Promise<ApiResponse> {
  const res = await apiClient.put<ApiResponse>(
    "/api/auth/update-password",
    data
  );
  return res.data;
}
