#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import time
import urllib.request
from datetime import date
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://assignmentvenuecentre.me"
PUBLIC = {"open", "closing-soon"}


def load_jobs() -> list[dict]:
    data = json.loads((ROOT / "data/jobs.json").read_text(encoding="utf-8"))
    return list(data.get("jobs") or [])


def is_active(job: dict) -> bool:
    if str(job.get("status", "")).lower() not in PUBLIC:
        return False
    valid = str(job.get("validThrough") or "")
    try:
        return bool(valid) and date.fromisoformat(valid) >= date.today()
    except ValueError:
        return False


def schema_eligible(job: dict) -> bool:
    org = job.get("hiringOrganization") or {}
    return bool(
        org.get("public") is True
        and org.get("name")
        and job.get("country")
        and job.get("title")
        and job.get("summary")
        and job.get("publishedAt")
        and job.get("validThrough")
    )


def active_jobs() -> list[dict]:
    return [job for job in load_jobs() if is_active(job)]


def static_check() -> int:
    jobs = load_jobs()
    active = active_jobs()
    generated = sorted((ROOT / "vacancies").glob("*.html")) if (ROOT / "vacancies").exists() else []
    failures: list[str] = []
    warnings: list[str] = []

    active_slugs = {str(job.get("slug") or "") for job in active}
    generated_slugs = {path.stem for path in generated}
    if generated_slugs != active_slugs:
        failures.append(f"generated slugs mismatch: active={sorted(active_slugs)} generated={sorted(generated_slugs)}")

    eligible_slugs = {str(job.get("slug")) for job in active if schema_eligible(job)}
    for path in generated:
        html = path.read_text(encoding="utf-8")
        slug = path.stem
        canonical = f"{BASE}/vacancies/{slug}.html"
        if canonical not in html:
            failures.append(f"{slug}: canonical URL missing")
        has_schema = '"@type":"JobPosting"' in html
        if (slug in eligible_slugs) != has_schema:
            failures.append(f"{slug}: structured-data eligibility mismatch")
        if has_schema and "Assignment Venue Center vacancy reference" not in html:
            failures.append(f"{slug}: structured-data identifier missing")
        if "Recruitment boundary:" not in html:
            failures.append(f"{slug}: responsibility boundary missing")
        if "../assets/avc-vacancy-spec.css" not in html:
            failures.append(f"{slug}: vacancy detail stylesheet missing")
        if "../assets/vacancy-page.js" not in html:
            failures.append(f"{slug}: vacancy detail script missing")

    listing_js = (ROOT / "assets/jobs.js").read_text(encoding="utf-8")
    if "vacancies/" not in listing_js:
        failures.append("public listings do not link detail pages")
    if "JobPosting" in listing_js:
        failures.append("public listings script must not inject detail structured data")

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if f"Sitemap: {BASE}/sitemap-jobs.xml" not in robots:
        failures.append("robots.txt missing jobs sitemap")

    sitemap = ET.parse(ROOT / "sitemap-jobs.xml").getroot()
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    actual_urls = sorted(node.text for node in sitemap.findall("s:url/s:loc", ns) if node.text)
    expected_urls = sorted(f"{BASE}/vacancies/{job['slug']}.html" for job in active)
    if actual_urls != expected_urls:
        failures.append("jobs sitemap URLs do not match active detail pages")

    result = {
        "status": "success" if not failures else "failed",
        "total_jobs": len(jobs),
        "active_jobs": len(active),
        "generated_pages": len(generated),
        "jobposting_eligible": len(eligible_slugs),
        "failures": failures,
        "warnings": warnings,
    }
    (ROOT / "phase13-static.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 0 if not failures else 1


def fetch_live(path: str, attempts: int = 30) -> tuple[int, str]:
    last = ""
    for _ in range(attempts):
        stamp = str(int(time.time()))
        sep = "&" if "?" in path else "?"
        url = f"{BASE}{path}{sep}phase13={stamp}"
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "AVC-Public-Page-Gate/1.1", "Cache-Control": "no-cache"},
            )
            with urllib.request.urlopen(req, timeout=20) as response:
                body = response.read().decode("utf-8", "replace")
                if response.status == 200:
                    return response.status, body
                last = str(response.status)
        except Exception as exc:
            last = str(exc)
        time.sleep(10)
    raise RuntimeError(last)


def live_check() -> int:
    active = active_jobs()
    static_path = ROOT / "phase13-static.json"
    static = json.loads(static_path.read_text(encoding="utf-8")) if static_path.exists() else {}
    failures: list[str] = []
    live: list[str] = []

    checks = [
        ("/jobs.html", "Current opportunities"),
        ("/assets/jobs.js", "View vacancy details"),
        ("/sitemap-jobs.xml", "<urlset"),
        ("/robots.txt", "sitemap-jobs.xml"),
    ]
    for path, marker in checks:
        try:
            code, body = fetch_live(path)
            ok = marker in body
            live.append(f"{BASE + path} -> {code}; marker={'yes' if ok else 'no'}")
            if not ok:
                failures.append(f"{path}: expected marker missing")
        except Exception as exc:
            failures.append(f"{path}: {exc}")
            live.append(f"{BASE + path} -> failed")

    for job in active:
        slug = str(job.get("slug") or "")
        path = f"/vacancies/{slug}.html"
        try:
            code, body = fetch_live(path)
            schema = '"@type":"JobPosting"' in body
            eligible = schema_eligible(job)
            has_spec = "AVC / JOB SPEC" in body
            live.append(
                f"{BASE + path} -> {code}; JobPosting={'yes' if schema else 'no'}; spec={'yes' if has_spec else 'no'}"
            )
            if schema != eligible:
                failures.append(f"{slug}: live structured-data eligibility mismatch")
            if not has_spec:
                failures.append(f"{slug}: live detail spec marker missing")
        except Exception as exc:
            failures.append(f"{path}: {exc}")

    lines = [
        "AVC Phase 13 vacancy pages gate",
        f"status: {'success' if not failures else 'failed'}",
        f"total_jobs: {static.get('total_jobs', len(load_jobs()))}",
        f"active_jobs: {static.get('active_jobs', len(active))}",
        f"generated_pages: {static.get('generated_pages', 0)}",
        f"jobposting_eligible: {static.get('jobposting_eligible', 0)}",
        f"failures: {len(failures)}",
        f"warnings: {len(static.get('warnings', []))}",
        "failure_details:",
        *failures,
        "live_details:",
        *live,
        "checked_at_utc: " + time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    ]
    (ROOT / "phase13-status.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    return 0 if not failures else 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=["static", "live"])
    args = parser.parse_args()
    raise SystemExit(static_check() if args.mode == "static" else live_check())


if __name__ == "__main__":
    main()
