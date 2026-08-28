from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
LINK = '<link rel="stylesheet" href="assets/avc-polish.css?v=20260828-p1">'
VACANCY_LINK = '<link rel="stylesheet" href="../assets/avc-polish.css?v=20260828-p1">'


def patch(path: Path, link: str) -> bool:
    text = path.read_text(encoding="utf-8")
    if "avc-polish.css" in text:
        updated = re.sub(
            r'<link rel="stylesheet" href="(?:\.\./)?assets/avc-polish\.css\?v=[^"]+">',
            link,
            text,
            count=1,
        )
    else:
        updated = text.replace("</head>", f"  {link}\n</head>", 1)
    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


changed: list[str] = []
for path in sorted(ROOT.glob("*.html")):
    if patch(path, LINK):
        changed.append(path.relative_to(ROOT).as_posix())

vacancies = ROOT / "vacancies"
if vacancies.exists():
    for path in sorted(vacancies.glob("*.html")):
        if patch(path, VACANCY_LINK):
            changed.append(path.relative_to(ROOT).as_posix())

print(f"AVC polish stylesheet linked on {len(changed)} page(s)")
for rel in changed:
    print(rel)
