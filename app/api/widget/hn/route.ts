import { NextResponse } from "next/server";


export async function GET() {
  try {
    const ids: number[] = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    ).then((r) => r.json());

    const pick = ids[Math.floor(Math.random() * 10)]; // top 10 random
    const item = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${pick}.json`
    ).then((r) => r.json());

    return NextResponse.json({
      title: item.title,
      url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
      score: item.score,
      by: item.by,
    });
  } catch {
    return NextResponse.json(
      { title: "AI is eating software — and we're cooking it", url: "https://news.ycombinator.com", score: "?", by: "HN" },
      { status: 200 }
    );
  }
}
