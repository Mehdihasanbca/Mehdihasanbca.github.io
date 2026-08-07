from pathlib import Path

ROOT=Path('.')
STAMP='20260807-p20'

def read(p): return (ROOT/p).read_text(encoding='utf-8')
def write(p,t): (ROOT/p).write_text(t,encoding='utf-8')

# Global footer discovery without adding more primary-nav clutter.
p='assets/site.js'; t=read(p)
if '<a href="medical-booking.html">Medical booking</a>' not in t:
    t=t.replace('<a href="knowledge.html">Knowledge & FAQ</a></div></div>', '<a href="knowledge.html">Knowledge & FAQ</a><a href="medical-booking.html">Medical booking</a></div></div>',1)
if '<a href="payment-trust.html">Payment trust</a>' not in t:
    t=t.replace('<a href="disclaimer.html">Disclaimer</a></div></div>', '<a href="disclaimer.html">Disclaimer</a><a href="payment-trust.html">Payment trust</a><a href="payment-refund.html">Payment & refunds</a></div></div>',1)
write(p,t)

# Engagement classification.
p='assets/measurement.js'; t=read(p)
if "return 'medical_booking'" not in t:
    anchor="if(href.includes('knowledge.html'))return 'knowledge_hub';"
    if anchor not in t: raise SystemExit('measurement anchor missing')
    repl="if(href.includes('medical-booking.html'))return 'medical_booking';\n    if(href.includes('payment-trust.html'))return 'payment_trust';\n    if(href.includes('payment-refund.html'))return 'payment_refund';\n    "+anchor
    t=t.replace(anchor,repl,1)
write(p,t)

# SEO breadcrumb labels.
p='assets/seo.js'; t=read(p)
if "'payment-trust.html':'Payment Trust Center'" not in t:
    anchor="'knowledge.html':'Knowledge & FAQ Center'"
    if anchor not in t: raise SystemExit('seo knowledge label missing')
    t=t.replace(anchor,anchor+",'medical-booking.html':'Wafid Medical Booking Assistance','payment-trust.html':'Payment Trust Center','payment-refund.html':'Payment & Refund Policy'",1)
write(p,t)

# Resources Hub: add real working public pages only.
p='resources.html'; t=read(p)
if 'href="medical-booking.html"' not in t:
    anchor='<article class="resource-card" data-resource-card data-audience="candidate"><span class="tag">Candidate tool</span><h3>Candidate Readiness Checklist</h3>'
    cards='<article class="resource-card" data-resource-card data-audience="candidate company"><span class="tag">Medical support</span><h3>Wafid Medical Booking Assistance</h3><p>Operator-assisted Wafid/GAMCA booking support with transparent fee, payment and responsibility boundaries.</p><a class="text-link" href="medical-booking.html">Medical booking support →</a></article><article class="resource-card" data-resource-card data-audience="candidate company employer partner"><span class="tag">Payments</span><h3>Payment Trust Center</h3><p>Verify AVC payment rules, Razorpay security boundaries and the payment/refund policy before paying.</p><a class="text-link" href="payment-trust.html">Payment trust & safety →</a></article>'
    if anchor not in t: raise SystemExit('resources checklist anchor missing')
    t=t.replace(anchor,cards+anchor,1)
write(p,t)

# Sitemap entries.
p='sitemap.xml'; t=read(p)
anchor='  <url><loc>https://assignmentvenuecentre.me/knowledge.html</loc><changefreq>monthly</changefreq><priority>0.85</priority><lastmod>2026-08-07</lastmod></url>\n'
entries=(anchor+
'  <url><loc>https://assignmentvenuecentre.me/medical-booking.html</loc><changefreq>monthly</changefreq><priority>0.85</priority><lastmod>2026-08-07</lastmod></url>\n'
'  <url><loc>https://assignmentvenuecentre.me/payment-trust.html</loc><changefreq>monthly</changefreq><priority>0.8</priority><lastmod>2026-08-07</lastmod></url>\n'
'  <url><loc>https://assignmentvenuecentre.me/payment-refund.html</loc><changefreq>monthly</changefreq><priority>0.75</priority><lastmod>2026-08-07</lastmod></url>\n')
if 'https://assignmentvenuecentre.me/payment-trust.html' not in t:
    if anchor not in t: raise SystemExit('sitemap knowledge anchor missing')
    t=t.replace(anchor,entries,1)
write(p,t)

# Cache-bust global scripts across root pages.
for path in ROOT.glob('*.html'):
    text=path.read_text(encoding='utf-8')
    for oldv in ['20260807-p16','20260807-p17','20260807-p18','20260807-p19']:
        text=text.replace(f'assets/site.js?v={oldv}',f'assets/site.js?v={STAMP}')
        text=text.replace(f'assets/measurement.js?v={oldv}',f'assets/measurement.js?v={STAMP}')
    path.write_text(text,encoding='utf-8')

# Keep future metadata and generated vacancy pages on current global asset version.
p='scripts/phase12_search_growth.py'; t=read(p)
for oldv in ['20260807-p18','20260807-p19']:
    t=t.replace(f'assets/measurement.js?v={oldv}',f'assets/measurement.js?v={STAMP}')
write(p,t)

p='scripts/build_job_pages.py'; t=read(p)
for oldv in ['20260807-p18','20260807-p19']:
    t=t.replace(f'../assets/site.js?v={oldv}',f'../assets/site.js?v={STAMP}')
write(p,t)

print('Phase 20 payment trust and medical booking integration applied')
