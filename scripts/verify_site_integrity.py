#!/usr/bin/env python3
"""Verify AVC static-site links, sitemaps, and public architecture using only stdlib."""

from __future__ import annotations

import sys
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
import xml.etree.ElementTree as ET

SITE_HOST = "assignmentvenuecentre.me"
ROOT = Path(__file__).resolve().parents[1]
IGNORED_SCHEMES = {"mailto", "tel", "javascript", "data", "blob"}
RETIRED_ASSETS = {
    "assets/final-polish.css",
    "assets/human-home.css",
    "assets/human-pages.css",
    "assets/candidate-hub.js",
}
RETIRED_PHASE10 = {
    "phase10-status.txt",
    "phase10-trigger.txt",
    ".github/workflows/phase10-launch-lock.yml",
}
RETIRED_WAFID_PAYMENT = {
    "medical-booking.html",
    "guide-wafid-medical-booking.html",
    "payment-trust.html",
    "payment-refund.html",
    "payment-confirmation.html",
    "assets/payment.css",
    "assets/payment.js",
    "assets/payment-config.js",
    "assets/payment-page-config.js",
    "assets/medical-v2.css",
    "assets/medical-v2.js",
    "worker/payment-api.js",
    "wrangler.toml",
    "docs/RAZORPAY-HOSTED-PAYMENT-PAGE.md",
    "docs/RAZORPAY-MEDICAL-PAYMENT-SETUP.md",
    "phase20-api-fingerprint-trigger.txt",
    "phase20-api-production-fingerprint.txt",
    "scripts/activate_hosted_payment_page.py",
    "scripts/deploy_payment_live.py",
    "scripts/finalize_payment_activation.py",
    "scripts/phase20_api_fingerprint.py",
    "scripts/phase20_hosted_payment_gate.py",
    "scripts/phase20_integrate.py",
    "scripts/phase20_wafid_v2_live_gate.py",
    "scripts/razorpay_medical_payment_link.py",
    ".github/workflows/phase20-api-fingerprint.yml",
    ".github/workflows/phase20-hosted-payment.yml",
    ".github/workflows/phase20-live-razorpay.yml",
    ".github/workflows/phase20-simple.yml",
    ".github/workflows/phase20-wafid-v2-live-gate.yml",
}
RETIRED_PUBLIC_MARKERS = {
    "medical-booking.html",
    "guide-wafid-medical-booking.html",
    "payment-trust.html",
    "payment-refund.html",
    "payment-confirmation.html",
    "/api/payments/",
}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.refs: list[tuple[str, str]] = []
        self.robots: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value for key, value in attrs if value is not None}
        for attr in ("href", "src"):
            value = values.get(attr)
            if value:
                self.refs.append((attr, value.strip()))
        if tag.lower() == "meta" and values.get("name", "").lower() == "robots":
            self.robots.append(values.get("content", "").lower())


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    return parser


def is_noindex(parser: PageParser) -> bool:
    return any("noindex" in content for content in parser.robots)


def local_target(source: Path, raw: str) -> Path | None:
    raw = raw.strip()
    if not raw or raw.startswith("#") or raw.startswith("//"):
        return None

    parsed = urlparse(raw)
    if parsed.scheme and parsed.scheme.lower() in IGNORED_SCHEMES:
        return None

    if parsed.scheme in {"http", "https"}:
        if (parsed.hostname or "").lower() != SITE_HOST:
            return None
        rel = unquote(parsed.path or "/").lstrip("/")
        target = ROOT / rel
    elif parsed.scheme:
        return None
    else:
        rel = unquote(parsed.path)
        if not rel:
            return None
        target = ROOT / rel.lstrip("/") if rel.startswith("/") else source.parent / rel

    target = target.resolve()
    try:
        target.relative_to(ROOT.resolve())
    except ValueError:
        return target

    clean_raw = raw.split("?", 1)[0].split("#", 1)[0]
    if target.is_dir() or clean_raw.endswith("/"):
        target = target / "index.html"
    return target


def path_from_site_url(raw: str) -> Path | None:
    parsed = urlparse(raw)
    if (parsed.hostname or "").lower() != SITE_HOST:
        return None
    rel = unquote(parsed.path or "/").lstrip("/")
    if not rel:
        return ROOT / "index.html"
    target = ROOT / rel
    return target / "index.html" if parsed.path.endswith("/") else target


def sitemap_urls(name: str, errors: list[str]) -> set[str]:
    path = ROOT / name
    if not path.exists():
        errors.append(f"missing sitemap file: {name}")
        return set()
    try:
        tree = ET.parse(path)
    except ET.ParseError as exc:
        errors.append(f"invalid XML in {name}: {exc}")
        return set()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    return {
        (node.text or "").strip()
        for node in tree.findall(".//sm:loc", namespace)
        if (node.text or "").strip()
    }


def display(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def verify_architecture(errors: list[str]) -> None:
    for rel in sorted(RETIRED_ASSETS | RETIRED_PHASE10 | RETIRED_WAFID_PAYMENT):
        if (ROOT / rel).exists():
            errors.append(f"retired artifact still present: {rel}")

    homepage = (ROOT / "index.html").read_text(encoding="utf-8", errors="replace")
    if 'class="avc-grid-ui avc-home"' not in homepage:
        errors.append("homepage missing avc-grid-ui avc-home body marker")
    if "assets/avc-gridline-home.css" not in homepage:
        errors.append("homepage missing avc-gridline-home.css source of truth")

    site_js = (ROOT / "assets/site.js").read_text(encoding="utf-8", errors="replace")
    for retired in ("final-polish.css", "human-home.css", "human-pages.css", "candidate-hub.js"):
        if retired in site_js:
            errors.append(f"site.js still references retired asset: {retired}")

    public_sources = list(ROOT.glob("*.html")) + [
        ROOT / "assets/site.js",
        ROOT / "assets/measurement.js",
        ROOT / "sitemap.xml",
        ROOT / "sitemap-jobs.xml",
    ]
    for source in public_sources:
        if not source.exists():
            continue
        text = source.read_text(encoding="utf-8", errors="replace")
        for marker in sorted(RETIRED_PUBLIC_MARKERS):
            if marker in text:
                errors.append(f"retired Wafid/payment reference remains in {display(source)}: {marker}")

    cname = (ROOT / "CNAME").read_text(encoding="utf-8", errors="replace").strip()
    if cname != SITE_HOST:
        errors.append(f"CNAME mismatch: expected {SITE_HOST}, found {cname!r}")

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8", errors="replace")
    required = {
        f"Sitemap: https://{SITE_HOST}/sitemap.xml",
        f"Sitemap: https://{SITE_HOST}/sitemap-jobs.xml",
    }
    for line in sorted(required):
        if line not in robots:
            errors.append(f"robots.txt missing: {line}")


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    html_files = sorted(ROOT.rglob("*.html"))
    page_cache: dict[Path, PageParser] = {}
    inbound: dict[Path, set[Path]] = defaultdict(set)

    for page in html_files:
        parser = parse_page(page)
        page_cache[page.resolve()] = parser
        for attr, raw in parser.refs:
            target = local_target(page, raw)
            if target is None:
                continue
            if not target.exists():
                errors.append(f"broken {attr}: {display(page)} -> {raw} ({display(target)})")
                continue
            if target.suffix.lower() == ".html":
                inbound[target.resolve()].add(page.resolve())

    main_sitemap = sitemap_urls("sitemap.xml", errors)
    jobs_sitemap = sitemap_urls("sitemap-jobs.xml", errors)
    all_sitemap_urls = main_sitemap | jobs_sitemap
    main_sitemap_paths: set[Path] = set()
    all_sitemap_paths: set[Path] = set()

    for name, urls in (("sitemap.xml", main_sitemap), ("sitemap-jobs.xml", jobs_sitemap)):
        for url in sorted(urls):
            target = path_from_site_url(url)
            if target is None:
                errors.append(f"external/invalid URL in {name}: {url}")
                continue
            resolved = target.resolve()
            all_sitemap_paths.add(resolved)
            if name == "sitemap.xml":
                main_sitemap_paths.add(resolved)
            if not target.exists():
                errors.append(f"missing sitemap target: {name} -> {url} ({display(target)})")

    root_pages = sorted(ROOT.glob("*.html"))
    indexable_root: set[Path] = set()
    noindex_root: set[Path] = set()
    for page in root_pages:
        parser = page_cache.get(page.resolve()) or parse_page(page)
        (noindex_root if is_noindex(parser) else indexable_root).add(page.resolve())

    for page in sorted(indexable_root):
        if page not in main_sitemap_paths:
            errors.append(f"indexable root page missing from sitemap.xml: {display(page)}")

    for page in sorted(noindex_root):
        if page in all_sitemap_paths:
            errors.append(f"noindex page must not appear in a sitemap: {display(page)}")

    for page in sorted(indexable_root):
        if page.name == "index.html":
            continue
        sources = {src for src in inbound.get(page, set()) if src != page}
        if not sources:
            warnings.append(f"no static inbound HTML link found: {display(page)}")

    verify_architecture(errors)

    print(
        "AVC site integrity: "
        f"{len(html_files)} HTML files, {len(all_sitemap_urls)} sitemap URLs, "
        f"{len(errors)} error(s), {len(warnings)} warning(s)"
    )
    for warning in warnings:
        print(f"WARN: {warning}")
    for error in errors:
        print(f"ERROR: {error}")

    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
