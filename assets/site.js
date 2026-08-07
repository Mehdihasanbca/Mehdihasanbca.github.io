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
  const about=byText('About AVC');
  if(!about){const a=document.createElement('a');a.href='about.html';a.textContent='About AVC';const first=siteNav.querySelector('a');first?.after(a)}
  const services=byText('Services');
  if(services){services.href='services.html'}else{const a=document.createElement('a');a.href='services.html';a.textContent='Services';siteNav.appendChild(a)}
  const jobs=byText('Jobs');
  if(jobs){jobs.href='jobs.html'}else{const a=document.createElement('a');a.href='jobs.html';a.textContent='Jobs';siteNav.appendChild(a)}
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

const footerCompanyHeading=[...document.querySelectorAll('.footer h3')].find(el=>el.textContent.trim().toLowerCase()==='company');
if(footerCompanyHeading){
  const links=footerCompanyHeading.nextElementSibling;
  if(links&&links.classList.contains('footer-links')){
    const wanted=[['about.html','About AVC'],['services.html','Services'],['jobs.html','Jobs'],['candidates.html','Candidates'],['employers.html','Employers'],['partners.html','Recruitment partners']];
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
