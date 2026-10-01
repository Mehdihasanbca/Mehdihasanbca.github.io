$ErrorActionPreference = 'Stop'

$templateContent = Get-Content "faq.html" -Raw
$navEndIdx = $templateContent.IndexOf("<main")
if ($navEndIdx -eq -1) { $navEndIdx = $templateContent.IndexOf("<section") }
$footerIdx = $templateContent.IndexOf("<footer")

# Fix paths for the subdirectory
$header = $templateContent.Substring(0, $navEndIdx)
$header = $header -replace 'href="assets/', 'href="../assets/'
$header = $header -replace 'src="assets/', 'src="../assets/'
$header = $header -replace 'href="\./"', 'href="../"'
$header = $header -replace 'href="about.html"', 'href="../about.html"'
$header = $header -replace 'href="apply.html"', 'href="../apply.html"'
$header = $header -replace 'href="jobs.html"', 'href="../jobs.html"'
$header = $header -replace 'href="services.html"', 'href="../services.html"'
$header = $header -replace 'href="contact.html"', 'href="../contact.html"'

$footer = $templateContent.Substring($footerIdx)
$footer = $footer -replace 'href="assets/', 'href="../assets/'
$footer = $footer -replace 'src="assets/', 'src="../assets/'
$footer = $footer -replace 'href="about.html"', 'href="../about.html"'
$footer = $footer -replace 'href="apply.html"', 'href="../apply.html"'
$footer = $footer -replace 'href="jobs.html"', 'href="../jobs.html"'

# Hub Page
$hubHeader = $header -replace '<title>.*</title>', '<title>Gulf Interview & Trade Test Checklists | AVC</title>'
$hubHeader = $hubHeader -replace '<meta name="description" content="[^"]*">', '<meta name="description" content="Download free trade test and interview checklists for electricians, welders, HVAC technicians, and plumbers targeting Gulf jobs.">'

$hubBody = @"
<main>
  <section style="background:#0f172a; color:#fff; padding:60px 0; text-align:center;">
    <div class="container">
      <h1 style="font-size:36px; margin:16px 0;">Interview & Trade Test Checklists</h1>
      <p style="color:#94a3b8; font-size:16px; max-width:800px; margin:0 auto 24px;">Prepare for your Gulf client interview with our trade-specific practical testing guides. Know exactly what the examiners will ask you to do.</p>
    </div>
  </section>

  <section style="padding:60px 0; background:#f8fafc;">
    <div class="container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
      
      <a href="electrician-trade-test.html" style="background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0; text-decoration:none; color:inherit; box-shadow:0 4px 12px rgba(0,0,0,0.05); display:block; transition:transform 0.2s;">
        <h2 style="font-size:20px; color:#2563eb; margin:0 0 12px;">Electrician Trade Test Checklist</h2>
        <p style="font-size:14px; color:#475569; margin:0;">DB dressing, conduit bending, MCB/RCCB circuits, and common interview questions for building electricians.</p>
      </a>

      <a href="welder-trade-test.html" style="background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0; text-decoration:none; color:inherit; box-shadow:0 4px 12px rgba(0,0,0,0.05); display:block; transition:transform 0.2s;">
        <h2 style="font-size:20px; color:#2563eb; margin:0 0 12px;">Welder Trade Test Checklist</h2>
        <p style="font-size:14px; color:#475569; margin:0;">6G pipe welding, TIG/ARC parameters, root penetration checks, and visual/RT standards.</p>
      </a>

      <a href="hvac-interview-questions.html" style="background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0; text-decoration:none; color:inherit; box-shadow:0 4px 12px rgba(0,0,0,0.05); display:block; transition:transform 0.2s;">
        <h2 style="font-size:20px; color:#2563eb; margin:0 0 12px;">HVAC Interview Questions</h2>
        <p style="font-size:14px; color:#475569; margin:0;">Chiller operations, compressor troubleshooting, gas charging, and VRF/VRV system fundamentals.</p>
      </a>

      <a href="plumber-trade-test.html" style="background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0; text-decoration:none; color:inherit; box-shadow:0 4px 12px rgba(0,0,0,0.05); display:block; transition:transform 0.2s;">
        <h2 style="font-size:20px; color:#2563eb; margin:0 0 12px;">Plumber Trade Test Guide</h2>
        <p style="font-size:14px; color:#475569; margin:0;">UPVC pipe fitting, PPR welding, pressure testing, and sanitary installation standards.</p>
      </a>

    </div>
  </section>
</main>
"@

Set-Content -Path "interview-checklists\index.html" -Value ($hubHeader + $hubBody + $footer) -Encoding UTF8
Write-Output "Created interview-checklists\index.html"


# Checklist Generator
function Generate-Checklist ($filename, $title, $h1, $items) {
    $cHeader = $header -replace '<title>.*</title>', "<title>$title | AVC</title>"
    $cHeader = $cHeader -replace '<meta name="description" content="[^"]*">', "<meta name=`"description`" content=`"Complete $h1 for Gulf job interviews.`">"

    $itemsHtml = ""
    foreach ($item in $items) {
        $itemsHtml += "<li style=`"margin-bottom:12px; padding-left:8px;`"><label style=`"display:flex; gap:12px; cursor:pointer;`"><input type=`"checkbox`" style=`"width:20px; height:20px; margin-top:2px;`"> <span style=`"font-size:16px; color:#334155; line-height:1.5;`">$item</span></label></li>"
    }

    $cBody = @"
<main>
  <section style="background:#0f172a; color:#fff; padding:40px 0; text-align:center;">
    <div class="container">
      <a href="index.html" style="color:#94a3b8; font-size:14px; text-decoration:none; margin-bottom:16px; display:inline-block;">&larr; Back to Checklists</a>
      <h1 style="font-size:32px; margin:0 0 16px;">$h1</h1>
    </div>
  </section>

  <section style="padding:60px 0; background:#f8fafc;">
    <div class="container" style="max-width:700px;">
      <div style="background:#fff; padding:40px; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
        <p style="color:#64748b; font-size:15px; margin-bottom:24px;">Use this interactive checklist to verify your readiness before appearing for a Gulf employer delegation interview at AVC.</p>
        
        <ul style="list-style:none; padding:0; margin:0;">
          $itemsHtml
        </ul>

        <div style="margin-top:40px; padding-top:24px; border-top:1px solid #e2e8f0; text-align:center;">
          <h3 style="font-size:18px; color:#0f172a; margin:0 0 16px;">Ready to clear your trade test?</h3>
          <a href="../apply.html" class="button primary">Apply for the Next Interview</a>
        </div>
      </div>
    </div>
  </section>
</main>
"@
    Set-Content -Path "interview-checklists\$filename" -Value ($cHeader + $cBody + $footer) -Encoding UTF8
    Write-Output "Created interview-checklists\$filename"
}

# 1. Electrician
$elecItems = @(
    "Can read and interpret basic single-line diagrams (SLD).",
    "Can perform proper Distribution Board (DB) dressing with neat wire routing.",
    "Understands the difference and application of MCB, MCCB, RCCB, and ELCB.",
    "Can demonstrate accurate PVC conduit bending using a bending spring.",
    "Knows how to use a Multimeter and Megger for insulation and continuity testing.",
    "Can perform 2-way switch wiring without looking at a diagram.",
    "Understands standard color coding for 3-phase systems (Red, Yellow, Blue, Black/Green)."
)
Generate-Checklist -filename "electrician-trade-test.html" -title "Electrician Trade Test Checklist" -h1 "Building Electrician Trade Test Checklist" -items $elecItems

# 2. Welder
$welderItems = @(
    "Can properly prepare, grind, and bevel the pipe edges (37.5 degrees) before fit-up.",
    "Can set the correct Argon gas flow rate and machine amperage for TIG root pass.",
    "Understands how to achieve full root penetration without lack of fusion.",
    "Can perform Hot Pass and Capping with 7018 electrodes without porosity or slag inclusion.",
    "Consistently achieves visual inspection standards (no undercuts, smooth cap profile).",
    "Has a track record of passing Radiographic Testing (RT / X-Ray) on 6G positions.",
    "Always wears proper PPE including welding helmet, leather jacket, and safety boots."
)
Generate-Checklist -filename "welder-trade-test.html" -title "Welder Trade Test Checklist" -h1 "6G TIG/ARC Welder Trade Test Checklist" -items $welderItems

# 3. HVAC
$hvacItems = @(
    "Can clearly explain the refrigeration cycle (Compressor, Condenser, Expansion Valve, Evaporator).",
    "Knows how to safely perform system vacuuming and leak testing using Nitrogen.",
    "Can accurately measure superheat and subcooling to determine proper refrigerant charge.",
    "Can safely braze copper pipes using Oxy-Acetylene without oxidizing the inside (using Nitrogen purge).",
    "Can troubleshoot a compressor that is tripping on high head pressure.",
    "Familiar with standard refrigerants (R-22, R-410A, R-32) and their operating pressures.",
    "Can read electrical control wiring diagrams for split and package units."
)
Generate-Checklist -filename "hvac-interview-questions.html" -title "HVAC Interview Questions" -h1 "HVAC Technician Interview Checklist" -items $hvacItems

# 4. Plumber
$plumberItems = @(
    "Can read isometric plumbing drawings to determine pipe routing and fittings.",
    "Can properly use a PPR welding machine at the correct temperature (usually 260°C).",
    "Understands the proper application of PVC solvent cement and primer.",
    "Can install sanitary fixtures (WC, washbasin, shower) perfectly leveled.",
    "Knows how to perform a hydrostatic pressure test to check for leaks.",
    "Understands proper slope requirements for drainage pipes to prevent clogging.",
    "Familiar with various fittings: elbow, tee, reducer, union, and valves."
)
Generate-Checklist -filename "plumber-trade-test.html" -title "Plumber Trade Test Guide" -h1 "Plumber & Pipe Fitter Trade Test Checklist" -items $plumberItems
