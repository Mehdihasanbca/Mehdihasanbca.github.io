import os

# 1. Update index.html (Maps + Schema)
try:
    with open('index.html', 'r', encoding='utf-8') as f:
        idx = f.read()

    css_insert = """
    <style>
    .trust-location-section { padding: 60px 0; background: #f8fafc; border-top: 1px solid #e2e8f0; }
    .trust-location-header { text-align: center; max-width: 700px; margin: 0 auto 40px; }
    .trust-location-header h2 { font-size: clamp(22px, 3vw, 32px); color: #0f172a; margin: 8px 0 12px; }
    .trust-location-header p { color: #64748b; font-size: 15px; line-height: 1.6; }
    .trust-location-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
    .trust-map-wrap { border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .trust-location-details { display: flex; flex-direction: column; gap: 20px; }
    .trust-address-block h3 { font-size: 18px; color: #0f172a; margin: 0 0 8px; }
    .trust-address-block p { color: #475569; font-size: 14px; line-height: 1.7; margin: 0; }
    .trust-location-pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .trust-loc-pill { background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; font-size: 13px; color: #334155; font-weight: 600; }
    .trust-reg-strip { background: #071827; color: #cbd5e1; border-radius: 8px; padding: 14px 16px; font-size: 13px; display: flex; gap: 20px; flex-wrap: wrap; }
    @media (max-width: 768px) {
      .trust-location-grid { grid-template-columns: 1fr; }
      .trust-location-pillars { grid-template-columns: 1fr; }
    }
    </style>
    """
    if "trust-location-section" not in idx:
        idx = idx.replace('</head>', css_insert + '</head>')
        
        html_insert = """
        <!-- Trust Location Section: Google Maps + Office Proof -->
        <section class="trust-location-section" aria-label="AVC Office Location and Verification">
          <div class="container">
            <div class="trust-location-header">
              <span class="section-kicker">PHYSICAL OFFICE / DARBHANGA</span>
              <h2>Visit Our Verified Office &amp; Interview Center</h2>
              <p>AVC operates from a registered physical office in Darbhanga, Bihar. Walk-in candidates, employer delegations, and verification visits are welcome during business hours.</p>
            </div>
            <div class="trust-location-grid">
              <div class="trust-map-wrap">
                <iframe
                  src="https://maps.google.com/maps?q=Kamtaul+Road+Madhupur+Tekatar+Darbhanga+Bihar+847306+India&output=embed&z=15"
                  width="100%"
                  height="380"
                  style="border:0; border-radius:10px;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="AVC Office Location on Google Maps"
                ></iframe>
              </div>
              <div class="trust-location-details">
                <div class="trust-address-block">
                  <h3>Assignment Venue Center</h3>
                  <p>Ground Floor, Kamtaul Road<br>Madhupur, Tekatar<br>Darbhanga, Bihar — 847306</p>
                  <a href="https://maps.google.com/maps?q=Kamtaul+Road+Madhupur+Darbhanga+Bihar" target="_blank" rel="noopener noreferrer" class="button outline" style="margin-top:12px;display:inline-block;">Open in Google Maps ↗</a>
                </div>
                <div class="trust-location-pillars">
                  <div class="trust-loc-pill">✅ Registered Physical Office</div>
                  <div class="trust-loc-pill">✅ Walk-in Verification Available</div>
                  <div class="trust-loc-pill">✅ Trade Testing Campus</div>
                  <div class="trust-loc-pill">✅ Client Interview Suites</div>
                  <div class="trust-loc-pill">✅ Candidate Support Desk</div>
                  <div class="trust-loc-pill">🕐 Mon–Sat: 9 AM – 6 PM IST</div>
                </div>
                <div class="trust-reg-strip">
                  <div><strong>GSTIN:</strong> <a href="https://www.gstin.gov.in/" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">10AOVPH3197L1ZI ↗</a></div>
                  <div><strong>Udyam:</strong> <a href="https://udyamregistration.gov.in/" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">UDYAM-BR-10-0047094 ↗</a></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        """
        idx = idx.replace('<!-- Master Corporate Footer -->', html_insert + '\n<!-- Master Corporate Footer -->')
        
        schema_target = '''"aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "148",
          "bestRating": "5",
          "worstRating": "1"
        },'''
        schema_insert = schema_target + '''
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        ],
        "hasMap": "https://maps.google.com/maps?q=Kamtaul+Road+Madhupur+Darbhanga+Bihar+847306",
        "sameAs": [
          "https://www.youtube.com/@AssignmentvenueCentre",
          "https://www.facebook.com/assignmentvenuecentre",
          "https://whatsapp.com/channel/0029Vb7mJuWF1YlQJ0sKSn06",
          "https://www.linkedin.com/in/mehdihasan-avc/"
        ],'''
        idx = idx.replace(schema_target, schema_insert)

        with open('index.html', 'w', encoding='utf-8') as f:
            f.write(idx)
        print("Updated index.html")
except Exception as e:
    print(f"Failed index.html: {e}")

# 2. Update about.html
try:
    with open('about.html', 'r', encoding='utf-8') as f:
        about = f.read()
    if "Office Location Map" not in about:
        about_map = """
      <!-- Office Location Map -->
      <section style="padding:40px 0; background:#f8fafc; border-top:1px solid #e2e8f0;">
        <div class="container">
          <h2 style="font-size:20px; color:#0f172a; margin:0 0 16px;">Visit Our Office — Darbhanga, Bihar</h2>
          <iframe
            src="https://maps.google.com/maps?q=Kamtaul+Road+Madhupur+Tekatar+Darbhanga+Bihar+847306&output=embed&z=15"
            width="100%"
            height="320"
            style="border:0; border-radius:8px;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="AVC Office Location"
          ></iframe>
          <p style="margin:12px 0 0; font-size:13px; color:#64748b;">Ground Floor, Kamtaul Road, Madhupur, Tekatar, Darbhanga, Bihar 847306 &nbsp;·&nbsp; <a href="https://maps.google.com/maps?q=Kamtaul+Road+Madhupur+Darbhanga" target="_blank" rel="noopener noreferrer" style="color:#2563eb;">Open in Google Maps ↗</a></p>
        </div>
      </section>
        """
        about = about.replace('<footer', about_map + '\n<footer')
        with open('about.html', 'w', encoding='utf-8') as f:
            f.write(about)
        print("Updated about.html")
except Exception as e:
    print(f"Failed about.html: {e}")
    
# 3. Create success-stories.html and hire-workers.html based on faq.html template
try:
    with open('faq.html', 'r', encoding='utf-8') as f:
        faq = f.read()
        
    nav_end = faq.find('<main')
    if nav_end == -1: nav_end = faq.find('<section')
    footer_start = faq.find('<footer')
    
    header = faq[:nav_end].replace('FAQ — Gulf Jobs & AVC Services | Assignment Venue Center', 'Candidate Success Stories | Gulf Jobs Bihar | AVC Darbhanga')
    header = header.replace('Answers to the most common questions', 'Real workers from Bihar placed in Gulf jobs through AVC')
    footer = faq[footer_start:]
    
    # Success Stories
    ss_content = header + '''
<main>
  <section style="background:#0f172a; color:#fff; padding:60px 0; text-align:center;">
    <div class="container">
      <span style="color:#38bdf8; font-weight:700; font-size:13px; letter-spacing:1px; text-transform:uppercase;">VERIFIED PLACEMENT STORIES</span>
      <h1 style="font-size:36px; margin:16px 0;">Real Workers. Real Opportunities. Zero Fees.</h1>
      <p style="color:#94a3b8; font-size:16px; max-width:800px; margin:0 auto 24px;">These are workers from Bihar who registered with AVC, passed trade tests, appeared for interviews, and were selected by GCC employers. No fabricated outcomes. We show trade, country, and journey — not guarantees.</p>
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
            <div style="font-size:12px; color:#64748b;">Building Electrician · Saudi Arabia</div>
          </div>
        </div>
        <p style="font-size:14px; color:#334155; font-style:italic; margin-bottom:16px;">"AVC did not take a single rupee. The trade test was conducted strictly on merit."</p>
        <div style="font-size:11px; color:#94a3b8; font-weight:700; letter-spacing:0.5px;">REGISTERED → TESTED → SELECTED</div>
      </div>
      
      <div style="background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
          <div style="width:40px; height:40px; border-radius:50%; background:#059669; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold;">RS</div>
          <div>
            <div style="font-weight:700; color:#0f172a;">Rakesh Kumar Sah</div>
            <div style="font-size:12px; color:#64748b;">6G TIG Welder · Qatar</div>
          </div>
        </div>
        <p style="font-size:14px; color:#334155; font-style:italic; margin-bottom:16px;">"Lincoln machine pipe welding test was supervised directly by the client delegation. Fully transparent."</p>
        <div style="font-size:11px; color:#94a3b8; font-weight:700; letter-spacing:0.5px;">REGISTERED → TESTED → SELECTED</div>
      </div>
      
      <div style="background:#fff; padding:24px; border-radius:8px; border:1px solid #e2e8f0; box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px;">
          <div style="width:40px; height:40px; border-radius:50%; background:#d97706; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:bold;">E</div>
          <div>
            <div style="font-weight:700; color:#0f172a;">Electrician</div>
            <div style="font-size:12px; color:#64748b;">Muzaffarpur, Bihar · UAE</div>
          </div>
        </div>
        <p style="font-size:14px; color:#334155; font-style:italic; margin-bottom:16px;">"The registration form was simple and free. No middleman, no money asked."</p>
        <div style="font-size:11px; color:#94a3b8; font-weight:700; letter-spacing:0.5px;">REGISTERED → TESTED → SELECTED</div>
      </div>

    </div>
  </section>
</main>
    ''' + footer
    with open('success-stories.html', 'w', encoding='utf-8') as f:
        f.write(ss_content)
    print("Created success-stories.html")
        
    # Hire Workers
    hw_header = header.replace('Candidate Success Stories | Gulf Jobs Bihar | AVC Darbhanga', 'Hire Skilled Workers for Gulf Projects | AVC Bihar')
    hw_header = hw_header.replace('Real workers from Bihar placed in Gulf jobs through AVC', 'Source trade-tested electricians, welders, HVAC technicians, and skilled workers from Bihar.')
    
    hw_content = hw_header + '''
<main>
  <section style="background:#0f172a; color:#fff; padding:60px 0; text-align:center;">
    <div class="container">
      <h1 style="font-size:36px; margin:16px 0;">Need Skilled Workers for Gulf Projects?</h1>
      <p style="color:#94a3b8; font-size:16px; max-width:800px; margin:0 auto 24px;">AVC pre-screens, trade-tests, and presents verified Indian manpower from Bihar. We organize the candidate pool — you do the interview.</p>
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
    ''' + footer
    with open('hire-workers.html', 'w', encoding='utf-8') as f:
        f.write(hw_content)
    print("Created hire-workers.html")
except Exception as e:
    print(f"Failed to create success/hire pages: {e}")

# 4. Update Sitemap
try:
    with open('sitemap.xml', 'r', encoding='utf-8') as f:
        sitemap = f.read()
    if "success-stories.html" not in sitemap:
        sitemap = sitemap.replace('</urlset>', '''  <url><loc>https://assignmentvenuecentre.me/success-stories.html</loc><changefreq>monthly</changefreq><priority>0.80</priority><lastmod>2026-10-01</lastmod></url>
  <url><loc>https://assignmentvenuecentre.me/hire-workers.html</loc><changefreq>monthly</changefreq><priority>0.80</priority><lastmod>2026-10-01</lastmod></url>
</urlset>''')
        with open('sitemap.xml', 'w', encoding='utf-8') as f:
            f.write(sitemap)
        print("Updated sitemap.xml")
except Exception as e:
    print(f"Failed sitemap update: {e}")
