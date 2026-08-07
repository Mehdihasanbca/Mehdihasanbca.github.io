from __future__ import annotations

import json
import re
from datetime import date, datetime
from html import escape
from pathlib import Path
from urllib.parse import quote, urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "jobs.json"
OUT = ROOT / "vacancies"
SITEMAP = ROOT / "sitemap-jobs.xml"
BASE = "https://assignmentvenuecentre.me"
CHANNEL = "https://whatsapp.com/channel/0029Vb7mJuWF1YlQJ0sKSn06"
PUBLIC = {"open", "closing-soon"}
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def iso_day(value: str, field: str) -> date:
    try:
        return date.fromisoformat(value)
    except Exception as exc:
        raise ValueError(f"{field} must be YYYY-MM-DD") from exc


def safe_https(value: str | None, fallback: str = "") -> str:
    if not value:
        return fallback
    parsed = urlparse(value)
    return value if parsed.scheme == "https" and parsed.netloc else fallback


def active(job: dict, today: date) -> bool:
    if str(job.get("status", "")).lower() not in PUBLIC:
        return False
    valid = job.get("validThrough")
    return bool(valid and iso_day(valid, "validThrough") >= today)


def schema_eligible(job: dict) -> bool:
    org = job.get("hiringOrganization") or {}
    return bool(
        org.get("public") is True
        and org.get("name")
        and job.get("title")
        and job.get("summary")
        and job.get("publishedAt")
        and job.get("validThrough")
        and job.get("country")
    )


def display_status(value: str) -> str:
    return "Closing soon" if value == "closing-soon" else "Open"


def fmt(value: str | None) -> str:
    if not value:
        return ""
    try:
        return datetime.strptime(value, "%Y-%m-%d").strftime("%d %b %Y")
    except ValueError:
        return value


def jobposting(job: dict, url: str) -> dict:
    org = job["hiringOrganization"]
    result = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job["title"],
        "description": job["summary"],
        "datePosted": job["publishedAt"],
        "validThrough": f"{job['validThrough']}T23:59:59+05:30",
        "employmentType": job.get("employmentType", "FULL_TIME"),
        "hiringOrganization": {"@type": "Organization", "name": org["name"]},
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": job.get("countryCode") or job["country"],
                **({"addressLocality": job["city"]} if job.get("city") else {}),
            },
        },
        "identifier": {
            "@type": "PropertyValue",
            "name": "Assignment Venue Center vacancy reference",
            "value": job["id"],
        },
        "url": url,
    }
    same_as = safe_https(org.get("sameAs"))
    if same_as:
        result["hiringOrganization"]["sameAs"] = same_as
    salary = job.get("baseSalary") or {}
    if salary.get("value") is not None and salary.get("currency"):
        result["baseSalary"] = {
            "@type": "MonetaryAmount",
            "currency": salary["currency"],
            "value": {
                "@type": "QuantitativeValue",
                "value": salary["value"],
                "unitText": salary.get("unitText", "MONTH"),
            },
        }
    return result


def render(job: dict) -> str:
    slug = job["slug"]
    url = f"{BASE}/vacancies/{slug}.html"
    apply_url = f"../apply.html?source=vacancy&job={quote(str(job['id']), safe='')}"
    org = job.get("hiringOrganization") or {}
    agent = job.get("recruitingAgent") or {}
    title = escape(job["title"])
    summary = escape(job["summary"])
    employer = (
        f'<div class="identity-row"><div class="identity-key">Hiring organization</div><div class="identity-value">{escape(org["name"])}</div></div>'
        if org.get("public") is True and org.get("name")
        else ""
    )
    stakeholder = (
        f'<div class="identity-row"><div class="identity-key">Recruitment stakeholder</div><div class="identity-value">{escape(agent["name"])}</div></div>'
        if agent.get("public") is True and agent.get("name")
        else ""
    )
    optional = []
    if job.get("salaryDisplay"):
        optional.append(("Salary / compensation", job["salaryDisplay"]))
    if job.get("requirements"):
        optional.append(("Key requirements", job["requirements"]))
    if job.get("benefits"):
        optional.append(("Benefits", job["benefits"]))
    extra = "".join(
        f'<div class="identity-row"><div class="identity-key">{escape(k)}</div><div class="identity-value">{escape(str(v))}</div></div>'
        for k, v in optional
    )
    schemas = [{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE}/"},
            {"@type": "ListItem", "position": 2, "name": "Jobs", "item": f"{BASE}/jobs.html"},
            {"@type": "ListItem", "position": 3, "name": job["title"], "item": url},
        ],
    }]
    if schema_eligible(job):
        schemas.append(jobposting(job, url))
    schema_html = "\n".join(
        f'<script type="application/ld+json">{json.dumps(s, ensure_ascii=False, separators=(",", ":"))}</script>'
        for s in schemas
    )
    schema_note = (
        "This page includes JobPosting structured data using the publicly approved actual hiring organization."
        if schema_eligible(job)
        else "This vacancy page does not publish JobPosting structured data because the actual hiring organization is not approved for public structured-data disclosure."
    )
    return f'''<!doctype html>
<html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0b1f3a"><meta name="robots" content="index,follow,max-image-preview:large"><meta name="description" content="{summary}"><link rel="canonical" href="{url}"><link rel="alternate" hreflang="en-IN" href="{url}"><link rel="alternate" hreflang="x-default" href="{url}"><meta property="og:type" content="website"><meta property="og:title" content="{title} | Assignment Venue Center"><meta property="og:description" content="{summary}"><meta property="og:url" content="{url}"><meta property="og:image" content="{BASE}/assets/avc-logo-intro-poster.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{title} | Assignment Venue Center"><meta name="twitter:description" content="{summary}"><meta name="twitter:image" content="{BASE}/assets/avc-logo-intro-poster.png"><title>{title} | AVC Vacancy {escape(job['id'])}</title><link rel="icon" href="../assets/favicon.ico"><link rel="stylesheet" href="../assets/site.css?v=20260807-p10"><link rel="stylesheet" href="../assets/company.css?v=20260807-p10"><link rel="stylesheet" href="../assets/business-pages.css?v=20260807-p10"><link rel="stylesheet" href="../assets/final-polish.css?v=20260807-p10">{schema_html}</head><body><a class="skip-link" href="#main">Skip to main content</a><div class="topbar"><div class="container topbar-inner"><span>Official AVC vacancy • {escape(job['id'])}</span><div class="topbar-links"><a href="../jobs.html">All jobs</a><a href="../fraud-safety.html">Fraud safety</a></div></div></div><header class="site-header"><div class="container header-inner"><a class="brand" href="../"><img src="../assets/avc-logo.png" alt="Assignment Venue Center official logo"></a><button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-nav-toggle>☰</button><nav class="site-nav" data-site-nav><a href="../">Home</a><a href="../about.html">About AVC</a><a href="../services.html">Services</a><a href="../jobs.html" aria-current="page">Jobs</a><a href="../trust-center.html">Trust</a><a href="../contact.html">Contact</a></nav></div></header><main id="main"><section class="business-hero"><div class="container business-hero-grid"><div><p class="eyebrow">Verified vacancy • {escape(job['id'])}</p><h1>{title}</h1><p class="lead">{summary}</p><div class="hero-actions"><a class="button primary" href="{escape(apply_url)}">Continue to application</a><a class="button secondary" href="{CHANNEL}" target="_blank" rel="noopener noreferrer">Official job updates</a></div></div><aside class="business-hero-card"><img src="../assets/avc-logo.png" alt="Assignment Venue Center official logo"><p><strong>Status:</strong> {display_status(job['status'])}<br><strong>Last verified:</strong> {fmt(job['lastVerifiedAt'])}<br><strong>Valid through:</strong> {fmt(job['validThrough'])}</p></aside></div></section><section class="business-section"><div class="container"><div class="business-heading"><span class="section-kicker">Vacancy details</span><h2>Public information verified for this requirement.</h2></div><div class="identity-table"><div class="identity-row"><div class="identity-key">Vacancy reference</div><div class="identity-value">{escape(job['id'])}</div></div><div class="identity-row"><div class="identity-key">Job title</div><div class="identity-value">{title}</div></div><div class="identity-row"><div class="identity-key">Location</div><div class="identity-value">{escape(', '.join(x for x in [job.get('city'), job.get('country')] if x))}</div></div><div class="identity-row"><div class="identity-key">Category</div><div class="identity-value">{escape(job['category'])}</div></div>{employer}{stakeholder}{extra}<div class="identity-row"><div class="identity-key">Published</div><div class="identity-value">{fmt(job['publishedAt'])}</div></div><div class="identity-row"><div class="identity-key">Last verified</div><div class="identity-value">{fmt(job['lastVerifiedAt'])}</div></div><div class="identity-row"><div class="identity-key">Valid through</div><div class="identity-value">{fmt(job['validThrough'])}</div></div></div></div></section><section class="business-section alt"><div class="container"><div class="boundary-box"><strong>Recruitment boundary:</strong> AVC provides recruitment support and coordination. Final selection, recruitment approval, visa processing, emigration and overseas deployment are handled by the concerned employer and/or registered Recruiting Agent, subject to applicable law and verification.</div><p class="evidence-note">{escape(schema_note)}</p></div></section><section class="cta"><div class="container cta-inner"><div><h2>Apply only through verified AVC channels.</h2><p>Keep the vacancy reference {escape(job['id'])} in your records.</p></div><a class="button light" href="{escape(apply_url)}">Continue to application</a></div></section></main><footer class="footer"><div class="container"><div class="footer-bottom"><span>© <span data-year></span> Assignment Venue Center.</span><a href="../jobs.html">Back to verified jobs</a></div></div></footer><script src="../assets/site.js?v=20260807-p17"></script><script src="../assets/measurement.js?v=20260807-p15" defer></script></body></html>'''


def main() -> None:
    raw = json.loads(DATA.read_text(encoding="utf-8"))
    jobs = raw.get("jobs") or []
    today = date.today()
    OUT.mkdir(exist_ok=True)
    for old in OUT.glob("*.html"):
        old.unlink()

    generated = []
    eligible = 0
    seen_slugs = set()
    for job in jobs:
        if not active(job, today):
            continue
        slug = str(job.get("slug", ""))
        if not SLUG_RE.fullmatch(slug):
            raise SystemExit(f"invalid public job slug: {slug!r}")
        if slug in seen_slugs:
            raise SystemExit(f"duplicate public job slug: {slug}")
        seen_slugs.add(slug)
        path = OUT / f"{slug}.html"
        path.write_text(render(job), encoding="utf-8")
        generated.append((job, path))
        eligible += int(schema_eligible(job))

    urls = "\n".join(
        f'  <url><loc>{BASE}/vacancies/{job["slug"]}.html</loc><lastmod>{job.get("lastVerifiedAt") or job.get("publishedAt")}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>'
        for job, _ in generated
    )
    SITEMAP.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'{urls}\n'
        '</urlset>\n',
        encoding="utf-8",
    )
    print(json.dumps({"generated": len(generated), "jobPostingEligible": eligible, "active": len(generated)}))


if __name__ == "__main__":
    main()
