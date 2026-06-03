import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.searchParams.get("path") || "";

  if (!path || path === "/") {
    return new Response("Bangumi Proxy OK. Use ?path=search/subject/xxx", {
      status: 200,
    });
  }

  try {
    const resp = await fetch(`https://api.bgm.tv/${path}`, {
      headers: { "User-Agent": "StreamVault/1.0 (Deno proxy)" },
    });

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: `Bangumi returned ${resp.status}` }),
        { status: resp.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: `Bangumi unreachable: ${e.message}` }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
});
