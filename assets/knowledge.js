(()=>{
  const search=document.querySelector('[data-knowledge-search]');
  const filters=[...document.querySelectorAll('[data-knowledge-filter]')];
  const items=[...document.querySelectorAll('[data-knowledge-item]')];
  const empty=document.querySelector('[data-knowledge-empty]');
  const count=document.querySelector('[data-knowledge-count]');
  let active='all';

  const normalize=value=>(value||'').toLowerCase().replace(/\s+/g,' ').trim();
  const apply=()=>{
    const q=normalize(search?.value);
    let visible=0;
    items.forEach(item=>{
      const category=normalize(item.dataset.category);
      const haystack=normalize(item.textContent+' '+(item.dataset.keywords||''));
      const categoryMatch=active==='all'||category.split(' ').includes(active);
      const searchMatch=!q||haystack.includes(q);
      const show=categoryMatch&&searchMatch;
      item.hidden=!show;
      if(show)visible++;
    });
    if(empty)empty.hidden=visible!==0;
    if(count)count.textContent=`${visible} of ${items.length} answers shown`;
  };

  search?.addEventListener('input',apply);
  filters.forEach(button=>button.addEventListener('click',()=>{
    active=button.dataset.knowledgeFilter||'all';
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    apply();
  }));

  document.querySelector('[data-knowledge-expand]')?.addEventListener('click',()=>{
    items.filter(item=>!item.hidden).forEach(item=>item.open=true);
  });
  document.querySelector('[data-knowledge-collapse]')?.addEventListener('click',()=>{
    items.forEach(item=>item.open=false);
  });
  apply();
})();