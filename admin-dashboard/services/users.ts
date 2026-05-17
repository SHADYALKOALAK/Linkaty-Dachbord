import { createClient } from "@/lib/supabase/client";
import type { User, UserWithCounts } from "@/types";

export async function getUsers(params?: {
  search?: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}) {
  const supabase = createClient();
  const { search, page = 1, pageSize = 10, sortField = "created_at", sortDirection = "desc" } = params || {};

  let query = supabase.from("Users").select("*", { count: "exact" });

  if (search) {
    query = query.or(`fullName.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order(sortField, { ascending: sortDirection === "asc" })
    .range(from, to);

  if (error) {
    console.error("[Users] getUsers error:", error);
    throw error;
  }

  console.log(`[Users] getUsers: ${count} users found`);
  return { data: data as User[], count: count || 0 };
}

export async function getAllUsers() {
  const supabase = createClient();
  const { data, error, count } = await supabase
    .from("Users")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Users] getAllUsers error:", error);
    throw error;
  }

  console.log(`[Users] getAllUsers: ${count} users`);
  return { data: data as User[], count: count || 0 };
}

export async function getUserById(id: string): Promise<UserWithCounts | null> {
  const supabase = createClient();
  const { data: user } = await supabase.from("Users").select("*").eq("id", id).single();
  if (!user) return null;

  const { count: projectCount } = await supabase.from("Projects").select("*", { count: "exact", head: true }).eq("user_id", id);
  const { count: linkCount } = await supabase.from("Links").select("*", { count: "exact", head: true }).eq("user_id", id);

  return { ...user, project_count: projectCount || 0, link_count: linkCount || 0 } as UserWithCounts;
}

export async function updateUserStatus(userId: string, isActive: boolean, isVerified: boolean) {
  console.log("[Users] updateUserStatus called:", { userId, isActive, isVerified });

  const supabase = createClient();

  const payload: Record<string, boolean> = {
    is_profile_active: isActive,
    isVerified: isVerified,
  };
  console.log("[Users] update payload:", JSON.stringify(payload));

  const response = await supabase
    .from("Users")
    .update(payload)
    .eq("id", userId)
    .select();

  console.log("[Users] raw response:", JSON.stringify(response, null, 2));

  const { data, error } = response;

  if (error) {
    console.error("[Users] update error:", { code: error.code, message: error.message, details: error.details, hint: error.hint });

    if (error.code === "42501") {
      const err = new Error(
        "Permission denied by Row Level Security (RLS). " +
        "Open Supabase Dashboard → SQL Editor → paste and run the SQL from sql/rls_policies.sql"
      ) as Error & { code?: string };
      err.code = "RLS_ERROR";
      throw err;
    }

    if (error.code === "42703") {
      throw new Error(`Invalid column name in update payload: ${error.message}. Check that "isVerified" is spelled correctly in the database.`);
    }

    throw new Error(`Supabase error [${error.code}]: ${error.message}${error.details ? ` | ${error.details}` : ""}`);
  }

  if (!data || data.length === 0) {
    // Diagnostic: why did the UPDATE return 0 rows?
    const { data: existingUser } = await supabase
      .from("Users")
      .select("id, fullName")
      .eq("id", userId)
      .maybeSingle();

    if (existingUser) {
      console.error("[Users] UPDATE returned 0 rows but user EXISTS — RLS silently blocked the update.");
      const err = new Error(
        "Update blocked by Row Level Security (RLS). " +
        "Although SELECT works, UPDATE is denied because no UPDATE policy exists or it is not applied. " +
        "Open Supabase Dashboard → SQL Editor → run the SQL from sql/rls_policies.sql"
      ) as Error & { code?: string };
      err.code = "RLS_ERROR";
      throw err;
    }

    console.error("[Users] UPDATE returned 0 rows because userId does not exist in DB:", userId);
    throw new Error(`User not found: no user with id "${userId}" exists in the "Users" table.`);
  }

  console.log("[Users] update succeeded:", data[0]);
  return data[0] as User;
}

export async function deleteUser(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("Users").delete().eq("id", id);
  if (error) {
    console.error("[Users] deleteUser error:", error);
    throw error;
  }
  console.log(`[Users] deleteUser: ${id} deleted`);
}
