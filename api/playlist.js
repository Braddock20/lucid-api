import { NextResponse } from "next/server";
import yts from "yt-search";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ status: false, message: "Missing search query (?q=artist or song)" }, { status: 400 });
  }

  try {
    const searchResults = await yts(q);
    const videos = searchResults.videos.slice(0, 8); // First 8 tracks

    if (!videos.length) {
      return NextResponse.json({ status: false, message: "No results found." }, { status: 404 });
    }

    const playlist = videos.map((v) => ({
      title: v.title,
      duration: v.timestamp,
      views: v.views,
      thumbnail: v.thumbnail,
      url: v.url,
      uploaded: v.ago,
      author: v.author.name,
    }));

    return NextResponse.json({
      status: true,
      query: q,
      results: playlist.length,
      playlist,
    });
  } catch (error) {
    return NextResponse.json({ status: false, error: error.message }, { status: 500 });
  }
}