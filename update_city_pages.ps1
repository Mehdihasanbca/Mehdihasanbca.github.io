$ErrorActionPreference = 'Stop'

$templateContent = Get-Content "faq.html" -Raw
$navEndIdx = $templateContent.IndexOf("<main")
if ($navEndIdx -eq -1) { $navEndIdx = $templateContent.IndexOf("<section") }
$footerIdx = $templateContent.IndexOf("<footer")

$headerTpl = $templateContent.Substring(0, $navEndIdx)
$footer = $templateContent.Substring($footerIdx)

$citiesData = @(
    @{
        id = "darbhanga"
        name = "Darbhanga"
        hero = "Darbhanga: The Central Hub for Gulf Recruitment in Mithilanchal"
        desc = "Darbhanga is rapidly becoming the epicenter for skilled manpower heading to the GCC. With its central location in North Bihar and improving connectivity, thousands of electricians, welders, and construction workers from Darbhanga district are securing high-paying overseas opportunities."
        faq1_q = "Is there a physical trade test center in Darbhanga?"
        faq1_a = "Yes! Assignment Venue Center operates a fully equipped, physical trade testing facility right here in Darbhanga at Kamtaul Road, Madhupur."
        faq2_q = "What trades are in highest demand from Darbhanga?"
        faq2_a = "Employers frequently source Building Electricians, Shuttering Carpenters, and Heavy Drivers directly from the Darbhanga talent pool."
        testiName = "Md. Arshad"
        testiTrade = "Building Electrician"
        testiQuote = "I didn't have to travel to Delhi for my trade test. The Saudi delegation came directly to the Darbhanga center. Got selected with zero agent fees."
    },
    @{
        id = "madhubani"
        name = "Madhubani"
        hero = "Madhubani's Skilled Artisans and Tradesmen for GCC Mega-Projects"
        desc = "Known historically for its art, Madhubani is also home to incredibly hardworking civil and mechanical tradesmen. Candidates from Madhubani are highly sought after by EPC contractors in Saudi Arabia and the UAE for their dedication and precision in construction roles."
        faq1_q = "How far is the trade testing center from Madhubani?"
        faq1_a = "The AVC trade testing facility in Darbhanga is easily accessible from Madhubani via NH27 and local transit, usually taking less than an hour."
        faq2_q = "Do Madhubani candidates need special passport clearance?"
        faq2_a = "Like all Indian workers, if you have not passed 10th grade, you will need an ECR passport and eMigrate clearance, which AVC guides you through for free."
        testiName = "Rajiv Ranjan"
        testiTrade = "Civil Mason"
        testiQuote = "AVC team guided me step by step on how to upgrade to an ECNR passport. Now I am working in Dubai and sending money back to Madhubani."
    },
    @{
        id = "samastipur"
        name = "Samastipur"
        hero = "Samastipur's Reliable Workforce Driving Gulf Infrastructure"
        desc = "Samastipur boasts a robust demographic of physically fit, technically capable youth transitioning from agriculture to lucrative Gulf construction and transport jobs. The region provides a massive supply of heavy equipment operators, riggers, and scaffolders."
        faq1_q = "Are there specific jobs for heavy vehicle drivers from Samastipur?"
        faq1_a = "Absolutely. We frequently host Gulf employer delegations looking specifically for HTV and LTV drivers with solid experience."
        faq2_q = "How do I register for the next interview drive?"
        faq2_a = "You can register online for free through the AVC website. We will notify you on WhatsApp when an employer delegation matching your trade schedules a visit."
        testiName = "Surendra Yadav"
        testiTrade = "Heavy Equipment Operator"
        testiQuote = "I gave my JCB operator test during a massive drive. Everything was transparent, no hidden charges. Very proud to represent Samastipur in Qatar."
    },
    @{
        id = "muzaffarpur"
        name = "Muzaffarpur"
        hero = "Muzaffarpur: Exporting Top Technical Talent to the Middle East"
        desc = "As a major commercial and educational hub in Tirhut, Muzaffarpur produces highly skilled HVAC technicians, PLC operators, and instrumentation specialists. AVC helps Muzaffarpur's technical talent connect directly with elite Gulf facility management companies."
        faq1_q = "Are there facility management jobs for Muzaffarpur candidates?"
        faq1_a = "Yes, Muzaffarpur candidates are highly preferred for technical FM roles in UAE and Qatar, including Chiller Operators and BMS Technicians."
        faq2_q = "Does AVC charge a commission from my first salary?"
        faq2_a = "No. AVC operates under a strict zero-fee candidate policy. We are compensated by the employers, never by the workers."
        testiName = "Aftab Alam"
        testiTrade = "HVAC Technician"
        testiQuote = "The technical interview was tough, but fair. I appreciate that AVC doesn't allow middlemen to interfere in the selection process."
    },
    @{
        id = "patna"
        name = "Patna"
        hero = "Patna's Gateway to Premium Overseas Employment"
        desc = "Being the capital, Patna has a diverse talent pool ranging from site engineers and HSE officers to general labor. AVC provides Patna residents a trusted, zero-fee conduit to verified international employment, bypassing the fraudulent agents common in big cities."
        faq1_q = "Do I need to come to Darbhanga for every interview?"
        faq1_a = "Many preliminary interviews for Patna candidates can be conducted via Zoom or WhatsApp Video. Physical presence is only required for hands-on trade tests."
        faq2_q = "Can HSE Officers and Engineers apply through AVC?"
        faq2_a = "Yes. While we specialize in blue-collar trades, we regularly source NEBOSH-certified safety officers and site supervisors for mega-projects."
        testiName = "Vikash Kumar"
        testiTrade = "HSE Officer"
        testiQuote = "As a safety professional from Patna, I value compliance. AVC's adherence to the Emigration Act 1983 and zero-fee model is commendable."
    }
)

foreach ($city in $citiesData) {
    $cityName = $city.name
    $title = "Gulf Jobs in $cityName | Overseas Recruitment Agency | AVC"
    $metaDesc = "Looking for Gulf jobs in $cityName, Bihar? Assignment Venue Center offers verified jobs for electricians, welders, and technicians with zero candidate fees."
    
    $header = $headerTpl -replace '<title>.*</title>', "<title>$title</title>"
    $header = $header -replace '<meta name="description" content="[^"]*">', "<meta name=`"description`" content=`"$metaDesc`">"

    $body = @"
<main>
  <section style="background:#0f172a; color:#fff; padding:60px 0; text-align:center;">
    <div class="container">
      <span style="color:#38bdf8; font-weight:700; font-size:13px; letter-spacing:1px; text-transform:uppercase;">OVERSEAS RECRUITMENT — $($city.name)</span>
      <h1 style="font-size:36px; margin:16px 0;">$($city.hero)</h1>
      <p style="color:#94a3b8; font-size:16px; max-width:800px; margin:0 auto 24px;">$($city.desc)</p>
      <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
        <a href="apply.html" class="button primary">Apply Free</a>
        <a href="tel:+919473286356" class="button outline" style="color:#fff; border-color:rgba(255,255,255,0.4);">Call AVC Helpdesk</a>
      </div>
    </div>
  </section>

  <section style="padding:60px 0; background:#f8fafc;">
    <div class="container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:32px;">
      
      <div style="background:#fff; padding:32px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="font-size:20px; color:#0f172a; margin:0 0 16px;">$($city.name) Local Candidate FAQ</h2>
        <ul style="font-size:15px; color:#475569; line-height:1.7; padding-left:20px;">
          <li style="margin-bottom:12px;"><strong>$($city.faq1_q)</strong><br>$($city.faq1_a)</li>
          <li style="margin-bottom:12px;"><strong>$($city.faq2_q)</strong><br>$($city.faq2_a)</li>
          <li style="margin-bottom:12px;"><strong>What documents are needed?</strong><br>Bring your original passport, 10 white-background photos, ITI certificates, and experience letters.</li>
        </ul>
      </div>

      <div style="background:#fff; padding:32px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="font-size:20px; color:#0f172a; margin:0 0 16px;">Top Sourcing Trades</h2>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <a href="electrician-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">Electricians</a>
          <a href="welder-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">6G/TIG Welders</a>
          <a href="hvac-technician-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">HVAC Technicians</a>
          <a href="plumber-jobs.html" style="background:#f1f5f9; padding:6px 12px; border-radius:4px; font-size:13px; color:#334155; text-decoration:none;">Plumbers</a>
        </div>
        
        <div style="margin-top:24px; padding-top:16px; border-top:1px solid #e2e8f0;">
          <h3 style="font-size:16px; color:#0f172a; margin:0 0 8px;">Success Story</h3>
          <p style="font-size:14px; color:#475569; font-style:italic;">"$($city.testiQuote)"</p>
          <div style="font-size:13px; font-weight:700; color:#2563eb;">— $($city.testiName), $($city.testiTrade)</div>
        </div>
      </div>

      <div style="background:#fffbeb; padding:32px; border-radius:8px; border:1px solid #fde68a;">
        <h2 style="font-size:20px; color:#92400e; margin:0 0 16px;">Visit the Verification Center</h2>
        <p style="font-size:14px; color:#b45309; margin-bottom:20px;">Candidates from $($city.name) can visit our Darbhanga office for physical verification of employer mandates before committing to any trade test.</p>
        <a href="about.html" class="button outline" style="background:#fff; border-color:#d97706; color:#92400e; display:block; text-align:center;">View Office Location Map</a>
      </div>

    </div>
  </section>
</main>
"@

    $filename = "gulf-jobs-$($city.id).html"
    $fullContent = $header + $body + $footer
    Set-Content -Path $filename -Value $fullContent -Encoding UTF8
    Write-Output "Updated $filename with unique content"
}
