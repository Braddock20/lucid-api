export default async function handler(req, res) {
  return res.status(200).json({
    status: 'Lucid API Online 🚀',
    message: 'Welcome to Lucid API! Use /api/music?q= to search and download music.',
    endpoints: {
      music: '/api/music?q=',
      video: '/api/video?q=',
      lyrics: '/api/lyrics?q='
    },
    author: 'Lucid Tech'
  });
}
