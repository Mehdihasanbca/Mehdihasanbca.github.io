$ErrorActionPreference = 'Stop'

# 1. Update Salary Calculator with SEO Text
$calcPath = "expected-salary-calculator.html"
$calcContent = Get-Content $calcPath -Raw

$seoText = @"
      <div style="margin-top:60px; background:#fff; padding:40px; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
        <h2 style="font-size:24px; color:#0f172a; margin:0 0 24px; border-bottom:2px solid #e2e8f0; padding-bottom:12px;">Gulf Jobs Salary Guide 2026: Trade & Country Comparison</h2>
        
        <h3 style="font-size:18px; color:#1e40af; margin-top:24px;">Electrician Salary in Saudi Arabia vs UAE</h3>
        <p style="font-size:15px; color:#475569; line-height:1.7;">Saudi Arabia typically offers a slightly higher base salary for building electricians compared to the UAE, due to massive ongoing giga-projects like NEOM. An experienced electrician in KSA can expect SAR 1,800 to SAR 2,500, whereas in Dubai/Abu Dhabi, the rate hovers around AED 1,800 to AED 2,800. The cost of living in UAE can be higher, making KSA a strong choice for maximum savings.</p>

        <h3 style="font-size:18px; color:#1e40af; margin-top:24px;">Welder Salary in Qatar</h3>
        <p style="font-size:15px; color:#475569; line-height:1.7;">Qatar remains a premium destination for 6G, TIG, and ARC welders due to expansions in the LNG sector. Certified welders can command QAR 2,200 to QAR 3,500 based on their X-Ray pass rate. Employers strictly look for valid ASME Section IX certifications and Gulf return experience.</p>

        <h3 style="font-size:18px; color:#1e40af; margin-top:24px;">HVAC Technician Salary in Oman</h3>
        <p style="font-size:15px; color:#475569; line-height:1.7;">Oman offers a steady market for HVAC technicians, particularly in facility management. Salaries range from OMR 140 to OMR 220. While the numerical value looks smaller, the Omani Rial is very strong, translating to excellent Indian Rupee equivalents.</p>

        <h3 style="font-size:18px; color:#1e40af; margin-top:24px;">Frequently Asked Questions</h3>
        <ul style="font-size:15px; color:#475569; line-height:1.7; padding-left:20px;">
          <li style="margin-bottom:8px;"><strong>Is food included in the base salary?</strong> Most EPC companies provide free food via camp catering, or they provide a food allowance (typically SAR/AED 300) on top of the basic salary.</li>
          <li style="margin-bottom:8px;"><strong>How is overtime calculated?</strong> Overtime in the GCC is strictly regulated by labor laws, usually calculated at 1.25x the basic hourly rate for normal days, and 1.5x for Fridays/Holidays.</li>
          <li style="margin-bottom:8px;"><strong>Do I have to pay for the flight?</strong> Legitimate employers provide free mobilization flights and a return ticket every 2 years.</li>
        </ul>
      </div>
"@

# Insert SEO text right before the closing </div> of the container in the second section
$calcContent = $calcContent -replace '(?s)      </div>\s*</div>\s*</section>', "`n$seoText`n      </div>`n    </div>`n  </section>"
Set-Content -Path $calcPath -Value $calcContent -Encoding UTF8
Write-Output "Updated expected-salary-calculator.html"


# 2. Update Employer Pages with Strong CTAs
$employerFiles = @("hire-workers.html", "hire-electricians.html", "hire-welders.html", "hire-hvac-technicians.html", "hire-plumbers.html")

$ctaBar = @"
      <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:8px; padding:24px; text-align:center; margin:32px 0;">
        <h3 style="font-size:20px; color:#92400e; margin:0 0 16px;">Ready to Mobilize Skilled Indian Manpower?</h3>
        <div style="display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">
          <a href="#employer-form" class="button primary" style="background:#b45309; color:#fff;">Request Candidate Pool</a>
          <a href="tel:+919473286356" class="button outline" style="border-color:#b45309; color:#92400e;">Book Employer Call</a>
          <a href="https://wa.me/919473286356?text=We%20want%20to%20schedule%20an%20Interview%20Drive%20in%20Bihar." class="button outline" style="border-color:#b45309; color:#92400e;">Schedule Interview Drive</a>
        </div>
      </div>
"@

foreach ($file in $employerFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        # Insert CTA bar right before the employer-form section
        $content = $content -replace '<section id="employer-form"', "$ctaBar`n  <section id=`"employer-form`""
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Output "Added CTAs to $file"
    }
}
