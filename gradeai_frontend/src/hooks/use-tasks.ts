import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  analyzeTaskImage,
  createTask,
  getTask,
  getTasks,
  updateTask,
} from "@/api/tasks";
import type { UpdateTaskRequest } from "@/types/task";

export function useTasks(groupId?: string) {
  return useQuery({
    queryKey: ["tasks", groupId ?? "all"],
    queryFn: () => getTasks(groupId),
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["tasks", "detail", id],
    queryFn: () => getTask(id),
    enabled: !!id,
  });
}

export function useAnalyzeTaskImage() {
  return useMutation({
    mutationFn: analyzeTaskImage,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTaskRequest) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "detail", id] });
    },
  });
}
