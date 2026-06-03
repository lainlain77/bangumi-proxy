exports.handler = async (event) => {
  const url = event.queryStringParameters?.url || "";

  if (!url) {
    return { statusCode: 400, body: "Missing url" };
  }

  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "StreamVault/1.0" },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) {
      return { statusCode: resp.status, body: "Image not found" };
    }

    const contentType = resp.headers.get("content-type") || "image/jpeg";
    const buffer = await resp.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true,
    };
  } catch (e) {
    return { statusCode: 502, body: "Proxy error" };
  }
};
