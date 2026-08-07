(()=>{
  const body=document.body;
  const flow=body?.dataset?.flow||'';
  const params=new URLSearchParams(location.search);
  const clean=(v,max=80)=>String(v||'').replace(/[^a-zA-Z0-9._ -]/g,'').trim().slice(0,max);
  const officialForm='https://forms.gle/1nVwzXHiHV9Cjw4A9';
  const officialEmail='info@assignmentvenuecentre.me';
  const publicStatuses=new Set(['open','closing-soon']);
  const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
  const validUntil=v=>{if(!v)return null;const d=new Date(`${v}T23:59:59`);return Number.isNaN(d.getTime())?null:d};
  const currentJob=j=>publicStatuses.has(String(j?.status||'').toLowerCase())&&validUntil(j?.validThrough)&&validUntil(j.validThrough)>=today();
  const dispatch=(kind,extra={})=>window.dispatchEvent(new CustomEvent('avc:analytics',{detail:{event:'avc_conversion',kind,path:location.pathname,...extra}}));

  if(flow==='candidate-apply'){
    const source=clean(params.get('source')||'website',40).toLowerCase()||'website';
    const jobId=clean(params.get('job')||'',60);
    const sourceNode=document.querySelector('[data-apply-source]');
    const jobNode=document.querySelector('[data-apply-job]');
    const titleNode=document.querySelector('[data-apply-title]');
    const statusNode=document.querySelector('[data-apply-status]');
    const button=document.querySelector('[data-apply-final]');
    const currentJobs=document.querySelector('[data-current-jobs]');
    if(sourceNode)sourceNode.textContent=source;
    const enable=(href,title='Official AVC candidate form')=>{
      if(button){button.href=href;button.hidden=false;button.dataset.directForm='true';button.dataset.applySource=source;if(jobId)button.dataset.applyJob=jobId;}
      if(titleNode)titleNode.textContent=title;
      if(statusNode){statusNode.textContent='Ready to continue';statusNode.dataset.state='open';}
      if(currentJobs)currentJobs.hidden=true;
    };
    const disable=(message)=>{
      if(button)button.hidden=true;
      if(statusNode){statusNode.textContent=message;statusNode.dataset.state='closed';}
      if(currentJobs)currentJobs.hidden=false;
    };
    if(!jobId){
      if(jobNode)jobNode.textContent='General candidate registration';
      enable(officialForm);
    }else{
      if(jobNode)jobNode.textContent=jobId;
      fetch('data/jobs.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
        const job=(Array.isArray(data.jobs)?data.jobs:[]).find(j=>String(j.id||'')===jobId);
        if(!job||!currentJob(job)){disable('This vacancy is not currently open for public application.');return;}
        let href=officialForm;
        try{if(job.applicationUrl){const u=new URL(job.applicationUrl);if(u.protocol==='https:')href=u.href;}}catch{}
        enable(href,job.title||'Verified AVC vacancy');
        if(jobNode)jobNode.textContent=`${jobId}${job.country?` • ${job.country}`:''}`;
      }).catch(()=>disable('Vacancy verification is temporarily unavailable. Please use the current jobs page.'));
    }
    button?.addEventListener('click',()=>dispatch('candidate_form_open',{source,job:jobId||null}));
  }

  const emailFlow=(kind,subject,lines)=>{
    const ref=clean(params.get('ref')||params.get('source')||'website',50);
    const template=[...lines,`Website reference: ${ref||'website'}`].join('\n');
    const link=document.querySelector('[data-compose-email]');
    const preview=document.querySelector('[data-email-template]');
    const refNode=document.querySelector('[data-flow-ref]');
    if(preview)preview.textContent=template;
    if(refNode)refNode.textContent=ref||'website';
    if(link){link.href=`mailto:${officialEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(template)}`;link.addEventListener('click',()=>dispatch(kind,{source:ref||'website'}));}
  };

  if(flow==='employer-requirement')emailFlow('employer_requirement','Employer manpower requirement — AVC',[
    'Company / organization:',
    'Country / project location:',
    'Job title(s):',
    'Number of positions:',
    'Required experience / trade criteria:',
    'Salary / duty hours / benefits:',
    'Accommodation / transport / food terms:',
    'Interview method / target date:',
    'Recruitment route / responsible RA (where applicable):',
    'Authorized contact person:',
    'Additional notes:'
  ]);

  if(flow==='partner-enquiry')emailFlow('partner_enquiry','Recruitment partnership enquiry — AVC',[
    'Agency / business legal name:',
    'Country:',
    'Licence / authorization details (where applicable):',
    'Requirement / demand summary:',
    'Positions / quantity:',
    'Employer / project information appropriate for review:',
    'Salary / benefits / duty hours:',
    'Interview / selection process:',
    'Visa / emigration / deployment responsibility:',
    'Commercial / coordination proposal:',
    'Authorized contact person:',
    'Additional notes:'
  ]);
})();