from __future__ import annotations

import json
import socket
import ssl
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'phase20-api-production-fingerprint.txt'
HOSTS = ['api.assignmentvenuecentre.me', 'live.assignmentvenuecentre.me']
PATHS = ['/', '/health', '/api/v1/gamca-medical/public/config', '/openapi.json']


def fetch(url: str):
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'AVC-Production-Fingerprint/1.0',
            'Cache-Control': 'no-cache',
            'Origin': 'https://assignmentvenuecentre.me',
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20, context=ssl.create_default_context()) as r:
            return r.status, dict(r.headers.items()), r.read()
    except urllib.error.HTTPError as exc:
        return exc.code, dict(exc.headers.items()) if exc.headers else {}, exc.read()
    except Exception as exc:
        return 0, {}, str(exc).encode()


lines = [
    'AVC ERP production API fingerprint',
    f'checked_at_utc={datetime.now(timezone.utc).isoformat()}',
]

for host in HOSTS:
    lines.append(f'host={host}')
    try:
        ips = sorted({row[4][0] for row in socket.getaddrinfo(host, 443, type=socket.SOCK_STREAM)})
    except Exception:
        ips = []
    lines.append(f'dns_resolves={"yes" if ips else "no"}')
    lines.append('dns_address_count=' + str(len(ips)))
    # IPs are public DNS data, but counts are sufficient for deployment diagnosis.

    for path in PATHS:
        code, headers, raw = fetch(f'https://{host}{path}')
        prefix = path.strip('/').replace('/', '_').replace('.', '_') or 'root'
        text = raw.decode('utf-8', 'replace')
        lines.append(f'{prefix}_http={code}')
        server = headers.get('Server') or headers.get('server') or ''
        via = headers.get('Via') or headers.get('via') or ''
        cf = headers.get('CF-Ray') or headers.get('cf-ray') or ''
        powered = headers.get('X-Powered-By') or headers.get('x-powered-by') or ''
        cors = headers.get('Access-Control-Allow-Origin') or headers.get('access-control-allow-origin') or ''
        lines.append(f'{prefix}_server={server[:120] or "none"}')
        lines.append(f'{prefix}_via_present={"yes" if via else "no"}')
        lines.append(f'{prefix}_cloudflare_present={"yes" if cf else "no"}')
        lines.append(f'{prefix}_powered_by={powered[:120] or "none"}')
        lines.append(f'{prefix}_cors_origin={cors[:160] or "none"}')
        if path == '/':
            lines.append(f'root_avc_api_marker={"yes" if "Assignment Venue Center" in text or "Assignment Venue Centre" in text else "no"}')
        elif path == '/api/v1/gamca-medical/public/config':
            lines.append(f'wafid_v2_config_marker={"yes" if "1770" in text and "wafid_third_party_fee_included" in text else "no"}')
            lines.append(f'wafid_v2_route_present={"yes" if code == 200 else "no"}')
        elif path == '/openapi.json' and code == 200:
            try:
                doc = json.loads(text)
                paths = doc.get('paths') or {}
            except Exception:
                paths = {}
            lines.append(f'openapi_route_count={len(paths)}')
            for route in [
                '/api/v1/gamca-medical/public/config',
                '/api/v1/gamca-medical/public/order',
                '/api/v1/gamca-medical/public/requests',
                '/api/v1/payments/webhook/razorpay',
                '/api/v1/gamca-medical/requests',
            ]:
                key = route.strip('/').replace('/', '_').replace('{','').replace('}','').replace('-','_')
                lines.append(f'openapi_{key}={"yes" if route in paths else "no"}')

OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('\n'.join(lines))
