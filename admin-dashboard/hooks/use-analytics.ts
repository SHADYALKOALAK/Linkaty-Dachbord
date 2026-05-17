"use client";

import { useQuery } from "@tanstack/react-query";
import * as analyticsService from "@/services/analytics";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => analyticsService.getDashboardStats(),
    refetchInterval: 30000,
  });
}
