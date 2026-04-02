export interface Teacher {
  _id: string;
  name: string;
  phone: string;
  subject: string;
  gender: "male" | "female";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
}

export interface SignUpRequest {
  name: string;
  phone: string;
  subject: string;
  gender: "male" | "female";
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  subject?: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface RefreshResponse {
  success: boolean;
  access_token: string;
  refresh_token: string;
}
