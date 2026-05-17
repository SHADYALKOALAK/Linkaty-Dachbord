"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as projectsService from "@/services/projects";
import type { TableFilters } from "@/types";

export function useAllProjects() {
  return useQuery({
    queryKey: ["all-projects"],
    queryFn: () => projectsService.getAllProjects(),
  });
}

export function useProjects(filters: TableFilters) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: () => projectsService.getProjects(filters),
  });
}

export function useUserProjects(userId: string) {
  return useQuery({
    queryKey: ["user-projects", userId],
    queryFn: () => projectsService.getUserProjects(userId),
    enabled: !!userId,
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
    },
  });
}
