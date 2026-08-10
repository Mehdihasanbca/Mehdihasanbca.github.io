#!/usr/bin/env python3
"""Create/fetch/cancel AVC Wafid medical-assistance Razorpay Payment Links.

Security:
- Requires RAZORPAY_LIVE_API_KEY and RAZORPAY_LIVE_KEY_SECRET in environment.
- Never put the secret in browser JavaScript or GitHub-tracked config.
- Intended for a private operator machine or secure backend/private runner.
- Does not accept/store passport data.
"""
from __future__ import annotations

import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request

API = "https://api.razorpay.com/v1"
TOTAL_PAISE = 177000
BASE_PAISE = 150000
GST_PAISE = 27000
CALLBACK_URL = "https://assignmentvenuecentre.me/payment-confirmation.html"
CASE_RE = re.compile(r"^AVC-MED-[A-Z0-9-]{4,28}$")


def credentials() -> tuple[str, str]:
    key = os.environ.get("RAZORPAY_LIVE_API_KEY", "").strip()
    secret = os.environ.get("RAZORPAY_LIVE_KEY_SECRET", "").strip()
    if not key.startswith("rzp_live_") or not secret:
        raise SystemExit("Live Razorpay credentials are not configured in the environment.")
    return key, secret


def request(method: str, path: str, payload: dict | None = None) -> dict:
    key, secret = credentials()
    token = base64.b64encode(f"{key}:{secret}".encode()).decode()
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(
        API + path,
        data=data,
        method=method,
        headers={"Authorization": "Basic " + token, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "replace")
        raise SystemExit(f"Razorpay API error HTTP {exc.code}: {body[:600]}") from exc


def create(case_reference: str, description: str | None = None) -> dict:
    case_reference = case_reference.strip().upper()
    if not CASE_RE.fullmatch(case_reference):
        raise SystemExit("Case reference must match AVC-MED-XXXX (uppercase letters/numbers/hyphen; max 36 chars).")
    # Reference IDs must be unique. Check first so an operator does not accidentally
    # create a second payable link for the same AVC medical case.
    existing = request("GET", "/payment_links/?reference_id=" + urllib.parse.quote(case_reference))
    for item in existing.get("payment_links", existing.get("items", [])) or []:
        if item.get("reference_id") == case_reference and item.get("status") in {"created", "issued", "partially_paid", "paid"}:
            raise SystemExit(f"An existing Razorpay Payment Link already uses case reference {case_reference} (status={item.get('status')}).")

    payload = {
        "amount": TOTAL_PAISE,
        "currency": "INR",
        "accept_partial": False,
        "description": description or "AVC Wafid medical booking assistance: INR 1,500 service fee + INR 270 GST. Wafid third-party fee separate.",
        "reference_id": case_reference,
        "notify": {"sms": False, "email": False},
        "reminder_enable": False,
        "callback_url": CALLBACK_URL,
        "callback_method": "get",
        "notes": {
            "service": "wafid_booking_assistance",
            "avc_case_reference": case_reference,
            "avc_service_base_paise": str(BASE_PAISE),
            "gst_paise": str(GST_PAISE),
            "wafid_fee_included": "no",
        },
    }
    result = request("POST", "/payment_links", payload)
    if result.get("amount") != TOTAL_PAISE or result.get("currency") != "INR":
        raise SystemExit("Razorpay returned an unexpected amount/currency; link not accepted.")
    return result


def safe_output(item: dict, include_url: bool = False) -> dict:
    out = {
        "id": item.get("id"),
        "reference_id": item.get("reference_id"),
        "status": item.get("status"),
        "amount": item.get("amount"),
        "amount_paid": item.get("amount_paid"),
        "currency": item.get("currency"),
        "callback_url": item.get("callback_url"),
    }
    if include_url:
        out["short_url"] = item.get("short_url")
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="AVC Razorpay medical Payment Link operations")
    sub = parser.add_subparsers(dest="command", required=True)

    p_create = sub.add_parser("create", help="Create a new case-specific ₹1,770 Payment Link")
    p_create.add_argument("--case", required=True, dest="case_reference")
    p_create.add_argument("--show-url", action="store_true", help="Print the shareable Razorpay URL. Use only in a private terminal.")

    p_fetch = sub.add_parser("fetch", help="Fetch a Payment Link by Razorpay link ID")
    p_fetch.add_argument("--id", required=True, dest="payment_link_id")
    p_fetch.add_argument("--show-url", action="store_true")

    p_cancel = sub.add_parser("cancel", help="Cancel an unpaid Payment Link")
    p_cancel.add_argument("--id", required=True, dest="payment_link_id")

    args = parser.parse_args()
    if args.command == "create":
        item = create(args.case_reference)
        print(json.dumps(safe_output(item, args.show_url), indent=2))
    elif args.command == "fetch":
        item = request("GET", "/payment_links/" + urllib.parse.quote(args.payment_link_id))
        print(json.dumps(safe_output(item, args.show_url), indent=2))
    else:
        item = request("POST", "/payment_links/" + urllib.parse.quote(args.payment_link_id) + "/cancel")
        print(json.dumps(safe_output(item, False), indent=2))
    return 0


if __name__ == "__main__":
    # imported here to keep all URL encoding explicit and avoid accidental query construction
    import urllib.parse
    sys.exit(main())
