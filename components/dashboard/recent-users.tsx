"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateRelative, getInitials } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function RecentUsers() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["recent-users"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("Users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Users</CardTitle>
        <Link
          href="/dashboard/users"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : users?.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No users yet
          </div>
        ) : (
          <div className="space-y-4">
            {users?.map((user) => (
              <Link
                key={user.id}
                href={`/dashboard/users/${user.id}`}
                className="flex items-center gap-3 group"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="text-xs">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={user.is_profile_active ? "success" : "secondary"}
                  >
                    {user.is_profile_active ? "Active" : "Inactive"}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDateRelative(user.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
