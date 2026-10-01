$ErrorActionPreference = 'Stop'

$templateContent = Get-Content "faq.html" -Raw
$navEndIdx = $templateContent.IndexOf("<main")
if ($navEndIdx -eq -1) { $navEndIdx = $templateContent.IndexOf("<section") }
$footerIdx = $templateContent.IndexOf("<footer")

$headerTpl = $templateContent.Substring(0, $navEndIdx)
$footer = $templateContent.Substring($footerIdx)

function Generate-CityPage ($filename, $city) {
    $title = "Gulf Jobs in $city | Overseas Recruitment Agency | AVC"
    $desc = "Looking for Gulf jobs in $city, Bihar? Assignment Venue Center offers verified jobs for electricians, welders, and technicians with zero candidate fees."
    
    $header = $headerTpl -replace '<title>.*</title>', "<title>$title</title>"
    $header = $header -replace '<meta name="description" content="[^"]*">', "<meta name=`"description`" content=`"$desc`">"

    $body = @"
<main>
  <section style="background:#0f172a; color:#fff; padding:60px 0; text-align:center;">
    <div class="container">
      <span style="color:#38bdf8; font-weight:700; font-size:13px; letter-spacing:1px; text-transform:uppercase;">OVERSEAS RECRUITMENT — $city</span>
      <h1 style="font-size:36px; margin:16px 0;">Gulf Jobs for Skilled Workers in $city</h1>
      <p style="color:#94a3b8; font-size:16px; max-width:800px; margin:0 auto 24px;">Assignment Venue Center (AVC) provides verified overseas job opportunities for candidates from $city and surrounding areas. We operate under a strict zero-fee policy.</p>
      <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
        <a href="apply.html" class="button primary">Apply Free</a>
        <a href="tel:+919473286356" class="button outline" style="color:#fff; border-color:rgba(255,255,255,0.4);">Call AVC Helpdesk</a>
      </div>
    </div>
  </section>

  <section style="padding:60px 0; background:#f8fafc;">
    <div class="container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:32px;">
      
      <div style="background:#fff; padding:32px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="font-size:20px; color:#0f172a; margin:0 0 16px;">Why Candidates from $city Trust AVC</h2>
        <ul style="font-size:15px; color:#475569; line-height:1.7; padding-left:20px;">
          <li style="margin-bottom:8px;"><strong>Zero Agent Fees:</strong> We do not charge money for application or selection.</li>
          <li style="margin-bottom:8px;"><strong>Physical Trade Tests:</strong> Transparent practical exams at our Darbhanga facility.</li>
          <li style="margin-bottom:8px;"><strong>Direct Client Interviews:</strong> Meet corporate delegations directly.</li>
          <li style="margin-bottom:8px;"><strong>Proper Documentation:</strong> Guidance on GAMCA medical and ECNR passports.</li>
        </ul>
      </div>

      <div style="background:#fff; padding:32px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="font-size:20px; color:#0f172a; margin:0 0 16px;">Top Sourcing Trades</h2>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <a href="electrician-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">Electricians</a>
          <a href="welder-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">6G/TIG Welders</a>
          <a href="hvac-technician-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">HVAC Technicians</a>
          <a href="plumber-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">Plumbers</a>
          <a href="pipe-fitter-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">Pipe Fitters</a>
          <a href="scaffolder-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">Scaffolders</a>
        </div>
        <p style="margin-top:16px; font-size:14px; color:#64748b;">We regularly conduct recruitment drives for Saudi Arabia, UAE, Qatar, and Oman.</p>
      </div>

      <div style="background:#fffbeb; padding:32px; border-radius:8px; border:1px solid #fde68a;">
        <h2 style="font-size:20px; color:#92400e; margin:0 0 16px;">Visit the Verification Center</h2>
        <p style="font-size:14px; color:#b45309; margin-bottom:20px;">Candidates from $city can visit our Darbhanga office for physical verification of employer mandates before committing to any trade test.</p>
        <a href="about.html" class="button outline" style="background:#fff; border-color:#d97706; color:#92400e; display:block; text-align:center;">View Office Location Map</a>
      </div>

    </div>
  </section>
</main>
"@

    $fullContent = $header + $body + $footer
    Set-Content -Path $filename -Value $fullContent -Encoding UTF8
    Write-Output "Created $filename"
}

$cities = @("Darbhanga", "Madhubani", "Samastipur", "Muzaffarpur", "Patna")
foreach ($city in $cities) {
    $filename = "gulf-jobs-$($city.ToLower()).html"
    Generate-CityPage -filename $filename -city $city
}
