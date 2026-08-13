const navToggle=document.querySelector('[data-nav-toggle]');
const siteNav=document.querySelector('[data-site-nav]');

const loadStyle=(needle,href)=>{if(!document.querySelector(`link[href*="${needle}"]`)){const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link)}};
loadStyle('company.css','assets/company.css?v=20260807');
loadStyle('phase8.css','assets/phase8.css?v=20260807');
loadStyle('final-polish.css','assets/final-polish.css?v=20260807-p10');

const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
const isHome=current==='index.html';
const syncHeaderHeight=()=>{const top=document.querySelector('.topbar')?.offsetHeight||0;const head=document.querySelector('.site-header')?.offsetHeight||0;document.documentElement.style.setProperty('--avc-header-height',`${top+head}px`)};
syncHeaderHeight();window.addEventListener('resize',syncHeaderHeight,{passive:true});

const topbarLinks=document.querySelector('.topbar-links');
if(topbarLinks){
  if(!topbarLinks.querySelector('a[href^="tel:"]')){const phone=document.createElement('a');phone.href='tel:+919473286356';phone.textContent='+91 9473286356';topbarLinks.prepend(phone)}
  if(!topbarLinks.querySelector('a[href^="mailto:"]')){const email=document.createElement('a');email.href='mailto:info@assignmentvenuecentre.me';email.textContent='info@assignmentvenuecentre.me';topbarLinks.appendChild(email)}
}

if(siteNav){
  const navItems=[['./','Home','index.html'],['about.html','About AVC','about.html'],['services.html','Services','services.html'],['jobs.html','Jobs','jobs.html'],['resources.html','Resources','resources.html'],['access.html','Access','access.html'],['trust-center.html','Trust','trust-center.html'],['contact.html','Contact','contact.html']];
  siteNav.innerHTML=navItems.map(([href,label,key])=>`<a href="${href}"${current===key?' aria-current="page"':''}>${label}</a>`).join('');
  siteNav.setAttribute('aria-label','Primary navigation');
}

const closeNav=(restoreFocus=false)=>{if(!siteNav||!navToggle)return;siteNav.classList.remove('open');document.body.classList.remove('menu-open');navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Open navigation');navToggle.textContent='☰';if(restoreFocus)navToggle.focus()};

if(navToggle&&siteNav){
  if(!siteNav.id)siteNav.id='primary-navigation';navToggle.setAttribute('aria-controls',siteNav.id);navToggle.setAttribute('aria-label','Open navigation');
  navToggle.addEventListener('click',()=>{const open=!siteNav.classList.contains('open');if(open){siteNav.classList.add('open');document.body.classList.add('menu-open');navToggle.setAttribute('aria-expanded','true');navToggle.setAttribute('aria-label','Close navigation');navToggle.textContent='×';siteNav.querySelector('a')?.focus()}else closeNav(true)});
  siteNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeNav(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&siteNav.classList.contains('open'))closeNav(true)});
  document.addEventListener('click',e=>{if(siteNav.classList.contains('open')&&!siteNav.contains(e.target)&&!navToggle.contains(e.target))closeNav(false)});
  window.addEventListener('resize',()=>{if(window.innerWidth>1060)closeNav(false)},{passive:true});
}

document.querySelectorAll('.faq-question').forEach((button,index)=>{
  const item=button.closest('.faq-item');const answer=item?.querySelector('.faq-answer');if(!item||!answer)return;
  const answerId=answer.id||`faq-answer-${index+1}`;answer.id=answerId;button.setAttribute('aria-controls',answerId);
  const initial=item.classList.contains('open');button.setAttribute('aria-expanded',String(initial));answer.hidden=!initial;
  button.addEventListener('click',()=>{const open=!item.classList.contains('open');item.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));answer.hidden=!open;const mark=button.querySelector('[data-mark]');if(mark)mark.textContent=open?'−':'+'});
});

document.querySelectorAll('[data-year]').forEach(node=>{node.textContent=String(new Date().getFullYear())});

document.querySelectorAll('img').forEach((img,index)=>{img.decoding='async';const critical=img.closest('.site-header')||img.closest('.hero')||img.closest('.about-hero')||img.closest('.business-hero')||img.closest('.trust-hero')||index===0;if(!critical)img.loading='lazy'});

if(isHome){
  const heroCopy=document.querySelector('.hero .hero-grid>div:first-child');
  if(heroCopy&&!heroCopy.querySelector('.avc-launch-badge')){const badge=document.createElement('div');badge.className='avc-launch-badge';badge.textContent='Official AVC website • Darbhanga, Bihar';heroCopy.insertBefore(badge,heroCopy.firstElementChild)}
}

const homeServices=document.querySelector('#services');
if(homeServices&&!document.querySelector('.company-snapshot')){
  const section=document.createElement('section');section.className='company-snapshot';section.setAttribute('aria-labelledby','company-snapshot-title');section.innerHTML=`<div class="container snapshot-grid"><article class="snapshot-intro"><span class="section-kicker">About AVC</span><h2 id="company-snapshot-title">Assignment Venue Center is a registered recruitment-support and manpower coordination business based in Darbhanga, Bihar.</h2><p>AVC supports Indian candidates, employers and recruitment partners with sourcing, applications, profile preparation, interviews and document readiness while keeping final overseas recruitment and deployment responsibilities with the concerned authorized stakeholders.</p><div class="hero-actions"><a class="button light" href="about.html">View company profile</a><a class="button light" href="company-verification.html">Verify AVC</a></div></article><div class="snapshot-facts"><article class="snapshot-fact"><span>Founder & Business Head</span><strong>Mehdi Hasan</strong><p>Business development, recruitment-support operations and partner coordination.</p></article><article class="snapshot-fact"><span>Registrations</span><strong>GSTIN 10AOVPH3197L1ZI</strong><p>Udyam Registration: UDYAM-BR-10-0047094.</p></article><article class="snapshot-fact"><span>Office</span><strong>Darbhanga, Bihar - 847306</strong><p>Kamtaul Road, Madhupur, Tekatar. <a href="office.html">View office details</a>.</p></article><article class="snapshot-fact"><span>Official contact</span><strong>+91 9473286356</strong><p><a href="mailto:info@assignmentvenuecentre.me">info@assignmentvenuecentre.me</a></p></article><article class="snapshot-fact"><span>Core role</span><strong>Candidate sourcing & recruitment coordination</strong><p>Applications, screening support, interviews and document guidance.</p></article><article class="snapshot-fact"><span>Market focus</span><strong>Gulf / GCC and verified international requirements</strong><p>Including Oman, Saudi Arabia, UAE and Qatar according to available approved demands.</p></article></div></div>`;homeServices.parentNode.insertBefore(section,homeServices);
}

const journeyPages={'for candidates':{href:'candidates.html',label:'Candidate information →'},'for employers':{href:'employers.html',label:'Employer manpower support →'},'for agencies':{href:'partners.html',label:'Recruitment partnership →'}};
document.querySelectorAll('.audience-card').forEach(card=>{const heading=card.querySelector('h3');const link=card.querySelector('.text-link');if(!heading||!link)return;const journey=journeyPages[heading.textContent.trim().toLowerCase()];if(journey){link.href=journey.href;link.removeAttribute('target');link.removeAttribute('rel');link.textContent=journey.label}});

const servicePages=['candidate-sourcing.html','application-coordination.html','cv-profile-support.html','document-guidance.html','interview-coordination.html','employer-manpower-support.html'];
document.querySelectorAll('#services .service-card').forEach((card,index)=>{if(!servicePages[index]||card.querySelector('.text-link'))return;const link=document.createElement('a');link.className='text-link';link.href=servicePages[index];link.textContent='View service →';link.style.display='inline-block';link.style.marginTop='16px';card.appendChild(link)});

const opportunitySection=document.querySelector('#opportunities');if(opportunitySection&&!opportunitySection.querySelector('a[href="jobs.html"]')){const heading=opportunitySection.querySelector('.section-heading');if(heading){const link=document.createElement('a');link.className='button outline';link.href='jobs.html';link.textContent='Open verified jobs hub';link.style.marginTop='18px';heading.appendChild(link)}}
const officeSection=document.querySelector('#office');if(officeSection&&!officeSection.querySelector('a[href="office.html"]')){const panel=officeSection.querySelector('.office-panel');if(panel){const link=document.createElement('a');link.className='button light';link.href='office.html';link.textContent='Office & interview information';link.style.marginTop='18px';panel.appendChild(link)}}
const trustSection=document.querySelector('#trust');if(trustSection&&!trustSection.querySelector('a[href="trust-center.html"]')){const heading=trustSection.querySelector('.section-heading');if(heading){const link=document.createElement('a');link.className='button light';link.href='trust-center.html';link.textContent='Open Trust Center';link.style.marginTop='18px';heading.appendChild(link)}}

const footer=document.querySelector('.footer');
if(footer){
  const container=footer.querySelector('.container');
  if(container&&!footer.querySelector('.footer-grid')){const grid=document.createElement('div');grid.className='footer-grid';grid.innerHTML=`<div class="footer-brand"><img src="assets/avc-logo.png" alt="Assignment Venue Center official logo"><p>Recruitment support for candidates, employers and recruitment partners.</p></div><div><h3>Company</h3><div class="footer-links"><a href="about.html">About AVC</a><a href="company-verification.html">Company verification</a><a href="office.html">Office</a><a href="media.html">Media</a><a href="brochure.html">Company brochure</a></div></div><div><h3>Services</h3><div class="footer-links"><a href="services.html">All services</a><a href="jobs.html">Jobs</a><a href="candidates.html">Candidates</a><a href="employers.html">Employers</a><a href="partners.html">Recruitment partners</a><a href="resources.html">Resources & Tools</a><a href="knowledge.html">Knowledge & FAQ</a><a href="medical-booking.html">Medical booking</a></div></div><div><h3>Trust & legal</h3><div class="footer-links"><a href="trust-center.html">Trust Center</a><a href="fraud-safety.html">Fraud safety</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="disclaimer.html">Disclaimer</a><a href="payment-trust.html">Payment trust</a><a href="payment-refund.html">Payment & refunds</a></div></div>`;container.prepend(grid)}
  const footerCompanyHeading=[...footer.querySelectorAll('h3')].find(el=>el.textContent.trim().toLowerCase()==='company');
  if(footerCompanyHeading){const links=footerCompanyHeading.nextElementSibling;if(links?.classList.contains('footer-links')){[['about.html','About AVC'],['company-verification.html','Company verification'],['office.html','Office'],['media.html','Media'],['brochure.html','Company brochure'],['resources.html','Resources & Tools'],['knowledge.html','Knowledge & FAQ']].forEach(([href,label])=>{if(!links.querySelector(`a[href="${href}"]`)){const link=document.createElement('a');link.href=href;link.textContent=label;links.appendChild(link)}})}}
  if(container&&!footer.querySelector('.global-contact-strip')){const strip=document.createElement('div');strip.className='global-contact-strip';strip.innerHTML=`<strong>Assignment Venue Center</strong><a href="tel:+919473286356">+91 9473286356</a><a href="mailto:info@assignmentvenuecentre.me">info@assignmentvenuecentre.me</a><span>Kamtaul Road, Madhupur, Tekatar, Darbhanga, Bihar - 847306</span>`;container.appendChild(strip)}
}

if(!document.querySelector('script[data-avc-seo-loader]')){const seo=document.createElement('script');seo.src='assets/seo.js?v=20260807-p19';seo.defer=true;seo.dataset.avcSeoLoader='true';document.head.appendChild(seo)}


// Phase 16 access integration
if(current==='candidates.html'){
  const actions=document.querySelector('.about-hero .hero-actions');
  if(actions&&!actions.querySelector('a[href="access.html"]')){const a=document.createElement('a');a.className='button secondary';a.href='access.html';a.textContent='Access Center';actions.appendChild(a)}
}
if(footer){
  const serviceHeading=[...footer.querySelectorAll('h3')].find(el=>el.textContent.trim().toLowerCase()==='services');
  const companyHeading=[...footer.querySelectorAll('h3')].find(el=>el.textContent.trim().toLowerCase()==='company');
  const target=(serviceHeading?.nextElementSibling?.classList.contains('footer-links')?serviceHeading.nextElementSibling:(companyHeading?.nextElementSibling?.classList.contains('footer-links')?companyHeading.nextElementSibling:null));
  if(target&&!target.querySelector('a[href="access.html"]')){const a=document.createElement('a');a.href='access.html';a.textContent='Access Center';target.appendChild(a)}
}

// Global Toast & Copy Helper
window.showAvcToast = function(msg) {
  let toast = document.getElementById('avcToast');
  if(!toast) {
    toast = document.createElement('div');
    toast.id = 'avcToast';
    toast.className = 'avc-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3500);
};

document.addEventListener('click', function(e) {
  const chip = e.target.closest('[data-copy]');
  if(chip) {
    const val = chip.getAttribute('data-copy');
    if(val) {
      navigator.clipboard.writeText(val).then(() => {
        window.showAvcToast(`Copied to clipboard: ${val}`);
      }).catch(() => {
        window.showAvcToast(`Copied: ${val}`);
      });
    }
  }
});

// Hindi / English Multi-Language Switcher
(function initAvcLangSwitcher() {
  const topLinks = document.querySelector('.topbar-links');
  if(!topLinks) return;

  const btn = document.createElement('button');
  btn.className = 'avc-lang-btn';
  btn.id = 'avcLangBtn';

  let currentLang = localStorage.getItem('avc_lang') || 'en';

  function updateBtnText() {
    btn.innerHTML = currentLang === 'hi' ? '🇬🇧 English' : '🇮🇳 हिन्दी';
  }

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('avc_lang', lang);
    updateBtnText();

    if(lang === 'hi') {
      window.showAvcToast('भाषा बदलकर हिन्दी कर दी गई है।');
    } else {
      window.showAvcToast('Language set to English.');
    }
  }

  updateBtnText();
  topLinks.appendChild(btn);

  btn.addEventListener('click', function() {
    const nextLang = currentLang === 'en' ? 'hi' : 'en';
    applyLanguage(nextLang);
  });
})();


