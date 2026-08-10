from __future__ import annotations

import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "assets" / "payment-page-config.js"
STATUS = ROOT / "phase20-hosted-payment-activation.txt"

ALLOWED_HOSTS = {"rzp.io", "pages.razorpay.com"}
EXPECTED_TOTAL = 177000


def valid_official_url(value: str) -> bool:
    try:
        u = urlparse(value)
    except Exception:
        return False
    return u.scheme == "https" and (u.hostname or "").lower() in ALLOWED_HOSTS and bool(u.path and u.path != "/")


def fetch_effective_url(value: str) -> tuple[bool, str, str]:
    req = Request(value, headers={"User-Agent": "AVC-Payment-Page-Activation/1.0"})
    try:
        with urlopen(req, timeout=25) as response:
            final = response.geturl()
            code = getattr(response, "status", 200)
            ok = 200 <= int(code) < 400 and valid_official_url(final)
            return ok, final, str(code)
    except Exception as exc:
        return False, "", type(exc).__name__


def write_config(url: str, enabled: bool) -> None:
    safe_url = url.replace("'", "%27") if enabled else ""
    text = f"""window.AVC_RAZORPAY_PAYMENT_PAGE=Object.freeze({{
  enabled:{str(enabled).lower()},
  url:'{safe_url}',
  amountPaise:177000,
  serviceBasePaise:150000,
  gstPaise:27000,
  gstRate:18,
  currency:'INR',
  wafidThirdPartyFeeIncluded:false,
  confirmationUrl:'https://assignmentvenuecentre.me/payment-confirmation.html',
  note:'Razorpay Hosted Payment Page for AVC medical booking assistance. Public payment activation is allowed only for an official Razorpay hosted URL.'
}});
"""
    CONFIG.write_text(text, encoding="utf-8")


def write_status(status: str, supplied: bool, url_ok: bool, http_ok: bool, effective: str, detail: str) -> None:
    STATUS.write_text(
        "\n".join(
            [
                "AVC Phase 20.3 Hosted Payment Page activation",
                f"status={status}",
                f"repo_variable_present={'yes' if supplied else 'no'}",
                f"official_url_format={'yes' if url_ok else 'no'}",
                f"official_url_live_fetch={'yes' if http_ok else 'no'}",
                f"effective_official_host={'yes' if effective and valid_official_url(effective) else 'no'}",
                f"checkout_enabled={'yes' if status == 'active' else 'no'}",
                f"razorpay_payment_page_total_paise={EXPECTED_TOTAL}",
                "wafid_third_party_fee_included=no",
                "passport_url_prefill_allowed=no",
                "secret_values_exposed=no",
                f"detail={detail}",
                "",
            ]
        ),
        encoding="utf-8",
    )


def main() -> int:
    raw = os.environ.get("RAZORPAY_PAYMENT_PAGE_URL", "").strip()
    if not raw:
        write_config("", False)
        write_status("pending_variable", False, False, False, "", "Set repository variable RAZORPAY_PAYMENT_PAGE_URL after publishing the live Razorpay Payment Page.")
        return 0

    url_ok = valid_official_url(raw)
    if not url_ok:
        write_config("", False)
        write_status("blocked_invalid_url", True, False, False, "", "Repository variable is not an allowed official Razorpay hosted URL.")
        return 2

    http_ok, effective, detail = fetch_effective_url(raw)
    if not http_ok:
        write_config("", False)
        write_status("blocked_unreachable_or_redirect", True, True, False, effective, f"Live fetch failed or left official Razorpay hosts: {detail}")
        return 3

    write_config(raw, True)
    write_status("active", True, True, True, effective, "Official Razorpay hosted URL validated. Website payment handoff enabled.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
