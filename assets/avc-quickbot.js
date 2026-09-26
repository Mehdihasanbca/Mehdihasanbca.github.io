/**
 * AVC QuickBot: Interactive Gulf Trade & Eligibility Assistant
 * Assignment Venue Center (assignmentvenuecentre.me)
 */
(()=>{
  // Load QuickBot CSS dynamically if not present
  if(!document.querySelector('link[href*="avc-quickbot.css"]')){
    const l=document.createElement('link');
    l.rel='stylesheet';
    l.href='assets/avc-quickbot.css?v=20260926-q1';
    document.head.appendChild(l);
  }

  // Prevent loading in admin consoles or iframe
  if(window.location.pathname.includes('admin') || window.self !== window.top) return;

  const TRADES = {
    electrician: {
      name: 'Building Electrician / MEP',
      icon: '⚡',
      salaryReturn: 'SAR 1,800 - 2,400 / AED 2,000 - 2,500 + OT',
      salaryIndia: 'SAR 1,400 - 1,700 / AED 1,600 - 1,900 + OT',
      test: '415V Star-Delta starter, forward-reverse panel, conduit bending & Megger insulation test.',
      tools: 'Multimeter, wire stripper, test pen, pliers.'
    },
    welder: {
      name: '6G TIG & ARC Welder',
      icon: '🔥',
      salaryReturn: 'SAR 2,200 - 3,200 / AED 2,500 - 3,500 + OT',
      salaryIndia: 'SAR 1,800 - 2,200 / AED 2,000 - 2,400 + OT',
      test: 'Lincoln 6G position on 2" & 6" CS/SS pipe. Argon TIG root pass + E7018 capping (X-ray quality).',
      tools: 'Welding shield, chipping hammer, wire brush, leather gloves.'
    },
    hvac: {
      name: 'HVAC & Chiller Technician',
      icon: '❄️',
      salaryReturn: 'SAR 2,000 - 2,800 / QAR 2,200 - 3,000 + OT',
      salaryIndia: 'SAR 1,500 - 1,900 / QAR 1,700 - 2,200 + OT',
      test: 'Compressor C-S-R diagnostics, R410A manifold charging, vacuum test, LP/HP switch calibration.',
      tools: 'Digital manifold gauge, clamp meter, vacuum pump adapter.'
    },
    driver: {
      name: 'Heavy Trailer / Equipment Driver',
      icon: '🚛',
      salaryReturn: 'SAR 2,200 - 3,000 + Trip Allowances',
      salaryIndia: 'SAR 1,800 - 2,200 + Trip Allowances',
      test: '40ft trailer reverse 90-degree alley docking, dual-circuit air brake inspection, road maneuver.',
      tools: 'Original GCC or Indian Commercial Heavy driving license.'
    },
    mason: {
      name: 'Civil Mason (Tile / Plaster)',
      icon: '🧱',
      salaryReturn: 'SAR 1,400 - 1,800 / AED 1,600 - 2,000 + OT',
      salaryIndia: 'SAR 1,200 - 1,500 / AED 1,300 - 1,600 + OT',
      test: 'Plumb-bob vertical alignment, right-angle diagonal squaring, tile leveling & finishing.',
      tools: 'Spirit level, trowel, plumb line.'
    },
    plumber: {
      name: 'Plumber & Pipe Fitter',
      icon: '🔧',
      salaryReturn: 'SAR 1,500 - 1,900 / AED 1,700 - 2,100 + OT',
      salaryIndia: 'SAR 1,300 - 1,600 / AED 1,400 - 1,700 + OT',
      test: 'PPR/PEX pipe hot-melt jointing, PVC drainage slopes, hydrostatic pressure leakage test.',
      tools: 'PPR welding machine, pipe cutter, thread seal tape.'
    }
  };

  let state = {
    trade: null,
    exp: null,
    passport: null
  };

  // Create UI Elements
  const launcher = document.createElement('button');
  launcher.className = 'quickbot-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open Gulf Eligibility & Salary QuickBot');
  launcher.innerHTML = '<span class="launcher-icon">⚡</span><span>Check Gulf Salary</span>';
  document.body.appendChild(launcher);

  const overlay = document.createElement('div');
  overlay.className = 'quickbot-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');

  const modal = document.createElement('div');
  modal.className = 'quickbot-modal';

  modal.innerHTML = `
    <div class="quickbot-head">
      <h3><span>⚡</span> Gulf Trade & Salary QuickBot</h3>
      <button class="quickbot-close" type="button" aria-label="Close Assistant">×</button>
    </div>
    <div class="quickbot-body" id="quickbot-content"></div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const contentArea = modal.querySelector('#quickbot-content');
  const closeBtn = modal.querySelector('.quickbot-close');

  const openBot = () => {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    renderStep1();
  };

  const closeBot = () => {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
  };

  launcher.addEventListener('click', openBot);
  closeBtn.addEventListener('click', closeBot);
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) closeBot();
  });

  const renderStep1 = () => {
    state = { trade: null, exp: null, passport: null };
    contentArea.innerHTML = `
      <div class="quickbot-step-title">Step 1 of 3: Apna Trade (Kaam) Chunein:</div>
      <div class="quickbot-options-grid">
        ${Object.keys(TRADES).map(k => `
          <button class="quickbot-btn-option" type="button" data-trade="${k}">
            <span class="icon">${TRADES[k].icon}</span>
            <span>${TRADES[k].name}</span>
          </button>
        `).join('')}
      </div>
      <p style="font-size:12px;color:#64748b;margin:0;text-align:center;">
        🔒 100% Free Service · ₹0 Fee under Emigration Act 1983
      </p>
    `;

    contentArea.querySelectorAll('[data-trade]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.trade = btn.getAttribute('data-trade');
        renderStep2();
      });
    });
  };

  const renderStep2 = () => {
    const tradeData = TRADES[state.trade];
    contentArea.innerHTML = `
      <div class="quickbot-step-title">Step 2 of 3: Selected: <strong>${tradeData.name}</strong><br>Aapka Experience Kitna Hai?</div>
      <div class="quickbot-options-grid" style="grid-template-columns: 1fr;">
        <button class="quickbot-btn-option" type="button" data-exp="gulf" style="flex-direction:row;justify-content:flex-start;padding:12px 16px;">
          <span class="icon">✈️</span>
          <div style="text-align:left;margin-left:8px;">
            <strong>Gulf Return (Experienced)</strong>
            <div style="font-size:11.5px;color:#64748b;">Pehle Saudi, Dubai, Qatar, Oman me kaam kar chuke hain</div>
          </div>
        </button>
        <button class="quickbot-btn-option" type="button" data-exp="india" style="flex-direction:row;justify-content:flex-start;padding:12px 16px;">
          <span class="icon">🇮🇳</span>
          <div style="text-align:left;margin-left:8px;">
            <strong>India Experience (2+ Years)</strong>
            <div style="font-size:11.5px;color:#64748b;">India me site, factory ya company me kaam kiya hai</div>
          </div>
        </button>
        <button class="quickbot-btn-option" type="button" data-exp="fresher" style="flex-direction:row;justify-content:flex-start;padding:12px 16px;">
          <span class="icon">🎓</span>
          <div style="text-align:left;margin-left:8px;">
            <strong>ITI / Technical Fresher</strong>
            <div style="font-size:11.5px;color:#64748b;">ITI pass ya course complete kiya hai, pehli baar ja rahe hain</div>
          </div>
        </button>
      </div>
    `;

    contentArea.querySelectorAll('[data-exp]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.exp = btn.getAttribute('data-exp');
        renderStep3();
      });
    });
  };

  const renderStep3 = () => {
    contentArea.innerHTML = `
      <div class="quickbot-step-title">Step 3 of 3: Passport Status:</div>
      <div class="quickbot-options-grid" style="grid-template-columns: 1fr;">
        <button class="quickbot-btn-option" type="button" data-passport="ECNR" style="flex-direction:row;justify-content:flex-start;padding:12px 16px;">
          <span class="icon">📘</span>
          <div style="text-align:left;margin-left:8px;">
            <strong>ECNR Passport (10th Pass / Non-Emigration)</strong>
            <div style="font-size:11.5px;color:#64748b;">Direct visa stamping, no POE clearance delay</div>
          </div>
        </button>
        <button class="quickbot-btn-option" type="button" data-passport="ECR" style="flex-direction:row;justify-content:flex-start;padding:12px 16px;">
          <span class="icon">📙</span>
          <div style="text-align:left;margin-left:8px;">
            <strong>ECR Passport (Below 10th Pass)</strong>
            <div style="font-size:11.5px;color:#64748b;">Emigration check required via registered eMigrate employer</div>
          </div>
        </button>
        <button class="quickbot-btn-option" type="button" data-passport="NO_PASSPORT" style="flex-direction:row;justify-content:flex-start;padding:12px 16px;">
          <span class="icon">📄</span>
          <div style="text-align:left;margin-left:8px;">
            <strong>Passport Nahi Hai (Applying Soon)</strong>
            <div style="font-size:11.5px;color:#64748b;">Abhi banwana hai, pehle eligibility check karni hai</div>
          </div>
        </button>
      </div>
    `;

    contentArea.querySelectorAll('[data-passport]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.passport = btn.getAttribute('data-passport');
        renderResult();
      });
    });
  };

  const renderResult = () => {
    const tradeData = TRADES[state.trade];
    const isGulf = state.exp === 'gulf';
    const salary = isGulf ? tradeData.salaryReturn : tradeData.salaryIndia;
    const expLabel = isGulf ? 'Gulf Returnee' : (state.exp === 'india' ? 'India Exp (2+ Yrs)' : 'ITI Fresher');

    const waText = encodeURIComponent(
      `Hello AVC Darbhanga Team,\nI checked my Gulf eligibility on assignmentvenuecentre.me:\n\n` +
      `🛠️ Trade: ${tradeData.name}\n` +
      `📈 Experience: ${expLabel}\n` +
      `📘 Passport: ${state.passport}\n` +
      `💰 Expected Salary: ${salary}\n\n` +
      `Please tell me upcoming trade test and interview dates at Darbhanga venue.`
    );

    const waLink = `https://wa.me/919473286356?text=${waText}`;
    const applyUrl = `apply.html?trade=${encodeURIComponent(tradeData.name)}&source=quickbot`;

    contentArea.innerHTML = `
      <div class="quickbot-result-card">
        <h4><span>✅</span> Eligibility Assessment Result</h4>
        <div class="result-stat-row">
          <span>Target Trade:</span>
          <strong>${tradeData.name}</strong>
        </div>
        <div class="result-stat-row">
          <span>Expected Basic Salary:</span>
          <strong>${salary}</strong>
        </div>
        <div class="result-stat-row">
          <span>Passport Eligibility:</span>
          <strong>${state.passport === 'ECNR' ? '✅ Full Direct Clearance' : (state.passport === 'ECR' ? '⚠️ Eligible (eMigrate Route)' : 'ℹ️ Need Passport for Visa')}</strong>
        </div>
        <div style="margin-top:12px;font-size:12.5px;color:#1e293b;line-height:1.5;">
          <strong>Practical Trade Test at Darbhanga:</strong><br>
          ${tradeData.test}
        </div>
        <div style="margin-top:10px;padding:8px 10px;background:#fef3c7;border-radius:6px;font-size:12px;color:#92400e;">
          ⚖️ <strong>Zero Fee Advisory:</strong> AVC never charges candidates any interview, registration, or visa fee (₹0 Intake).
        </div>
      </div>

      <div class="quickbot-actions">
        <a class="quickbot-btn-whatsapp" href="${waLink}" target="_blank" rel="noopener noreferrer">
          <span>💬</span> Chat on WhatsApp with Pre-filled Profile
        </a>
        <a class="quickbot-btn-apply" href="${applyUrl}">
          📝 Fill Official Free Registration Form
        </a>
        <button class="quickbot-btn-reset" type="button" id="quickbot-reset">
          🔄 Check Another Trade or Profile
        </button>
      </div>
    `;

    contentArea.querySelector('#quickbot-reset').addEventListener('click', renderStep1);
  };
})();
