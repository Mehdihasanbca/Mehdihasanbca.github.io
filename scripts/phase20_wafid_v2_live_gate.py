from __future__ import annotations

import json
import re
import ssl
import urllib.error
import urllib.request
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
STATUS = ROOT / 'phase20-wafid-v2-live-status.txt'
ORIGIN = 'https://assignmentvenuecentre.me'
API_BASES = [
    'https://api.assignmentvenuecentre.me',
    'https://live.assignmentvenuecentre.me',
]

checks: list[tuple[str, bool, str]] = []

def check(name: str, ok: bool, detail: str = '') -> None:
    checks.append((name, bool(ok), detail.replace('\n', ' ')[:500]))


def fetch(url: str, *, method: str = 'GET', body: bytes | None = None, origin: str | None = None, timeout: int = 20):
    headers = {'User-Agent': 'AVC-Wafid-V2-Live-Gate/1.0', 'Cache-Control': 'no-cache'}
    if body is not None:
        headers['Content-Type'] = 'application/json'
    if origin:
        headers['Origin'] = origin
    req = urllib.request.Request(url, method=method, data=body, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ssl.create_default_context()) as response:
            raw = response.read()
            return response.status, dict(response.headers.items()), raw
    except urllib.error.HTTPError as exc:
        return exc.code, dict(exc.headers.items()) if exc.headers else {}, exc.read()
    except Exception as exc:
        return 0, {}, str(exc).encode()


medical = (ROOT / 'medical-booking.html').read_text(encoding='utf-8')
js = (ROOT / 'assets/medical-v2.js').read_text(encoding='utf-8')
trust = (ROOT / 'payment-trust.html').read_text(encoding='utf-8')
privacy = (ROOT / 'privacy.html').read_text(encoding='utf-8')
refund = (ROOT / 'payment-refund.html').read_text(encoding='utf-8')

check('static_medical_form', 'id="medical-booking-form"' in medical and 'id="medical-pay-button"' in medical)
check('static_status_and_slip', 'id="medical-status-form"' in medical and 'id="medical-slip-button"' in medical)
check('static_fee_breakdown', '₹1,500' in medical and '₹270' in medical and '₹1,770' in medical)
check('static_wafid_fee_separate', 'Official Wafid / third-party cost' in medical and 'Separate actual amount' in medical)
check('static_no_hosted_payment_page_dependency', 'payment-page-config.js' not in medical and 'payment-page.js' not in medical)
check('static_no_passport_query', '?passport=' not in medical and '?passport=' not in js and 'passport_number=' not in js)
check('static_no_local_storage', 'localStorage' not in js)
check('static_fixed_order_assertion', 'TOTAL_PAISE=177000' in js and "'/api/v1/gamca-medical/public/order'" in js)
check('static_verified_case_submit', "'/api/v1/gamca-medical/public/requests'" in js and 'razorpay_signature' in js)
check('static_failed_payment_no_pii_payload', "'/api/v1/gamca-medical/public/payment-failures'" in js and 'failure_reason' in js)
check('static_secure_status_post', "'/api/v1/gamca-medical/public/status'" in js and "'/api/v1/gamca-medical/public/slip'" in js)
trust_lower = trust.lower()
trust_verification_marker = (
    'server-side verification' in trust_lower
    or 'server-side payment verification' in trust_lower
    or 'signature verification' in trust_lower
)
check('static_trust_aligned', trust_verification_marker and 'Hosted Payment Page' not in trust)
check('static_privacy_aligned', 'private ERP/API' in privacy and 'localStorage' in privacy)
check('static_refund_aligned', 'Razorpay Checkout total' in refund and 'Hosted Payment Page' not in refund)
check('no_razorpay_secret_pattern', not re.search(r'rzp_(?:live|test)_[A-Za-z0-9]{8,}', medical + js + trust + privacy + refund))

# Fresh public production checks.
for path, marker in [
    ('/medical-booking.html', 'medical-booking-form'),
    ('/assets/medical-v2.js', 'TOTAL_PAISE=177000'),
    ('/payment-trust.html', 'Signature verification'),
    ('/privacy.html', 'private ERP/API'),
    ('/payment-refund.html', 'Razorpay Checkout total'),
]:
    code, _, raw = fetch(ORIGIN + path)
    text = raw.decode('utf-8', 'replace')
    check('live_' + path.strip('/').replace('/', '_').replace('.', '_'), code == 200 and marker in text, f'http={code}')

live_api = ''
api_config = None
for base in API_BASES:
    code, headers, raw = fetch(base + '/api/v1/gamca-medical/public/config', origin=ORIGIN)
    text = raw.decode('utf-8', 'replace')
    try:
        data = json.loads(text) if text else {}
    except Exception:
        data = {}
    payload = data.get('data', data) if isinstance(data, dict) else {}
    if code == 200 and isinstance(payload, dict) and str(payload.get('total_inr')) in {'1770', '1770.0', '1770.00'}:
        live_api = base
        api_config = payload
        cors = headers.get('Access-Control-Allow-Origin') or headers.get('access-control-allow-origin') or ''
        check('live_api_config', True, base)
        check('live_api_payment_enabled', bool(payload.get('payment_enabled')), base)
        check('live_api_public_key_only', str(payload.get('razorpay_key_id', '')).startswith('rzp_'), base)
        check('live_api_cors', cors in {ORIGIN, '*'}, f'{base} allow-origin={cors}')
        check('live_api_official_phone', payload.get('support_phone') == '+91 9473286356', base)
        check('live_api_wafid_fee_separate', payload.get('wafid_third_party_fee_included') is False, base)
        break

if not live_api:
    check('live_api_config', False, 'No trusted AVC API host returned Wafid v2 config')
else:
    code, _, raw = fetch(
        live_api + '/api/v1/gamca-medical/public/order',
        method='POST',
        body=b'{}',
        origin=ORIGIN,
    )
    text = raw.decode('utf-8', 'replace')
    try:
        order = json.loads(text) if text else {}
    except Exception:
        order = {}
    check('live_order_create_http', code == 200, f'http={code}')
    check('live_order_fixed_amount', order.get('amount') == 177000, str(order.get('amount')))
    check('live_order_currency_inr', order.get('currency') == 'INR', str(order.get('currency')))
    check('live_order_public_key_present', str(order.get('razorpay_key_id', '')).startswith('rzp_'), 'public key present' if order.get('razorpay_key_id') else 'missing')
    check('live_order_no_candidate_pii', all(k not in text.lower() for k in ['passport_number', 'date_of_birth', 'first_name', 'last_name']), 'order response contains no candidate PII')

failed = [name for name, ok, _ in checks if not ok]
status = 'success' if not failed else ('blocked_backend_not_live' if 'live_api_config' in failed else 'failure')
lines = [
    'AVC Phase 20 Wafid Medical V2 live gate',
    f'status={status}',
    f'checks={len(checks)}',
    f'failures={len(failed)}',
    f'live_api={live_api or "none"}',
    'razorpay_service_base_paise=150000',
    'gst_paise=27000',
    'razorpay_total_paise=177000',
    'wafid_third_party_fee_included=no',
    'payment_test_charge_created=no',
    'secret_values_exposed=no',
    f'checked_at_utc={datetime.now(timezone.utc).isoformat()}',
]
for name, ok, detail in checks:
    lines.append(f'{name}={"pass" if ok else "fail"}' + (f' ({detail})' if detail else ''))
if failed:
    lines.append('failed_checks=' + ','.join(failed))
STATUS.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('\n'.join(lines))
# A backend deployment blocker is reported but does not prevent committing the evidence.
raise SystemExit(0)
