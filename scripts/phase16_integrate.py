from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STAMP = "20260807-p16"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def write(path: str, text: str) -> None:
    (ROOT / path).write_text(text, encoding="utf-8")


# Global navigation: make Access Center a primary public route while Office remains
# available from the footer/company navigation.
site_path = "assets/site.js"
site = read(site_path)
old_nav = "const navItems=[['./','Home','index.html'],['about.html','About AVC','about.html'],['services.html','Services','services.html'],['jobs.html','Jobs','jobs.html'],['office.html','Office','office.html'],['trust-center.html','Trust','trust-center.html'],['contact.html','Contact','contact.html']];"
new_nav = "const navItems=[['./','Home','index.html'],['about.html','About AVC','about.html'],['services.html','Services','services.html'],['jobs.html','Jobs','jobs.html'],['access.html','Access','access.html'],['trust-center.html','Trust','trust-center.html'],['contact.html','Contact','contact.html']];"
if old_nav in site:
    site = site.replace(old_nav, new_nav, 1)
elif new_nav not in site:
    raise SystemExit("site.js primary navigation pattern not found")

marker = "// Phase 16 access integration"
if marker not in site:
    site += f'''\n\n{marker}\nif(current==='candidates.html'){{\n  const actions=document.querySelector('.about-hero .hero-actions');\n  if(actions&&!actions.querySelector('a[href="access.html"]')){{const a=document.createElement('a');a.className='button secondary';a.href='access.html';a.textContent='Access Center';actions.appendChild(a)}}\n}}\nif(footer){{\n  const serviceHeading=[...footer.querySelectorAll('h3')].find(el=>el.textContent.trim().toLowerCase()==='services');\n  const companyHeading=[...footer.querySelectorAll('h3')].find(el=>el.textContent.trim().toLowerCase()==='company');\n  const target=(serviceHeading?.nextElementSibling?.classList.contains('footer-links')?serviceHeading.nextElementSibling:(companyHeading?.nextElementSibling?.classList.contains('footer-links')?companyHeading.nextElementSibling:null));\n  if(target&&!target.querySelector('a[href="access.html"]')){{const a=document.createElement('a');a.href='access.html';a.textContent='Access Center';target.appendChild(a)}}\n}}\n'''
write(site_path, site)

# Engagement classification for the new public access route and compatibility URLs.
measurement_path = "assets/measurement.js"
measurement = read(measurement_path)
needle = "if(href.includes('apply.html'))return 'apply_gateway';"
addition = "if(href.includes('access.html'))return 'access_center';\n    if(href.includes('portal/candidate/login'))return 'legacy_candidate_access';\n    if(href.includes('register/candidate'))return 'legacy_candidate_register';\n    " + needle
if "return 'access_center'" not in measurement:
    if needle not in measurement:
        raise SystemExit("measurement.js classify insertion point not found")
    measurement = measurement.replace(needle, addition, 1)
write(measurement_path, measurement)

# SEO breadcrumb label.
seo_path = "assets/seo.js"
seo = read(seo_path)
if "'access.html':'Access Center'" not in seo:
    anchor = "'jobs.html':'Jobs','candidates.html':'Candidates'"
    if anchor not in seo:
        raise SystemExit("seo.js labels insertion point not found")
    seo = seo.replace(anchor, "'jobs.html':'Jobs','access.html':'Access Center','candidates.html':'Candidates'", 1)
write(seo_path, seo)

# Public sitemap: Access Center is indexable; compatibility routes remain noindex and
# intentionally stay out of the sitemap.
sitemap_path = "sitemap.xml"
sitemap = read(sitemap_path)
access_url = "https://assignmentvenuecentre.me/access.html"
if access_url not in sitemap:
    anchor = '  <url><loc>https://assignmentvenuecentre.me/jobs.html</loc><changefreq>daily</changefreq><priority>0.95</priority><lastmod>2026-08-07</lastmod></url>\n'
    entry = anchor + '  <url><loc>https://assignmentvenuecentre.me/access.html</loc><changefreq>monthly</changefreq><priority>0.85</priority><lastmod>2026-08-07</lastmod></url>\n'
    if anchor not in sitemap:
        raise SystemExit("sitemap jobs anchor not found")
    sitemap = sitemap.replace(anchor, entry, 1)
write(sitemap_path, sitemap)

# Cache-bust the changed global JS assets on every root public HTML page.
for path in ROOT.glob("*.html"):
    text = path.read_text(encoding="utf-8")
    text = text.replace("assets/site.js?v=20260807-p10", f"assets/site.js?v={STAMP}")
    text = text.replace("assets/site.js?v=20260807-p10-p10", f"assets/site.js?v={STAMP}")
    text = text.replace("assets/measurement.js?v=20260807-p12", f"assets/measurement.js?v={STAMP}")
    text = text.replace("assets/measurement.js?v=20260807-p15", f"assets/measurement.js?v={STAMP}")
    path.write_text(text, encoding="utf-8")

# Preserve future generated vacancy pages on the same navigation version.
generator_path = "scripts/build_job_pages.py"
generator = read(generator_path)
generator = generator.replace("../assets/site.js?v=20260807-p10", f"../assets/site.js?v={STAMP}")
write(generator_path, generator)

# Future Phase-12 metadata runs must use the current measurement asset version when
# they add it to a newly created root page.
phase12_path = "scripts/phase12_search_growth.py"
phase12 = read(phase12_path)
phase12 = phase12.replace("assets/measurement.js?v=20260807-p12", f"assets/measurement.js?v={STAMP}")
write(phase12_path, phase12)

print("Phase 16 access integration applied")
