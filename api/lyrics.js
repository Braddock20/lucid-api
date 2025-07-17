import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ status: false, message: "Query missing. Use ?q=song_name" }, { status: 400 });
  }

  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q + " lyrics")}`;
    const headers = {
      "User-Agent": "Mozilla/5.0",
    };

    const { data } = await axios.get(searchUrl, { headers });
    const $ = cheerio.load(data);

    const lyrics = [];

    $("div.ujudUb").each((i, el) => {
      const line = $(el).text().trim();
      if (line) lyrics.push(line);
    });

    if (lyrics.length === 0) {
      return NextResponse.json({ status: false, message: "Lyrics not found." }, { status: 404 });
    }

    return NextResponse.json({
      status: true,
      title: q,
      lyrics: lyrics.join("\n"),
      source: "Google Search",
    });
  } catch (err) {
    return NextResponse.json({ status: false, error: err.message }, { status: 500 });
  }
}