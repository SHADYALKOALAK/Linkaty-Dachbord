import { NextResponse } from "next/server";

const SQL = `
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Links" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can read all users" ON "Users";
CREATE POLICY "Admin can read all users" ON "Users"
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can update any user" ON "Users";
CREATE POLICY "Admin can update any user" ON "Users"
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can delete users" ON "Users";
CREATE POLICY "Admin can delete users" ON "Users"
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can read all projects" ON "Projects";
CREATE POLICY "Admin can read all projects" ON "Projects"
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can delete projects" ON "Projects";
CREATE POLICY "Admin can delete projects" ON "Projects"
  FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can read all links" ON "Links";
CREATE POLICY "Admin can read all links" ON "Links"
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admin can delete links" ON "Links";
CREATE POLICY "Admin can delete links" ON "Links"
  FOR DELETE TO authenticated USING (true);
`;

export async function GET() {
  return NextResponse.json({
    message: "Run this SQL in Supabase Dashboard → SQL Editor to enable admin operations.",
    instructions: [
      "1. Open https://supabase.com/dashboard/project/uhvcsyhpmdqwtpjsixum/sql/new",
      "2. Paste the SQL below",
      "3. Click 'Run'",
      "4. Refresh your admin dashboard",
    ],
    sql: SQL.trim(),
  });
}
