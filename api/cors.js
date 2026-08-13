/**
 * Vercel Node.js serverless function — CORS proxy for Steam Web API.
 *
 * 호출 형식:
 *   /api/cors?url={encoded_steam_api_url}
 * 예: /api/cors?url=https%3A%2F%2Fapi.steampowered.com%2FISteamUser%2FGetPlayerSummaries%2Fv0002%2F%3Fkey%3Dxxx%26steamids%3Dyyy
 *
 * Vercel이 자동으로 query url을 1차 decode → req.query.url은 디코드된 URL
 * → fetch는 그대로 사용 (Steam API에 정상 도달)
 */

const ALLOWED_HOSTS = new Set([
    'api.steampowered.com',
    'store.steampowered.com',
]);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const targetUrl = req.query.url;
    if (!targetUrl || Array.isArray(targetUrl)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'missing url query param' });
    }

    let parsed;
    try {
        parsed = new URL(targetUrl);
    } catch (e) {
        return res.status(400).json({ error: 'invalid url' });
    }

    if (!ALLOWED_HOSTS.has(parsed.hostname)) {
        res.setHeader('Content-Type', 'application/json');
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
        res.setHeader('Content-Type', 'application/json');
        return res.status(502).json({ error: `upstream failed: ${e.message}` });
    }
}
