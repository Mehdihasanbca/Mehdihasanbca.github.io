$ErrorActionPreference = 'Stop'

$templateContent = Get-Content "faq.html" -Raw
$navEndIdx = $templateContent.IndexOf("<main")
if ($navEndIdx -eq -1) { $navEndIdx = $templateContent.IndexOf("<section") }
$footerIdx = $templateContent.IndexOf("<footer")

$header = $templateContent.Substring(0, $navEndIdx)
$footer = $templateContent.Substring($footerIdx)

$header = $header -replace '<title>.*</title>', '<title>Gulf Jobs Salary Calculator 2026 | Expected Salary for Indian Workers | AVC</title>'
$header = $header -replace '<meta name="description" content="[^"]*">', '<meta name="description" content="Calculate your expected salary for Gulf jobs based on your trade and experience. See estimates for Saudi Arabia, UAE, Qatar, and Oman.">'

$body = @"
<main>
  <section style="background:#0f172a; color:#fff; padding:60px 0; text-align:center;">
    <div class="container">
      <h1 style="font-size:36px; margin:16px 0;">Expected Salary Calculator</h1>
      <p style="color:#94a3b8; font-size:16px; max-width:800px; margin:0 auto 24px;">Check transparent salary estimates for skilled trades in the GCC based on 2026 market data. Know your worth before applying.</p>
    </div>
  </section>

  <section style="padding:60px 0; background:#f8fafc;">
    <div class="container" style="max-width:800px;">
      
      <div style="background:#fff; padding:40px; border-radius:12px; border:1px solid #e2e8f0; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
        <h2 style="font-size:24px; color:#0f172a; margin:0 0 24px; text-align:center;">Calculate Your Estimation</h2>
        
        <form id="salary-calc-form" style="display:flex; flex-direction:column; gap:20px;">
          <div>
            <label style="display:block; font-size:14px; font-weight:700; color:#334155; margin-bottom:8px;">Target Country</label>
            <select id="calc-country" required style="width:100%; padding:14px; border:1px solid #cbd5e1; border-radius:8px; font-size:16px;">
              <option value="saudi">Saudi Arabia (SAR)</option>
              <option value="uae">United Arab Emirates (AED)</option>
              <option value="qatar">Qatar (QAR)</option>
              <option value="oman">Oman (OMR)</option>
            </select>
          </div>
          
          <div>
            <label style="display:block; font-size:14px; font-weight:700; color:#334155; margin-bottom:8px;">Your Trade</label>
            <select id="calc-trade" required style="width:100%; padding:14px; border:1px solid #cbd5e1; border-radius:8px; font-size:16px;">
              <option value="electrician">Electrician (Building / Industrial)</option>
              <option value="welder">Welder (6G / TIG / ARC)</option>
              <option value="hvac">HVAC Technician</option>
              <option value="plumber">Plumber / Pipe Fitter</option>
              <option value="mason">Civil Mason</option>
              <option value="labor">General Helper / Labor</option>
            </select>
          </div>
          
          <div>
            <label style="display:block; font-size:14px; font-weight:700; color:#334155; margin-bottom:8px;">Gulf Experience</label>
            <select id="calc-exp" required style="width:100%; padding:14px; border:1px solid #cbd5e1; border-radius:8px; font-size:16px;">
              <option value="0">Fresh (Indian Experience Only)</option>
              <option value="1">1 - 3 Years Gulf Return</option>
              <option value="2">4+ Years Gulf Return</option>
            </select>
          </div>
          
          <button type="button" onclick="calculateSalary()" class="button primary" style="padding:16px; font-size:16px; margin-top:10px;">Estimate Expected Package</button>
        </form>

        <div id="calc-result" style="display:none; margin-top:32px; padding:24px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px;">
          <h3 style="font-size:18px; color:#1e40af; margin:0 0 16px; text-align:center;">Estimated Monthly Basic Salary</h3>
          <div style="font-size:36px; font-weight:800; color:#0f172a; text-align:center; margin-bottom:8px;" id="result-salary"></div>
          <div style="font-size:14px; color:#64748b; text-align:center; margin-bottom:24px;">+ Overtime (1.25x or 1.5x basic rate)</div>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px;">
            <div style="background:#fff; padding:12px; border-radius:6px; border:1px solid #e2e8f0; font-size:13px; color:#334155;">🏠 Free Accommodation</div>
            <div style="background:#fff; padding:12px; border-radius:6px; border:1px solid #e2e8f0; font-size:13px; color:#334155;">🚌 Free Transportation</div>
            <div style="background:#fff; padding:12px; border-radius:6px; border:1px solid #e2e8f0; font-size:13px; color:#334155;">🏥 Medical Insurance</div>
            <div style="background:#fff; padding:12px; border-radius:6px; border:1px solid #e2e8f0; font-size:13px; color:#334155;">✈️ Return Air Ticket (2 Yrs)</div>
          </div>
          
          <div style="text-align:center;">
            <p style="font-size:13px; color:#64748b; margin-bottom:16px;">This is an estimate based on current employer mandates. Actual salaries depend on your practical trade test performance.</p>
            <a href="apply.html" class="button" style="background:#16a34a; color:#fff; padding:12px 24px; border-radius:6px; font-weight:700; text-decoration:none;">Apply Free for This Position</a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <script>
    function calculateSalary() {
      const country = document.getElementById('calc-country').value;
      const trade = document.getElementById('calc-trade').value;
      const exp = parseInt(document.getElementById('calc-exp').value);
      
      // Base values for "Fresh" in local currency
      const baseRates = {
        'saudi': { electrician: 1400, welder: 1800, hvac: 1600, plumber: 1300, mason: 1200, labor: 900, curr: 'SAR' },
        'uae': { electrician: 1400, welder: 1800, hvac: 1600, plumber: 1300, mason: 1200, labor: 900, curr: 'AED' },
        'qatar': { electrician: 1400, welder: 1800, hvac: 1600, plumber: 1300, mason: 1200, labor: 900, curr: 'QAR' },
        'oman': { electrician: 120, welder: 160, hvac: 140, plumber: 110, mason: 100, labor: 80, curr: 'OMR' }
      };

      const base = baseRates[country][trade];
      const currency = baseRates[country].curr;
      
      // Multipliers based on Gulf experience
      let multiMin = 1.0;
      let multiMax = 1.2;
      
      if (exp === 1) { multiMin = 1.2; multiMax = 1.4; } // 1-3 years
      if (exp === 2) { multiMin = 1.4; multiMax = 1.8; } // 4+ years
      
      const estMin = Math.round(base * multiMin / 50) * 50;
      const estMax = Math.round(base * multiMax / 50) * 50;
      
      const salaryText = currency + " " + estMin + " - " + estMax;
      
      document.getElementById('result-salary').innerText = salaryText;
      document.getElementById('calc-result').style.display = 'block';
      
      // Smooth scroll to result
      document.getElementById('calc-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  </script>
</main>
"@

$fullContent = $header + $body + $footer
Set-Content -Path "expected-salary-calculator.html" -Value $fullContent -Encoding UTF8
Write-Output "Created expected-salary-calculator.html"

