(()=>{
  const list=document.querySelector('[data-jobs-list]');
  if(!list)return;
  const search=document.querySelector('[data-job-search]');
  const country=document.querySelector('[data-job-country]');
  const category=document.querySelector('[data-job-category]');
  const count=document.querySelector('[data-job-count]');
  const empty=document.querySelector('[data-jobs-empty]');
  const defaultForm='https://forms.gle/1nVwzXHiHV9Cjw4A9';
  const channel='https://whatsapp.com/channel/0029Vb7mJuWF1YlQJ0sKSn06';
  const allowedStatuses=new Set(['open','closing-soon']);
  let jobs=[];

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const toDate=v=>v?new Date(`${v}T23:59:59`):null;
  const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
  const isCurrent=j=>{
    const status=String(j.status||'').toLowerCase();
    if(!allowedStatuses.has(status))return false;
    const expiry=toDate(j.validThrough);
    return !expiry||expiry>=today();
  };
  const displayStatus=status=>status==='closing-soon'?'Closing soon':'Open';
  const fmtDate=v=>{if(!v)return'';const d=new Date(`${v}T00:00:00`);return Number.isNaN(d.getTime())?v:d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})};
  const safeUrl=v=>{try{const u=new URL(v);return u.protocol==='https:'?u.href:''}catch{return''}};
  const addJobSchema=j=>{
    if(!j.hiringOrganization?.name||!j.country||!j.title||!j.publishedAt||!j.validThrough)return;
    const graph={
      '@context':'https://schema.org',
      '@type':'JobPosting',
      title:j.title,
      description:j.summary,
      datePosted:j.publishedAt,
      validThrough:`${j.validThrough}T23:59:59+05:30`,
      employmentType:j.employmentType||'FULL_TIME',
      hiringOrganization:{'@type':'Organization',name:j.hiringOrganization.name},
      jobLocation:{'@type':'Place',address:{'@type':'PostalAddress',addressCountry:j.countryCode||j.country,addressLocality:j.city||undefined}},
      identifier:{'@type':'PropertyValue',name:'Assignment Venue Center vacancy reference',value:j.id}
    };
    if(j.hiringOrganization.sameAs)graph.hiringOrganization.sameAs=j.hiringOrganization.sameAs;
    if(j.baseSalary?.value&&j.baseSalary?.currency){graph.baseSalary={'@type':'MonetaryAmount',currency:j.baseSalary.currency,value:{'@type':'QuantitativeValue',value:j.baseSalary.value,unitText:j.baseSalary.unitText||'MONTH'}}}
    const script=document.createElement('script');script.type='application/ld+json';script.dataset.avcJobSchema=j.id;script.text=JSON.stringify(graph);document.head.appendChild(script);
  };

  const render=()=>{
    const q=(search?.value||'').trim().toLowerCase();
    const c=country?.value||'';
    const cat=category?.value||'';
    const filtered=jobs.filter(j=>(!q||[j.id,j.title,j.country,j.city,j.category,j.summary,j.requirements].filter(Boolean).join(' ').toLowerCase().includes(q))&&(!c||j.country===c)&&(!cat||j.category===cat));
    if(count)count.textContent=String(filtered.length);
    list.innerHTML='';
    if(!filtered.length){if(empty)empty.hidden=false;return}
    if(empty)empty.hidden=true;
    filtered.forEach(j=>{
      const article=document.createElement('article');
      article.className='job-card';
      article.id=`job-${esc(j.id)}`;
      const apply=safeUrl(j.applicationUrl)||defaultForm;
      const employer=j.hiringOrganization?.public===true&&j.hiringOrganization?.name?`<p><strong>Hiring organization:</strong> ${esc(j.hiringOrganization.name)}</p>`:'';
      const recruiter=j.recruitingAgent?.public===true&&j.recruitingAgent?.name?`<p><strong>Recruitment stakeholder:</strong> ${esc(j.recruitingAgent.name)}</p>`:'';
      article.innerHTML=`<div class="job-card-top"><div><p class="job-ref">${esc(j.id)}</p><h3>${esc(j.title)}</h3><p>${esc(j.summary||'Verified AVC vacancy')}</p></div><span class="job-chip active">${esc(displayStatus(j.status))}</span></div><div class="job-meta">${j.country?`<span class="job-chip">${esc(j.country)}</span>`:''}${j.city?`<span class="job-chip">${esc(j.city)}</span>`:''}${j.category?`<span class="job-chip">${esc(j.category)}</span>`:''}${j.salaryDisplay?`<span class="job-chip">${esc(j.salaryDisplay)}</span>`:''}</div>${employer}${recruiter}${j.requirements?`<p><strong>Key requirements:</strong> ${esc(j.requirements)}</p>`:''}${j.benefits?`<p><strong>Benefits:</strong> ${esc(j.benefits)}</p>`:''}${j.validThrough?`<p><strong>Apply by / validity:</strong> ${esc(fmtDate(j.validThrough))}</p>`:''}${j.lastVerifiedAt?`<p class="job-verified"><strong>Last verified:</strong> ${esc(fmtDate(j.lastVerifiedAt))}</p>`:''}<div class="job-actions"><a class="button primary" href="${esc(apply)}" target="_blank" rel="noopener noreferrer">Apply now</a><a class="button outline" href="${channel}" target="_blank" rel="noopener noreferrer">Official updates</a></div>`;
      list.appendChild(article);
      addJobSchema(j);
    });
  };

  const buildFilters=()=>{
    const countries=[...new Set(jobs.map(j=>j.country).filter(Boolean))].sort();
    const cats=[...new Set(jobs.map(j=>j.category).filter(Boolean))].sort();
    countries.forEach(v=>country?.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));
    cats.forEach(v=>category?.insertAdjacentHTML('beforeend',`<option value="${esc(v)}">${esc(v)}</option>`));
  };

  fetch('data/jobs.json',{cache:'no-store'})
    .then(r=>r.ok?r.json():Promise.reject(new Error('jobs data unavailable')))
    .then(data=>{
      jobs=(Array.isArray(data.jobs)?data.jobs:[]).filter(isCurrent).sort((a,b)=>String(b.publishedAt||'').localeCompare(String(a.publishedAt||'')));
      buildFilters();render();
    })
    .catch(()=>{jobs=[];render()});
  [search,country,category].forEach(el=>el&&el.addEventListener(el===search?'input':'change',render));
})();
