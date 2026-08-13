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


def location_text(job: dict) -> str:
    return ", ".join(x for x in [job.get("city"), job.get("country")] if x)


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


def ledger_row(label: str, value: str, *, raw: bool = False) -> str:
    shown = value if raw else escape(str(value))
    return (
        '<div class="vacancy-row">'
        f'<div class="vacancy-key">{escape(label)}</div>'
        f'<div class="vacancy-value">{shown}</div>'
        '</div>'
    )


def render(job: dict) -> str:
    slug = job["slug"]
    url = f"{BASE}/vacancies/{slug}.html"
    apply_url = f"../apply.html?source=vacancy&job={quote(str(job['id']), safe='')}"
    org = job.get("hiringOrganization") or {}
    agent = job.get("recruitingAgent") or {}
    jid = str(job["id"])
    title = escape(job["title"])
    summary = escape(job["summary"])
    location = location_text(job)
    status = str(job.get("status") or "open").lower()
    status_class = " closing" if status == "closing-soon" else ""

    rows = [
        ledger_row("Vacancy reference", jid),
        ledger_row("Status", f'<span class="vacancy-status{status_class}">{escape(display_status(status))}</span>', raw=True),
        ledger_row("Job title", job["title"]),
        ledger_row("Location", location),
        ledger_row("Category", job["category"]),
    ]
    if org.get("public") is True and org.get("name"):
        rows.append(ledger_row("Hiring organization", org["name"]))
    if agent.get("public") is True and agent.get("name"):
        rows.append(ledger_row("Recruitment stakeholder", agent["name"]))
    if job.get("salaryDisplay"):
        rows.append(ledger_row("Salary / compensation", job["salaryDisplay"]))
    if job.get("requirements"):
        rows.append(ledger_row("Key requirements", job["requirements"]))
    if job.get("benefits"):
        rows.append(ledger_row("Benefits", job["benefits"]))
    rows.extend([
        ledger_row("Published", fmt(job.get("publishedAt"))),
        ledger_row("Last verified", fmt(job.get("lastVerifiedAt"))),
        ledger_row("Valid through", fmt(job.get("validThrough"))),
    ])
    ledger = "".join(rows)

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

    return f'''<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#071827">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="description" content="{summary}">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="en-IN" href="{url}">
  <link rel="alternate" hreflang="x-default" href="{url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Assignment Venue Center">
  <meta property="og:title" content="{title} | Assignment Venue Center">
  <meta property="og:description" content="{summary}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{BASE}/assets/avc-logo.png">
  <meta property="og:image:alt" content="Assignment Venue Center official logo">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="{title} | Assignment Venue Center">
  <meta name="twitter:description" content="{summary}">
  <meta name="twitter:image" content="{BASE}/assets/avc-logo.png">
  <title>{title} | AVC Vacancy {escape(jid)}</title>
  <link rel="icon" href="../assets/favicon.ico">
  <link rel="stylesheet" href="../assets/site.css?v=20260807-p10">
  <link rel="stylesheet" href="../assets/company.css?v=20260807-p10">
  <link rel="stylesheet" href="../assets/avc-gridline.css?v=20260813-g1">
  <link rel="stylesheet" href="../assets/avc-vacancy-spec.css?v=20260813-g5">
  {schema_html}
</head>
<body class="avc-grid-ui avc-vacancy-page">
<a class="skip-link" href="#main">Skip to main content</a>
<div class="topbar"><div class="container topbar-inner"><span>VACANCY / {escape(jid)}</span><div class="topbar-links"><a href="../jobs.html">All jobs</a><a href="../fraud-safety.html">Fraud safety</a></div></div></div>
<header class="site-header"><div class="container header-inner"><a class="brand" href="../" aria-label="Assignment Venue Center home"><img src="../assets/avc-logo.png" alt="Assignment Venue Center official logo"></a><button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false" data-nav-toggle>☰</button><nav class="site-nav" aria-label="Primary navigation" data-site-nav><a href="../">Home</a><a href="../about.html">About AVC</a><a href="../services.html">Services</a><a href="../jobs.html" aria-current="page">Jobs</a><a href="../resources.html">Resources</a><a href="../trust-center.html">Trust</a><a href="../contact.html">Contact</a></nav></div></header>
<main id="main">
<section class="vacancy-hero"><div class="container vacancy-hero-grid"><div class="vacancy-copy"><p class="vacancy-code">Public vacancy record · {escape(jid)}</p><h1>{title}</h1><p class="lead">{summary}</p><div class="vacancy-actions"><a class="button primary" href="{escape(apply_url)}">Continue to application</a><a class="button outline" href="{CHANNEL}" target="_blank" rel="noopener noreferrer">Official job updates</a></div></div><aside class="vacancy-console" aria-label="Vacancy summary"><div class="vacancy-console-head"><span>AVC / JOB SPEC</span><span>{escape(display_status(status))}</span></div><dl><div><dt>Reference</dt><dd>{escape(jid)}</dd></div><div><dt>Location</dt><dd>{escape(location)}</dd></div><div><dt>Category</dt><dd>{escape(job['category'])}</dd></div><div><dt>Valid through</dt><dd>{escape(fmt(job.get('validThrough')))}</dd></div></dl><button class="vacancy-copy-ref" type="button" data-copy-reference="{escape(jid)}">Copy vacancy reference</button></aside></div></section>
<section class="vacancy-section"><div class="container"><div class="vacancy-section-head"><span class="vacancy-section-code">01 / POSITION</span><h2>Public information for this requirement.</h2></div><div class="vacancy-ledger">{ledger}</div></div></section>
<section class="vacancy-section alt"><div class="container"><div class="vacancy-section-head"><span class="vacancy-section-code">02 / PROCESS</span><h2>From vacancy review to selection handoff.</h2></div><div class="vacancy-sequence"><article class="vacancy-step"><span>01</span><div><h3>Review</h3><p>Check the role, location, compensation, requirements and validity date.</p></div></article><article class="vacancy-step"><span>02</span><div><h3>Prepare</h3><p>Keep your factual CV and vacancy-specific documents or work samples ready.</p></div></article><article class="vacancy-step"><span>03</span><div><h3>Apply</h3><p>Continue through the AVC application route with this vacancy reference.</p></div></article><article class="vacancy-step"><span>04</span><div><h3>Selection handoff</h3><p>Interview, final selection and formal overseas processing continue with the concerned recruitment stakeholders.</p></div></article></div></div></section>
<section class="vacancy-section"><div class="container vacancy-boundary"><div><span class="vacancy-section-code">03 / RESPONSIBILITY</span><h2>Clear handoff after recruitment support.</h2></div><p><strong>Recruitment boundary:</strong> AVC provides recruitment support and coordination. Final selection, recruitment approval, visa processing, emigration and overseas deployment are handled by the concerned employer and/or registered Recruiting Agent, subject to the applicable process and verification.</p></div></section>
<section class="vacancy-cta"><div class="container"><div><span>AVC / NEXT ACTION</span><h2>Apply using reference {escape(jid)}.</h2></div><a class="button primary" href="{escape(apply_url)}">Continue to application</a></div></section>
</main>
<footer class="footer"><div class="container"><div class="footer-bottom"><span>© <span data-year></span> Assignment Venue Center</span><span>AVC / IND / VACANCY / {escape(jid)}</span><a href="../jobs.html">Back to jobs</a></div></div></footer>
<script src="../assets/vacancy-page.js?v=20260813-g5" defer></script>
<script src="../assets/measurement.js?v=20260807-p15" defer></script>
</body>
</html>'''


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
