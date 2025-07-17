module.exports = async (req, res) => {
  const url = req.query.url;
  if (!url || !url.includes('youtube.com')) return res.status(400).send({ error: 'Invalid URL' });

  const videoId = new URL(url).searchParams.get('v');
  const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  res.send({ thumbnail: thumb });
};