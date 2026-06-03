export default async function handler(req, res) {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  const url = `https://api.bgm.tv/${path}`;

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'StreamVault/1.0 (Vercel proxy)',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) {
      return res.status(resp.status).json({
        error: `Bangumi returned ${resp.status}`,
      });
    }

    const data = await resp.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: `Bangumi unreachable: ${e.message}` });
  }
}
