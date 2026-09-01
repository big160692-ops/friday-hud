// Cloudflare Worker - YouTube Search CORS Proxy
// Deploy: https://dash.cloudflare.com > Workers > Create Worker
// Paste this code, save, get your worker URL (e.g. https://friday-yt-proxy.YOURSUBDOMAIN.workers.dev)

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    if (!target) return new Response(JSON.stringify({error:'Missing ?url= parameter'}), {status:400, headers:{'Content-Type':'application/json'}});
    try {
      const r = await fetch(target, {
        method: request.headers.get('x-method') || 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Content-Type': request.headers.get('x-content-type') || 'application/json',
          'Origin': 'https://music.youtube.com',
          'Referer': 'https://music.youtube.com/'
        },
        body: request.headers.get('x-method') === 'POST' ? await request.text() : undefined
      });
      const body = await r.text();
      return new Response(body, {
        status: r.status,
        headers: {
          'Content-Type': r.headers.get('Content-Type') || 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': '*'
        }
      });
    } catch(e) {
      return new Response(JSON.stringify({error:e.message}), {status:502, headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}});
    }
  }
};
