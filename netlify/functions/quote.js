export default async (req) => {
  const url = new URL(req.url);
  const symbol = url.searchParams.get("symbol");
  const range = url.searchParams.get("range") || "3mo";
  const interval = url.searchParams.get("interval") || "1d";

  if (!symbol) {
    return new Response(JSON.stringify({ error: "symbol required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const yahooUrl =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?range=${range}&interval=${interval}&includePrePost=false`;

  try {
    const resp = await fetch(yahooUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json"
      }
    });

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: `Yahoo returned ${resp.status}` }),
        { status: resp.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config = {
  path: "/api/quote"
};
