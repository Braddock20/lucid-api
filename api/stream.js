import { NextResponse } from "next/server";
import yts from "yt-search";
import fg from "api-dylux"; // Used for getting direct download links

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({
      status: false,
      message: "Missing query (?q=song name or URL)"
    }, { status: 400 });
  }

  try {
    const search = await yts(q);
    const song = search.videos[0];

    if (!song) {
      return NextResponse.json({
        status: false,
        message: "No result found."
      }, { status: 404 });
    }

    const download = await fg.yta(song.url);

    return NextResponse.json({
      status: true,
      title: song.title,
      thumbnail: song.thumbnail,
      artist: song.author.name,
      duration: song.timestamp,
      views: song.views,
      uploaded: song.ago,
      url: song.url,
      stream_url: download.dl_url
    });

  } catch (err) {
    return NextResponse.json({
      status: false,
      error: err.message || "Failed to stream"
    }, { status: 500 });
  }
}