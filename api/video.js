import { ytv } from 'api-dylux'; import yts from 'yt-search';

export default async function handler(req, res) { const { query } = req.query; if (!query) { return res.status(400).json({ error: 'Missing query parameter.' }); }

try { const search = await yts(query); const video = search.videos[0];

if (!video) { return res.status(404).json({ error: 'No video found.' }); } const details = await ytv(video.url); return res.status(200).json({ title: video.title, url: video.url, thumbnail: video.thumbnail, download: details.dl_url, description: video.description, timestamp: video.timestamp, ago: video.ago, views: video.views, author: video.author, duration: video.duration, }); 

} catch (error) { console.error('Error:', error); return res.status(500).json({ error: 'Failed to fetch video info.' }); } }

