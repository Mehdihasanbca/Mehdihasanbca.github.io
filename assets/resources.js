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
  if(checklist.length){
    const key='avc-candidate-readiness-v1';
    const progress=document.querySelector('[data-readiness-progress]');
    const count=document.querySelector('[data-readiness-count]');
    const status=document.querySelector('[data-readiness-status]');
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
      if(status)status.textContent=pct===100?'Checklist complete':pct>=60?'Good progress':'In progress';
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
  }
})();