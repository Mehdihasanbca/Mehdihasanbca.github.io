$ErrorActionPreference = 'Stop'

$templateContent = Get-Content "faq.html" -Raw
$navEndIdx = $templateContent.IndexOf("<main")
if ($navEndIdx -eq -1) { $navEndIdx = $templateContent.IndexOf("<section") }
$footerIdx = $templateContent.IndexOf("<footer")

$headerTpl = $templateContent.Substring(0, $navEndIdx)
$footer = $templateContent.Substring($footerIdx)

# Helper function
function Generate-TradePage ($filename, $title, $desc, $h1, $sub, $heroColor, $salary, $reqs, $test, $isEmployer) {
    $header = $headerTpl -replace '<title>.*</title>', "<title>$title</title>"
    $header = $header -replace '<meta name="description" content="[^"]*">', "<meta name=`"description`" content=`"$desc`">"
    
    if ($isEmployer) {
        $ctaButton = '<a href="hire-workers.html#employer-form" class="button primary">Request Pre-Screened Candidates</a>'
        $secondaryButton = '<a href="tel:+919473286356" class="button outline" style="color:#fff; border-color:rgba(255,255,255,0.4);">Call AVC: +91 9473286356</a>'
        $bottomCta = '<a href="hire-workers.html#employer-form" class="button primary" style="width:100%; text-align:center; display:block;">Submit Requirement Brief</a>'
    } else {
        $ctaButton = '<a href="apply.html" class="button primary">Apply Free - Zero Fee</a>'
        $secondaryButton = '<a href="jobs.html" class="button outline" style="color:#fff; border-color:rgba(255,255,255,0.4);">View Live Jobs</a>'
        $bottomCta = '<a href="apply.html" class="button primary" style="width:100%; text-align:center; display:block;">Register for Next Interview</a>'
    }

    $body = @"
<main>
  <section style="background:$heroColor; color:#fff; padding:60px 0; text-align:center;">
    <div class="container">
      <h1 style="font-size:36px; margin:16px 0;">$h1</h1>
      <p style="color:rgba(255,255,255,0.8); font-size:16px; max-width:800px; margin:0 auto 24px;">$sub</p>
      <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
        $ctaButton
        $secondaryButton
      </div>
    </div>
  </section>
  
  <section style="padding:60px 0; background:#f8fafc;">
    <div class="container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:32px;">
      
      <div style="background:#fff; padding:32px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="font-size:20px; color:#0f172a; margin:0 0 16px; border-bottom:2px solid #e2e8f0; padding-bottom:12px;">Salary Ranges & Packages</h2>
        <div style="font-size:15px; color:#475569; line-height:1.7;">
          $salary
        </div>
      </div>

      <div style="background:#fff; padding:32px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="font-size:20px; color:#0f172a; margin:0 0 16px; border-bottom:2px solid #e2e8f0; padding-bottom:12px;">Trade Test Expectations</h2>
        <div style="font-size:15px; color:#475569; line-height:1.7;">
          $test
        </div>
      </div>

      <div style="background:#fff; padding:32px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="font-size:20px; color:#0f172a; margin:0 0 16px; border-bottom:2px solid #e2e8f0; padding-bottom:12px;">Core Requirements</h2>
        <div style="font-size:15px; color:#475569; line-height:1.7;">
          $reqs
        </div>
      </div>

      <div style="background:#fffbeb; padding:32px; border-radius:8px; border:1px solid #fde68a;">
        <h2 style="font-size:20px; color:#92400e; margin:0 0 16px;">Take the Next Step</h2>
        <p style="font-size:14px; color:#b45309; margin-bottom:20px;">AVC operates transparently from Darbhanga, Bihar. We ensure zero candidate fees and fully verified employer mandates.</p>
        $bottomCta
      </div>

    </div>
  </section>
</main>
"@
    
    $fullContent = $header + $body + $footer
    Set-Content -Path $filename -Value $fullContent -Encoding UTF8
    Write-Output "Created $filename"
}

# 1. CANDIDATE PAGES

# Electrician
Generate-TradePage -filename "electrician-jobs.html" `
    -title "Electrician Jobs in Gulf | Saudi, UAE, Qatar | AVC Bihar" `
    -desc "Apply for building electrician, industrial electrician, and MEP jobs in the Gulf. Free registration, trade test details, and salary ranges. Zero fees." `
    -h1 "Electrician Jobs in the Gulf" `
    -sub "Verified overseas opportunities for building electricians, industrial electricians, and panel wiremen. Register with AVC for zero-fee placement support." `
    -heroColor "#0f172a" `
    -salary "<ul><li><strong>Saudi Arabia:</strong> SAR 1,500 - 2,500 + OT</li><li><strong>UAE:</strong> AED 1,500 - 2,800 + OT</li><li><strong>Qatar:</strong> QAR 1,500 - 2,500 + OT</li><li><strong>Oman:</strong> OMR 120 - 200 + OT</li></ul><p>Most packages include free accommodation, transportation, and medical coverage.</p>" `
    -test "<p>At the AVC Darbhanga center, you will be tested on:</p><ul><li>Panel wiring and DB dressing</li><li>Conduit bending and routing</li><li>Testing MCB/RCCB circuits</li><li>Understanding basic blueprints</li></ul>" `
    -reqs "<ul><li>Minimum 2+ years experience</li><li>ITI/Diploma preferred</li><li>Valid Passport (ECNR highly preferred)</li><li>Physical fitness for construction site work</li></ul>" `
    -isEmployer $false

# Welder
Generate-TradePage -filename "welder-jobs.html" `
    -title "Welder Jobs in Gulf | 6G, TIG, ARC | AVC Bihar" `
    -desc "Apply for 6G, TIG, ARC, and MIG welding jobs in the Gulf. Free registration, trade test details, and salary ranges. Zero fees." `
    -h1 "Welder Jobs in the Gulf" `
    -sub "Verified overseas opportunities for 6G, TIG, ARC, and MIG welders in Oil & Gas and EPC projects. Register with AVC for zero-fee placement support." `
    -heroColor "#0f172a" `
    -salary "<ul><li><strong>Saudi Arabia:</strong> SAR 2,000 - 3,500 + OT</li><li><strong>UAE:</strong> AED 2,200 - 3,500 + OT</li><li><strong>Qatar:</strong> QAR 2,000 - 3,500 + OT</li></ul><p>TIG and 6G certified welders command premium salaries. Food allowance or free food is usually provided.</p>" `
    -test "<p>Our welding bays test you on:</p><ul><li>6G pipe welding position (TIG/ARC)</li><li>Root penetration and capping quality</li><li>X-Ray / RT testing passing ability</li><li>Safety protocol adherence</li></ul>" `
    -reqs "<ul><li>Verifiable experience in Oil & Gas or Heavy EPC</li><li>Valid welding certificates (ASME Sec IX)</li><li>Valid Passport</li><li>Commitment to safety standards</li></ul>" `
    -isEmployer $false

# HVAC
Generate-TradePage -filename "hvac-technician-jobs.html" `
    -title "HVAC Technician Jobs in Gulf | AVC Bihar" `
    -desc "Apply for HVAC, Chiller, and AC Technician jobs in the Gulf. Free registration, trade test details, and salary ranges. Zero fees." `
    -h1 "HVAC Technician Jobs in the Gulf" `
    -sub "Verified overseas opportunities for Split AC, Chiller, and Central HVAC technicians. Register with AVC for zero-fee placement support." `
    -heroColor "#0f172a" `
    -salary "<ul><li><strong>Saudi Arabia:</strong> SAR 1,800 - 3,000 + OT</li><li><strong>UAE:</strong> AED 2,000 - 3,200 + OT</li><li><strong>Qatar:</strong> QAR 1,800 - 3,000 + OT</li></ul><p>Package includes accommodation, transportation, and paid leave as per Gulf labor laws.</p>" `
    -test "<p>Practical trade testing covers:</p><ul><li>Compressor troubleshooting</li><li>Gas charging and vacuuming</li><li>Brazing copper pipes</li><li>Reading electrical control diagrams</li></ul>" `
    -reqs "<ul><li>Minimum 3+ years experience in maintenance/installation</li><li>ITI or specific HVAC Diploma</li><li>Valid Passport (ECNR)</li></ul>" `
    -isEmployer $false

# Plumber
Generate-TradePage -filename "plumber-jobs.html" `
    -title "Plumber Jobs in Gulf | Saudi, UAE | AVC Bihar" `
    -desc "Apply for Plumbing and Pipe Fitting jobs in the Gulf. Free registration, trade test details, and salary ranges. Zero fees." `
    -h1 "Plumber & Pipe Fitter Jobs in the Gulf" `
    -sub "Verified overseas opportunities for Plumbers and Pipe Fitters in construction and maintenance. Register with AVC for zero-fee placement support." `
    -heroColor "#0f172a" `
    -salary "<ul><li><strong>Saudi Arabia:</strong> SAR 1,200 - 1,800 + OT</li><li><strong>UAE:</strong> AED 1,200 - 1,800 + OT</li><li><strong>Qatar:</strong> QAR 1,200 - 1,800 + OT</li></ul><p>Standard package includes accommodation, transportation, and medical.</p>" `
    -test "<p>Trade test involves:</p><ul><li>PVC and UPVC pipe fitting</li><li>PPR pipe welding</li><li>Installing sanitary fixtures</li><li>Checking for leaks/pressure testing</li></ul>" `
    -reqs "<ul><li>Minimum 2+ years of GCC or Indian experience</li><li>Valid Passport</li><li>Physically fit</li></ul>" `
    -isEmployer $false

# Scaffolder
Generate-TradePage -filename "scaffolder-jobs.html" `
    -title "Scaffolder Jobs in Gulf | AVC Bihar" `
    -desc "Apply for Scaffolding jobs in the Gulf. Free registration, trade test details, and salary ranges. Zero fees." `
    -h1 "Scaffolder Jobs in the Gulf" `
    -sub "Verified overseas opportunities for Certified Scaffolders and riggers. Register with AVC for zero-fee placement support." `
    -heroColor "#0f172a" `
    -salary "<ul><li><strong>Saudi Arabia:</strong> SAR 1,200 - 1,600 + OT</li><li><strong>UAE:</strong> AED 1,200 - 1,600 + OT</li><li><strong>Qatar:</strong> QAR 1,200 - 1,600 + OT</li></ul><p>Heavy overtime potential during shutdowns.</p>" `
    -test "<p>Practical trade testing covers:</p><ul><li>Cuplock and tube/fitting erection</li><li>Safety harness usage and working at heights</li><li>Leveling and structural stability</li></ul>" `
    -reqs "<ul><li>TUV or CITB certification is a plus</li><li>Valid Passport</li><li>Strict adherence to HSE protocols</li></ul>" `
    -isEmployer $false

# Pipe Fitter
Generate-TradePage -filename "pipe-fitter-jobs.html" `
    -title "Pipe Fitter Jobs in Gulf | Oil & Gas | AVC Bihar" `
    -desc "Apply for Pipe Fitter and Fabricator jobs in the Gulf Oil & Gas sector. Free registration, trade test details, and salary ranges." `
    -h1 "Pipe Fitter Jobs in the Gulf" `
    -sub "Verified overseas opportunities for Pipe Fitters and Fabricators in EPC and Petrochemical projects. Register with AVC for zero-fee placement support." `
    -heroColor "#0f172a" `
    -salary "<ul><li><strong>Saudi Arabia:</strong> SAR 1,500 - 2,500 + OT</li><li><strong>UAE:</strong> AED 1,600 - 2,600 + OT</li><li><strong>Qatar:</strong> QAR 1,500 - 2,500 + OT</li></ul>" `
    -test "<p>Practical trade testing covers:</p><ul><li>Isometric drawing reading</li><li>Pipe cutting, grinding, and beveling</li><li>Flange alignment and fit-up</li></ul>" `
    -reqs "<ul><li>Verifiable experience in Oil & Gas</li><li>Valid Passport</li><li>Ability to read isometric drawings</li></ul>" `
    -isEmployer $false


# 2. EMPLOYER PAGES

# Hire Electricians
Generate-TradePage -filename "hire-electricians.html" `
    -title "Hire Indian Electricians for Gulf Projects | AVC Bihar" `
    -desc "Source trade-tested, GAMCA-ready Indian electricians for your Gulf projects. AVC provides pre-screened building and industrial electricians." `
    -h1 "Hire Skilled Indian Electricians" `
    -sub "Source trade-tested, GAMCA-ready building and industrial electricians from Bihar. We pre-screen candidates based on your exact technical requirements." `
    -heroColor "#071827" `
    -salary "<ul><li>We match candidates to your approved salary scale.</li><li>We brief candidates on your overtime, food, and accommodation policies to ensure 100% transparency and lower dropout rates.</li></ul>" `
    -test "<p>Our facility provides:</p><ul><li>Custom panel boards for DB dressing tests</li><li>415V testing environments</li><li>Video recording of candidate practical tests if you cannot visit physically</li></ul>" `
    -reqs "<p>You provide the requirement brief, we provide:</p><ul><li>Shortlisted CVs within 48-72 hours</li><li>Pre-screened candidates holding valid passports</li><li>Coordinated interview scheduling</li></ul>" `
    -isEmployer $true

# Hire Welders
Generate-TradePage -filename "hire-welders.html" `
    -title "Hire Indian 6G/TIG Welders for Gulf Projects | AVC Bihar" `
    -desc "Source certified 6G, TIG, and ARC welders for EPC and Oil & Gas projects. AVC provides pre-screened, trade-tested welders." `
    -h1 "Hire Certified Indian Welders" `
    -sub "Source ASME-tested 6G, TIG, and ARC welders from Bihar for your EPC and Petrochemical projects. We arrange full testing facilities." `
    -heroColor "#071827" `
    -salary "<ul><li>We match candidates to your approved salary scale.</li><li>Candidates are briefed on your specific project location, hours, and camp facilities.</li></ul>" `
    -test "<p>Our facility provides:</p><ul><li>Lincoln/Miller welding machines</li><li>Pipe coupons for 6G positions</li><li>Proper safety gear and extraction</li><li>Space for your delegation to supervise tests directly</li></ul>" `
    -reqs "<p>You provide the requirement brief, we provide:</p><ul><li>Shortlisted CVs within 48-72 hours</li><li>Verification of past Gulf experience</li><li>Logistics for physical delegation visits</li></ul>" `
    -isEmployer $true

# Hire HVAC
Generate-TradePage -filename "hire-hvac-technicians.html" `
    -title "Hire Indian HVAC Technicians for Gulf Projects | AVC Bihar" `
    -desc "Source trade-tested Indian HVAC and Chiller technicians for facility management and construction in the GCC." `
    -h1 "Hire Indian HVAC Technicians" `
    -sub "Source trade-tested HVAC, Chiller, and BMS technicians from Bihar. Pre-screened for technical competence and communication." `
    -heroColor "#071827" `
    -salary "<ul><li>We align with your FM or Construction package standards.</li><li>Transparent briefing to ensure candidates accept offers gladly.</li></ul>" `
    -test "<p>Our facility provides:</p><ul><li>Split AC and Window AC rigs for basic testing</li><li>Electrical troubleshooting boards</li><li>Interview suites for your technical managers</li></ul>" `
    -reqs "<p>You provide the requirement brief, we provide:</p><ul><li>Shortlisted CVs within 48-72 hours</li><li>Candidates with valid passports and verified ITI certs</li></ul>" `
    -isEmployer $true

# Hire Plumbers
Generate-TradePage -filename "hire-plumbers.html" `
    -title "Hire Indian Plumbers & Pipe Fitters for Gulf | AVC Bihar" `
    -desc "Source skilled Indian plumbers and pipe fitters for Gulf construction projects. Trade-tested and pre-screened by AVC." `
    -h1 "Hire Indian Plumbers & Pipe Fitters" `
    -sub "Source skilled, robust plumbers and pipe fitters from Bihar. Ready for immediate mobilization to Gulf construction projects." `
    -heroColor "#071827" `
    -salary "<ul><li>We match candidates to your approved salary scale.</li><li>We ensure candidates understand the scale and scope of work before interview.</li></ul>" `
    -test "<p>Our facility provides:</p><ul><li>PPR and UPVC welding tools</li><li>Mock-up walls for sanitary fixture installation</li><li>Space for large-scale practical assessment</li></ul>" `
    -reqs "<p>You provide the requirement brief, we provide:</p><ul><li>Shortlisted CVs within 48-72 hours</li><li>Large volumes of pre-screened manpower</li><li>Smooth queue management during your recruitment drive</li></ul>" `
    -isEmployer $true

