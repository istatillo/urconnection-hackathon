import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGroup,
  freezeStudent,
  unfreezeStudent,
  getGroup,
  getGroups,
  getInviteLink,
  removeStudent,
  updateGroup,
} from "@/api/groups";
import type { CreateGroupRequest, UpdateGroupRequest } from "@/types/group";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => getGroup(id),
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGroupRequest) => createGroup(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups"] }),
  });
}

export function useUpdateGroup(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGroupRequest) => updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups", id] });
    },
  });
}

export function useFreezeStudent(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => freezeStudent(groupId, studentId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] }),
  });
}

export function useUnfreezeStudent(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => unfreezeStudent(groupId, studentId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] }),
  });
}

export function useRemoveStudent(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: string) => removeStudent(groupId, studentId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] }),
  });
}

export function useInviteLink(id: string) {
  return useQuery({
    queryKey: ["groups", id, "invite"],
    queryFn: () => getInviteLink(id),
    enabled: false,
  });
}
