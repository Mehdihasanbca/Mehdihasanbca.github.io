(()=>{
  const button=document.querySelector('[data-copy-intake]');
  const preview=document.querySelector('[data-email-template]');
  if(!button||!preview)return;
  const original=button.textContent;
  const copyFallback=text=>{
    const area=document.createElement('textarea');
    area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';
    document.body.appendChild(area);area.select();
    const ok=document.execCommand('copy');area.remove();return ok;
  };
  button.addEventListener('click',async()=>{
    const text=(preview.textContent||'').trim();
    if(!text||/^loading/i.test(text))return;
    let copied=false;
    try{await navigator.clipboard.writeText(text);copied=true}catch(_){try{copied=copyFallback(text)}catch(__){copied=false}}
    button.textContent=copied?'Brief copied':'Copy unavailable';
    button.setAttribute('aria-live','polite');
    setTimeout(()=>{button.textContent=original},2200);
  });
})();