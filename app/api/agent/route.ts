import { NextRequest, NextResponse } from "next/server";
import { runOpenRouterAgent } from "@/lib/ai/openrouter";
import { runAgentQuery } from "@/lib/agent/tools";

// ── Simple in-memory rate limiter ────────────────────────────────────────────
const RL = new Map<string, { count: number; resetAt: number }>();
const RL_MAX = 20;
const RL_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RL.get(ip);
  if (!entry || now > entry.resetAt) {
    RL.set(ip, { count: 1, resetAt: now + RL_WINDOW });
    return true;
  }
  if (entry.count >= RL_MAX) return false;
  entry.count++;
  return true;
}

// ── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  // Parse and validate body
  let query: string;
  try {
    const body = await req.json() as { query?: unknown };
    if (typeof body.query !== "string" || !body.query.trim()) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }
    query = body.query.trim().slice(0, 500); // max 500 chars
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Try OpenRouter — fall back to deterministic agent if unavailable
  const hasKey = Boolean(process.env.OPENROUTER_API_KEY);

  if (hasKey) {
    try {
      const result = await runOpenRouterAgent(query);
      return NextResponse.json({ result, mode: "ai" });
    } catch (err) {
      console.error("[agent] OpenRouter error, falling back:", err);
      // Fall through to deterministic
    }
  }

  const result = runAgentQuery(query);
  return NextResponse.json({ result, mode: "local" });
}
