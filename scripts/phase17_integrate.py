from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
STAMP='20260807-p17'

def read(path): return (ROOT/path).read_text(encoding='utf-8')
def write(path,text): (ROOT/path).write_text(text,encoding='utf-8')

# Global footer discovery + current SEO loader version.
site_path='assets/site.js'
site=read(site_path)
site=site.replace("['about.html','About AVC'],['company-verification.html','Company verification'],['office.html','Office'],['media.html','Media']","['about.html','About AVC'],['company-verification.html','Company verification'],['office.html','Office'],['media.html','Media'],['brochure.html','Company brochure']")
site=site.replace("<a href=\"media.html\">Media</a></div></div>","<a href=\"media.html\">Media</a><a href=\"brochure.html\">Company brochure</a></div></div>")
site=site.replace("seo.src='assets/seo.js?v=20260807-p10'","seo.src='assets/seo.js?v=20260807-p17'")
write(site_path,site)

# Measurement classification.
measurement_path='assets/measurement.js'
measurement=read(measurement_path)
needle="if(href.includes('access.html'))return 'access_center';"
if "return 'company_brochure'" not in measurement:
    measurement=measurement.replace(needle,"if(href.includes('brochure.html'))return 'company_brochure';\n    "+needle,1)
write(measurement_path,measurement)

# SEO breadcrumb label.
seo_path='assets/seo.js'
seo=read(seo_path)
if "'brochure.html':'Company Brochure'" not in seo:
    anchor="'company-verification.html':'Company Verification','services.html':'Services'"
    seo=seo.replace(anchor,"'company-verification.html':'Company Verification','brochure.html':'Company Brochure','services.html':'Services'",1)
write(seo_path,seo)

# Sitemap entry.
sitemap_path='sitemap.xml'
sitemap=read(sitemap_path)
if 'https://assignmentvenuecentre.me/brochure.html' not in sitemap:
    anchor='  <url><loc>https://assignmentvenuecentre.me/media.html</loc><changefreq>weekly</changefreq><priority>0.75</priority><lastmod>2026-08-07</lastmod></url>\n'
    entry=anchor+'  <url><loc>https://assignmentvenuecentre.me/brochure.html</loc><changefreq>monthly</changefreq><priority>0.85</priority><lastmod>2026-08-07</lastmod></url>\n'
    if anchor not in sitemap: raise SystemExit('media sitemap anchor missing')
    sitemap=sitemap.replace(anchor,entry,1)
write(sitemap_path,sitemap)

# Media hub discovery card and CTA.
media_path='media.html'
media=read(media_path)
if 'Open company brochure' not in media:
    anchor='<article class="verify-card"><span class="status">Official</span><h3>Email</h3><p>Business, recruitment coordination and verification enquiries.</p><a class="text-link" href="mailto:info@assignmentvenuecentre.me">info@assignmentvenuecentre.me →</a></article>'
    card=anchor+'<article class="verify-card"><span class="status">Official</span><h3>Digital Company Brochure</h3><p>Print/share-friendly AVC company profile with services, verification, contact and application QR.</p><a class="text-link" href="brochure.html">Open company brochure →</a></article>'
    if anchor not in media: raise SystemExit('media email card anchor missing')
    media=media.replace(anchor,card,1)
    cta='<a class="button light" href="https://whatsapp.com/channel/0029Vb7mJuWF1YlQJ0sKSn06" target="_blank" rel="noopener noreferrer">WhatsApp Channel</a>'
    media=media.replace(cta,cta+'<a class="button light" href="brochure.html">Company Brochure</a>',1)
write(media_path,media)

# Cache-bust global scripts on root public pages.
for p in ROOT.glob('*.html'):
    t=p.read_text(encoding='utf-8')
    for old in ['assets/site.js?v=20260807-p16','assets/site.js?v=20260807-p10','assets/site.js?v=20260807-p10-p10']:
        t=t.replace(old,f'assets/site.js?v={STAMP}')
    for old in ['assets/measurement.js?v=20260807-p16','assets/measurement.js?v=20260807-p15','assets/measurement.js?v=20260807-p12']:
        t=t.replace(old,f'assets/measurement.js?v={STAMP}')
    t=t.replace('assets/seo.js?v=20260807-p17','assets/seo.js?v=20260807-p17')
    p.write_text(t,encoding='utf-8')

# Future generated vacancy pages and future SEO metadata additions use current versions.
gen_path='scripts/build_job_pages.py'
gen=read(gen_path).replace('../assets/site.js?v=20260807-p16',f'../assets/site.js?v={STAMP}').replace('../assets/site.js?v=20260807-p10',f'../assets/site.js?v={STAMP}')
write(gen_path,gen)
phase12_path='scripts/phase12_search_growth.py'
phase12=read(phase12_path)
phase12=phase12.replace('assets/measurement.js?v=20260807-p16',f'assets/measurement.js?v={STAMP}').replace('assets/measurement.js?v=20260807-p12',f'assets/measurement.js?v={STAMP}')
write(phase12_path,phase12)
print('Phase 17 brochure integration applied')
