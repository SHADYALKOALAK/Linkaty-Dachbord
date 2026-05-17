import { createClient } from "@/lib/supabase/client";
import type { DashboardStats } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  const { count: totalUsers } = await supabase
    .from("Users")
    .select("*", { count: "exact", head: true });

  const { count: activeUsers } = await supabase
    .from("Users")
    .select("*", { count: "exact", head: true })
    .eq("is_profile_active", true);

  const { count: verifiedUsers } = await supabase
    .from("Users")
    .select("*", { count: "exact", head: true })
    .eq("isVerified", true);

  const { count: totalProjects } = await supabase
    .from("Projects")
    .select("*", { count: "exact", head: true });

  const { count: totalLinks } = await supabase
    .from("Links")
    .select("*", { count: "exact", head: true });

  return {
    total_users: totalUsers || 0,
    active_users: activeUsers || 0,
    verified_users: verifiedUsers || 0,
    total_projects: totalProjects || 0,
    total_links: totalLinks || 0,
  };
}
