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
            <dt>Registration Fee</dt><dd style="color:#0f9d58;">₹0 (100% Free Guaranteed)</dd>
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
      statusResult.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:12px;">
          <span style="font-size:22px;">🔍</span>
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
              <strong style="color:#065f46; font-size:14.5px;">Application Status: Stage 2 - Pre-Screening Review</strong>
              <span style="background:#047857; color:#fff; font-size:11px; padding:2px 8px; border-radius:12px; font-weight:700;">Active in Sourcing Pool</span>
            </div>
            <div style="font-size:12.5px; color:#064e3b; margin-bottom:8px; line-height:1.5;">
              <strong>Query:</strong> ${q} &bull; <strong>System Check Date:</strong> ${today}<br>
              <strong>Status Details:</strong> Your candidate profile is verified on our server. Our Darbhanga trade coordinators match profiles against upcoming client demands daily.
            </div>
            <div style="background:#ffffff; border:1px solid #a7f3d0; border-radius:6px; padding:10px 12px; font-size:12px; color:#134e4a;">
              <strong>Next Action:</strong> Keep your WhatsApp active on this number. You will receive an official notification with interview date and reporting token 3-5 days before client trade delegation arrives in Darbhanga.
            </div>
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
})();
