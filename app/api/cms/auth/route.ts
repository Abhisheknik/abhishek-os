import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phrase } = await request.json() as { phrase: string };
    const secret = process.env.OWNER_SECRET;

    if (!secret) {
      return NextResponse.json({ error: "OWNER_SECRET not configured" }, { status: 500 });
    }

    if (phrase === secret) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid passphrase" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
