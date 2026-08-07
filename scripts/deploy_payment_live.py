from __future__ import annotations

import base64
import json
import os
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATUS = ROOT / "phase20-live-status.txt"
READINESS = ROOT / "phase20-secret-readiness.txt"
CONFIG = ROOT / "assets" / "payment-config.js"

BASE_PAISE = 150000
GST_RATE = 18
GST_PAISE = 27000
TOTAL_PAISE = 177000


def http_json(url: str, headers: dict[str, str] | None = None, timeout: int = 25):
    req = urllib.request.Request(url, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            body = res.read().decode("utf-8", "replace")
            return res.status, json.loads(body)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")
        try:
            data = json.loads(body)
        except Exception:
            data = {}
        return exc.code, data
    except Exception:
        return 0, {}


def run(cmd: list[str], *, env: dict[str, str], input_text: str | None = None, timeout: int = 180) -> bool:
    try:
        proc = subprocess.run(
            cmd,
            cwd=ROOT,
            env=env,
            input=input_text,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout,
            check=False,
        )
        return proc.returncode == 0
    except Exception:
        return False


def write_config(*, checkout: bool, key_id: str, trusted: bool, mode: str):
    public_key = key_id if checkout else ""
    CONFIG.write_text(
        "window.AVC_PAYMENT_CONFIG=Object.freeze({\n"
        f"  mode:'{mode}',\n"
        f"  checkoutEnabled:{str(checkout).lower()},\n"
        f"  trustedBusinessClaimEnabled:{str(trusted).lower()},\n"
        f"  razorpayKeyId:'{public_key}',\n"
        "  orderEndpoint:'/api/payments/order',\n"
        "  verifyEndpoint:'/api/payments/verify',\n"
        "  webhookManagedServerSide:true,\n"
        f"  serviceBasePaise:{BASE_PAISE},\n"
        f"  gstRate:{GST_RATE},\n"
        f"  gstPaise:{GST_PAISE},\n"
        f"  serviceTotalPaise:{TOTAL_PAISE},\n"
        "  wafidThirdPartyFeeIncluded:false,\n"
        "  supportEmail:'info@assignmentvenuecentre.me',\n"
        "  supportPhone:'+91 9473286356',\n"
        "  note:'AVC Razorpay service payment is INR 1,770. Wafid third-party cost is separate. Key Secret remains server-side.'\n"
        "});\n",
        encoding="utf-8",
    )


def main():
    key_id = os.getenv("RAZORPAY_LIVE_API_KEY", "").strip()
    key_secret = os.getenv("RAZORPAY_LIVE_KEY_SECRET", "").strip()
    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "").strip()
    cf_token = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
    trusted = os.getenv("RAZORPAY_TRUSTED_BUSINESS_ENABLED", "").strip().lower() == "true"

    mode = "live" if key_id.startswith("rzp_live_") else ("test" if key_id.startswith("rzp_test_") else "unknown")
    state = {
        "razorpay_key_id_present": bool(key_id),
        "razorpay_key_secret_present": bool(key_secret),
        "razorpay_mode": mode,
        "razorpay_api_auth": False,
        "cloudflare_api_token_present": bool(cf_token),
        "cloudflare_api_auth": False,
        "worker_deployed": False,
        "worker_razorpay_secrets_set": False,
        "payment_api_health": False,
        "checkout_enabled": False,
        "razorpay_webhook_secret_present": bool(webhook_secret),
        "trusted_business_claim_enabled": trusted,
    }

    # Razorpay credential verification: read-only list orders request.
    if key_id and key_secret:
        basic = base64.b64encode(f"{key_id}:{key_secret}".encode()).decode()
        code, _ = http_json(
            "https://api.razorpay.com/v1/orders?count=1",
            {"Authorization": f"Basic {basic}", "Accept": "application/json"},
        )
        state["razorpay_api_auth"] = code == 200

    # Cloudflare token verification.
    if cf_token:
        code, data = http_json(
            "https://api.cloudflare.com/client/v4/user/tokens/verify",
            {"Authorization": f"Bearer {cf_token}", "Content-Type": "application/json"},
        )
        state["cloudflare_api_auth"] = code == 200 and bool(data.get("success"))

    env = dict(os.environ)
    if cf_token:
        env["CLOUDFLARE_API_TOKEN"] = cf_token

    if state["razorpay_api_auth"] and mode == "live" and state["cloudflare_api_auth"]:
        installed = run(["npm", "install", "--no-save", "wrangler@4"], env=env, timeout=240)
        if installed:
            state["worker_deployed"] = run(["npx", "wrangler", "deploy"], env=env, timeout=240)
        if state["worker_deployed"]:
            key_ok = run(["npx", "wrangler", "secret", "put", "RAZORPAY_KEY_ID"], env=env, input_text=key_id + "\n")
            secret_ok = run(["npx", "wrangler", "secret", "put", "RAZORPAY_KEY_SECRET"], env=env, input_text=key_secret + "\n")
            if webhook_secret:
                run(["npx", "wrangler", "secret", "put", "RAZORPAY_WEBHOOK_SECRET"], env=env, input_text=webhook_secret + "\n")
            state["worker_razorpay_secrets_set"] = key_ok and secret_ok

    if state["worker_razorpay_secrets_set"]:
        for _ in range(15):
            code, data = http_json(f"https://assignmentvenuecentre.me/api/payments/health?ts={int(time.time())}")
            if (
                code == 200
                and data.get("service") == "avc-payment-api"
                and data.get("razorpayConfigured") is True
                and data.get("totalPaise") == TOTAL_PAISE
                and data.get("wafidThirdPartyFeeIncluded") is False
            ):
                state["payment_api_health"] = True
                break
            time.sleep(6)

    state["checkout_enabled"] = bool(
        state["razorpay_api_auth"]
        and state["cloudflare_api_auth"]
        and state["worker_razorpay_secrets_set"]
        and state["payment_api_health"]
        and mode == "live"
    )

    write_config(checkout=state["checkout_enabled"], key_id=key_id, trusted=trusted, mode=mode)

    readiness_lines = [
        "AVC Razorpay secret readiness probe",
        f"razorpay_live_api_key_present={'yes' if state['razorpay_key_id_present'] else 'no'}",
        f"razorpay_live_key_secret_present={'yes' if state['razorpay_key_secret_present'] else 'no'}",
        f"razorpay_mode={mode}",
        f"razorpay_api_auth={'yes' if state['razorpay_api_auth'] else 'no'}",
        f"cloudflare_api_token_present={'yes' if state['cloudflare_api_token_present'] else 'no'}",
        f"cloudflare_api_auth={'yes' if state['cloudflare_api_auth'] else 'no'}",
        f"razorpay_webhook_secret_present={'yes' if state['razorpay_webhook_secret_present'] else 'no'}",
        f"avc_service_base_paise={BASE_PAISE}",
        f"gst_rate_percent={GST_RATE}",
        f"gst_paise={GST_PAISE}",
        f"razorpay_order_total_paise={TOTAL_PAISE}",
        "wafid_third_party_fee_included=no",
        "secret_values_exposed=no",
        f"checked_at_utc={time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}",
    ]
    READINESS.write_text("\n".join(readiness_lines) + "\n", encoding="utf-8")

    status_lines = [
        "AVC Phase 20.1 final live payment deployment",
        f"status={'success_live_checkout' if state['checkout_enabled'] else 'blocked_not_live'}",
        f"razorpay_api_auth={'yes' if state['razorpay_api_auth'] else 'no'}",
        f"cloudflare_api_auth={'yes' if state['cloudflare_api_auth'] else 'no'}",
        f"worker_deployed={'yes' if state['worker_deployed'] else 'no'}",
        f"worker_razorpay_secrets_set={'yes' if state['worker_razorpay_secrets_set'] else 'no'}",
        f"payment_api_health={'yes' if state['payment_api_health'] else 'no'}",
        f"checkout_enabled={'yes' if state['checkout_enabled'] else 'no'}",
        f"avc_service_base_paise={BASE_PAISE}",
        f"gst_rate_percent={GST_RATE}",
        f"gst_paise={GST_PAISE}",
        f"razorpay_order_total_paise={TOTAL_PAISE}",
        "wafid_third_party_fee_included=no",
        f"razorpay_webhook_secret_present={'yes' if state['razorpay_webhook_secret_present'] else 'no'}",
        f"trusted_business_claim_enabled={'yes' if trusted else 'no'}",
        "secret_values_exposed=no",
        f"checked_at_utc={time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}",
    ]
    STATUS.write_text("\n".join(status_lines) + "\n", encoding="utf-8")

    print(STATUS.read_text(encoding="utf-8"))


if __name__ == "__main__":
    main()
