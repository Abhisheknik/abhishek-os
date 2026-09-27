import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkOwnerAuth } from "@/lib/cms-auth";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const sb = createClient(url, anon);
  const { data, error } = await sb.from("portfolio_profile").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!checkOwnerAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as Record<string, string>;
  const sb = adminClient();

  const { error } = await sb.from("portfolio_profile").upsert({ id: 1, ...body, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
