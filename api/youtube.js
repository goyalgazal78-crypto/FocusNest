export default async function handler(req, res) {
  try {
    const { query } = req.query;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=6&type=video&key=${process.env.YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}