"""Vercel serverless CORS proxy for Steam Web API.

Pages의 정적 사이트에서 브라우저가 Steam API를 직접 호출하면 CORS로 차단됩니다.
이 serverless 함수가 중간에서 우회:
  - /api/steam?url=https://api.steampowered.com/ISteamUser/...
  - 외부 Steam API 호출 + CORS 헤더 응답

allorigins.win 등 공개 CORS 프록시는 자주 죽어서 자체 프록시 운영.
"""

import os
from urllib.parse import urlencode
import urllib.request

# 환경변수로 시크릿 API 동작 (선택)
ALLOWED_HOSTS = ('api.steampowered.com', 'store.steampowered.com')


def handler(request):
    """Vercel serverless Python handler."""
    # CORS preflight (OPTIONS 요청)
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 's-maxage=600, stale-while-revalidate=1200',
    }

    if request.method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    # ?url=... 또는 path parameter
    target_url = (request.query or {}).get('url', '')

    if not target_url:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': '{"error":"missing query parameter: url"}'
        }

    # host allowlist (보안)
    from urllib.parse import urlparse
    parsed = urlparse(target_url)
    if parsed.netloc not in ALLOWED_HOSTS:
        return {
            'statusCode': 403,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': f'{{"error":"host not allowed: {parsed.netloc}"}}'
        }

    try:
        # 외부 호출 (steam api로 사용자 API key 직접 forward)
        req = urllib.request.Request(target_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            content_type = resp.headers.get('Content-Type', 'application/json')
        return {
            'statusCode': 200,
            'headers': {**cors_headers, 'Content-Type': content_type},
            'body': data.decode('utf-8', errors='replace'),
        }
    except Exception as e:
        return {
            'statusCode': 502,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': f'{{"error":"upstream failed: {str(e)}"}}'
        }
