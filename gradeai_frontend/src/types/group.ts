import type { Student } from "./student";

export interface Group {
  _id: string;
  name: string;
  status: "open" | "closed";
  invite_code: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupWithCount extends Group {
  member_count: number;
}

export interface GroupMember {
  _id: string;
  group: string;
  student: Student;
  status: "active" | "frozen" | "removed";
  joined_at: string;
}

export interface GroupDetail extends Group {
  members: GroupMember[];
}

export interface CreateGroupRequest {
  name: string;
}

export interface UpdateGroupRequest {
  name?: string;
  status?: "open" | "closed";
}

export interface InviteLinkResponse {
  invite_link: string;
  invite_code: string;
}
