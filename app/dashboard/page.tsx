"use client";

import { useDashboardStats } from "@/hooks/use-analytics";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentUsers } from "@/components/dashboard/recent-users";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserCog, FolderKanban, Link as LinkIcon } from "lucide-react";

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  const cards = [
    { title: "Total Users", value: stats?.total_users ?? 0, icon: Users },
    { title: "Active Users", value: stats?.active_users ?? 0, icon: UserCheck },
    { title: "Verified Users", value: stats?.verified_users ?? 0, icon: UserCog },
    { title: "Total Projects", value: stats?.total_projects ?? 0, icon: FolderKanban },
    { title: "Total Links", value: stats?.total_links ?? 0, icon: LinkIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your platform
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-20 mb-1" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      <RecentUsers />
    </div>
  );
}
