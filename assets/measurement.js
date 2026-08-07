(()=>{
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(['candidates.html','employers.html','partners.html'].includes(page)&&!document.querySelector('script[data-avc-intake-links]')){
    const s=document.createElement('script');s.src='assets/intake-links.js?v=20260807-p15';s.defer=true;s.dataset.avcIntakeLinks='true';document.head.appendChild(s);
  }

  const classify=(a)=>{
    const href=(a.getAttribute('href')||'').trim();
    if(!href)return null;
    if(href.includes('apply.html'))return 'apply_gateway';
    if(href.includes('employer-requirement.html'))return 'employer_requirement';
    if(href.includes('partner-enquiry.html'))return 'partner_enquiry';
    if(href.startsWith('https://forms.gle/'))return 'candidate_form';
    if(href.includes('whatsapp.com/channel/'))return 'whatsapp_channel';
    if(href.startsWith('tel:'))return 'phone';
    if(href.startsWith('mailto:'))return 'email';
    if(href.includes('youtube.com/'))return 'youtube';
    if(href.includes('facebook.com/'))return 'facebook';
    if(href.includes('linkedin.com/'))return 'linkedin';
    if(href.includes('jobs.html'))return 'jobs';
    return null;
  };
  document.addEventListener('click',event=>{
    const a=event.target.closest?.('a');
    if(!a)return;
    const kind=classify(a);
    if(!kind)return;
    const q=new URLSearchParams(location.search);
    const detail={event:'avc_engagement',kind,path:location.pathname,href:a.href};
    const source=a.dataset.applySource||q.get('source');
    const job=a.dataset.applyJob||q.get('job');
    if(source)detail.source=String(source).slice(0,80);
    if(job)detail.job=String(job).slice(0,80);
    window.dispatchEvent(new CustomEvent('avc:analytics',{detail}));
    if(Array.isArray(window.dataLayer))window.dataLayer.push(detail);
  },{passive:true});
})();