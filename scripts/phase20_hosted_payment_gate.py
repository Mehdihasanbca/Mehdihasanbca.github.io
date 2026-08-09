from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "assets" / "payment-page-config.js"
MEDICAL = ROOT / "medical-booking.html"
CONFIRM = ROOT / "payment-confirmation.html"
PRIVACY = ROOT / "privacy.html"
DOC = ROOT / "docs" / "RAZORPAY-HOSTED-PAYMENT-PAGE.md"
STATIC = ROOT / "phase20-hosted-payment-static.json"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def require(condition: bool, message: str, failures: list[str]) -> None:
    if not condition:
        failures.append(message)


def extract_bool(text: str, key: str) -> bool | None:
    m = re.search(rf"\b{re.escape(key)}\s*:\s*(true|false)", text, re.I)
    return None if not m else m.group(1).lower() == "true"


def extract_int(text: str, key: str) -> int | None:
    m = re.search(rf"\b{re.escape(key)}\s*:\s*(\d+)", text)
    return None if not m else int(m.group(1))


def extract_string(text: str, key: str) -> str | None:
    m = re.search(rf"\b{re.escape(key)}\s*:\s*['\"]([^'\"]*)['\"]", text)
    return None if not m else m.group(1)


def main() -> int:
    failures: list[str] = []
    warnings: list[str] = []

    for path in (CONFIG, MEDICAL, CONFIRM, PRIVACY, DOC):
        require(path.exists(), f"missing:{path.relative_to(ROOT)}", failures)

    if failures:
        result = {"status": "failure", "failures": failures, "warnings": warnings}
        STATIC.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(result, indent=2))
        return 1

    cfg = read(CONFIG)
    medical = read(MEDICAL)
    confirm = read(CONFIRM)
    privacy = read(PRIVACY)
    doc = read(DOC)

    enabled = extract_bool(cfg, "enabled")
    url = extract_string(cfg, "url") or ""
    amount = extract_int(cfg, "amountPaise")
    base = extract_int(cfg, "serviceBasePaise")
    gst = extract_int(cfg, "gstPaise")
    gst_rate = extract_int(cfg, "gstRate")

    require(amount == 177000, "payment_page_amount_must_be_177000_paise", failures)
    require(base == 150000, "service_base_must_be_150000_paise", failures)
    require(gst == 27000, "gst_must_be_27000_paise", failures)
    require(gst_rate == 18, "gst_rate_must_be_18_percent", failures)
    require("wafidThirdPartyFeeIncluded:false" in cfg.replace(" ", ""), "wafid_fee_must_be_separate", failures)
    require("RAZORPAY_KEY_SECRET" not in cfg and "RAZORPAY_LIVE_KEY_SECRET" not in cfg, "public_config_must_not_contain_key_secret", failures)
    require("CLOUDFLARE_API_TOKEN" not in cfg, "public_config_must_not_contain_cloudflare_token", failures)

    allowed = bool(re.match(r"^https://(rzp\.io|pages\.razorpay\.com)/", url, re.I))
    if enabled is True:
        require(allowed, "enabled_payment_page_requires_official_razorpay_url", failures)
    else:
        require(url == "", "disabled_payment_page_url_should_be_empty", failures)

    for marker in (
        "Full Name as per Passport",
        "Passport Number",
        "Nationality",
        "GCC Destination Country",
        "Current City / Medical City",
        "Profession / Trade",
        "AVC Case Reference",
        "₹1,770",
        "payment-page-config.js",
        "payment-page.js",
    ):
        require(marker in medical, f"medical_page_missing:{marker}", failures)

    require('name="robots" content="noindex,follow"' in confirm, "confirmation_page_must_be_noindex", failures)
    require("screenshot alone" in confirm.lower(), "confirmation_page_must_reject_screenshot_only_confirmation", failures)
    require("Razorpay-hosted Payment Page" in privacy, "privacy_must_disclose_razorpay_hosted_page", failures)
    require("passport number" in privacy.lower(), "privacy_must_disclose_passport_number_collection", failures)
    require("Never pre-populate a passport number" in doc, "setup_doc_must_forbid_passport_url_prefill", failures)
    require("authorize AVC" in doc, "setup_doc_must_include_candidate_authorization", failures)
    require("Fixed Amount" in doc and "1770" in doc, "setup_doc_must_lock_fixed_amount", failures)

    status = "failure" if failures else (
        "ready_live_url_configured" if enabled is True and allowed else "ready_pending_razorpay_dashboard_publish"
    )
    if enabled is not True:
        warnings.append("live_razorpay_payment_page_url_not_configured")

    result = {
        "status": status,
        "failures": failures,
        "warnings": warnings,
        "payment_architecture": "razorpay_hosted_payment_page",
        "payment_page_enabled": bool(enabled),
        "payment_page_url_official_host": allowed,
        "service_base_paise": base,
        "gst_rate_percent": gst_rate,
        "gst_paise": gst,
        "total_paise": amount,
        "wafid_third_party_fee_included": False,
        "confirmation_page_noindex": True,
        "passport_url_prefill_allowed": False,
        "public_secret_required": False,
    }
    STATIC.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
