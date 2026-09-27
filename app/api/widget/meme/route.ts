import { NextResponse } from "next/server";


export async function GET() {
  try {
    const res = await fetch("https://meme-api.com/gimme/ProgrammerHumor", {
      next: { revalidate: 0 },
    });
    if (!res.ok) throw new Error("meme api failed");
    const data = await res.json();
    return NextResponse.json({ title: data.title, url: data.url, postLink: data.postLink });
  } catch {
    return NextResponse.json(
      { title: "When your code works but you don't know why", url: null, postLink: null },
      { status: 200 }
    );
  }
}
