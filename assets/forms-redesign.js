/**
 * Assignment Venue Center (AVC)
 * High-Converting Interactive Forms Engine
 * Handles Candidate Intake (apply.html) & Enterprise Sourcing (employer-requirement.html)
 */

(() => {
  'use strict';

  // Helper: Format phone number
  const sanitizePhone = (val) => String(val || '').replace(/[^0-9]/g, '');

  // Helper: Toast notification
  const showToast = (message) => {
    let toast = document.querySelector('.avc-toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'avc-toast-notice';
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#071827;color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:700;box-shadow:0 10px 25px rgba(0,0,0,0.2);z-index:99999;border-left:4px solid #0f9d58;transition:opacity 0.3s;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 3200);
  };

  /* ==========================================================================
     1. CANDIDATE APPLICATION PORTAL (apply.html)
     ========================================================================== */
  const candidateForm = document.getElementById('candidate-apply-form');
  const candidateSuccess = document.getElementById('candidate-success-card');

  if (candidateForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = (urlParams.get('job') || '').trim();
    const source = (urlParams.get('source') || 'website').trim();

    const linkedCard = document.getElementById('linked-vacancy-card');
    const linkedTitle = document.getElementById('linked-vacancy-title');
    const linkedMeta = document.getElementById('linked-vacancy-meta');
    const jobInput = document.getElementById('target-job-ref');
    const tradeSelect = document.getElementById('candidate-trade');

    // If job param is present, fetch and auto-link from jobs.json
    if (jobId) {
      fetch('data/jobs.json', { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => {
          const job = (Array.isArray(data.jobs) ? data.jobs : []).find(
            (j) => String(j.id || '').toUpperCase() === jobId.toUpperCase()
          );

          if (job) {
            if (linkedCard) linkedCard.style.display = 'flex';
            if (linkedTitle) linkedTitle.textContent = `${job.title} (${job.id})`;
            if (linkedMeta) {
              linkedMeta.innerHTML = `
                <span><strong>Country:</strong> ${job.country || 'Gulf'}</span>
                <span><strong>Salary:</strong> ${job.salaryDisplay || 'Competitive + OT'}</span>
                <span><strong>Status:</strong> ${job.status === 'open' ? 'Active Recruitment' : 'Closing Soon'}</span>
              `;
            }
            if (jobInput) jobInput.value = `${job.id} - ${job.title}`;

            // Map trade category if match found
            if (tradeSelect && job.category) {
              const catLower = job.category.toLowerCase();
              Array.from(tradeSelect.options).forEach((opt) => {
                if (catLower.includes(opt.value.toLowerCase()) || opt.value.toLowerCase().includes(catLower)) {
                  tradeSelect.value = opt.value;
                }
              });
            }
          } else {
            if (jobInput) jobInput.value = jobId;
          }
        })
        .catch(() => {
          if (jobInput) jobInput.value = jobId;
        });
    }

    // Form Submission Handling
    candidateForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = (document.getElementById('candidate-name')?.value || '').trim();
      const rawPhone = (document.getElementById('candidate-phone')?.value || '').trim();
      const altPhone = (document.getElementById('candidate-alt-phone')?.value || '').trim();
      const email = (document.getElementById('candidate-email')?.value || '').trim();
      const district = (document.getElementById('candidate-district')?.value || '').trim();
      const trade = (document.getElementById('candidate-trade')?.value || '').trim();
      const expTotal = (document.getElementById('candidate-exp-total')?.value || '').trim();
      const expGulf = (document.getElementById('candidate-exp-gulf')?.value || '').trim();
      const passport = (document.getElementById('candidate-passport')?.value || '').trim();
      const education = (document.getElementById('candidate-education')?.value || '').trim();
      const targetCountry = (document.getElementById('candidate-target-country')?.value || '').trim();
      const jobRef = (document.getElementById('target-job-ref')?.value || 'General Pool Registration').trim();
      const notes = (document.getElementById('candidate-notes')?.value || '').trim();

      const cleanPhone = sanitizePhone(rawPhone);
      if (cleanPhone.length < 10) {
        alert('Please enter a valid 10-digit mobile / WhatsApp number.');
        document.getElementById('candidate-phone')?.focus();
        return;
      }

      // Generate Reference Code
      const appRef = `AVC-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Populate Success Card
      const refNode = document.getElementById('success-app-token');
      if (refNode) refNode.textContent = appRef;

      const summaryList = document.getElementById('success-summary-list');
      if (summaryList) {
        summaryList.innerHTML = `
          <dl>
            <dt>Applicant Name</dt><dd>${fullName}</dd>
            <dt>WhatsApp No.</dt><dd>+91 ${cleanPhone}</dd>
            <dt>Primary Trade</dt><dd>${trade}</dd>
            <dt>Experience</dt><dd>${expTotal} (Gulf: ${expGulf})</dd>
            <dt>Passport Status</dt><dd>${passport}</dd>
            <dt>Home District</dt><dd>${district}</dd>
            <dt>Applied For</dt><dd>${jobRef}</dd>
            <dt>Intake Status</dt><dd style="color:#0f9d58;">Verified 100% Free Registration</dd>
          </dl>
        `;
      }

      // Build WhatsApp dispatch message
      const waText = `*OFFICIAL CANDIDATE REGISTRATION — AVC DARBHANGA*
*Application Ref:* ${appRef}
*Full Name:* ${fullName}
*WhatsApp No:* +91 ${cleanPhone}
${altPhone ? `*Alternate No:* +91 ${sanitizePhone(altPhone)}\n` : ''}*Primary Trade:* ${trade}
*Total Experience:* ${expTotal}
*Gulf Experience:* ${expGulf}
*Passport Status:* ${passport}
*Home District:* ${district}
*Target Vacancy / Route:* ${jobRef}
${targetCountry ? `*Preferred Country:* ${targetCountry}\n` : ''}${education ? `*Qualification:* ${education}\n` : ''}${notes ? `*Candidate Notes:* ${notes}\n` : ''}
_I have completed 100% free registration on assignmentvenuecentre.me. Please review my profile for upcoming client interview drives at Darbhanga Venue._`;

      const waBtn = document.getElementById('success-whatsapp-btn');
      if (waBtn) {
        waBtn.href = `https://wa.me/919473286356?text=${encodeURIComponent(waText)}`;
      }

      // Switch views
      candidateForm.style.display = 'none';
      if (candidateSuccess) {
        candidateSuccess.classList.add('active');
        candidateSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      showToast('Profile registered successfully! Tracking token generated.');
    });

    // Reset Form button
    const resetBtn = document.getElementById('btn-apply-another');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        candidateForm.reset();
        candidateForm.style.display = 'block';
        if (candidateSuccess) candidateSuccess.classList.remove('active');
        candidateForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ==========================================================================
     2. ENTERPRISE MANPOWER SOURCING PORTAL (employer-requirement.html)
     ========================================================================== */
  const employerForm = document.getElementById('employer-requirement-form');
  const employerSuccess = document.getElementById('employer-success-card');

  if (employerForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const refSource = (urlParams.get('source') || urlParams.get('ref') || 'website').trim();

    employerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const companyName = (document.getElementById('emp-company-name')?.value || '').trim();
      const repName = (document.getElementById('emp-rep-name')?.value || '').trim();
      const repDesignation = (document.getElementById('emp-rep-desig')?.value || '').trim();
      const email = (document.getElementById('emp-email')?.value || '').trim();
      const rawPhone = (document.getElementById('emp-phone')?.value || '').trim();
      const country = (document.getElementById('emp-country')?.value || '').trim();
      const industry = (document.getElementById('emp-industry')?.value || '').trim();
      const tradesHeadcount = (document.getElementById('emp-trades-headcount')?.value || '').trim();
      const interviewMode = (document.getElementById('emp-interview-mode')?.value || '').trim();
      const salaryTerms = (document.getElementById('emp-salary-terms')?.value || '').trim();
      const timeline = (document.getElementById('emp-timeline')?.value || '').trim();
      const notes = (document.getElementById('emp-notes')?.value || '').trim();

      const cleanPhone = sanitizePhone(rawPhone);
      const reqRef = `AVC-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Structured Specification Brief
      const briefText = `=====================================================
ASSIGNMENT VENUE CENTER (AVC) — SOURCING & VENUE BRIEF
Reference: ${reqRef} | Source: ${refSource}
=====================================================
1. COMPANY PROFILE
- Organization: ${companyName}
- Representative: ${repName} (${repDesignation || 'Authorized Officer'})
- Corporate Email: ${email}
- Phone / WhatsApp: +${cleanPhone}

2. DEPLOYMENT & PROJECT CONTEXT
- Target Country: ${country}
- Industry / Sector: ${industry}

3. MANPOWER REQUIREMENTS & VOLUME
${tradesHeadcount}

4. INTERVIEW & VENUE SPECIFICATION
- Preferred Selection Mode: ${interviewMode}
- Target Schedule / Mobilization: ${timeline || 'Immediate'}

5. COMMERCIAL & EMPLOYMENT TERMS
${salaryTerms || 'Standard GCC labour terms with accommodation & transport'}

6. STATUTORY OPERATING RECOGNITION
- Ground Sourcing & Venue Operations: Assignment Venue Center, Darbhanga, Bihar.
- Regulated Emigration & Visa Clearance: Under authorized statutory mechanisms.
${notes ? `\nADDITIONAL NOTES:\n${notes}\n` : ''}
=====================================================`;

      // Render summary
      const refNode = document.getElementById('success-req-token');
      if (refNode) refNode.textContent = reqRef;

      const summaryList = document.getElementById('emp-success-summary');
      if (summaryList) {
        summaryList.innerHTML = `
          <dl>
            <dt>Company</dt><dd>${companyName}</dd>
            <dt>Authorized Contact</dt><dd>${repName} (${email})</dd>
            <dt>Deployment Country</dt><dd>${country}</dd>
            <dt>Selection Mode</dt><dd>${interviewMode}</dd>
            <dt>Trades & Volume</dt><dd>${tradesHeadcount.replace(/\n/g, ', ')}</dd>
            <dt>Target Window</dt><dd>${timeline || 'As mutually scheduled'}</dd>
          </dl>
        `;
      }

      // WhatsApp Corporate Dispatch Link
      const waEmpBtn = document.getElementById('emp-whatsapp-btn');
      if (waEmpBtn) {
        waEmpBtn.href = `https://wa.me/919473286356?text=${encodeURIComponent(briefText)}`;
      }

      // Email Corporate Dispatch Link
      const mailEmpBtn = document.getElementById('emp-email-btn');
      if (mailEmpBtn) {
        const mailSubject = `Enterprise Manpower Sourcing Brief — ${companyName} [${reqRef}]`;
        mailEmpBtn.href = `mailto:info@assignmentvenuecentre.me?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(briefText)}`;
      }

      // Clipboard Copy handler
      const copyBtn = document.getElementById('emp-copy-brief-btn');
      if (copyBtn) {
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(briefText);
            showToast('Sourcing Brief copied to clipboard!');
          } catch {
            showToast('Please select and copy the text manually.');
          }
        };
      }

      // Switch views
      employerForm.style.display = 'none';
      if (employerSuccess) {
        employerSuccess.classList.add('active');
        employerSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      showToast('Sourcing requirement generated successfully!');
    });

    // Reset Form button
    const empResetBtn = document.getElementById('btn-emp-another');
    if (empResetBtn) {
      empResetBtn.addEventListener('click', () => {
        employerForm.reset();
        employerForm.style.display = 'block';
        if (employerSuccess) employerSuccess.classList.remove('active');
        employerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ==========================================================================
     3. UNIVERSAL FAQ ACCORDION HANDLER
     ========================================================================== */
  document.querySelectorAll('.faq-box').forEach((box) => {
    const btn = box.querySelector('.faq-question-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = box.classList.contains('open');
      document.querySelectorAll('.faq-box').forEach((b) => {
        if (b !== box) b.classList.remove('open');
      });
      box.classList.toggle('open', !isOpen);
    });
  });

  /* ==========================================================================
     4. PRINT SLIP HANDLER
     ========================================================================== */
  document.querySelectorAll('[data-print-slip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });
})();
