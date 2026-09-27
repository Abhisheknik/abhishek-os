import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkOwnerAuth } from "@/lib/cms-auth";
import { portfolio } from "@/data/portfolio";

export async function POST(request: Request) {
  if (!checkOwnerAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const sb = createClient(url, key);

  try {
    // Seed profile
    await sb.from("portfolio_profile").upsert({
      id: 1,
      name: portfolio.profile.name,
      title: portfolio.profile.title,
      tagline: portfolio.profile.tagline,
      location: portfolio.profile.location,
      email: portfolio.profile.email,
      summary: portfolio.profile.summary,
    });

    // Seed projects
    const projects = portfolio.projects.map((p, i) => ({
      id: p.id,
      name: p.name,
      featured: "featured" in p ? p.featured : false,
      live: "live" in p ? (p.live as string) : null,
      github: "github" in p ? (p.github as string) : null,
      tags: [...p.tags],
      description: p.description,
      details: [...p.details],
      architecture: [...p.architecture],
      tech: { ...p.tech },
      sort_order: i,
    }));
    await sb.from("portfolio_projects").upsert(projects);

    // Seed experience
    const experience = portfolio.experience.map((e, i) => ({
      company: e.company,
      role: e.role,
      period: e.period,
      location: e.location,
      highlights: [...e.highlights],
      sort_order: i,
    }));
    await sb.from("portfolio_experience").upsert(experience, { onConflict: "company" });

    // Seed certifications
    const certs = portfolio.certifications.map((c, i) => ({
      name: c.name,
      issuer: c.issuer,
      code: "code" in c ? c.code : null,
      issued: "issued" in c ? c.issued : null,
      expires: "expires" in c ? c.expires : null,
      credential_id: "credentialId" in c ? c.credentialId : null,
      skills: "skills" in c ? [...(c.skills as readonly string[])] : [],
      sort_order: i,
    }));
    await sb.from("portfolio_certifications").upsert(certs, { onConflict: "name" });

    return NextResponse.json({ ok: true, seeded: { projects: projects.length, experience: experience.length, certs: certs.length } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
