(()=>{
  const search=document.querySelector('[data-resource-search]');
  const filters=[...document.querySelectorAll('[data-resource-filter]')];
  const cards=[...document.querySelectorAll('[data-resource-card]')];
  const empty=document.querySelector('[data-resource-empty]');
  let active='all';

  const applyFilter=()=>{
    const q=(search?.value||'').trim().toLowerCase();
    let shown=0;
    cards.forEach(card=>{
      const audience=(card.dataset.audience||'').toLowerCase();
      const haystack=(card.textContent||'').toLowerCase();
      const okAudience=active==='all'||audience.split(' ').includes(active);
      const okQuery=!q||haystack.includes(q);
      card.hidden=!(okAudience&&okQuery);
      if(!card.hidden)shown++;
    });
    if(empty)empty.hidden=shown!==0;
  };

  search?.addEventListener('input',applyFilter);
  filters.forEach(button=>button.addEventListener('click',()=>{
    active=button.dataset.resourceFilter||'all';
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    applyFilter();
  }));
  applyFilter();

  const checklist=[...document.querySelectorAll('[data-readiness-item]')];
  if(!checklist.length)return;

  document.body.classList.add('avc-grid-ui','avc-readiness-console');
  const loadStyle=(needle,href)=>{
    if(document.querySelector(`link[href*="${needle}"]`))return;
    const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);
  };
  loadStyle('avc-gridline.css','assets/avc-gridline.css?v=20260813-g1');
  loadStyle('avc-readiness-console.css','assets/avc-readiness-console.css?v=20260815-r1');

  const topbar=document.querySelector('.topbar-inner>span');
  if(topbar)topbar.textContent='CANDIDATE READINESS / LOCAL CHECKLIST';

  const hero=document.querySelector('.resources-hero');
  const heroAside=hero?.querySelector('.resources-side');
  if(heroAside){
    heroAside.className='readiness-console';
    heroAside.innerHTML='<div class="readiness-console-head"><span>AVC / READINESS</span><span>LOCAL STATE</span></div><dl><div><dt>Checks</dt><dd>16 preparation items</dd></div><div><dt>Storage</dt><dd>This browser only</dd></div><div><dt>Submission</dt><dd>None from this checklist</dd></div><div><dt>Purpose</dt><dd>Preparation aid</dd></div></dl><p>Your checklist state remains on this device when browser storage is available. It is not a selection, visa or deployment assessment.</p>';
  }

  const key='avc-candidate-readiness-v1';
  const groups=[...document.querySelectorAll('.check-group')];
  const progress=document.querySelector('[data-readiness-progress]');
  const count=document.querySelector('[data-readiness-count]');
  const status=document.querySelector('[data-readiness-status]');
  const summary=document.querySelector('.tool-summary');

  if(summary&&!summary.querySelector('.readiness-summary-head')){
    const head=document.createElement('div');head.className='readiness-summary-head';head.textContent='AVC / PROGRESS CONSOLE';summary.prepend(head);
    const percent=document.createElement('div');percent.className='readiness-percent';percent.dataset.readinessPercent='';count?.after(percent);
    const category=document.createElement('div');category.className='readiness-category-status';category.dataset.readinessCategories='';status?.after(category);
  }

  groups.forEach((group,index)=>{
    const heading=group.querySelector('h2');
    if(!heading||heading.closest('.check-group-head'))return;
    const head=document.createElement('div');head.className='check-group-head';
    heading.parentNode.insertBefore(head,heading);head.appendChild(heading);
    const meta=document.createElement('div');meta.className='check-group-meta';meta.dataset.groupProgress=String(index);meta.textContent='0 / 4 ready';head.appendChild(meta);
  });

  const toolSection=document.querySelector('.candidate-tool');
  if(toolSection&&!document.querySelector('.readiness-links')){
    const links=document.createElement('section');links.className='readiness-links';
    links.innerHTML='<div class="container"><span class="readiness-code">NEXT / CANDIDATE ROUTES</span><div class="readiness-links-grid"><a href="jobs.html"><span>01 / VACANCIES</span><strong>Current Jobs</strong><small>Review active requirements and vacancy references.</small></a><a href="apply.html?source=readiness"><span>02 / APPLY</span><strong>Application Gateway</strong><small>Continue through the official candidate application route.</small></a><a href="candidates.html"><span>03 / HUB</span><strong>Candidate Operations</strong><small>Return to profile, document, interview and safety routes.</small></a></div></div>';
    toolSection.after(links);
  }

  const restore=()=>{
    try{
      const saved=JSON.parse(localStorage.getItem(key)||'[]');
      checklist.forEach((input,index)=>{input.checked=Boolean(saved[index])});
    }catch(_){/* local storage is optional */}
  };

  const sync=()=>{
    const done=checklist.filter(i=>i.checked).length;
    const pct=Math.round(done/checklist.length*100);
    if(progress)progress.style.width=pct+'%';
    if(count)count.textContent=`${done}/${checklist.length}`;
    const percent=document.querySelector('[data-readiness-percent]');
    if(percent)percent.textContent=`${pct}% overall readiness`;
    if(status){
      status.textContent=pct===100?'Checklist complete':pct>=75?'Nearly ready':pct>=50?'Good progress':'In progress';
      status.dataset.state=pct===100?'complete':pct>=50?'progress':'start';
    }

    const category=document.querySelector('[data-readiness-categories]');
    const categoryRows=[];
    groups.forEach((group,index)=>{
      const items=[...group.querySelectorAll('[data-readiness-item]')];
      const groupDone=items.filter(i=>i.checked).length;
      const label=(group.querySelector('h2')?.textContent||`Section ${index+1}`).replace(/^\d+\.\s*/, '');
      const meta=group.querySelector(`[data-group-progress="${index}"]`);
      if(meta)meta.textContent=`${groupDone} / ${items.length} ready`;
      categoryRows.push(`<div><span>${label}</span><strong>${groupDone}/${items.length}</strong></div>`);
    });
    if(category)category.innerHTML=categoryRows.join('');

    checklist.forEach(input=>input.closest('.check-item')?.classList.toggle('is-checked',input.checked));
    try{localStorage.setItem(key,JSON.stringify(checklist.map(i=>i.checked)))}catch(_){/* no-op */}
  };

  restore();sync();
  checklist.forEach(input=>input.addEventListener('change',sync));
  document.querySelector('[data-readiness-reset]')?.addEventListener('click',()=>{
    checklist.forEach(i=>{i.checked=false});
    try{localStorage.removeItem(key)}catch(_){/* no-op */}
    sync();
  });
  document.querySelector('[data-readiness-print]')?.addEventListener('click',()=>window.print());
})();
