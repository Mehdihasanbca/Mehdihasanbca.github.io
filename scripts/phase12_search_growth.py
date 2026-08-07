from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path('.')
BASE = 'https://assignmentvenuecentre.me/'
OG_IMAGE = BASE + 'assets/avc-logo-intro-poster.png'
LASTMOD = '2026-08-07'

META_PATTERNS = [
    r'<meta\s+property="og:[^"]+"[^>]*>\s*',
    r'<meta\s+name="twitter:[^"]+"[^>]*>\s*',
    r'<meta\s+property="twitter:[^"]+"[^>]*>\s*',
    r'<meta\s+property="og:site_name"[^>]*>\s*',
    r'<meta\s+property="og:locale"[^>]*>\s*',
    r'<link\s+rel="alternate"\s+hreflang="[^"]+"[^>]*>\s*',
]

def attr(text, pattern):
    m = re.search(pattern, text, flags=re.I | re.S)
    return m.group(1).strip() if m else ''

for path in sorted(ROOT.glob('*.html')):
    if path.name == '404.html':
        continue
    text = path.read_text(encoding='utf-8')
    title = attr(text, r'<title>(.*?)</title>')
    desc = attr(text, r'<meta\s+name="description"\s+content="([^"]*)"')
    canonical = attr(text, r'<link\s+rel="canonical"\s+href="([^"]+)"')
    if not (title and desc and canonical):
        raise SystemExit(f'{path.name}: missing title/description/canonical')

    for pattern in META_PATTERNS:
        text = re.sub(pattern, '', text, flags=re.I)

    # Normalize robots for indexable public pages.
    robots = '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">'
    if re.search(r'<meta\s+name="robots"[^>]*>', text, flags=re.I):
        text = re.sub(r'<meta\s+name="robots"[^>]*>', robots, text, count=1, flags=re.I)
    else:
        text = text.replace('</head>', robots + '</head>', 1)

    social = (
        f'<meta property="og:type" content="website">'
        f'<meta property="og:site_name" content="Assignment Venue Center">'
        f'<meta property="og:locale" content="en_IN">'
        f'<meta property="og:title" content="{title.replace(chr(34), "&quot;")}">'
        f'<meta property="og:description" content="{desc.replace(chr(34), "&quot;")}">'
        f'<meta property="og:url" content="{canonical}">'
        f'<meta property="og:image" content="{OG_IMAGE}">'
        f'<meta property="og:image:alt" content="Assignment Venue Center official brand presentation">'
        f'<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="twitter:title" content="{title.replace(chr(34), "&quot;")}">'
        f'<meta name="twitter:description" content="{desc.replace(chr(34), "&quot;")}">'
        f'<meta name="twitter:image" content="{OG_IMAGE}">'
        f'<link rel="alternate" hreflang="en-IN" href="{canonical}">'
        f'<link rel="alternate" hreflang="x-default" href="{canonical}">'
    )
    text = text.replace('</head>', social + '</head>', 1)

    if 'assets/measurement.js' not in text:
        text = text.replace('</body>', '<script src="assets/measurement.js?v=20260807-p12" defer></script></body>', 1)

    path.write_text(text, encoding='utf-8')

# Add lastmod to every sitemap URL while preserving the existing priorities/frequencies.
sitemap = ROOT / 'sitemap.xml'
ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
tree = ET.parse(sitemap)
root = tree.getroot()
ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
for url in root.findall('sm:url', ns):
    lastmod = url.find('sm:lastmod', ns)
    if lastmod is None:
        lastmod = ET.SubElement(url, '{http://www.sitemaps.org/schemas/sitemap/0.9}lastmod')
    lastmod.text = LASTMOD
tree.write(sitemap, encoding='utf-8', xml_declaration=True)
