import { useQuery } from "@tanstack/react-query";
import { getGroupRating, getStudentProgress } from "@/api/ratings";

export function useGroupRating(groupId: string) {
  return useQuery({
    queryKey: ["rating", "group", groupId],
    queryFn: () => getGroupRating(groupId),
    enabled: !!groupId,
  });
}

export function useStudentProgress(studentId: string, enabled = true) {
  return useQuery({
    queryKey: ["rating", "student", studentId],
    queryFn: () => getStudentProgress(studentId),
    enabled: !!studentId && enabled,
  });
}
