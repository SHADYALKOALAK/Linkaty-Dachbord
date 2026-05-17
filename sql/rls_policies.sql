-- ============================================================
-- RLS Policies for Admin Dashboard
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Ensure RLS is enabled on all tables
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Links" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Users table policies
-- ============================================================

-- Allow admin to read all users
DROP POLICY IF EXISTS "Admin can read all users" ON "Users";
CREATE POLICY "Admin can read all users" ON "Users"
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow admin to update any user (for status toggles)
DROP POLICY IF EXISTS "Admin can update any user" ON "Users";
CREATE POLICY "Admin can update any user"
ON "Users"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);
-- Allow admin to delete users
DROP POLICY IF EXISTS "Admin can delete users" ON "Users";
CREATE POLICY "Admin can delete users" ON "Users"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Projects table policies
-- ============================================================

-- Allow admin to read all projects
DROP POLICY IF EXISTS "Admin can read all projects" ON "Projects";
CREATE POLICY "Admin can read all projects" ON "Projects"
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow admin to delete projects
DROP POLICY IF EXISTS "Admin can delete projects" ON "Projects";
CREATE POLICY "Admin can delete projects" ON "Projects"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Links table policies
-- ============================================================

-- Allow admin to read all links
DROP POLICY IF EXISTS "Admin can read all links" ON "Links";
CREATE POLICY "Admin can read all links" ON "Links"
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow admin to delete links
DROP POLICY IF EXISTS "Admin can delete links" ON "Links";
CREATE POLICY "Admin can delete links" ON "Links"
  FOR DELETE
  TO authenticated
  USING (true);
