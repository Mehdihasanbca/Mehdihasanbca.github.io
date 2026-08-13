(()=>{
  if(window.__AVC_CANDIDATE_HUB__)return;
  window.__AVC_CANDIDATE_HUB__=true;
  if((location.pathname.split('/').pop()||'').toLowerCase()!=='candidates.html')return;

  document.body.classList.add('avc-grid-ui','avc-candidate-hub');
  document.querySelectorAll('.avc-section-index').forEach(node=>node.remove());
  const topbar=document.querySelector('.topbar-inner>span');
  if(topbar)topbar.textContent='CANDIDATE OPERATIONS / INDIA';

  const hero=document.querySelector('.about-hero');
  if(hero){
    hero.className='candidate-hero';
    const grid=hero.querySelector('.about-hero-grid');
    if(grid)grid.className='candidate-hero-grid';
    const copy=grid?.firstElementChild;
    const eyebrow=copy?.querySelector('.eyebrow');
    if(eyebrow){eyebrow.className='candidate-code';eyebrow.textContent='AVC / Candidate desk'}
    const h1=copy?.querySelector('h1');
    if(h1)h1.textContent='One operating hub for the candidate journey.';
    const lead=copy?.querySelector('.lead');
    if(lead)lead.textContent='Move from vacancy review to application, readiness, documents and interview preparation through clear public routes. Use only the steps relevant to your actual vacancy and recruitment process.';
    const actions=copy?.querySelector('.hero-actions');
    if(actions){actions.className='candidate-actions';actions.innerHTML='<a class="button primary" href="jobs.html">Browse current jobs</a><a class="button outline" href="apply.html?source=candidate-hub">Candidate application</a>'}
    const aside=grid?.querySelector('aside');
    if(aside){aside.className='candidate-console';aside.innerHTML='<div class="candidate-console-head"><span>AVC / CANDIDATE</span><span>PUBLIC ROUTES</span></div><dl><div><dt>Start</dt><dd>Vacancy or general registration</dd></div><div><dt>Prepare</dt><dd>Profile · documents · interview</dd></div><div><dt>Conditional</dt><dd>Further formalities when applicable</dd></div><div><dt>Decision</dt><dd>Employer / concerned Recruiting Agent</dd></div></dl><p class="candidate-console-note">This is a public information and coordination hub, not a private candidate account or selection dashboard.</p>'}
  }

  if(hero&&!document.querySelector('.candidate-routes')){
    const routes=document.createElement('section');
    routes.className='candidate-section alt';
    routes.innerHTML='<div class="container"><div class="candidate-section-head"><span class="candidate-section-code">01 / ROUTES</span><h2>Use the right route for the task in front of you.</h2><p>These are existing AVC public routes. Open only what is relevant to your current stage.</p></div><div class="candidate-routes">'+[
      ['01 / JOBS','Current Vacancies','Review active vacancy references, location, terms, requirements and validity.','jobs.html','Open vacancy ledger →'],
      ['02 / APPLY','Application Gateway','Continue through the official AVC candidate application route.','apply.html?source=candidate-hub','Open application →'],
      ['03 / READY','Readiness Checklist','Check profile, document, interview and safety readiness.','candidate-readiness.html','Check readiness →'],
      ['04 / PROFILE','CV & Profile Support','Present factual work history, trade experience and role-relevant information.','cv-profile-support.html','Review profile support →'],
      ['05 / DOCS','Document Guidance','Prepare documents relevant to the actual vacancy and process.','document-guidance.html','Review document guidance →'],
      ['06 / INTERVIEW','Interview Coordination','Review communication, timing, mode and preparation responsibilities.','interview-coordination.html','Review interview route →'],
      ['07 / GCC STEP','Wafid Medical Assistance','Use this only when a GCC/Wafid medical step applies to your process.','medical-booking.html','Open conditional route →'],
      ['08 / SAFETY','Fraud Safety','Check official channels and suspicious recruitment requests before proceeding.','fraud-safety.html','Open safety guidance →']
    ].map(([code,title,text,href,cta])=>`<a class="candidate-route" href="${href}"><span class="candidate-route-code">${code}</span><h3>${title}</h3><p>${text}</p><strong>${cta}</strong></a>`).join('')+'</div></div>';
    hero.after(routes);
  }

  const oldSections=[...document.querySelectorAll('.profile-section')];
  oldSections.forEach(section=>section.remove());

  const routesSection=document.querySelector('.candidate-routes')?.closest('section');
  if(routesSection){
    const process=document.createElement('section');
    process.className='candidate-section';
    process.innerHTML='<div class="container"><div class="candidate-section-head"><span class="candidate-section-code">02 / PROCESS</span><h2>The candidate journey is a sequence, not a guarantee.</h2><p>The exact order can vary by employer, country, vacancy and recruitment stakeholder.</p></div><div class="candidate-sequence">'+[
      ['01','Review vacancy','Check the role, location, terms, reference and validity before acting.'],
      ['02','Apply accurately','Use factual contact, profile and experience information through the official route.'],
      ['03','Screen & prepare','AVC may coordinate matching, communication, document readiness and interview preparation.'],
      ['04','Interview / assessment','Follow confirmed instructions. Attendance itself does not mean selection.'],
      ['05','Formal processing','Selected candidates continue with the concerned employer and/or registered Recruiting Agent for applicable formalities.']
    ].map(([n,t,p])=>`<article class="candidate-step"><span>${n}</span><h3>${t}</h3><p>${p}</p></article>`).join('')+'</div></div>';
    routesSection.after(process);

    const readiness=document.createElement('section');
    readiness.className='candidate-section alt';
    readiness.innerHTML='<div class="container"><div class="candidate-section-head"><span class="candidate-section-code">03 / READINESS</span><h2>Keep a factual candidate pack ready.</h2><p>Preparation categories vary by vacancy; not every item is required in every case.</p></div><div class="candidate-pack"><article><h3>Core profile information</h3><ul class="candidate-list"><li>Current contact details</li><li>Factual CV and work history</li><li>Trade, role and experience information</li><li>Education or skill records when relevant</li><li>Passport details when the verified process requires them</li></ul></article><article><h3>Vacancy-specific items</h3><ul class="candidate-list"><li>Work sample or trade video when requested</li><li>Introduction video when requested</li><li>Interview timing and joining instructions</li><li>Country or recruitment-route requirements</li><li>Written terms and legitimate receipts where applicable</li></ul></article></div></div>';
    process.after(readiness);

    const conditional=document.createElement('section');
    conditional.className='candidate-section dark';
    conditional.innerHTML='<div class="container"><div class="candidate-section-head"><span class="candidate-section-code">04 / CONDITIONAL</span><h2>Some later steps apply only to specific processes.</h2><p>Registration or interview attendance does not automatically mean that a later-stage formality is required.</p></div><div class="candidate-special"><div><span class="candidate-route-code">GCC / WAFID</span><h3>Medical assistance is a separate conditional route.</h3><p>Use the dedicated AVC page only when the actual GCC recruitment process requires this step.</p><a class="button outline" href="medical-booking.html">Open medical assistance</a></div><div class="candidate-special-facts"><div><span>When</span><strong>Only when applicable to the actual process</strong></div><div><span>Candidate action</span><strong>Follow the verified instructions for that stage</strong></div><div><span>Selection</span><strong>No later-stage step guarantees a job or deployment</strong></div></div></div></div>';
    readiness.after(conditional);
  }

  const cta=document.querySelector('.cta');
  if(cta){cta.className='candidate-cta';cta.innerHTML='<div class="container"><div><span>AVC / NEXT ACTION</span><h2>Start with the vacancy, then follow the relevant route.</h2></div><div class="candidate-cta-actions"><a class="button outline" href="candidate-readiness.html">Readiness checklist</a><a class="button primary" href="jobs.html">Current jobs</a></div></div>'}
})();
