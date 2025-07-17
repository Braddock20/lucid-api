import yts from 'yt-search';
import fg from 'api-dylux';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing search query (?q=)' });

  try {
    const search = await yts(q);
    const video = search.videos[0];
    const audio = await fg.yta(video.url);

    return res.status(200).json({
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.timestamp,
      url: video.url,
      download: audio.dl_url,
      fileSize: audio.filesizeF || 'Unknown',
      author: 'Lucid API 🎵'
    });
  } catch (err) {
    return res.status(500).json({ error: 'Music download failed', details: err.message });
  }
}
