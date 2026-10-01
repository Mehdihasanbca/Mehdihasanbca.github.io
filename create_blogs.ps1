$ErrorActionPreference = 'Stop'

$templateContent = Get-Content "blog\how-to-verify-gulf-job-offer.html" -Raw
$navEndIdx = $templateContent.IndexOf("<main")
if ($navEndIdx -eq -1) { $navEndIdx = $templateContent.IndexOf("<section") }
$footerIdx = $templateContent.IndexOf("<footer")

$headerTpl = $templateContent.Substring(0, $navEndIdx)
$footer = $templateContent.Substring($footerIdx)

function Generate-Article ($filename, $title, $desc, $body) {
    $header = $headerTpl -replace '<title>.*</title>', "<title>$title</title>"
    $header = $header -replace '<meta name="description" content="[^"]*">', "<meta name=`"description`" content=`"$desc`">"
    $header = $header -replace '<h1 itemprop="headline" class="article-title">.*</h1>', "<h1 itemprop=`"headline`" class=`"article-title`">$title</h1>"
    
    $fullContent = $header + $body + $footer
    Set-Content -Path "blog\$filename" -Value $fullContent -Encoding UTF8
    Write-Output "Created blog\$filename"
}

$body1 = @"
<main class="article-shell" itemscope itemtype="https://schema.org/Article">
  <article class="article-body">
    <h1 itemprop="headline" class="article-title">Electrician Gulf Jobs from Bihar 2026 | Saudi Arabia, UAE, Qatar | AVC</h1>
    <div itemprop="articleBody">
      <h2>Why Bihar Electricians are in Demand</h2>
      <p>GCC countries require skilled building electricians for mega-projects. Candidates from Bihar with solid trade skills are highly preferred for their work ethic and technical understanding.</p>
      <h2>Current Salary Ranges (2026)</h2>
      <ul>
        <li><strong>Saudi Arabia:</strong> SAR 1,800 - 2,500 + OT</li>
        <li><strong>UAE (Dubai/Abu Dhabi):</strong> AED 2,000 - 3,000 + OT</li>
        <li><strong>Qatar:</strong> QAR 1,800 - 2,600 + OT</li>
      </ul>
      <h2>Qualifications Needed</h2>
      <p>Employers look for ITI certification or at least 2 years of verifiable experience. An ECNR passport is strongly recommended.</p>
      <h2>Trade Test Format</h2>
      <p>The standard trade test involves panel wiring, conduit bending, and understanding MCB/RCCB circuits. You must demonstrate these skills in front of an examiner.</p>
      <h2>GAMCA Medical & eMigrate</h2>
      <p>After selection, you must clear the GAMCA medical test. If you hold an ECR passport, you will need eMigrate clearance.</p>
      <div class="disclaimer-box" style="padding:16px; background:#fffbeb; border:1px solid #fde68a; border-radius:6px; margin:24px 0;">
        <strong>Important:</strong> AVC Darbhanga charges ZERO FEES for candidate registration and trade test coordination. Never pay anyone promising a guaranteed job.
      </div>
      <p><a href="../apply.html" class="button primary">Apply Free</a></p>
    </div>
  </article>
</main>
"@

Generate-Article -filename "electrician-gulf-jobs-bihar.html" -title "Electrician Gulf Jobs from Bihar 2026 | Saudi Arabia, UAE, Qatar | AVC" -desc "Complete guide for electricians from Bihar applying for Gulf jobs. Salary ranges, trade test requirements, ECNR passport, GAMCA medical, and how to apply free through AVC." -body $body1

$body2 = @"
<main class="article-shell" itemscope itemtype="https://schema.org/Article">
  <article class="article-body">
    <h1 itemprop="headline" class="article-title">Dubai Jobs 2026: Salary Guide for Indian Skilled Workers | AVC</h1>
    <div itemprop="articleBody">
      <h2>UAE Labor Market Overview</h2>
      <p>The UAE labor market remains robust in 2026. Skilled Indian workers are in high demand across construction, facility management, and MEP sectors.</p>
      <h2>Average Salary by Trade (AED)</h2>
      <ul>
        <li><strong>Electrician:</strong> AED 1,800 - 2,800</li>
        <li><strong>6G Welder:</strong> AED 2,200 - 3,200</li>
        <li><strong>HVAC Technician:</strong> AED 2,000 - 2,800</li>
        <li><strong>Civil Mason:</strong> AED 1,500 - 2,200</li>
      </ul>
      <h2>Allowances and Overtime</h2>
      <p>Standard packages include accommodation, transport, medical insurance, and a food allowance. Overtime is usually calculated at 1.25x the basic rate.</p>
      <h2>How to Evaluate an Offer</h2>
      <p>If an offer promises 3x the market rate, it is likely a scam. Always verify the employer and ensure the contract is processed through the Wage Protection System (WPS).</p>
      <div class="disclaimer-box" style="padding:16px; background:#fffbeb; border:1px solid #fde68a; border-radius:6px; margin:24px 0;">
        <strong>Important:</strong> AVC Darbhanga charges ZERO FEES for candidate registration. Never pay anyone promising a guaranteed job.
      </div>
      <p><a href="../apply.html" class="button primary">Apply Free</a></p>
    </div>
  </article>
</main>
"@

Generate-Article -filename "dubai-jobs-2026-salary-guide.html" -title "Dubai Jobs 2026: Salary Guide for Indian Skilled Workers | AVC" -desc "Updated salary guide for Indian workers going to Dubai, UAE in 2026. Trade-wise salary breakdown, accommodation, food allowance, OT rates, and how to evaluate an offer." -body $body2

$body3 = @"
<main class="article-shell" itemscope itemtype="https://schema.org/Article">
  <article class="article-body">
    <h1 itemprop="headline" class="article-title">ECR vs ECNR Passport for Indian Workers | Gulf Jobs | Complete Guide 2026</h1>
    <div itemprop="articleBody">
      <h2>What is an ECR Passport?</h2>
      <p>ECR stands for Emigration Check Required. If you haven't passed the 10th grade, your passport usually falls under this category by default.</p>
      <h2>What is an ECNR Passport?</h2>
      <p>ECNR stands for Emigration Check Not Required. Individuals who have passed their matriculation (10th standard) or hold diplomas/degrees are eligible.</p>
      <h2>Why ECNR Matters</h2>
      <p>ECNR passport holders do not need Emigration Clearance from the Protector of Emigrants (POE) to work in 18 notified countries, making the visa process faster and smoother.</p>
      <h2>How to Get ECNR Status</h2>
      <p>Apply at a Passport Seva Kendra with your educational certificates. The status can be updated during passport renewal or as a fresh application.</p>
      <div class="disclaimer-box" style="padding:16px; background:#fffbeb; border:1px solid #fde68a; border-radius:6px; margin:24px 0;">
        <strong>Important:</strong> AVC Darbhanga provides free guidance on documentation. We do not charge fees for registration or recruitment.
      </div>
      <p><a href="../apply.html" class="button primary">Apply Free</a></p>
    </div>
  </article>
</main>
"@

Generate-Article -filename "ecr-ecnr-passport-guide.html" -title "ECR vs ECNR Passport for Indian Workers | Gulf Jobs | Complete Guide 2026" -desc "What is ECR and ECNR passport? How to get ECNR endorsement? Why it matters for Gulf jobs. Complete guide for Indian workers from Bihar seeking overseas employment." -body $body3

$body4 = @"
<main class="article-shell" itemscope itemtype="https://schema.org/Article">
  <article class="article-body">
    <h1 itemprop="headline" class="article-title">How to Avoid Gulf Job Scams: 15 Red Flags Every Worker Must Know | AVC</h1>
    <div itemprop="articleBody">
      <h2>Protect Yourself from Job Fraud</h2>
      <p>Many workers from Bihar fall victim to fake agents. Here are the top red flags to watch out for:</p>
      <ol>
        <li>Asking for money before a valid visa is stamped.</li>
        <li>Promising salaries 2x or 3x the market rate.</li>
        <li>No physical, verifiable office location.</li>
        <li>Providing an offer letter with spelling mistakes.</li>
        <li>Asking you to pay for your GAMCA medical directly to them.</li>
      </ol>
      <h2>What to do if you suspect fraud</h2>
      <p>Contact the MEA Pravasi Helpline at 1800-11-3090, report it on the eMigrate portal, or file a local police complaint.</p>
      <div class="disclaimer-box" style="padding:16px; background:#fffbeb; border:1px solid #fde68a; border-radius:6px; margin:24px 0;">
        <strong>Important:</strong> AVC Darbhanga charges ZERO FEES for candidate registration. We operate a transparent, physical trade testing center in Darbhanga.
      </div>
      <p><a href="../apply.html" class="button primary">Apply Free</a></p>
    </div>
  </article>
</main>
"@

Generate-Article -filename "how-to-avoid-gulf-job-scams.html" -title "How to Avoid Gulf Job Scams: 15 Red Flags Every Worker Must Know | AVC" -desc "Protect yourself from Gulf job fraud. 15 real red flags used by scammers targeting Indian workers. Verified by AVC Darbhanga." -body $body4
