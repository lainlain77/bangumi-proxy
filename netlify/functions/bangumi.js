exports.handler = async (event) => {
  const path = event.queryStringParameters?.path || "";

  if (!path) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing path parameter" }),
    };
  }

  try {
    const resp = await fetch(`https://api.bgm.tv/${path}`, {
      headers: { "User-Agent": "StreamVault/1.0 (Netlify proxy)" },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        body: JSON.stringify({ error: `Bangumi returned ${resp.status}` }),
      };
    }

    const data = await resp.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: `Bangumi unreachable: ${e.message}` }),
    };
  }
};
