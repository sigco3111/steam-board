/**
 * Vercel Node.js serverless function — CORS proxy for Steam Web API
 *
 * Pages에서 Steam API 직접 호출 시 CORS 차단되므로 우회:
 *   fetch('/api/cors?url=https://api.steampowered.com/...')
 *     → 이 함수가 외부 호출 후 CORS 헤더와 함께 응답
 *
 * allorigins.win 등 공개 프록시는 자주 죽어서 자체 호스팅.
 */

const ALLOWED_HOSTS = new Set([
    'api.steampowered.com',
    'store.steampowered.com',
]);

export default async function handler(req, res) {
    // CORS 헤더 — 정적 사이트 어디서든 호출 가능
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const targetUrl = req.query.url;
    if (!targetUrl) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'missing query parameter: url' });
    }

    // host allowlist (보안: SSRF 방지)
    let parsed;
    try {
        parsed = new URL(targetUrl);
    } catch (e) {
        return res.status(400).json({ error: 'invalid url' });
    }
    if (!ALLOWED_HOSTS.has(parsed.hostname)) {
        return res.status(403).json({ error: `host not allowed: ${parsed.hostname}` });
    }

    try {
        const upstream = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (SteamBoardProxy/1.0)' },
        });
        const body = await upstream.text();
        res.setHeader('Content-Type', upstream.headers.get('Content-Type') || 'application/json');
        return res.status(upstream.status).send(body);
    } catch (e) {
        return res.status(502).json({ error: `upstream failed: ${e.message}` });
    }
}
