const navToggle=document.querySelector('[data-nav-toggle]');
const siteNav=document.querySelector('[data-site-nav]');

if(!document.querySelector('link[href*="company.css"]')){
  const companyStyles=document.createElement('link');
  companyStyles.rel='stylesheet';
  companyStyles.href='assets/company.css?v=20260807';
  document.head.appendChild(companyStyles);
}

if(siteNav){
  const byText=text=>[...siteNav.querySelectorAll('a')].find(a=>a.textContent.trim().toLowerCase()===text.toLowerCase());
  const ensure=(text,href)=>{const found=byText(text);if(found){found.href=href;return found}const a=document.createElement('a');a.href=href;a.textContent=text;siteNav.appendChild(a);return a};
  const about=byText('About AVC');
  if(!about){const a=document.createElement('a');a.href='about.html';a.textContent='About AVC';const first=siteNav.querySelector('a');first?.after(a)}
  ensure('Services','services.html');
  ensure('Jobs','jobs.html');
  ensure('Trust','trust-center.html');
  ensure('Contact','contact.html');
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
        <h2 id="company-snapshot-title">Assignment Venue Center is a registered recruitment-support and manpower coordination business based in Darbhanga, Bihar.</h2>
        <p>AVC supports Indian candidates, employers and recruitment partners with sourcing, applications, profile preparation, interviews and document readiness while keeping final overseas recruitment and deployment responsibilities with the concerned authorized stakeholders.</p>
        <div class="hero-actions"><a class="button light" href="about.html">View company profile</a><a class="button light" href="company-verification.html">Verify AVC</a></div>
      </article>
      <div class="snapshot-facts">
        <article class="snapshot-fact"><span>Founder & Business Head</span><strong>Mehdi Hasan</strong><p>Business development, recruitment-support operations and partner coordination.</p></article>
        <article class="snapshot-fact"><span>Registrations</span><strong>GSTIN 10AOVPH3197L1ZI</strong><p>Udyam Registration: UDYAM-BR-10-0047094.</p></article>
        <article class="snapshot-fact"><span>Office</span><strong>Darbhanga, Bihar - 847306</strong><p>Kamtaul Road, Madhupur, Tekatar. <a href="office.html">View office details</a>.</p></article>
        <article class="snapshot-fact"><span>Official contact</span><strong>+91 9162530999</strong><p><a href="mailto:info@assignmentvenuecentre.me">info@assignmentvenuecentre.me</a></p></article>
        <article class="snapshot-fact"><span>Core role</span><strong>Candidate sourcing & recruitment coordination</strong><p>Applications, screening support, interviews and document guidance.</p></article>
        <article class="snapshot-fact"><span>Market focus</span><strong>Gulf / GCC and verified international requirements</strong><p>Including Oman, Saudi Arabia, UAE and Qatar according to available approved demands.</p></article>
      </div>
    </div>`;
  homeServices.parentNode.insertBefore(section,homeServices);
}

const journeyPages={
  'for candidates':{href:'candidates.html',label:'Candidate information →'},
  'for employers':{href:'employers.html',label:'Employer manpower support →'},
  'for agencies':{href:'partners.html',label:'Recruitment partnership →'}
};
document.querySelectorAll('.audience-card').forEach(card=>{
  const heading=card.querySelector('h3');
  const link=card.querySelector('.text-link');
  if(!heading||!link)return;
  const journey=journeyPages[heading.textContent.trim().toLowerCase()];
  if(journey){link.href=journey.href;link.removeAttribute('target');link.removeAttribute('rel');link.textContent=journey.label;}
});

const servicePages=['candidate-sourcing.html','application-coordination.html','cv-profile-support.html','document-guidance.html','interview-coordination.html','employer-manpower-support.html'];
document.querySelectorAll('#services .service-card').forEach((card,index)=>{
  if(!servicePages[index]||card.querySelector('.text-link'))return;
  const link=document.createElement('a');
  link.className='text-link';
  link.href=servicePages[index];
  link.textContent='View service →';
  link.style.display='inline-block';
  link.style.marginTop='16px';
  card.appendChild(link);
});

const opportunitySection=document.querySelector('#opportunities');
if(opportunitySection&&!opportunitySection.querySelector('a[href="jobs.html"]')){
  const heading=opportunitySection.querySelector('.section-heading');
  if(heading){const link=document.createElement('a');link.className='button outline';link.href='jobs.html';link.textContent='Open verified jobs hub';link.style.marginTop='18px';heading.appendChild(link)}
}

const officeSection=document.querySelector('#office');
if(officeSection&&!officeSection.querySelector('a[href="office.html"]')){
  const panel=officeSection.querySelector('.office-panel');
  if(panel){const link=document.createElement('a');link.className='button light';link.href='office.html';link.textContent='Office & interview information';link.style.marginTop='18px';panel.appendChild(link)}
}

const trustSection=document.querySelector('#trust');
if(trustSection&&!trustSection.querySelector('a[href="trust-center.html"]')){
  const heading=trustSection.querySelector('.section-heading');
  if(heading){const link=document.createElement('a');link.className='button light';link.href='trust-center.html';link.textContent='Open Trust Center';link.style.marginTop='18px';heading.appendChild(link)}
}

const footerCompanyHeading=[...document.querySelectorAll('.footer h3')].find(el=>el.textContent.trim().toLowerCase()==='company');
if(footerCompanyHeading){
  const links=footerCompanyHeading.nextElementSibling;
  if(links&&links.classList.contains('footer-links')){
    const wanted=[['about.html','About AVC'],['company-verification.html','Company verification'],['services.html','Services'],['jobs.html','Jobs'],['office.html','Office'],['media.html','Media'],['trust-center.html','Trust Center'],['contact.html','Contact'],['candidates.html','Candidates'],['employers.html','Employers'],['partners.html','Recruitment partners']];
    wanted.reverse().forEach(([href,label])=>{
      if(!links.querySelector(`a[href="${href}"]`)){
        const link=document.createElement('a');
        link.href=href;
        link.textContent=label;
        links.prepend(link);
      }
    });
  }
}

if(!document.querySelector('script[data-avc-seo-loader]')){
  const seo=document.createElement('script');
  seo.src='assets/seo.js?v=20260807';
  seo.defer=true;
  seo.dataset.avcSeoLoader='true';
  document.head.appendChild(seo);
}
