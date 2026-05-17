export interface User {
  id: string;
  created_at: string;
  fullName: string;
  email: string;
  image: string | null;
  bio: string | null;
  typeOfJop: string | null;
  location: string | null;
  specialization: string | null;
  is_profile_active: boolean;
  isVerified: boolean;
}

export interface UserWithCounts extends User {
  project_count: number;
  link_count: number;
}

export interface Project {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  link: string | null;
  image: string | null;
  user_id: string;
}

export interface ProjectWithDetails extends Project {
  owner_name: string;
  owner_email: string;
  owner_image: string | null;
  link_count: number;
}

export interface Link {
  id: number;
  created_at: string;
  name: string;
  link: string;
  user_id: string;
}

export interface LinkWithDetails extends Link {
  owner_name: string;
  owner_email: string;
  owner_image: string | null;
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  verified_users: number;
  total_projects: number;
  total_links: number;
}

export interface TableFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: "asc" | "desc";
}
