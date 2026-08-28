from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

REPLACEMENTS = {
    "payment-trust.html": "trust-center.html",
    "payment-refund.html": "terms.html",
    "payment-confirmation.html": "contact.html",
    "medical-booking.html": "contact.html",
    "guide-wafid-medical-india.html": "guides.html",
}

changed: list[str] = []

for path in sorted(ROOT.rglob("*.html")):
    text = path.read_text(encoding="utf-8")
    updated = text
    for old, new in REPLACEMENTS.items():
        updated = updated.replace(old, new)
    if updated != text:
        path.write_text(updated, encoding="utf-8")
        changed.append(path.relative_to(ROOT).as_posix())

site_js = ROOT / "assets" / "site.js"
if site_js.exists():
    text = site_js.read_text(encoding="utf-8")
    updated = re.sub(
        r"\nconst retiredRouteNeedles=\[[^\n]+\];\ndocument\.querySelectorAll\('a\[href\]'\)\.forEach\([^\n]+\);\n",
        "\n",
        text,
        count=1,
    )
    for old, new in REPLACEMENTS.items():
        updated = updated.replace(old, new)
    if updated != text:
        site_js.write_text(updated, encoding="utf-8")
        changed.append("assets/site.js")

print(f"Retired route cleanup updated {len(changed)} file(s)")
for rel in changed:
    print(rel)
