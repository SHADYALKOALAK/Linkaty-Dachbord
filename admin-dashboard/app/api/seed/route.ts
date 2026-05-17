import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { count: existingUsers } = await supabase
      .from("Users")
      .select("*", { count: "exact", head: true });

    if (existingUsers && existingUsers > 0) {
      return NextResponse.json({
        message: "Database already has data. Skipping seed.",
        count: existingUsers,
      });
    }

    const users = [
      { fullName: "Alex Morgan", email: "admin@example.com", bio: "Platform administrator", typeOfJop: "Admin", location: "San Francisco, CA", specialization: "Full Stack", is_profile_active: true, isVerified: true, image: null },
      { fullName: "Sarah Chen", email: "sarah@example.com", bio: "Frontend developer", typeOfJop: "Developer", location: "New York, NY", specialization: "React", is_profile_active: true, isVerified: true, image: null },
      { fullName: "Marcus Johnson", email: "marcus@example.com", bio: "UX designer", typeOfJop: "Designer", location: "Austin, TX", specialization: "UI/UX", is_profile_active: true, isVerified: true, image: null },
      { fullName: "Emily Davis", email: "emily@example.com", bio: "Product manager", typeOfJop: "Manager", location: "Seattle, WA", specialization: "Product", is_profile_active: false, isVerified: true, image: null },
      { fullName: "James Wilson", email: "james@example.com", bio: "Backend engineer", typeOfJop: "Developer", location: "Chicago, IL", specialization: "Node.js", is_profile_active: true, isVerified: false, image: null },
      { fullName: "Lisa Anderson", email: "lisa@example.com", bio: "Data scientist", typeOfJop: "Engineer", location: "Boston, MA", specialization: "AI/ML", is_profile_active: true, isVerified: true, image: null },
      { fullName: "David Thompson", email: "david@example.com", bio: "Marketing specialist", typeOfJop: "Marketing", location: "Denver, CO", specialization: "Growth", is_profile_active: false, isVerified: false, image: null },
      { fullName: "Anna Martinez", email: "anna@example.com", bio: "Mobile developer", typeOfJop: "Developer", location: "Miami, FL", specialization: "Flutter", is_profile_active: true, isVerified: true, image: null },
      { fullName: "Robert Kim", email: "robert@example.com", bio: "DevOps engineer", typeOfJop: "Engineer", location: "Portland, OR", specialization: "Cloud", is_profile_active: true, isVerified: false, image: null },
      { fullName: "Michelle Taylor", email: "michelle@example.com", bio: "Content writer", typeOfJop: "Writer", location: "Nashville, TN", specialization: "Technical Writing", is_profile_active: false, isVerified: true, image: null },
    ];

    const { error: usersError } = await supabase.from("Users").insert(users);
    if (usersError) throw usersError;

    const { data: insertedUsers } = await supabase.from("Users").select("id").limit(10);
    const userIds = (insertedUsers || []).map((u: { id: string }) => u.id);

    const projects = [
      { name: "Marketing Campaign", description: "Q2 marketing campaign landing pages", link: "https://example.com/marketing", image: null, user_id: userIds[0] },
      { name: "Product Launch", description: "New product launch page", link: "https://example.com/product", image: null, user_id: userIds[1] },
      { name: "Blog Network", description: "Blog and content management links", link: "https://blog.example.com", image: null, user_id: userIds[2] },
      { name: "Social Media", description: "Social media campaign links", link: "https://example.com/social", image: null, user_id: userIds[0] },
      { name: "Email Newsletter", description: "Email marketing tracking", link: "https://example.com/newsletter", image: null, user_id: userIds[4] },
      { name: "Partner Program", description: "Affiliate partner tracking", link: "https://example.com/partners", image: null, user_id: userIds[5] },
      { name: "Mobile App", description: "App download and deep links", link: "https://example.com/app", image: null, user_id: userIds[7] },
      { name: "SEO Project", description: "SEO link building project", link: "https://example.com/seo", image: null, user_id: userIds[8] },
    ];

    const { error: projectsError } = await supabase.from("Projects").insert(projects);
    if (projectsError) throw projectsError;

    const links = [
      { name: "Summer Sale", link: "https://example.com/summer-sale", user_id: userIds[0] },
      { name: "New Product Page", link: "https://example.com/products/new", user_id: userIds[1] },
      { name: "How-to Guide", link: "https://blog.example.com/guide", user_id: userIds[2] },
      { name: "Twitter Campaign", link: "https://twitter.com/example/123", user_id: userIds[0] },
      { name: "LinkedIn Profile", link: "https://linkedin.com/in/example", user_id: userIds[0] },
      { name: "Newsletter Signup", link: "https://example.com/subscribe", user_id: userIds[4] },
      { name: "Referral Link", link: "https://example.com/ref/partner", user_id: userIds[5] },
      { name: "App Store", link: "https://apps.apple.com/app/example", user_id: userIds[7] },
      { name: "Google Play", link: "https://play.google.com/store/apps/details?id=example", user_id: userIds[7] },
      { name: "Documentation", link: "https://docs.example.com", user_id: userIds[8] },
    ];

    const { error: linksError } = await supabase.from("Links").insert(links);
    if (linksError) throw linksError;

    return NextResponse.json({
      message: "Seed data created successfully",
      stats: { users: users.length, projects: projects.length, links: links.length },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed data", details: String(error) }, { status: 500 });
  }
}
