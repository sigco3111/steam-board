"""Vercel serverless Python handler for CORS proxy.

Pages 정적 사이트가 Steam API 직접 호출 시 CORS로 차단됨.
이 serverless가 중간에서 Steam API 호출 + CORS 헤더 응답.
"""

import urllib.request
from urllib.parse import urlparse


ALLOWED_HOSTS = ('api.steampowered.com', 'store.steampowered.com')


def handler(request):
    """Vercel Python handler (flask-style)."""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 's-maxage=600, stale-while-revalidate=1200',
    }

    if request.method == 'OPTIONS':
        return ('OK', 200, cors_headers)

    url = (request.args or {}).get('url', '')
    if not url:
        return ('{"error":"missing url query param"}', 400, {**cors_headers, 'Content-Type': 'application/json'})

    parsed = urlparse(url)
    if parsed.netloc not in ALLOWED_HOSTS:
        return (f'{{"error":"host not allowed: {parsed.netloc}"}}', 403, {**cors_headers, 'Content-Type': 'application/json'})

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read().decode('utf-8', errors='replace')
            content_type = resp.headers.get('Content-Type', 'application/json')
        return (data, 200, {**cors_headers, 'Content-Type': content_type})
    except Exception as e:
        return (f'{{"error":"upstream failed: {str(e)}"}}', 502, {**cors_headers, 'Content-Type': 'application/json'})
