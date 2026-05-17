import { createClient } from "@/lib/supabase/client";
import type { Project, ProjectWithDetails } from "@/types";

async function attachOwnerNames<T extends { user_id: string }>(
  items: T[]
): Promise<(T & { owner_name: string })[]> {
  if (items.length === 0) return [];
  const supabase = createClient();
  const { data: users } = await supabase.from("Users").select("id, fullName");
  const userMap = new Map(users?.map((u) => [u.id, u.fullName]) || []);
  return items.map((item) => ({
    ...item,
    owner_name: userMap.get(item.user_id) || "",
  }));
}

export async function getAllProjects() {
  const supabase = createClient();
  const { data, error, count } = await supabase
    .from("Projects")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Projects] getAllProjects error:", error);
    throw error;
  }

  const mapped = await attachOwnerNames(data || []);
  console.log(`[Projects] getAllProjects: ${count} projects`);
  return { data: mapped as ProjectWithDetails[], count: count || 0 };
}

export async function getProjects(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}) {
  const supabase = createClient();
  const { search, page = 1, pageSize = 10, sortField = "created_at", sortDirection = "desc" } = params || {};

  let query = supabase.from("Projects").select("*", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order(sortField, { ascending: sortDirection === "asc" })
    .range(from, to);

  if (error) {
    console.error("[Projects] getProjects error:", error);
    throw error;
  }

  const mapped = await attachOwnerNames(data || []);
  console.log(`[Projects] getProjects: ${count} projects`);
  return { data: mapped as ProjectWithDetails[], count: count || 0 };
}

export async function getUserProjects(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("Projects").select("*").eq("user_id", userId).order("created_at", { ascending: false });

  if (error) {
    console.error("[Projects] getUserProjects error:", error);
    throw error;
  }
  return data || [];
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("Projects").delete().eq("id", id);
  if (error) throw error;
  console.log(`[Projects] deleteProject: ${id} deleted`);
}
