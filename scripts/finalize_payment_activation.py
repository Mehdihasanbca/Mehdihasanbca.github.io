from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / 'assets' / 'payment-config.js'
STATUS = ROOT / 'phase20-live-status.txt'

BASE = 150000
GST_RATE = 18
GST = 27000
TOTAL = 177000


def health_check():
    for _ in range(15):
        url = f'https://assignmentvenuecentre.me/api/payments/health?ts={int(time.time())}'
        req = urllib.request.Request(url, headers={'Cache-Control': 'no-cache'})
        try:
            with urllib.request.urlopen(req, timeout=20) as res:
                data = json.loads(res.read().decode('utf-8', 'replace'))
            if (
                res.status == 200
                and data.get('service') == 'avc-payment-api'
                and data.get('razorpayConfigured') is True
                and data.get('totalPaise') == TOTAL
                and data.get('wafidThirdPartyFeeIncluded') is False
            ):
                return True
        except Exception:
            pass
        time.sleep(6)
    return False


def main():
    key_id = os.getenv('RAZORPAY_LIVE_API_KEY', '').strip()
    deploy_ok = os.getenv('DEPLOY_OUTCOME', '') == 'success'
    secrets_ok = os.getenv('SECRETS_OUTCOME', '') == 'success'
    trusted = os.getenv('RAZORPAY_TRUSTED_BUSINESS_ENABLED', '').strip().lower() == 'true'
    webhook = bool(os.getenv('RAZORPAY_WEBHOOK_SECRET', '').strip())
    health = health_check() if deploy_ok and secrets_ok else False
    checkout = bool(health and key_id.startswith('rzp_live_'))
    public_key = key_id if checkout else ''

    CONFIG.write_text(
        "window.AVC_PAYMENT_CONFIG=Object.freeze({\n"
        "  mode:'live',\n"
        f"  checkoutEnabled:{str(checkout).lower()},\n"
        f"  trustedBusinessClaimEnabled:{str(trusted).lower()},\n"
        f"  razorpayKeyId:'{public_key}',\n"
        "  orderEndpoint:'/api/payments/order',\n"
        "  verifyEndpoint:'/api/payments/verify',\n"
        "  webhookManagedServerSide:true,\n"
        f"  serviceBasePaise:{BASE},\n"
        f"  gstRate:{GST_RATE},\n"
        f"  gstPaise:{GST},\n"
        f"  serviceTotalPaise:{TOTAL},\n"
        "  wafidThirdPartyFeeIncluded:false,\n"
        "  supportEmail:'info@assignmentvenuecentre.me',\n"
        "  supportPhone:'+91 9473286356',\n"
        "  note:'AVC Razorpay service payment is INR 1,770. Wafid third-party cost is separate. Key Secret remains server-side.'\n"
        "});\n",
        encoding='utf-8'
    )

    lines = [
        'AVC Phase 20.1 final live payment deployment',
        f"status={'success_live_checkout' if checkout else 'blocked_not_live'}",
        f"worker_deployed={'yes' if deploy_ok else 'no'}",
        f"worker_razorpay_secrets_set={'yes' if secrets_ok else 'no'}",
        f"payment_api_health={'yes' if health else 'no'}",
        f"checkout_enabled={'yes' if checkout else 'no'}",
        f'avc_service_base_paise={BASE}',
        f'gst_rate_percent={GST_RATE}',
        f'gst_paise={GST}',
        f'razorpay_order_total_paise={TOTAL}',
        'wafid_third_party_fee_included=no',
        f"razorpay_webhook_secret_present={'yes' if webhook else 'no'}",
        f"trusted_business_claim_enabled={'yes' if trusted else 'no'}",
        'secret_values_exposed=no',
        f"checked_at_utc={time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}",
    ]
    STATUS.write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print(STATUS.read_text(encoding='utf-8'))


if __name__ == '__main__':
    main()
