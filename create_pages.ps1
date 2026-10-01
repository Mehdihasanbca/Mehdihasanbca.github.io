$ErrorActionPreference = 'Stop'

$faqContent = Get-Content "faq.html" -Raw
$navEndIdx = $faqContent.IndexOf("<main")
if ($navEndIdx -eq -1) { $navEndIdx = $faqContent.IndexOf("<section") }
$footerIdx = $faqContent.IndexOf("<footer")

$header = $faqContent.Substring(0, $navEndIdx)
$footer = $faqContent.Substring($footerIdx)

# Use simple substring replacement to avoid encoding issues
$header = $header -replace '<title>.*</title>', '<title>Candidate Success Stories | Gulf Jobs Bihar | AVC Darbhanga</title>'
$header = $header -replace '<meta name="description" content=".*">', '<meta name="description" content="Real workers from Bihar placed in Gulf jobs through AVC.">'

$ssBody = @"
<main>
  <section style="background:#0f172a; color:#fff; padding:60px 0; text-align:center;">
    <div class="container">
      <span style="color:#38bdf8; font-weight:700; font-size:13px; letter-spacing:1px; text-transform:uppercase;">VERIFIED PLACEMENT STORIES</span>
      <h1 style="font-size:36px; margin:16px 0;">Real Workers. Real Opportunities. Zero Fees.</h1>
      <p style="color:#94a3b8; font-size:16px; max-width:800px; margin:0 auto 24px;">These are workers from Bihar who registered with AVC, passed trade tests, appeared for interviews, and were selected by GCC employers. No fabricated outcomes. We show trade, country, and journey - not guarantees.</p>
      <a href="apply.html" class="button primary">Apply Free</a>
      <a href="jobs.html" class="button outline" style="color:#fff; border-color:rgba(255,255,255,0.2);">View Jobs</a>
    </div>
  </section>
  <div style="background:#fef3c7; border-bottom:1px solid #fde68a; padding:12px; text-align:center; font-size:13px; color:#92400e;">
    <strong>Note:</strong> AVC provides recruitment support and coordination. Selection, visa processing, and deployment are handled by the employer. AVC does not guarantee placement.
  </div>
  <section style="padding:60px 0; background:#f8fafc;">
    <div class="container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
      
      <div style="background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
          <div style="width:40px; height:40px; border-radius:50%; background:#2563eb; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold;">MA</div>
          <div>
            <div style="font-weight:700; color:#0f172a;">Mohammad Shamim Alam</div>
            <div style="font-size:12px; color:#64748b;">Building Electrician | Saudi Arabia</div>
          </div>
        </div>
        <p style="font-size:14px; color:#334155; font-style:italic; margin-bottom:16px;">"AVC did not take a single rupee. The trade test was conducted strictly on merit."</p>
        <div style="font-size:11px; color:#94a3b8; font-weight:700; letter-spacing:0.5px;">REGISTERED > TESTED > SELECTED</div>
      </div>
      
      <div style="background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
          <div style="width:40px; height:40px; border-radius:50%; background:#059669; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold;">RS</div>
          <div>
            <div style="font-weight:700; color:#0f172a;">Rakesh Kumar Sah</div>
            <div style="font-size:12px; color:#64748b;">6G TIG Welder | Qatar</div>
          </div>
        </div>
        <p style="font-size:14px; color:#334155; font-style:italic; margin-bottom:16px;">"Lincoln machine pipe welding test was supervised directly by the client delegation. Fully transparent."</p>
        <div style="font-size:11px; color:#94a3b8; font-weight:700; letter-spacing:0.5px;">REGISTERED > TESTED > SELECTED</div>
      </div>

      <div style="background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
          <div style="width:40px; height:40px; border-radius:50%; background:#d97706; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold;">E</div>
          <div>
            <div style="font-weight:700; color:#0f172a;">Electrician</div>
            <div style="font-size:12px; color:#64748b;">Muzaffarpur, Bihar | UAE</div>
          </div>
        </div>
        <p style="font-size:14px; color:#334155; font-style:italic; margin-bottom:16px;">"The registration form was simple and free. No middleman, no money asked."</p>
        <div style="font-size:11px; color:#94a3b8; font-weight:700; letter-spacing:0.5px;">REGISTERED > TESTED > SELECTED</div>
      </div>
      
    </div>
  </section>
</main>
"@

Set-Content -Path "success-stories.html" -Value ($header + $ssBody + $footer) -Encoding UTF8
Write-Output "Created success-stories.html"

$hwHeader = $faqContent.Substring(0, $navEndIdx)
$hwHeader = $hwHeader -replace '<title>.*</title>', '<title>Hire Skilled Workers for Gulf Projects | AVC Bihar</title>'
$hwHeader = $hwHeader -replace '<meta name="description" content=".*">', '<meta name="description" content="Source trade-tested electricians, welders, HVAC technicians, and skilled workers from Bihar.">'

$hwBody = @"
<main>
  <section style="background:#0f172a; color:#fff; padding:60px 0; text-align:center;">
    <div class="container">
      <h1 style="font-size:36px; margin:16px 0;">Need Skilled Workers for Gulf Projects?</h1>
      <p style="color:#94a3b8; font-size:16px; max-width:800px; margin:0 auto 24px;">AVC pre-screens, trade-tests, and presents verified Indian manpower from Bihar. We organize the candidate pool - you do the interview.</p>
      <div style="display:flex; justify-content:center; gap:16px; margin-bottom:24px; flex-wrap:wrap;">
        <span style="background:rgba(255,255,255,0.1); padding:6px 12px; border-radius:4px; font-size:13px;">✅ Trade-Tested Candidates</span>
        <span style="background:rgba(255,255,255,0.1); padding:6px 12px; border-radius:4px; font-size:13px;">✅ GAMCA Ready</span>
        <span style="background:rgba(255,255,255,0.1); padding:6px 12px; border-radius:4px; font-size:13px;">✅ Zero Middleman Markup</span>
      </div>
      <a href="#employer-form" class="button primary">Request Candidate Pool</a>
    </div>
  </section>
  <section id="employer-form" style="padding:60px 0; background:#f8fafc;">
    <div class="container" style="max-width:600px;">
      <form class="redesign-form" action="https://formsubmit.co/ajax/info@assignmentvenuecentre.me" method="POST" style="background:#fff; padding:32px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
        <h2 style="font-size:24px; margin:0 0 24px; color:#0f172a;">Request Pre-Screened Candidates</h2>
        <input type="hidden" name="_subject" value="New Employer Manpower Request">
        <input type="hidden" name="_next" value="https://assignmentvenuecentre.me/post-submission.html">
        <input type="text" name="Company" placeholder="Company / Agency Name" required style="width:100%; padding:12px; margin-bottom:16px; border:1px solid #cbd5e1; border-radius:6px;">
        <input type="text" name="ContactName" placeholder="Authorized Contact Name" required style="width:100%; padding:12px; margin-bottom:16px; border:1px solid #cbd5e1; border-radius:6px;">
        <input type="tel" name="WhatsApp" placeholder="WhatsApp Number" required style="width:100%; padding:12px; margin-bottom:16px; border:1px solid #cbd5e1; border-radius:6px;">
        <input type="email" name="Email" placeholder="Email Address" required style="width:100%; padding:12px; margin-bottom:16px; border:1px solid #cbd5e1; border-radius:6px;">
        <select name="Trade" required style="width:100%; padding:12px; margin-bottom:16px; border:1px solid #cbd5e1; border-radius:6px;">
          <option value="">Select Trade Required...</option>
          <option value="Electrical">Electrical & MEP</option>
          <option value="Welding">Welding & Piping</option>
          <option value="HVAC">HVAC & Chiller</option>
          <option value="Civil">Civil & Construction</option>
          <option value="Transport">Transport & Logistics</option>
          <option value="Other">Other / Multiple</option>
        </select>
        <button type="submit" class="button primary" style="width:100%;">Submit Requirement</button>
      </form>
    </div>
  </section>
</main>
"@
Set-Content -Path "hire-workers.html" -Value ($hwHeader + $hwBody + $footer) -Encoding UTF8
Write-Output "Created hire-workers.html"

# Sitemap Update
$sitemapPath = "sitemap.xml"
$sitemap = Get-Content $sitemapPath -Raw
if ($sitemap -notmatch "success-stories.html") {
    $sitemapUrls = @"
  <url><loc>https://assignmentvenuecentre.me/success-stories.html</loc><changefreq>monthly</changefreq><priority>0.80</priority><lastmod>2026-10-01</lastmod></url>
  <url><loc>https://assignmentvenuecentre.me/hire-workers.html</loc><changefreq>monthly</changefreq><priority>0.80</priority><lastmod>2026-10-01</lastmod></url>
</urlset>
"@
    $sitemap = $sitemap.Replace("</urlset>", $sitemapUrls)
    Set-Content -Path $sitemapPath -Value $sitemap -Encoding UTF8
    Write-Output "Updated sitemap.xml"
}

