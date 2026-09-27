import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    return NextResponse.json({ empty: true });
  }

  try {
    const sb = createClient(url, anon);

    const [profileRes, projectsRes, experienceRes, certsRes] = await Promise.all([
      sb.from("portfolio_profile").select("*").eq("id", 1).single(),
      sb.from("portfolio_projects").select("*").order("sort_order"),
      sb.from("portfolio_experience").select("*").order("sort_order"),
      sb.from("portfolio_certifications").select("*").order("sort_order"),
    ]);

    const profile       = profileRes.data;
    const projects      = projectsRes.data ?? [];
    const experience    = experienceRes.data ?? [];
    const certifications = certsRes.data ?? [];

    if (!profile && projects.length === 0 && experience.length === 0) {
      return NextResponse.json({ empty: true });
    }

    return NextResponse.json({ profile, projects, experience, certifications });
  } catch {
    return NextResponse.json({ empty: true });
  }
}
