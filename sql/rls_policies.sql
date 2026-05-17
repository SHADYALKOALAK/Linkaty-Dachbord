
-- ============================================================
-- ENABLE RLS
-- ============================================================

ALTER TABLE "public"."Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Links" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS TABLE
-- ============================================================

-- READ USERS (ADMIN ONLY)
DROP POLICY IF EXISTS "Admin can read all users" ON "public"."Users";
CREATE POLICY "Admin can read all users"
ON "public"."Users"
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- UPDATE USERS (ADMIN ONLY)
DROP POLICY IF EXISTS "Admin can update any user" ON "public"."Users";
CREATE POLICY "Admin can update any user"
ON "public"."Users"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- DELETE USERS (ADMIN ONLY)
DROP POLICY IF EXISTS "Admin can delete users" ON "public"."Users";
CREATE POLICY "Admin can delete users"
ON "public"."Users"
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================

-- READ PROJECTS
DROP POLICY IF EXISTS "Read projects" ON "public"."Projects";
CREATE POLICY "Read projects"
ON "public"."Projects"
FOR SELECT
TO authenticated
USING (true);

-- DELETE PROJECTS
DROP POLICY IF EXISTS "Delete projects" ON "public"."Projects";
CREATE POLICY "Delete projects"
ON "public"."Projects"
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- UPDATE PROJECTS
DROP POLICY IF EXISTS "Update projects" ON "public"."Projects";
CREATE POLICY "Update projects"
ON "public"."Projects"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- INSERT PROJECTS
DROP POLICY IF EXISTS "Insert projects" ON "public"."Projects";
CREATE POLICY "Insert projects"
ON "public"."Projects"
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "public"."Users u"
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- ============================================================
-- LINKS TABLE
-- ============================================================

-- READ LINKS
DROP POLICY IF EXISTS "Read links" ON "public"."Links";
CREATE POLICY "Read links"
ON "public"."Links"
FOR SELECT
TO authenticated
USING (true);

-- DELETE LINKS
DROP POLICY IF EXISTS "Delete links" ON "public"."Links";
CREATE POLICY "Delete links"
ON "public"."Links"
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- UPDATE LINKS
DROP POLICY IF EXISTS "Update links" ON "public"."Links";
CREATE POLICY "Update links"
ON "public"."Links"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- INSERT LINKS
DROP POLICY IF EXISTS "Insert links" ON "public"."Links";
CREATE POLICY "Insert links"
ON "public"."Links"
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM "public"."Users" u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);
