const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/bangumi/*', async (req, res) => {
  const path = req.params[0] + (req.url.includes('?') ? '?' + req.url.split('?')[1] : '');
  const url = `https://api.bgm.tv/${path}`;

  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'StreamVault/1.0 (Glitch proxy)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) return res.status(resp.status).json({ error: `Bangumi ${resp.status}` });
    const data = await resp.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

app.get('/', (req, res) => res.send('Bangumi proxy OK'));

app.listen(PORT, () => console.log(`Proxy on port ${PORT}`));
