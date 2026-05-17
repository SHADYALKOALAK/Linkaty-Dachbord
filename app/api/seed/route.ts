import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const now = new Date().toISOString();
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

const users = [
  { id: "d1a2b3c4-0001-4000-8000-000000000001", created_at: thirtyDaysAgo, fullName: "Ahmed Al-Mansouri", email: "ahmed@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ahmed", bio: "Full-stack developer", typeOfJop: "Developer", location: "Dubai, UAE", specialization: "Web Development", is_profile_active: true, isVerified: true },
  { id: "d1a2b3c4-0002-4000-8000-000000000002", created_at: thirtyDaysAgo, fullName: "Sara Al-Fahad", email: "sara@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sara", bio: "UI/UX Designer", typeOfJop: "Designer", location: "Riyadh, KSA", specialization: "UX Design", is_profile_active: true, isVerified: true },
  { id: "d1a2b3c4-0003-4000-8000-000000000003", created_at: thirtyDaysAgo, fullName: "Mohammed Al-Qahtani", email: "mohammed@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mohammed", bio: "DevOps Engineer", typeOfJop: "Engineer", location: "Jeddah, KSA", specialization: "Cloud Infrastructure", is_profile_active: true, isVerified: false },
  { id: "d1a2b3c4-0004-4000-8000-000000000004", created_at: thirtyDaysAgo, fullName: "Nora Al-Saud", email: "nora@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Nora", bio: "Data Scientist", typeOfJop: "Scientist", location: "Doha, Qatar", specialization: "Machine Learning", is_profile_active: false, isVerified: true },
  { id: "d1a2b3c4-0005-4000-8000-000000000005", created_at: thirtyDaysAgo, fullName: "Khalid Al-Otaibi", email: "khalid@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Khalid", bio: "Product Manager", typeOfJop: "Manager", location: "Kuwait City, Kuwait", specialization: "Product Strategy", is_profile_active: true, isVerified: false },
  { id: "d1a2b3c4-0006-4000-8000-000000000006", created_at: thirtyDaysAgo, fullName: "Layla Al-Harbi", email: "layla@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Layla", bio: "Frontend Developer", typeOfJop: "Developer", location: "Manama, Bahrain", specialization: "React/Next.js", is_profile_active: true, isVerified: true },
  { id: "d1a2b3c4-0007-4000-8000-000000000007", created_at: thirtyDaysAgo, fullName: "Faisal Al-Dosari", email: "faisal@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Faisal", bio: "Backend Developer", typeOfJop: "Developer", location: "Muscat, Oman", specialization: "Node.js/Python", is_profile_active: false, isVerified: false },
  { id: "d1a2b3c4-0008-4000-8000-000000000008", created_at: thirtyDaysAgo, fullName: "Maha Al-Zahrani", email: "maha@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maha", bio: "Cybersecurity Analyst", typeOfJop: "Analyst", location: "Abu Dhabi, UAE", specialization: "Security", is_profile_active: true, isVerified: true },
  { id: "d1a2b3c4-0009-4000-8000-000000000009", created_at: thirtyDaysAgo, fullName: "Sultan Al-Anazi", email: "sultan@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sultan", bio: "Mobile Developer", typeOfJop: "Developer", location: "Dammam, KSA", specialization: "Flutter/React Native", is_profile_active: true, isVerified: false },
  { id: "d1a2b3c4-0010-4000-8000-000000000010", created_at: thirtyDaysAgo, fullName: "Hessa Al-Marri", email: "hessa@example.com", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Hessa", bio: "Technical Writer", typeOfJop: "Writer", location: "Sharjah, UAE", specialization: "Documentation", is_profile_active: false, isVerified: true },
];

const projects = [
  { id: "e5f6a7b8-0001-4000-8000-000000000001", name: "E-Commerce Platform", description: "Full-stack online marketplace built with Next.js and Stripe", link: "https://github.com/ahmed/ecommerce", image: null, user_id: "d1a2b3c4-0001-4000-8000-000000000001", created_at: thirtyDaysAgo },
  { id: "e5f6a7b8-0002-4000-8000-000000000002", name: "Design System", description: "Comprehensive UI component library for internal tools", link: "https://github.com/sara/design-system", image: null, user_id: "d1a2b3c4-0002-4000-8000-000000000002", created_at: thirtyDaysAgo },
  { id: "e5f6a7b8-0003-4000-8000-000000000003", name: "CI/CD Pipeline", description: "Automated deployment pipeline for microservices", link: "https://github.com/mohammed/cicd", image: null, user_id: "d1a2b3c4-0003-4000-8000-000000000003", created_at: thirtyDaysAgo },
  { id: "e5f6a7b8-0004-4000-8000-000000000004", name: "ML Model Dashboard", description: "Interactive dashboard for monitoring ML model performance", link: "https://github.com/nora/ml-dashboard", image: null, user_id: "d1a2b3c4-0004-4000-8000-000000000004", created_at: thirtyDaysAgo },
  { id: "e5f6a7b8-0005-4000-8000-000000000005", name: "Task Management App", description: "Project management tool with real-time collaboration", link: "https://github.com/khalid/task-manager", image: null, user_id: "d1a2b3c4-0005-4000-8000-000000000005", created_at: thirtyDaysAgo },
  { id: "e5f6a7b8-0006-4000-8000-000000000006", name: "Portfolio Website", description: "Personal portfolio with blog and project showcase", link: "https://github.com/layla/portfolio", image: null, user_id: "d1a2b3c4-0006-4000-8000-000000000006", created_at: thirtyDaysAgo },
  { id: "e5f6a7b8-0007-4000-8000-000000000007", name: "Real-time Chat API", description: "WebSocket-based chat service with Redis", link: "https://github.com/faisal/chat-api", image: null, user_id: "d1a2b3c4-0007-4000-8000-000000000007", created_at: thirtyDaysAgo },
  { id: "e5f6a7b8-0008-4000-8000-000000000008", name: "Security Audit Tool", description: "Automated security scanning and reporting tool", link: "https://github.com/maha/security-audit", image: null, user_id: "d1a2b3c4-0008-4000-8000-000000000008", created_at: thirtyDaysAgo },
];

const links = [
  { name: "Next.js Documentation", link: "https://nextjs.org/docs", user_id: "d1a2b3c4-0001-4000-8000-000000000001", created_at: thirtyDaysAgo },
  { name: "Supabase Docs", link: "https://supabase.com/docs", user_id: "d1a2b3c4-0001-4000-8000-000000000001", created_at: thirtyDaysAgo },
  { name: "Figma Community", link: "https://figma.com/community", user_id: "d1a2b3c4-0002-4000-8000-000000000002", created_at: thirtyDaysAgo },
  { name: "Docker Hub", link: "https://hub.docker.com", user_id: "d1a2b3c4-0003-4000-8000-000000000003", created_at: thirtyDaysAgo },
  { name: "Kaggle Datasets", link: "https://kaggle.com/datasets", user_id: "d1a2b3c4-0004-4000-8000-000000000004", created_at: thirtyDaysAgo },
  { name: "Product Hunt", link: "https://producthunt.com", user_id: "d1a2b3c4-0005-4000-8000-000000000005", created_at: thirtyDaysAgo },
  { name: "React DevTools", link: "https://react.dev", user_id: "d1a2b3c4-0006-4000-8000-000000000006", created_at: thirtyDaysAgo },
  { name: "Node.js API", link: "https://nodejs.org/api", user_id: "d1a2b3c4-0007-4000-8000-000000000007", created_at: thirtyDaysAgo },
  { name: "OWASP Top 10", link: "https://owasp.org/Top10", user_id: "d1a2b3c4-0008-4000-8000-000000000008", created_at: thirtyDaysAgo },
  { name: "Flutter Widgets", link: "https://flutter.dev/widgets", user_id: "d1a2b3c4-0009-4000-8000-000000000009", created_at: thirtyDaysAgo },
];

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const { error: deleteUsers } = await supabaseAdmin.from("Users").delete().neq("id", "none");
    results.usersDeleted = !deleteUsers;

    const { error: insertUsers } = await supabaseAdmin.from("Users").insert(users);
    results.usersInserted = !insertUsers;
    if (insertUsers) results.usersError = insertUsers.message;
  } catch (e) {
    results.usersError = String(e);
  }

  try {
    const { error: deleteProjects } = await supabaseAdmin.from("Projects").delete().neq("id", "none");
    results.projectsDeleted = !deleteProjects;

    const { error: insertProjects } = await supabaseAdmin.from("Projects").insert(projects);
    results.projectsInserted = !insertProjects;
    if (insertProjects) results.projectsError = insertProjects.message;
  } catch (e) {
    results.projectsError = String(e);
  }

  try {
    const { error: deleteLinks } = await supabaseAdmin.from("Links").delete().neq("id", "none");
    results.linksDeleted = !deleteLinks;

    const { error: insertLinks } = await supabaseAdmin.from("Links").insert(links);
    results.linksInserted = !insertLinks;
    if (insertLinks) results.linksError = insertLinks.message;
  } catch (e) {
    results.linksError = String(e);
  }

  return NextResponse.json({
    message: "Seed complete",
    results,
    data: { users: 10, projects: 8, links: 10 },
  });
}
