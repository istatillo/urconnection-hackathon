import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getComplaint, getComplaints, overrideScore } from "@/api/complaints";
import type { OverrideRequest } from "@/types/complaint";

export function useComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: getComplaints,
  });
}

export function useComplaint(id: string) {
  return useQuery({
    queryKey: ["complaints", id],
    queryFn: () => getComplaint(id),
    enabled: !!id,
  });
}

export function useOverrideScore(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OverrideRequest) => overrideScore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      queryClient.invalidateQueries({ queryKey: ["complaints", id] });
    },
  });
}
