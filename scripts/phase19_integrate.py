from pathlib import Path

ROOT=Path('.')
STAMP='20260807-p19'

def read(p): return (ROOT/p).read_text(encoding='utf-8')
def write(p,t): (ROOT/p).write_text(t,encoding='utf-8')

# Global footer discovery + current SEO loader.
p='assets/site.js'; t=read(p)
if '<a href="knowledge.html">Knowledge & FAQ</a>' not in t:
    anchor='<a href="resources.html">Resources & Tools</a></div></div>'
    if anchor in t:
        t=t.replace(anchor,'<a href="resources.html">Resources & Tools</a><a href="knowledge.html">Knowledge & FAQ</a></div></div>',1)
if "['knowledge.html','Knowledge & FAQ']" not in t:
    anchor="['resources.html','Resources & Tools']"
    if anchor in t:
        t=t.replace(anchor,anchor+",['knowledge.html','Knowledge & FAQ']",1)
t=t.replace("assets/seo.js?v=20260807-p17","assets/seo.js?v=20260807-p19")
t=t.replace("assets/seo.js?v=20260807-p18","assets/seo.js?v=20260807-p19")
write(p,t)

# Resource Hub: expose Knowledge Center as a verified working resource.
p='resources.html'; t=read(p)
if 'Knowledge & FAQ Center' not in t:
    anchor='<div class="resource-grid">'
    card='<article class="resource-card" data-resource-card data-audience="candidate employer partner company"><span class="tag">Knowledge</span><h3>Knowledge & FAQ Center</h3><p>Search AVC answers on applications, interviews, documents, employer requirements, recruitment partners, safety, office verification and process responsibility.</p><a class="text-link" href="knowledge.html">Search AVC answers →</a></article>'
    if anchor not in t: raise SystemExit('resources.html resource grid anchor missing')
    t=t.replace(anchor,anchor+card,1)
write(p,t)

# Engagement classification.
p='assets/measurement.js'; t=read(p)
if "return 'knowledge_hub'" not in t:
    anchor="if(href.includes('candidate-readiness.html'))return 'candidate_readiness';"
    if anchor not in t: raise SystemExit('measurement candidate-readiness anchor missing')
    t=t.replace(anchor,"if(href.includes('knowledge.html'))return 'knowledge_hub';\n    "+anchor,1)
write(p,t)

# SEO breadcrumb label.
p='assets/seo.js'; t=read(p)
if "'knowledge.html':'Knowledge & FAQ Center'" not in t:
    anchor="'resources.html':'Resources & Tools'"
    if anchor not in t: raise SystemExit('seo resources label missing')
    t=t.replace(anchor,anchor+",'knowledge.html':'Knowledge & FAQ Center'",1)
write(p,t)

# Public sitemap.
p='sitemap.xml'; t=read(p)
if 'https://assignmentvenuecentre.me/knowledge.html' not in t:
    anchor='  <url><loc>https://assignmentvenuecentre.me/resources.html</loc><changefreq>monthly</changefreq><priority>0.85</priority><lastmod>2026-08-07</lastmod></url>\n'
    entry=anchor+'  <url><loc>https://assignmentvenuecentre.me/knowledge.html</loc><changefreq>monthly</changefreq><priority>0.85</priority><lastmod>2026-08-07</lastmod></url>\n'
    if anchor not in t: raise SystemExit('sitemap resources anchor missing')
    t=t.replace(anchor,entry,1)
write(p,t)

# Cache-bust changed global scripts across root pages.
for path in ROOT.glob('*.html'):
    text=path.read_text(encoding='utf-8')
    for oldv in ['20260807-p10','20260807-p15','20260807-p16','20260807-p17','20260807-p18']:
        text=text.replace(f'assets/site.js?v={oldv}',f'assets/site.js?v={STAMP}')
        text=text.replace(f'assets/measurement.js?v={oldv}',f'assets/measurement.js?v={STAMP}')
    path.write_text(text,encoding='utf-8')

# Future metadata runs should keep current measurement asset version.
p='scripts/phase12_search_growth.py'; t=read(p)
for oldv in ['20260807-p12','20260807-p16','20260807-p17','20260807-p18']:
    t=t.replace(f'assets/measurement.js?v={oldv}',f'assets/measurement.js?v={STAMP}')
write(p,t)

# Future generated vacancy pages should use current global assets.
p='scripts/build_job_pages.py'; t=read(p)
for oldv in ['20260807-p10','20260807-p16','20260807-p17','20260807-p18']:
    t=t.replace(f'../assets/site.js?v={oldv}',f'../assets/site.js?v={STAMP}')
    t=t.replace(f'../assets/measurement.js?v={oldv}',f'../assets/measurement.js?v={STAMP}')
write(p,t)

print('Phase 19 Knowledge Center integration applied')
