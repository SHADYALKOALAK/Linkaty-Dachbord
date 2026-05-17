"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as usersService from "@/services/users";
import type { TableFilters } from "@/types";

export function useUsers(filters: TableFilters) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersService.getUsers(filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive, isVerified }: { userId: string; isActive: boolean; isVerified: boolean }) =>
      usersService.updateUserStatus(userId, isActive, isVerified),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
