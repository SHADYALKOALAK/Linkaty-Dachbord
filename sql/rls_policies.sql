-- ============================================================
-- RLS Policies for Admin Dashboard
-- ============================================================

-- Enable RLS
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Links" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS TABLE
-- ============================================================

-- Allow admin to read all users
DROP POLICY IF EXISTS "Admin can read all users" ON "Users";
CREATE POLICY "Admin can read all users" ON "Users"
FOR SELECT
TO authenticated
USING (true);

-- 👤 User can update own profile
DROP POLICY IF EXISTS "User can update own profile" ON "Users";
CREATE POLICY "User can update own profile" ON "Users"
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 🛡️ Admin can update any user (FIXED)
DROP POLICY IF EXISTS "Admin can update any user" ON "Users";
CREATE POLICY "Admin can update any user"
ON "Users"
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM "Users"
    WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM "Users"
    WHERE role = 'admin'
  )
);

-- Allow admin to delete users
DROP POLICY IF EXISTS "Admin can delete users" ON "Users";
CREATE POLICY "Admin can delete users" ON "Users"
FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================

DROP POLICY IF EXISTS "Admin can read all projects" ON "Projects";
CREATE POLICY "Admin can read all projects" ON "Projects"
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admin can delete projects" ON "Projects";
CREATE POLICY "Admin can delete projects" ON "Projects"
FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- LINKS TABLE
-- ============================================================

DROP POLICY IF EXISTS "Admin can read all links" ON "Links";
CREATE POLICY "Admin can read all links" ON "Links"
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admin can delete links" ON "Links";
CREATE POLICY "Admin can delete links" ON "Links"
FOR DELETE
TO authenticated
USING (true);