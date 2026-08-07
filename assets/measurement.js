(()=>{
  const classify=(a)=>{
    const href=(a.getAttribute('href')||'').trim();
    if(!href)return null;
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
    const detail={event:'avc_engagement',kind,path:location.pathname,href:a.href};
    window.dispatchEvent(new CustomEvent('avc:analytics',{detail}));
    if(Array.isArray(window.dataLayer))window.dataLayer.push(detail);
  },{passive:true});
})();
