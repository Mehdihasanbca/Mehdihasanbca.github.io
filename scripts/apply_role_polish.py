from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
TARGETS = ["jobs.html", "candidates.html", "employers.html", "partners.html"]
LINK = '<link rel="stylesheet" href="assets/avc-role-polish.css?v=20260828-p3">'


def patch(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "avc-role-polish.css" in text:
        updated = re.sub(
            r'<link rel="stylesheet" href="assets/avc-role-polish\.css\?v=[^"]+">',
            LINK,
            text,
            count=1,
        )
    else:
        updated = text.replace("</head>", f"  {LINK}\n</head>", 1)
    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


changed: list[str] = []
for name in TARGETS:
    path = ROOT / name
    if path.exists() and patch(path):
        changed.append(name)

print(f"AVC role polish linked on {len(changed)} page(s)")
for rel in changed:
    print(rel)
