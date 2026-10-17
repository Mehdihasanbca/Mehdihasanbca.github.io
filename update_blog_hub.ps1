$ErrorActionPreference = 'Stop'

$blogIndex = Get-Content "blog\index.html" -Raw

$allCards = @"
      <div class="blog-grid">

        <article class="blog-card">
          <span class="blog-card-cat">Fraud Prevention</span>
          <span class="blog-card-date">28 Sep 2026</span>
          <h2>How to Verify a Gulf Job Offer &mdash; 12 Steps Checklist</h2>
          <p>Before you pay anyone or travel anywhere, run through this 12-point verification checklist. It has protected hundreds of Bihar workers from fraud.</p>
          <a class="read-link" href="how-to-verify-gulf-job-offer.html">Read the guide &rarr;</a>
        </article>

        <article class="blog-card">
          <span class="blog-card-cat">Salary Analysis</span>
          <span class="blog-card-date">28 Sep 2026</span>
          <h2>Dubai Jobs 2026: Salary Guide for Indian Skilled Workers</h2>
          <p>Comprehensive salary benchmarks for electricians, welders, HVAC technicians, plumbers, and fitters in UAE, including allowances and WPS rules.</p>
          <a class="read-link" href="dubai-jobs-2026-salary-guide.html">Read the guide &rarr;</a>
        </article>

        <article class="blog-card">
          <span class="blog-card-cat">Documents &amp; Process</span>
          <span class="blog-card-date">26 Sep 2026</span>
          <h2>ECR vs ECNR Passport for Indian Workers: 2026 Guide</h2>
          <p>Understand the critical differences between Emigration Check Required and Non-ECR status, POE clearances, and conversion procedures.</p>
          <a class="read-link" href="ecr-ecnr-passport-guide.html">Read the guide &rarr;</a>
        </article>

        <article class="blog-card">
          <span class="blog-card-cat">Fraud Prevention</span>
          <span class="blog-card-date">24 Sep 2026</span>
          <h2>How to Avoid Gulf Job Scams: 15 Red Flags Every Worker Must Know</h2>
          <p>A comprehensive safety guide detailing the common deceit tactics, counterfeit documents, and illegal fee schemes used by fraudsters.</p>
          <a class="read-link" href="how-to-avoid-gulf-job-scams.html">Read the guide &rarr;</a>
        </article>

        <article class="blog-card">
          <span class="blog-card-cat">Trade Specialization</span>
          <span class="blog-card-date">30 Sep 2026</span>
          <h2>Electrician Gulf Jobs from Bihar: The Complete 2026 Guide</h2>
          <p>Everything Bihar electricians need to know before applying for GCC jobs: trade test modules, single-line diagrams, and salary expectations.</p>
          <a class="read-link" href="electrician-gulf-jobs-bihar.html">Read the guide &rarr;</a>
        </article>

        <article class="blog-card">
          <span class="blog-card-cat">Medical Protocols</span>
          <span class="blog-card-date">02 Oct 2026</span>
          <h2>GAMCA Medical Test Guide 2026: Wafid Appointment &amp; Rules</h2>
          <p>What GAMCA tests check, Wafid appointment slip generation, medical unfitness rules, and authorized centers in Bihar.</p>
          <a class="read-link" href="gamca-medical-test-guide.html">Read the guide &rarr;</a>
        </article>

        <article class="blog-card">
          <span class="blog-card-cat">Trade Test Prep</span>
          <span class="blog-card-date">04 Oct 2026</span>
          <h2>Electrician Gulf Job Interview: 40 Technical Questions &amp; Answers</h2>
          <p>Practice these 40 questions before your electrical technician interview for Saudi Arabia, UAE, or Qatar. Includes DB dressing and motor starters.</p>
          <a class="read-link" href="electrician-gulf-interview-questions.html">Read the guide &rarr;</a>
        </article>

        <article class="blog-card">
          <span class="blog-card-cat">Welding Standards</span>
          <span class="blog-card-date">06 Oct 2026</span>
          <h2>6G Welder Trade Test Guide: Standards, Inspection &amp; Certification</h2>
          <p>A 6G pipe welding test is the standard for Gulf oil &amp; gas projects. Here is exactly what certified examiners check, step by step.</p>
          <a class="read-link" href="6g-welder-trade-test-guide.html">Read the guide &rarr;</a>
        </article>

      </div>
"@

$blogIndex = $blogIndex -replace '(?s)<div class="blog-grid">.*?</div>\s*</div>\s*</section>', "$allCards`n    </div>`n  </section>"
Set-Content -Path "blog\index.html" -Value $blogIndex -Encoding UTF8
Write-Output "Updated blog\index.html with all 8 published guides"
