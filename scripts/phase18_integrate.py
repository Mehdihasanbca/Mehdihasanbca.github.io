from pathlib import Path

ROOT=Path('.')
STAMP='20260807-p18'

def read(p): return (ROOT/p).read_text(encoding='utf-8')
def write(p,t): (ROOT/p).write_text(t,encoding='utf-8')

# Global primary navigation.
p='assets/site.js'; t=read(p)
old="const navItems=[['./','Home','index.html'],['about.html','About AVC','about.html'],['services.html','Services','services.html'],['jobs.html','Jobs','jobs.html'],['access.html','Access','access.html'],['trust-center.html','Trust','trust-center.html'],['contact.html','Contact','contact.html']];"
new="const navItems=[['./','Home','index.html'],['about.html','About AVC','about.html'],['services.html','Services','services.html'],['jobs.html','Jobs','jobs.html'],['resources.html','Resources','resources.html'],['access.html','Access','access.html'],['trust-center.html','Trust','trust-center.html'],['contact.html','Contact','contact.html']];"
if old in t: t=t.replace(old,new,1)
elif new not in t: raise SystemExit('site.js nav pattern not found')
if "['resources.html','Resources & Tools']" not in t:
    anchor="['brochure.html','Company brochure']"
    if anchor in t:
        t=t.replace(anchor,anchor+",['resources.html','Resources & Tools']")
# ensure dynamically-created footer also exposes resources
if '<a href="resources.html">Resources & Tools</a>' not in t:
    t=t.replace('<a href="partners.html">Recruitment partners</a></div></div>', '<a href="partners.html">Recruitment partners</a><a href="resources.html">Resources & Tools</a></div></div>',1)
write(p,t)

# Engagement classification.
p='assets/measurement.js'; t=read(p)
if "return 'resources_hub'" not in t:
    anchor="if(href.includes('brochure.html'))return 'company_brochure';"
    if anchor not in t: raise SystemExit('measurement anchor missing')
    t=t.replace(anchor,"if(href.includes('candidate-readiness.html'))return 'candidate_readiness';\n    if(href.includes('resources.html'))return 'resources_hub';\n    "+anchor,1)
write(p,t)

# SEO breadcrumb labels.
p='assets/seo.js'; t=read(p)
if "'resources.html':'Resources & Tools'" not in t:
    anchor="'brochure.html':'Company Brochure'"
    if anchor not in t: raise SystemExit('seo brochure label missing')
    t=t.replace(anchor,anchor+",'resources.html':'Resources & Tools','candidate-readiness.html':'Candidate Readiness Checklist'",1)
write(p,t)

# Sitemap entries.
p='sitemap.xml'; t=read(p)
anchor='  <url><loc>https://assignmentvenuecentre.me/jobs.html</loc><changefreq>daily</changefreq><priority>0.95</priority><lastmod>2026-08-07</lastmod></url>\n'
entries=(anchor+
'  <url><loc>https://assignmentvenuecentre.me/resources.html</loc><changefreq>monthly</changefreq><priority>0.85</priority><lastmod>2026-08-07</lastmod></url>\n'
'  <url><loc>https://assignmentvenuecentre.me/candidate-readiness.html</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>2026-08-07</lastmod></url>\n')
if 'https://assignmentvenuecentre.me/resources.html' not in t:
    if anchor not in t: raise SystemExit('sitemap jobs anchor missing')
    t=t.replace(anchor,entries,1)
write(p,t)

# Cache-bust changed global scripts on root HTML pages.
for path in ROOT.glob('*.html'):
    text=path.read_text(encoding='utf-8')
    for oldv in ['20260807-p10','20260807-p15','20260807-p16','20260807-p17']:
        text=text.replace(f'assets/site.js?v={oldv}',f'assets/site.js?v={STAMP}')
        text=text.replace(f'assets/measurement.js?v={oldv}',f'assets/measurement.js?v={STAMP}')
    path.write_text(text,encoding='utf-8')

# Keep future metadata runs on current measurement version.
p='scripts/phase12_search_growth.py'; t=read(p)
for oldv in ['20260807-p12','20260807-p16','20260807-p17']:
    t=t.replace(f'assets/measurement.js?v={oldv}',f'assets/measurement.js?v={STAMP}')
write(p,t)

# Keep future generated vacancy pages on current global site version.
p='scripts/build_job_pages.py'; t=read(p)
for oldv in ['20260807-p10','20260807-p16','20260807-p17']:
    t=t.replace(f'../assets/site.js?v={oldv}',f'../assets/site.js?v={STAMP}')
write(p,t)

print('Phase 18 resources integration applied')
