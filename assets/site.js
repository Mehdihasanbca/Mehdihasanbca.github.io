const navToggle=document.querySelector('[data-nav-toggle]');
const siteNav=document.querySelector('[data-site-nav]');

if(!document.querySelector('link[href*="company.css"]')){
  const companyStyles=document.createElement('link');
  companyStyles.rel='stylesheet';
  companyStyles.href='assets/company.css?v=20260807';
  document.head.appendChild(companyStyles);
}

if(siteNav&&!siteNav.querySelector('a[href="about.html"]')){
  const aboutLink=document.createElement('a');
  aboutLink.href='about.html';
  aboutLink.textContent='About AVC';
  const firstLink=siteNav.querySelector('a');
  if(firstLink&&firstLink.nextSibling){siteNav.insertBefore(aboutLink,firstLink.nextSibling)}else{siteNav.appendChild(aboutLink)}
}

if(navToggle&&siteNav){
  navToggle.addEventListener('click',()=>{
    const open=siteNav.classList.toggle('open');
    document.body.classList.toggle('menu-open',open);
    navToggle.setAttribute('aria-expanded',String(open));
    navToggle.textContent=open?'×':'☰';
  });
  siteNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
    siteNav.classList.remove('open');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded','false');
    navToggle.textContent='☰';
  }));
}

document.querySelectorAll('.faq-question').forEach(button=>{
  button.addEventListener('click',()=>{
    const item=button.closest('.faq-item');
    const open=item.classList.toggle('open');
    button.setAttribute('aria-expanded',String(open));
    const mark=button.querySelector('[data-mark]');
    if(mark)mark.textContent=open?'−':'+';
  });
});

document.querySelectorAll('[data-year]').forEach(node=>{node.textContent=String(new Date().getFullYear())});

const homeServices=document.querySelector('#services');
if(homeServices&&!document.querySelector('.company-snapshot')){
  const section=document.createElement('section');
  section.className='company-snapshot';
  section.setAttribute('aria-labelledby','company-snapshot-title');
  section.innerHTML=`
    <div class="container snapshot-grid">
      <article class="snapshot-intro">
        <span class="section-kicker">About AVC</span>
        <h2 id="company-snapshot-title">Assignment Venue Center is a recruitment-support and manpower coordination business based in Bihar, India.</h2>
        <p>AVC supports Indian candidates, employers and recruitment partners with sourcing, applications, profile preparation, interviews and document readiness while keeping final overseas recruitment and deployment responsibilities with the concerned authorized stakeholders.</p>
        <a class="button light" href="about.html">View complete company profile</a>
      </article>
      <div class="snapshot-facts">
        <article class="snapshot-fact"><span>Founder & Business Head</span><strong>Mehdi Hasan</strong><p>Business development, recruitment-support operations and partner coordination.</p></article>
        <article class="snapshot-fact"><span>Base</span><strong>Darbhanga, Bihar, India</strong><p>AVC operates as an India-based recruitment-support service business.</p></article>
        <article class="snapshot-fact"><span>Core role</span><strong>Candidate sourcing & recruitment coordination</strong><p>Applications, screening support, interviews and document guidance.</p></article>
        <article class="snapshot-fact"><span>Market focus</span><strong>Gulf / GCC and verified international requirements</strong><p>Including Oman, Saudi Arabia, UAE and Qatar according to available approved demands.</p></article>
      </div>
    </div>`;
  homeServices.parentNode.insertBefore(section,homeServices);
}

const footerCompanyHeading=[...document.querySelectorAll('.footer h3')].find(el=>el.textContent.trim().toLowerCase()==='company');
if(footerCompanyHeading){
  const links=footerCompanyHeading.nextElementSibling;
  if(links&&links.classList.contains('footer-links')&&!links.querySelector('a[href="about.html"]')){
    const link=document.createElement('a');
    link.href='about.html';
    link.textContent='About AVC';
    links.prepend(link);
  }
}
