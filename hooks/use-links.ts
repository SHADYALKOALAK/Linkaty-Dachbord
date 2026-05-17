"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as linksService from "@/services/links";
import type { TableFilters } from "@/types";

export function useAllLinks() {
  return useQuery({
    queryKey: ["all-links"],
    queryFn: () => linksService.getAllLinks(),
  });
}

export function useLinks(filters: TableFilters) {
  return useQuery({
    queryKey: ["links", filters],
    queryFn: () => linksService.getLinks(filters),
  });
}

export function useUserLinks(userId: string) {
  return useQuery({
    queryKey: ["user-links", userId],
    queryFn: () => linksService.getUserLinks(userId),
    enabled: !!userId,
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => linksService.deleteLink(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["all-links"] });
    },
  });
}
