import { NextResponse } from "next/server";


export async function GET() {
  try {
    const res = await fetch(
      "https://official-joke-api.appspot.com/jokes/programming/random",
      { next: { revalidate: 0 } }
    );
    if (!res.ok) throw new Error();
    const [joke] = await res.json();
    return NextResponse.json({ setup: joke.setup, punchline: joke.punchline });
  } catch {
    return NextResponse.json(
      { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs." },
      { status: 200 }
    );
  }
}
