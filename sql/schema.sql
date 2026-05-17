-- Admin Dashboard Database Schema
-- Run this in your Supabase SQL editor
-- MATCHES YOUR EXACT TABLE STRUCTURES

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS "Users" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  "fullName" TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  image TEXT,
  bio TEXT,
  "typeOfJop" TEXT,
  location TEXT,
  specialization TEXT,
  is_profile_active BOOLEAN DEFAULT false,
  "isVerified" BOOLEAN DEFAULT false
);

-- ==================== PROJECTS TABLE ====================
CREATE TABLE IF NOT EXISTS "Projects" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  description TEXT,
  link TEXT,
  image TEXT,
  user_id UUID DEFAULT auth.uid() REFERENCES "Users"(id) ON DELETE CASCADE
);

-- ==================== LINKS TABLE ====================
CREATE TABLE IF NOT EXISTS "Links" (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  user_id UUID DEFAULT auth.uid() REFERENCES "Users"(id) ON DELETE CASCADE
);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_users_email ON "Users"(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON "Users"(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON "Projects"(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON "Projects"(created_at);
CREATE INDEX IF NOT EXISTS idx_links_user_id ON "Links"(user_id);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON "Links"(created_at);

-- ==================== ROW LEVEL SECURITY ====================
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Links" ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data, admins to read all
CREATE POLICY "Users can view own profile"
  ON "Users" FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update own profile
CREATE POLICY "Users can update own profile"
  ON "Users" FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Projects: users can CRUD their own
CREATE POLICY "Users can manage own projects"
  ON "Projects" FOR ALL
  USING (auth.uid() = user_id);

-- Links: users can CRUD their own
CREATE POLICY "Users can manage own links"
  ON "Links" FOR ALL
  USING (auth.uid() = user_id);

-- ==================== VIEWS FOR ADMIN DASHBOARD ====================
CREATE OR REPLACE VIEW "UserStats" AS
SELECT
  u.id,
  u."fullName",
  u.email,
  u.image,
  u."typeOfJop",
  u.location,
  u.specialization,
  u.is_profile_active,
  u."isVerified",
  u.created_at,
  COUNT(DISTINCT p.id)::BIGINT AS project_count,
  COUNT(DISTINCT l.id)::BIGINT AS link_count
FROM "Users" u
LEFT JOIN "Projects" p ON p.user_id = u.id
LEFT JOIN "Links" l ON l.user_id = u.id
GROUP BY u.id;

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_projects BIGINT,
  total_links BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM "Users")::BIGINT,
    (SELECT COUNT(*) FROM "Projects")::BIGINT,
    (SELECT COUNT(*) FROM "Links")::BIGINT;
END;
$$;
