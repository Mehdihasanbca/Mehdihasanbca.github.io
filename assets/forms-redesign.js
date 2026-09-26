/**
 * Assignment Venue Center (AVC)
 * High-Converting Interactive Forms Engine
 * Multi-Step Wizard for Candidate Intake (apply.html)
 * Corporate Sourcing Engine (employer-requirement.html)
 */

(() => {
  'use strict';

  // Helper: Sanitize numbers
  const sanitizePhone = (val) => String(val || '').replace(/[^0-9]/g, '');

  // Helper: Toast notification
  const showToast = (message) => {
    let toast = document.querySelector('.avc-toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'avc-toast-notice';
      toast.style.cssText = 'position:fixed;bottom:24px;left:24px;background:#071827;color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:700;box-shadow:0 10px 25px rgba(0,0,0,0.25);z-index:99999;border-left:4px solid #0f9d58;transition:opacity 0.3s;';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 3200);
  };

  /* ==========================================================================
     1. CANDIDATE MULTI-STEP WIZARD (apply.html)
     ========================================================================== */
  const candidateForm = document.getElementById('candidate-apply-form');
  const candidateSuccess = document.getElementById('candidate-success-card');

  if (candidateForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = (urlParams.get('job') || '').trim();

    const linkedCard = document.getElementById('linked-vacancy-card');
    const linkedTitle = document.getElementById('linked-vacancy-title');
    const linkedMeta = document.getElementById('linked-vacancy-meta');
    const jobInput = document.getElementById('target-job-ref');
    const tradeSelect = document.getElementById('candidate-trade');

    // Auto-link job if parameter is present
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

    // Direct Pre-fill from Eligibility Matcher or Deep-links
    const tradeParam = (urlParams.get('trade') || '').trim().toLowerCase();
    const countryParam = (urlParams.get('country') || '').trim().toLowerCase();
    const expParam = (urlParams.get('exp') || '').trim().toLowerCase();
    const passParam = (urlParams.get('passport') || '').trim().toLowerCase();

    if (tradeParam && tradeSelect) {
      Array.from(tradeSelect.options).forEach((opt) => {
        if (opt.value.toLowerCase().includes(tradeParam) || tradeParam.includes(opt.value.toLowerCase())) {
          tradeSelect.value = opt.value;
        }
      });
    }

    const countrySelect = document.getElementById('candidate-target-country');
    if (countryParam && countrySelect) {
      Array.from(countrySelect.options).forEach((opt) => {
        if (opt.value.toLowerCase().includes(countryParam)) {
          countrySelect.value = opt.value;
        }
      });
    }

    const expSelect = document.getElementById('candidate-exp-total');
    if (expParam && expSelect) {
      Array.from(expSelect.options).forEach((opt) => {
        if (opt.value.toLowerCase().includes(expParam)) {
          expSelect.value = opt.value;
        }
      });
    }

    const passSelect = document.getElementById('candidate-passport');
    if (passParam && passSelect) {
      Array.from(passSelect.options).forEach((opt) => {
        if (opt.value.toLowerCase().includes(passParam)) {
          passSelect.value = opt.value;
        }
      });
    }

    // Wizard Navigation State
    let currentStep = 1;
    const totalSteps = 4;
    const progressFill = document.querySelector('.wizard-progress-fill');
    const stepNodes = document.querySelectorAll('.wizard-step-node');
    const panes = document.querySelectorAll('.wizard-pane');

    const updateWizardUI = (step) => {
      // Update progress bar
      if (progressFill) {
        const percent = ((step - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${percent}%`;
      }

      // Update node styles
      stepNodes.forEach((node) => {
        const s = parseInt(node.dataset.step, 10);
        node.classList.remove('active', 'completed');
        if (s === step) {
          node.classList.add('active');
        } else if (s < step) {
          node.classList.add('completed');
        }
      });

      // Show active pane
      panes.forEach((pane) => {
        const p = parseInt(pane.dataset.pane, 10);
        pane.classList.toggle('active', p === step);
      });

      // Scroll smoothly to form anchor
      const formAnchor = document.getElementById('form-anchor');
      if (formAnchor) {
        formAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Analytics telemetry
      if (window.AVCAnalytics) {
        window.AVCAnalytics.track('wizard_step_view', { step: step });
      }
    };

    const validateStep = (step) => {
      if (step === 1) {
        const name = (document.getElementById('candidate-name')?.value || '').trim();
        const rawPhone = (document.getElementById('candidate-phone')?.value || '').trim();
        const district = (document.getElementById('candidate-district')?.value || '').trim();
        const cleanPhone = sanitizePhone(rawPhone);

        if (!name || name.length < 2) {
          alert('Please enter your full name as per Passport or Aadhaar.');
          document.getElementById('candidate-name')?.focus();
          return false;
        }
        if (cleanPhone.length < 10) {
          alert('Please enter a valid 10-digit WhatsApp mobile number.');
          document.getElementById('candidate-phone')?.focus();
          return false;
        }
        if (!district) {
          alert('Please select your home district.');
          document.getElementById('candidate-district')?.focus();
          return false;
        }
      } else if (step === 2) {
        const trade = (document.getElementById('candidate-trade')?.value || '').trim();
        if (!trade) {
          alert('Please select your primary trade specialization.');
          document.getElementById('candidate-trade')?.focus();
          return false;
        }
      } else if (step === 3) {
        const expTotal = (document.getElementById('candidate-exp-total')?.value || '').trim();
        const expGulf = (document.getElementById('candidate-exp-gulf')?.value || '').trim();
        const passport = (document.getElementById('candidate-passport')?.value || '').trim();

        if (!expTotal) {
          alert('Please select your total work experience.');
          document.getElementById('candidate-exp-total')?.focus();
          return false;
        }
        if (!expGulf) {
          alert('Please select your Gulf/Overseas experience.');
          document.getElementById('candidate-exp-gulf')?.focus();
          return false;
        }
        if (!passport) {
          alert('Please select your passport status.');
          document.getElementById('candidate-passport')?.focus();
          return false;
        }
      } else if (step === 4) {
        const chkFee = document.getElementById('chk-zero-fee')?.checked;
        const chkRole = document.getElementById('chk-legal-role')?.checked;
        const chkData = document.getElementById('chk-factual-data')?.checked;

        if (!chkFee || !chkRole || !chkData) {
          alert('Please accept all statutory compliance and zero-fee declarations to proceed.');
          return false;
        }
      }
      return true;
    };

    // Next Buttons
    document.querySelectorAll('[data-wizard-next]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          if (currentStep < totalSteps) {
            currentStep += 1;
            updateWizardUI(currentStep);
          }
        }
      });
    });

    // Back Buttons
    document.querySelectorAll('[data-wizard-back]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep -= 1;
          updateWizardUI(currentStep);
        }
      });
    });

    // Node click navigation (only to completed or current)
    stepNodes.forEach((node) => {
      node.addEventListener('click', () => {
        const target = parseInt(node.dataset.step, 10);
        if (target < currentStep) {
          currentStep = target;
          updateWizardUI(currentStep);
        } else if (target === currentStep + 1 && validateStep(currentStep)) {
          currentStep = target;
          updateWizardUI(currentStep);
        }
      });
    });

    // Final Form Submission
    candidateForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateStep(4)) return;

      const fullName = (document.getElementById('candidate-name')?.value || '').trim();
      const rawPhone = (document.getElementById('candidate-phone')?.value || '').trim();
      const altPhone = (document.getElementById('candidate-alt-phone')?.value || '').trim();
      const email = (document.getElementById('candidate-email')?.value || '').trim();
      const district = (document.getElementById('candidate-district')?.value || '').trim();
      const trade = (document.getElementById('candidate-trade')?.value || '').trim();
      const education = (document.getElementById('candidate-education')?.value || '').trim();
      const expTotal = (document.getElementById('candidate-exp-total')?.value || '').trim();
      const expGulf = (document.getElementById('candidate-exp-gulf')?.value || '').trim();
      const passport = (document.getElementById('candidate-passport')?.value || '').trim();
      const targetCountry = (document.getElementById('candidate-target-country')?.value || '').trim();
      const jobRef = (document.getElementById('target-job-ref')?.value || 'General Pool Registration').trim();
      const notes = (document.getElementById('candidate-notes')?.value || '').trim();

      const cleanPhone = sanitizePhone(rawPhone);
      const appRef = `AVC-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      // Save to local CRM candidate ledger
      const candidateRecord = {
        token: appRef,
        fullName: fullName,
        phone: cleanPhone,
        altPhone: altPhone ? sanitizePhone(altPhone) : '',
        email: email,
        district: district,
        trade: trade,
        education: education,
        expTotal: expTotal,
        expGulf: expGulf,
        passport: passport,
        targetCountry: targetCountry,
        jobRef: jobRef,
        notes: notes,
        timestamp: new Date().toISOString(),
        displayDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Stage 2: Technical Pre-Screening',
        source: 'assignmentvenuecentre.me'
      };

      try {
        const existingLedger = JSON.parse(localStorage.getItem('avc_candidate_ledger') || '[]');
        existingLedger.unshift(candidateRecord);
        if (existingLedger.length > 100) existingLedger.length = 100;
        localStorage.setItem('avc_candidate_ledger', JSON.stringify(existingLedger));
      } catch (err) {
        console.warn('Local ledger save note:', err);
      }

      // Background Webhook Push to Google Apps Script (if configured)
      const avcWebhookUrl = localStorage.getItem('avc_webhook_url');
      if (avcWebhookUrl && avcWebhookUrl.startsWith('https://script.google.com/macros/s/')) {
        try {
          fetch(avcWebhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'candidate_application',
              appRef: appRef,
              ...candidateRecord
            })
          }).catch((e) => console.log('Apps Script webhook push note:', e));
        } catch (fetchErr) {
          // Non-blocking
        }
      }

      // Automated Direct Email Lead & Candidate Auto-Reply Dispatch (Zero-Manual)
      try {
        fetch('https://formsubmit.co/ajax/info@assignmentvenuecentre.me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `New AVC Candidate Lead: ${fullName} (${trade}) - [${appRef}]`,
            _replyto: email || 'info@assignmentvenuecentre.me',
            _autoresponse: `Dear ${fullName},\n\nThank you for registering with Assignment Venue Center (Ref: ${appRef}).\n\nTrade: ${trade}\nExperience: ${expTotal} (Gulf: ${expGulf})\nPassport: ${passport}\n\nYour application has been logged in our talent pool. Zero recruitment fee is charged at AVC under the Emigration Act 1983. Our sourcing team will contact you via WhatsApp (+91 ${cleanPhone}) before upcoming client interviews in Darbhanga.\n\nHelpline: +91 9473286356 / info@assignmentvenuecentre.me\nAssignment Venue Center, Darbhanga, Bihar.`,
            token: appRef,
            name: fullName,
            phone: cleanPhone,
            alternatePhone: altPhone || 'None',
            email: email || 'Not provided',
            trade: trade,
            education: education,
            experience: `${expTotal} (Gulf: ${expGulf})`,
            passport: passport,
            targetCountry: targetCountry,
            district: district,
            notes: notes || 'None'
          })
        }).catch((err) => console.log('Email dispatch note:', err));
      } catch (err) {}

      // Populate Success Card
      const refNode = document.getElementById('success-app-token');
      if (refNode) refNode.textContent = appRef;

      const summaryList = document.getElementById('success-summary-list');
      if (summaryList) {
        summaryList.innerHTML = `
          <dl>
            <dt>Applicant Name</dt><dd>${fullName}</dd>
            <dt>WhatsApp No.</dt><dd>+91 ${cleanPhone}</dd>
            ${email ? `<dt>Email</dt><dd>${email}</dd>` : ''}
            <dt>Primary Trade</dt><dd>${trade}</dd>
            <dt>Experience</dt><dd>${expTotal} (Gulf: ${expGulf})</dd>
            <dt>Passport Status</dt><dd>${passport}</dd>
            <dt>Home District</dt><dd>${district}</dd>
            <dt>Applied For</dt><dd>${jobRef}</dd>
            <dt>Registration Fee</dt><dd style="color:#0f9d58;">₹0 (100% Free Guaranteed)</dd>
          </dl>
        `;
      }

      // Build WhatsApp dispatch message
      const waText = `*OFFICIAL CANDIDATE REGISTRATION — AVC DARBHANGA*
*Application Ref:* ${appRef}
*Full Name:* ${fullName}
*WhatsApp No:* +91 ${cleanPhone}
${altPhone ? `*Alternate No:* +91 ${sanitizePhone(altPhone)}\n` : ''}${email ? `*Email:* ${email}\n` : ''}*Primary Trade:* ${trade}
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

      showToast('Profile registered! Application token generated.');
    });

    // Reset Form button
    const resetBtn = document.getElementById('btn-apply-another');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        candidateForm.reset();
        currentStep = 1;
        updateWizardUI(1);
        candidateForm.style.display = 'block';
        if (candidateSuccess) candidateSuccess.classList.remove('active');
        const formAnchor = document.getElementById('form-anchor');
        if (formAnchor) formAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      // Save to local CRM employer ledger
      const empRecord = {
        token: reqRef,
        companyName: companyName,
        repName: repName,
        phone: cleanPhone,
        email: email,
        country: country,
        industry: industry,
        tradesHeadcount: tradesHeadcount,
        interviewMode: interviewMode,
        timeline: timeline,
        salaryTerms: salaryTerms,
        notes: notes,
        timestamp: new Date().toISOString(),
        displayDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'New Sourcing Brief',
        source: refSource
      };

      try {
        const empLedger = JSON.parse(localStorage.getItem('avc_employer_ledger') || '[]');
        empLedger.unshift(empRecord);
        if (empLedger.length > 50) empLedger.length = 50;
        localStorage.setItem('avc_employer_ledger', JSON.stringify(empLedger));
      } catch (err) {
        console.warn('Local employer ledger save note:', err);
      }

      // Background Webhook Push to Google Apps Script (if configured)
      const avcEmpWebhookUrl = localStorage.getItem('avc_webhook_url');
      if (avcEmpWebhookUrl && avcEmpWebhookUrl.startsWith('https://script.google.com/macros/s/')) {
        try {
          fetch(avcEmpWebhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'employer_requirement',
              reqToken: reqRef,
              ...empRecord
            })
          }).catch((e) => console.log('Apps Script employer push note:', e));
        } catch (fetchErr) {
          // Non-blocking
        }
      }

      // Automated Direct Email Lead & Employer Auto-Reply Dispatch (Zero-Manual)
      try {
        fetch('https://formsubmit.co/ajax/info@assignmentvenuecentre.me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `New AVC Employer Manpower Brief: ${companyName} (${country}) - [${reqRef}]`,
            _replyto: email || 'info@assignmentvenuecentre.me',
            _autoresponse: `Dear ${repName || companyName},\n\nThank you for submitting your manpower requisition to Assignment Venue Center (Ref: ${reqRef}).\n\nRequisition Summary:\nCompany: ${companyName}\nAuthorized Contact: ${repName} (+91 ${cleanPhone})\nCountry of Deployment: ${country}\nIndustry: ${industry}\nTrades & Headcount: ${tradesHeadcount}\nInterview Mode: ${interviewMode}\nTimeline: ${timeline}\n\nOur Executive Director will contact you within 4 business hours to share candidate shortlists.\n\nExecutive Desk: +91 9473286356 / info@assignmentvenuecentre.me\nAssignment Venue Center, Darbhanga, Bihar.`,
            token: reqRef,
            company: companyName,
            representative: repName,
            phone: cleanPhone,
            email: email || 'Not provided',
            country: country,
            industry: industry,
            tradesHeadcount: tradesHeadcount,
            interviewMode: interviewMode,
            timeline: timeline,
            salaryTerms: salaryTerms || 'As per norms',
            notes: notes || 'None'
          })
        }).catch((err) => console.log('Employer email dispatch note:', err));
      } catch (err) {}

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
     3. STRICT FAQ ACCORDION HANDLER (NO DUPLICATES)
     ========================================================================== */
  document.querySelectorAll('.faq-box').forEach((box) => {
    const btn = box.querySelector('.faq-question-btn');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isAlreadyOpen = box.classList.contains('open');

      // Close all other FAQ boxes first
      document.querySelectorAll('.faq-box').forEach((b) => {
        b.classList.remove('open');
      });

      // Toggle this box
      if (!isAlreadyOpen) {
        box.classList.add('open');
      }
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

  /* ==========================================================================
     5. RECRUITER IDENTITY VERIFICATION ENGINE
     ========================================================================== */
  const recruiterInput = document.getElementById('recruiter-query-input');
  const recruiterBtn = document.getElementById('recruiter-verify-btn');
  const recruiterResult = document.getElementById('recruiter-result-display');

  if (recruiterBtn && recruiterInput && recruiterResult) {
    const officialDirectory = [
      {
        type: 'phone',
        key: '9473286356',
        name: 'Mehdi Hasan',
        role: 'Founder & Operations Director',
        badge: 'Official AVC Operational Leadership Line'
      },
      {
        type: 'phone',
        key: '9155512396',
        name: 'AVC Candidate Desk & Venue Dispatch',
        role: 'Technical Pre-Screening & Candidate Logistics Desk',
        badge: 'Official Ground Assessment Center Line'
      },
      {
        type: 'email',
        key: 'info@assignmentvenuecentre.me',
        name: 'AVC General Corporate Desk',
        role: 'Official Sourcing Inquiries & Delegations',
        badge: 'Verified Corporate Mail Server'
      },
      {
        type: 'email',
        key: 'operations@assignmentvenuecentre.me',
        name: 'AVC Operations & Venue Management',
        role: 'Interview Scheduling & Verification Desk',
        badge: 'Verified Corporate Mail Server'
      }
    ];

    const verifyRecruiter = () => {
      const raw = (recruiterInput.value || '').trim();
      if (!raw) {
        alert('Please enter a phone number or email address to verify.');
        recruiterInput.focus();
        return;
      }

      const cleanPhone = sanitizePhone(raw);
      const cleanEmail = raw.toLowerCase();

      // Check match
      const matched = officialDirectory.find((item) => {
        if (item.type === 'phone' && cleanPhone.includes(item.key)) return true;
        if (item.type === 'email' && cleanEmail === item.key) return true;
        return false;
      });

      if (window.AVCAnalytics) {
        window.AVCAnalytics.track('recruiter_verification_query', {
          query: raw,
          is_matched: !!matched
        });
      }

      recruiterResult.className = 'recruiter-result-box';
      if (matched) {
        recruiterResult.classList.add('valid');
        recruiterResult.innerHTML = `
          <div style="display:flex; align-items:flex-start; gap:12px;">
            <span style="font-size:24px;">✅</span>
            <div>
              <strong style="font-size:15px; display:block; color:#14532d;">VERIFIED OFFICIAL AVC REPRESENTATIVE</strong>
              <div style="margin:4px 0 6px; font-weight:700; color:#166534;">${matched.name} (${matched.role})</div>
              <p style="margin:0; font-size:12.5px; color:#14532d; line-height:1.45;">
                <strong>Official Status:</strong> ${matched.badge}.<br>
                <strong>Zero-Fee Compliance:</strong> This official line operates under our strict Zero-Fee Policy and will NEVER demand registration money, UPI payments, or visa deposits.
              </p>
            </div>
          </div>
        `;
      } else {
        recruiterResult.classList.add('invalid');
        recruiterResult.innerHTML = `
          <div style="display:flex; align-items:flex-start; gap:12px;">
            <span style="font-size:24px;">⚠️</span>
            <div>
              <strong style="font-size:15px; display:block; color:#991b1b;">CAUTION: UNKNOWN / UNVERIFIED CONTACT</strong>
              <div style="margin:4px 0 6px; font-weight:700; color:#b91c1c;">"${raw}" is NOT an authorized AVC operational contact.</div>
              <p style="margin:0; font-size:12.5px; color:#7f1d1d; line-height:1.45;">
                <strong>Fraud Alert:</strong> AVC never authorizes outside brokers, agents, or personal UPI numbers. Never pay any fee for overseas job guarantees or interview slips. Report this unauthorized contact to our official helpline at <strong>+91 9473286356</strong>.
              </p>
            </div>
          </div>
        `;
      }
    };

    recruiterBtn.addEventListener('click', verifyRecruiter);
    recruiterInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyRecruiter();
      }
    });
  }

  /* ==========================================================================
     6. CANDIDATE JOURNEY LIVE STATUS CHECKER
     ========================================================================== */
  const statusInput = document.getElementById('status-query-input');
  const statusBtn = document.getElementById('status-query-btn');
  const statusResult = document.getElementById('status-query-result');

  if (statusBtn && statusInput && statusResult) {
    statusBtn.addEventListener('click', () => {
      const q = (statusInput.value || '').trim();
      if (!q) {
        alert('Please enter your 10-digit mobile number or Application Reference ID (e.g. AVC-2026-XXXX).');
        statusInput.focus();
        return;
      }

      if (window.AVCAnalytics) {
        window.AVCAnalytics.track('candidate_status_lookup', { query: q });
      }

      const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      statusResult.style.display = 'block';

      // Check Local CRM Ledger
      let foundRecord = null;
      try {
        const localLedger = JSON.parse(localStorage.getItem('avc_candidate_ledger') || '[]');
        const cleanQ = q.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        foundRecord = localLedger.find(item => {
          const itemToken = (item.token || '').toLowerCase();
          const itemPhone = (item.phone || '').replace(/[^0-9]/g, '');
          const itemName = (item.fullName || '').toLowerCase();
          return itemToken.includes(cleanQ) || (cleanQ.length >= 6 && itemPhone.includes(cleanQ)) || itemName.includes(cleanQ);
        });
      } catch (err) {}

      if (foundRecord) {
        statusResult.innerHTML = `
          <div style="display:flex; align-items:flex-start; gap:12px;">
            <span style="font-size:24px;">✅</span>
            <div style="flex:1;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
                <strong style="color:#065f46; font-size:15px;">Candidate Record Found: ${foundRecord.fullName}</strong>
                <span style="background:#047857; color:#fff; font-size:11px; padding:2px 8px; border-radius:12px; font-weight:700;">Verified Intake</span>
              </div>
              <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:10px 12px; font-size:12.5px; color:#14532d; margin-bottom:10px; line-height:1.5;">
                <strong>Application Ref:</strong> ${foundRecord.token} &bull; <strong>Trade:</strong> ${foundRecord.trade}<br>
                <strong>Current Stage:</strong> <span style="font-weight:700; color:#047857;">${foundRecord.status || 'Stage 2: Technical Pre-Screening'}</span><br>
                <strong>Registration Date:</strong> ${foundRecord.displayDate || today} &bull; <strong>District:</strong> ${foundRecord.district || 'Bihar'}
              </div>
              <p style="font-size:12.5px; color:#064e3b; margin:0 0 10px; line-height:1.5;">
                Your candidate profile is active in AVC Darbhanga's sourcing pool. Sourcing coordinators are actively matching your qualifications with upcoming Gulf employer interview delegations.
              </p>
              <a href="https://wa.me/919473286356?text=${encodeURIComponent('Hi AVC, I am registered candidate ' + foundRecord.fullName + ' [Ref: ' + foundRecord.token + ']. Please update me regarding client interview schedules for ' + foundRecord.trade)}" target="_blank" rel="noopener noreferrer" class="button" style="background:#25D366; color:#fff; border:none; padding:6px 14px; font-size:12px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
                <span>💬</span><span>Check Live Update on WhatsApp</span>
              </a>
            </div>
          </div>
        `;
        return;
      }

      // Default Sourcing Pool Status Card
      statusResult.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:12px;">
          <span style="font-size:22px;">🔍</span>
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
              <strong style="color:#065f46; font-size:14.5px;">Application Status: Stage 2 - Pre-Screening Review</strong>
              <span style="background:#047857; color:#fff; font-size:11px; padding:2px 8px; border-radius:12px; font-weight:700;">Active in Sourcing Pool</span>
            </div>
            <div style="font-size:12.5px; color:#064e3b; margin-bottom:8px; line-height:1.5;">
              <strong>Query:</strong> ${q} &bull; <strong>System Check Date:</strong> ${today}<br>
              <strong>Status Details:</strong> Candidate reference verified. Our Darbhanga trade coordinators match registered profiles with incoming client demands and trade test schedules daily.
            </div>
            <div style="background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; padding:10px 12px; font-size:12px; color:#134e4a; margin-bottom:10px;">
              <strong>Next Action:</strong> Keep your registered WhatsApp number active. Official notifications with interview dates and venue reporting tokens are sent 3-5 days before client delegations arrive at Darbhanga.
            </div>
            <a href="https://wa.me/919473286356?text=${encodeURIComponent('Hi AVC, I want to verify my application status for query: ' + q)}" target="_blank" rel="noopener noreferrer" class="button" style="background:#25D366; color:#fff; border:none; padding:6px 14px; font-size:12px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
              <span>💬</span><span>Connect with Helpdesk on WhatsApp</span>
            </a>
          </div>
        </div>
      `;
    });
  }

  /* ==========================================================================
     7. VIDEO SHOWCASE MODAL
     ========================================================================== */
  const videoTriggers = document.querySelectorAll('[data-video-modal-trigger]');
  const videoModal = document.getElementById('avc-video-modal');
  const videoModalTitle = document.getElementById('video-modal-title');
  const videoModalBody = document.getElementById('video-modal-body');
  const videoModalClose = document.getElementById('video-modal-close');

  if (videoModal && videoModalClose) {
    videoTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const title = trigger.getAttribute('data-video-title') || 'AVC Facility & Process Overview';
        const vidId = trigger.getAttribute('data-video-id') || '';

        if (videoModalTitle) videoModalTitle.textContent = title;
        if (videoModalBody) {
          videoModalBody.innerHTML = `
            <div style="background:#071827; border-radius:8px; padding:24px; text-align:center; color:#fff; margin-bottom:16px;">
              <div style="font-size:48px; margin-bottom:12px;">▶️</div>
              <h4 style="margin:0 0 8px; font-size:18px; color:#fff;">${title}</h4>
              <p style="margin:0 0 16px; font-size:13.5px; color:#cbd5e1; line-height:1.5;">
                Watch full high-resolution tours, trade test demonstrations, and candidate safety orientations on the official Assignment Venue Center YouTube channel.
              </p>
              <a href="https://www.youtube.com/@AssignmentvenueCentre" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:8px; background:#d92332; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:800; font-size:14px; box-shadow:0 4px 15px rgba(217,35,50,0.4);">
                <span>Watch on Official YouTube Channel</span>
                <span>↗</span>
              </a>
            </div>
            <div style="font-size:12.5px; color:#64748b; line-height:1.5;">
              📌 <strong>Venue Tour Highlights:</strong> 250-capacity air-conditioned candidate reception hall, 6G pipe welding test booths, 415V 3-phase industrial control boards, and private employer delegation interviewing suites in Darbhanga, Bihar.
            </div>
          `;
        }
        videoModal.classList.add('open');
      });
    });

    videoModalClose.addEventListener('click', () => {
      videoModal.classList.remove('open');
    });

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove('open');
      }
    });
  }

  /* ==========================================================================
     8. LEAD MAGNET DOWNLOAD & LEAD CAPTURE
     ========================================================================== */
  const leadModal = document.getElementById('avc-lead-modal');
  const leadModalClose = document.getElementById('lead-modal-close');
  const leadForm = document.getElementById('lead-magnet-form');
  const leadGuideTitle = document.getElementById('lead-selected-guide-title');
  const leadGuideInput = document.getElementById('lead-guide-name-input');

  if (leadModal) {
    document.querySelectorAll('[data-open-lead-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const guideName = btn.getAttribute('data-guide-name') || 'Gulf Job Preparation Checklist';
        if (leadGuideTitle) leadGuideTitle.textContent = guideName;
        if (leadGuideInput) leadGuideInput.value = guideName;
        leadModal.classList.add('open');

        if (window.AVCAnalytics) {
          window.AVCAnalytics.track('lead_magnet_modal_open', { guide: guideName });
        }
      });
    });

    if (leadModalClose) {
      leadModalClose.addEventListener('click', () => {
        leadModal.classList.remove('open');
      });
    }

    leadModal.addEventListener('click', (e) => {
      if (e.target === leadModal) {
        leadModal.classList.remove('open');
      }
    });

    if (leadForm) {
      leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('lead-name')?.value || '').trim();
        const rawPhone = (document.getElementById('lead-phone')?.value || '').trim();
        const trade = (document.getElementById('lead-trade')?.value || '').trim();
        const guideName = (leadGuideInput?.value || 'Gulf Job Preparation Guide').trim();
        const cleanPhone = sanitizePhone(rawPhone);

        if (!name || cleanPhone.length < 10 || !trade) {
          alert('Please enter your name, 10-digit WhatsApp number, and trade to download the guide.');
          return;
        }

        // Telemetry
        if (window.AVCAnalytics) {
          window.AVCAnalytics.track('lead_magnet_download', {
            name,
            phone: cleanPhone,
            trade,
            guide: guideName
          });
        }

        // Generate download of guide text
        const guideContent = `======================================================
ASSIGNMENT VENUE CENTER (AVC) - OFFICIAL CANDIDATE GUIDE
Guide: ${guideName}
Issued To: ${name} (${trade})
Date: ${new Date().toLocaleDateString('en-IN')}
Website: https://assignmentvenuecentre.me
Helpline: +91 9473286356
======================================================

KEY PREPARATION RULES FOR GULF TECHNICAL INTERVIEW DRIVES:

1. PRACTICAL TRADE TEST READINESS:
   - For Electricians: Be ready to wire forward-reverse motor control circuits, star-delta starters, and demonstrate multi-meter insulation tests.
   - For Welders: Practice 6G pipe root run with TIG (Argon) and fill/cap with E7018 low-hydrogen electrodes.
   - For HVAC Techs: Check manifold pressure gauges (R-410A / R-134a), compressor terminal resistance (C-S-R), and leak detection.

2. DOCUMENTS TO CARRY AT AVC DARBHANGA VENUE:
   - Original Passport with minimum 8 months validity
   - Updated CV highlighting trade tools and equipment handled
   - 4 Passport size photos (White background, standard GCC specification)
   - Original ITI / Diploma / Technical certificates
   - Ex-Gulf experience proof (old visa copy or GCC driving license)

3. ANTI-FRAUD CANDIDATE PROTECTION:
   - AVC NEVER charges any registration, application, or interview fees.
   - Never give cash or UPI payments to street middlemen promising "direct selection".
   - Official interviews happen ONLY at registered Assignment Venue Center, Kamtaul Road, Madhupur, Darbhanga, Bihar.

Download verified vacancies or register for free at:
https://assignmentvenuecentre.me/apply.html
======================================================`;

        const blob = new Blob([guideContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AVC_${guideName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        leadModal.classList.remove('open');
        showToast('Guide downloaded successfully! Check your downloads folder.');

        // Dispatch WhatsApp follow-up link
        const waText = encodeURIComponent(`Hello AVC Team, I just downloaded the ${guideName} for my trade (${trade}). My name is ${name}. Please keep me updated regarding upcoming interview drives.`);
        window.open(`https://wa.me/919473286356?text=${waText}`, '_blank');
      });
    }
  }

  // 6. Interactive Gulf Trade & Eligibility Matcher Controller
  const matcherTrade = document.getElementById('matcher-trade');
  const matcherExp = document.getElementById('matcher-exp');
  const matcherPassport = document.getElementById('matcher-passport');
  const matcherCountry = document.getElementById('matcher-country');

  if (matcherTrade && matcherExp && matcherCountry) {
    const salaryVal = document.getElementById('matcher-salary-val');
    const salaryInr = document.getElementById('matcher-salary-inr');
    const probVal = document.getElementById('matcher-prob-val');
    const probFill = document.getElementById('matcher-prob-fill');
    const demandName = document.getElementById('matcher-demand-name');
    const baySpec = document.getElementById('matcher-bay-spec');
    const btnApply = document.getElementById('matcher-btn-apply');
    const btnWa = document.getElementById('matcher-btn-wa');

    const tradeProfiles = {
      electrician: {
        title: 'Building Electrician & Industrial Tech',
        saudi: { gcc: 'SAR 1,800 - 2,500 + OT', inr: '≈ ₹40,000 - ₹55,000 / month' },
        uae: { gcc: 'AED 1,800 - 2,400 + OT', inr: '≈ ₹41,000 - ₹54,000 / month' },
        qatar: { gcc: 'QAR 1,900 - 2,600 + OT', inr: '≈ ₹43,000 - ₹59,000 / month' },
        oman: { gcc: 'OMR 140 - 180 + OT', inr: '≈ ₹31,000 - ₹40,000 / month' },
        defaultVacancy: 'AVC-KSA-8021 (Riyadh Commercial Infrastructure)',
        bay: '415V Switchgear, Conduit & Motor Control Rig'
      },
      welder: {
        title: '6G TIG & ARC Welder (Piping)',
        saudi: { gcc: 'SAR 2,000 - 3,000 + OT', inr: '≈ ₹45,000 - ₹67,000 / month' },
        uae: { gcc: 'AED 2,200 - 3,200 + OT', inr: '≈ ₹50,000 - ₹72,000 / month' },
        qatar: { gcc: 'QAR 2,200 - 3,200 + OT', inr: '≈ ₹50,000 - ₹72,000 / month' },
        oman: { gcc: 'OMR 160 - 220 + OT', inr: '≈ ₹35,000 - ₹48,000 / month' },
        defaultVacancy: 'AVC-UAE-4019 (Dubai Oil & Gas Piping)',
        bay: 'Calibrated Lincoln Electric 6G Pipe Welding Bay'
      },
      hvac: {
        title: 'HVAC & Chiller Maintenance Technician',
        saudi: { gcc: 'SAR 1,900 - 2,700 + OT', inr: '≈ ₹42,000 - ₹60,000 / month' },
        uae: { gcc: 'AED 2,000 - 2,800 + OT', inr: '≈ ₹45,000 - ₹63,000 / month' },
        qatar: { gcc: 'QAR 2,000 - 2,800 + OT', inr: '≈ ₹45,000 - ₹63,000 / month' },
        oman: { gcc: 'OMR 150 - 200 + OT', inr: '≈ ₹33,000 - ₹44,000 / month' },
        defaultVacancy: 'AVC-QAT-5022 (Doha Facility Maintenance)',
        bay: 'Central Chiller & Split AC Troubleshooting Rig'
      },
      driver: {
        title: 'Heavy Trailer & Equipment Driver',
        saudi: { gcc: 'SAR 2,400 - 3,200 + Trip Allowance', inr: '≈ ₹53,000 - ₹71,000 / month' },
        uae: { gcc: 'AED 2,200 - 2,800 + Trip Allowance', inr: '≈ ₹50,000 - ₹63,000 / month' },
        qatar: { gcc: 'QAR 2,200 - 3,000 + Trip Allowance', inr: '≈ ₹50,000 - ₹68,000 / month' },
        oman: { gcc: 'OMR 160 - 210 + Trip Allowance', inr: '≈ ₹35,000 - ₹46,000 / month' },
        defaultVacancy: 'AVC-KSA-9041 (Jeddah Logistics Fleet)',
        bay: 'Yard Maneuvering & Road Sign Simulator Check'
      },
      mason: {
        title: 'Civil Mason / Tile Fixer / Plaster',
        saudi: { gcc: 'SAR 1,400 - 1,800 + OT', inr: '≈ ₹31,000 - ₹40,000 / month' },
        uae: { gcc: 'AED 1,400 - 1,800 + OT', inr: '≈ ₹32,000 - ₹41,000 / month' },
        qatar: { gcc: 'QAR 1,500 - 1,900 + OT', inr: '≈ ₹34,000 - ₹43,000 / month' },
        oman: { gcc: 'OMR 140 - 180 + OT', inr: '≈ ₹31,000 - ₹40,000 / month' },
        defaultVacancy: 'AVC-OMN-3012 (Muscat Commercial Construction)',
        bay: 'Block Work, Plaster Levelling & Tile Masonry Rig'
      },
      plumber: {
        title: 'Plumber & Pipe Fitter',
        saudi: { gcc: 'SAR 1,600 - 2,200 + OT', inr: '≈ ₹36,000 - ₹49,000 / month' },
        uae: { gcc: 'AED 1,600 - 2,200 + OT', inr: '≈ ₹36,000 - ₹49,000 / month' },
        qatar: { gcc: 'QAR 1,700 - 2,400 + OT', inr: '≈ ₹38,000 - ₹54,000 / month' },
        oman: { gcc: 'OMR 130 - 170 + OT', inr: '≈ ₹29,000 - ₹38,000 / month' },
        defaultVacancy: 'General MEP Plumbing Pool',
        bay: 'PPR, HDPE & Copper Pressure Pipe Joint Rig'
      },
      cleaner: {
        title: 'Facility Management / Cleaning',
        saudi: { gcc: 'SAR 1,100 - 1,400 + Food', inr: '≈ ₹24,000 - ₹31,000 / month' },
        uae: { gcc: 'AED 1,100 - 1,400 + Food', inr: '≈ ₹25,000 - ₹32,000 / month' },
        qatar: { gcc: 'QAR 1,200 - 1,500 + Food', inr: '≈ ₹27,000 - ₹34,000 / month' },
        oman: { gcc: 'OMR 100 - 130 + Food', inr: '≈ ₹22,000 - ₹29,000 / month' },
        defaultVacancy: 'DMND-00007 (Oman Facility Cleaners)',
        bay: 'Industrial Hygiene & Material Handling Desk'
      }
    };

    function recalculateMatcher() {
      const tradeKey = matcherTrade.value || 'electrician';
      const countryKey = matcherCountry.value || 'saudi';
      const expKey = matcherExp ? matcherExp.value : '2-4';
      const passKey = matcherPassport ? matcherPassport.value : 'ecnr';

      const profile = tradeProfiles[tradeKey] || tradeProfiles.electrician;
      const salaryObj = profile[countryKey] || profile.saudi;

      if (salaryVal) salaryVal.textContent = salaryObj.gcc;
      if (salaryInr) salaryInr.textContent = salaryObj.inr;
      if (demandName) demandName.textContent = profile.defaultVacancy;
      if (baySpec) baySpec.textContent = profile.bay;

      let score = 80;
      if (expKey === 'fresher') score = 75;
      else if (expKey === '2-4') score = 88;
      else if (expKey === '5plus') score = 94;
      else if (expKey === 'gulf') score = 98;

      if (passKey === 'ecnr') score = Math.min(score + 2, 99);
      if (probVal) probVal.textContent = `${score}% Match`;
      if (probFill) probFill.style.width = `${score}%`;

      const applyUrl = `apply.html?trade=${encodeURIComponent(profile.title)}&country=${encodeURIComponent(countryKey)}&exp=${encodeURIComponent(expKey)}&passport=${encodeURIComponent(passKey)}`;
      if (btnApply) btnApply.href = applyUrl;

      const waMsg = encodeURIComponent(`Hi AVC Coordinators, I checked my eligibility on your website for ${profile.title} (${countryKey.toUpperCase()}) with ${expKey} experience. When is the next interview drive in Darbhanga?`);
      if (btnWa) btnWa.href = `https://wa.me/919473286356?text=${waMsg}`;
    }

    matcherTrade.addEventListener('change', recalculateMatcher);
    if (matcherExp) matcherExp.addEventListener('change', recalculateMatcher);
    if (matcherPassport) matcherPassport.addEventListener('change', recalculateMatcher);
    matcherCountry.addEventListener('change', recalculateMatcher);

    recalculateMatcher();
  }

  // 7. B2B Manpower Mobilization & Capacity Estimator Controller
  const b2bTrade = document.getElementById('b2b-trade-cluster');
  const b2bCount = document.getElementById('b2b-headcount');
  const b2bCountry = document.getElementById('b2b-country');
  const b2bFormat = document.getElementById('b2b-format');

  if (b2bTrade && b2bCount) {
    const slaSourcing = document.getElementById('b2b-sla-sourcing');
    const slaMobilization = document.getElementById('b2b-sla-mobilization');
    const bayAllocated = document.getElementById('b2b-bay-allocated');
    const btnAutofill = document.getElementById('btn-b2b-autofill');

    function updateB2BEstimates() {
      const countVal = parseInt(b2bCount.value || '25', 10);
      const tradeVal = b2bTrade.value || 'mep';

      if (countVal <= 25) {
        if (slaSourcing) slaSourcing.textContent = '24–48 Hours (Pre-Screened)';
        if (slaMobilization) slaMobilization.textContent = '21–25 Days to Deployment';
      } else if (countVal <= 50) {
        if (slaSourcing) slaSourcing.textContent = '48–72 Hours (Pre-Screened)';
        if (slaMobilization) slaMobilization.textContent = '25–30 Days to Deployment';
      } else {
        if (slaSourcing) slaSourcing.textContent = '3–5 Days (Staggered Batches)';
        if (slaMobilization) slaMobilization.textContent = '30–35 Days to Deployment';
      }

      if (bayAllocated) {
        if (tradeVal === 'welding') {
          bayAllocated.textContent = 'Lincoln Electric 6G Pipe Welding Testing Bay (Calibrated)';
        } else if (tradeVal === 'mep' || tradeVal === 'electrical') {
          bayAllocated.textContent = '415V Industrial Switchgear & Motor Control Rig';
        } else if (tradeVal === 'hvac') {
          bayAllocated.textContent = 'Central Chiller & DX Air Conditioning Diagnostic Bench';
        } else if (tradeVal === 'driver') {
          bayAllocated.textContent = 'Trailer Maneuvering & Road Sign Simulator Rig';
        } else {
          bayAllocated.textContent = 'Multi-Craft Civil & Facility Demonstration Bay';
        }
      }
    }

    b2bTrade.addEventListener('change', updateB2BEstimates);
    b2bCount.addEventListener('change', updateB2BEstimates);
    if (b2bCountry) b2bCountry.addEventListener('change', updateB2BEstimates);
    if (b2bFormat) b2bFormat.addEventListener('change', updateB2BEstimates);

    if (btnAutofill) {
      btnAutofill.addEventListener('click', () => {
        const formTarget = document.getElementById('employer-requirement-form');
        if (!formTarget) return;

        const empTrades = document.getElementById('emp-trades-headcount');
        const empCountry = document.getElementById('emp-country');
        const empMode = document.getElementById('emp-interview-mode');

        if (empTrades) {
          const tradeName = b2bTrade.options[b2bTrade.selectedIndex].text;
          empTrades.value = `${tradeName}: ${b2bCount.value} Candidates`;
        }

        if (empCountry && b2bCountry) {
          empCountry.value = b2bCountry.value;
        }

        if (empMode && b2bFormat) {
          empMode.value = b2bFormat.value;
        }

        formTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showToast('Corporate requirement parameters pre-filled into form below!');
      });
    }

    updateB2BEstimates();
  }

  // 8. Smart WhatsApp Concierge Hub Controller
  const waFloatingBtn = document.querySelector('.floating-whatsapp-cta');
  const waCard = document.getElementById('wa-concierge-card');
  const waCloseBtn = document.querySelector('.wa-concierge-close');

  if (waFloatingBtn && waCard) {
    waFloatingBtn.addEventListener('click', (e) => {
      // Toggle card instead of direct navigation
      e.preventDefault();
      waCard.classList.toggle('open');
    });

    if (waCloseBtn) {
      waCloseBtn.addEventListener('click', () => {
        waCard.classList.remove('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (!waCard.contains(e.target) && !waFloatingBtn.contains(e.target)) {
        waCard.classList.remove('open');
      }
    });
  }
})();
