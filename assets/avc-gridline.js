(()=>{
  if(window.__AVC_GRIDLINE_UI__)return;
  window.__AVC_GRIDLINE_UI__=true;

  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const gridPages=new Set([
    'index.html','about.html','services.html','jobs.html','candidates.html','employers.html','partners.html',
    'trust-center.html','contact.html','resources.html','access.html','company-verification.html','office.html','media.html',
    'candidate-sourcing.html','application-coordination.html','cv-profile-support.html','document-guidance.html',
    'interview-coordination.html','employer-manpower-support.html','employer-requirement.html','partner-enquiry.html'
  ]);
  if(!gridPages.has(page))return;

  document.body.classList.add('avc-grid-ui');

  let style=document.querySelector('link[href*="avc-gridline.css"]');
  if(!style){
    style=document.createElement('link');
    style.rel='stylesheet';
    style.href='assets/avc-gridline.css?v=20260813-g1';
  }
  document.head.appendChild(style);

  const topbarLabel=document.querySelector('.topbar-inner>span');
  if(topbarLabel)topbarLabel.textContent='Recruitment Operations · Darbhanga, Bihar';

  const sections=[...document.querySelectorAll('main>section')];
  let visibleIndex=1;
  sections.forEach(section=>{
    if(section.matches('.hero,.about-hero,.business-hero,.trust-hero,.resources-hero,.access-hero'))return;
    if(section.querySelector(':scope>.avc-section-index'))return;
    const marker=document.createElement('span');
    marker.className='avc-section-index';
    marker.setAttribute('aria-hidden','true');
    marker.textContent=`AVC / ${String(visibleIndex++).padStart(2,'0')}`;
    section.prepend(marker);
  });

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets=document.querySelectorAll([
    '.human-route','.human-service','.human-editorial-copy','.human-process-list',
    '.profile-card','.service-hub-card','.job-card','.resource-card','.access-card',
    '.scope-grid','.checklist-grid','.fact-table','.identity-table','.leadership-card'
  ].join(','));
  if(!reduce&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:.06});
    revealTargets.forEach((node,index)=>{
      node.classList.add('avc-reveal');
      node.style.transitionDelay=`${Math.min(index%4,3)*35}ms`;
      observer.observe(node);
    });
  }else{
    revealTargets.forEach(node=>node.classList.add('is-visible'));
  }

  const rail=document.createElement('div');
  rail.className='avc-scroll-rail';
  rail.setAttribute('aria-hidden','true');
  rail.style.cssText='position:fixed;left:0;right:0;top:0;height:2px;z-index:3000;pointer-events:none;background:transparent;';
  const meter=document.createElement('span');
  meter.style.cssText='display:block;width:100%;height:100%;background:#d82032;transform:scaleX(0);transform-origin:left center;will-change:transform;';
  rail.appendChild(meter);
  document.body.appendChild(rail);

  let ticking=false;
  const updateRail=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const progress=Math.min(1,Math.max(0,scrollY/max));
    meter.style.transform=`scaleX(${progress})`;
    ticking=false;
  };
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateRail);ticking=true}},{passive:true});
  updateRail();
})();
