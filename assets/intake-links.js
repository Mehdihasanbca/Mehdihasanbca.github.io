(()=>{
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(page==='candidates.html'){
    document.querySelectorAll('a[href^="https://forms.gle/"]').forEach(a=>{a.href='apply.html?source=candidates';a.removeAttribute('target');a.removeAttribute('rel');});
  }
  if(page==='employers.html'){
    document.querySelectorAll('a[href^="mailto:info@assignmentvenuecentre.me"]').forEach(a=>{const href=(a.getAttribute('href')||'').toLowerCase();if(href.includes('employer%20manpower%20requirement')){a.href='employer-requirement.html?source=employers';a.removeAttribute('target');a.removeAttribute('rel');}});
  }
  if(page==='partners.html'){
    document.querySelectorAll('a[href^="mailto:info@assignmentvenuecentre.me"]').forEach(a=>{const href=(a.getAttribute('href')||'').toLowerCase();if(href.includes('recruitment%20partnership%20enquiry')){a.href='partner-enquiry.html?source=partners';a.removeAttribute('target');a.removeAttribute('rel');}});
  }
})();