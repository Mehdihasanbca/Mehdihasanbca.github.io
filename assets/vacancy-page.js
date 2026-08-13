(()=>{
  const navToggle=document.querySelector('[data-nav-toggle]');
  const siteNav=document.querySelector('[data-site-nav]');
  const closeNav=(restore=false)=>{
    if(!navToggle||!siteNav)return;
    siteNav.classList.remove('open');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-label','Open navigation');
    navToggle.textContent='☰';
    if(restore)navToggle.focus();
  };
  if(navToggle&&siteNav){
    if(!siteNav.id)siteNav.id='vacancy-navigation';
    navToggle.setAttribute('aria-controls',siteNav.id);
    navToggle.addEventListener('click',()=>{
      const open=!siteNav.classList.contains('open');
      if(open){
        siteNav.classList.add('open');
        document.body.classList.add('menu-open');
        navToggle.setAttribute('aria-expanded','true');
        navToggle.setAttribute('aria-label','Close navigation');
        navToggle.textContent='×';
      }else closeNav(true);
    });
    siteNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeNav(false)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav(true)});
  }
  document.querySelectorAll('[data-year]').forEach(n=>n.textContent=String(new Date().getFullYear()));
  const copy=document.querySelector('[data-copy-reference]');
  if(copy){
    copy.addEventListener('click',async()=>{
      const value=copy.getAttribute('data-copy-reference')||'';
      try{await navigator.clipboard.writeText(value)}catch(_){/* clipboard may be unavailable */}
      let toast=document.querySelector('.vacancy-toast');
      if(!toast){toast=document.createElement('div');toast.className='vacancy-toast';document.body.appendChild(toast)}
      toast.textContent=`Reference copied: ${value}`;
      toast.style.display='block';
      clearTimeout(window.__avcVacancyToast);
      window.__avcVacancyToast=setTimeout(()=>{toast.style.display='none'},2600);
    });
  }
})();
