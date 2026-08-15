(()=>{
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const form='https://forms.gle/1nVwzXHiHV9Cjw4A9';

  // The old language control only changed its own label; remove it until a real translation layer exists.
  document.querySelectorAll('.avc-lang-btn,#avcLangBtn').forEach(node=>node.remove());

  // Keep the permanent Google Form as a no-JS fallback in static HTML, but route normal browser clicks
  // through AVC's application gateway so vacancy context and verification stay connected.
  if(page!=='apply.html'){
    const source=(page.replace(/\.html$/,'')||'home').replace(/[^a-z0-9-]/g,'-');
    document.querySelectorAll('a[href]').forEach(link=>{
      const href=(link.getAttribute('href')||'').trim();
      if(href!==form||link.dataset.keepDirectForm==='true')return;
      link.href=`apply.html?source=${encodeURIComponent(source)}`;
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.dataset.avcGatewayRoute='true';
    });
  }
})();
