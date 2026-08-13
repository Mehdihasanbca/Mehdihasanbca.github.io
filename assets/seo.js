(()=>{
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const base='https://assignmentvenuecentre.me/';
  const orgId=base+'#organization';
  const officialLogo=base+'assets/avc-logo.png';

  // Keep public pages on the official AVC logo whenever an older presentation-poster
  // reference is still present in legacy page metadata or markup.
  document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]').forEach(meta=>{
    const value=meta.getAttribute('content')||'';
    if(value.includes('avc-logo-intro-poster.png'))meta.setAttribute('content',officialLogo);
  });
  document.querySelectorAll('meta[property="og:image:alt"]').forEach(meta=>{
    if((meta.getAttribute('content')||'').toLowerCase().includes('brand presentation'))meta.setAttribute('content','Assignment Venue Center official logo');
  });
  document.querySelectorAll('img[src*="avc-logo-intro-poster.png"]').forEach(img=>{
    img.src='assets/avc-logo.png';
    img.alt='Assignment Venue Center official logo';
  });

  // Secondary public-business pages use the same restrained visual language as the homepage.
  // Legal/payment/system pages are intentionally excluded so their functional layouts stay untouched.
  const humanPages=new Set([
    'about.html','services.html','candidates.html','employers.html','partners.html',
    'trust-center.html','contact.html','company-verification.html','office.html','media.html'
  ]);
  if(humanPages.has(path)){
    document.body.classList.add('human-business-page');
    if(!document.querySelector('link[href*="human-pages.css"]')){
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href='assets/human-pages.css?v=20260813';
      document.head.appendChild(link);
    }
    const topbarLabel=document.querySelector('.topbar-inner>span');
    if(topbarLabel)topbarLabel.textContent='Assignment Venue Center · Darbhanga, Bihar';
  }

  const replaceText=(selector,from,to)=>{
    document.querySelectorAll(selector).forEach(node=>{
      const text=node.textContent.trim();
      if(text===from)node.textContent=to;
    });
  };

  if(path==='about.html'){
    replaceText('.profile-heading p',"This profile explains AVC's public business role without presenting unsupported recruitment, visa or deployment claims.",'Here are the practical details candidates, employers and recruitment partners usually need before working with AVC.');
    replaceText('.scope-panel.boundary h3','AVC does not represent','Handled by the authorized recruitment process');
    replaceText('.profile-heading p','Actual vacancies vary by approved demand. These are focus markets and job families, not a claim that every category is currently open.','Vacancies vary by employer demand. These are the markets and job families AVC most often supports.');
    replaceText('.profile-heading h2','Business leadership.','Leadership and day-to-day direction.');
  }

  if(path==='services.html'){
    replaceText('.business-hero .lead','Assignment Venue Center supports candidate sourcing, applications, profile readiness, interviews, documents and manpower coordination. AVC does not present support activity as a guarantee of selection, visa or deployment.','Assignment Venue Center supports candidate sourcing, applications, profile readiness, interviews, documents and manpower coordination. Each service is designed to keep candidates and recruitment stakeholders aligned on the next step.');
    replaceText('.business-heading p',"Each service page explains what AVC does, what information is needed and where AVC's responsibility ends.",'Each service page explains what AVC does, what information is needed and how the work moves forward.');
    replaceText('.business-section.alt .section-kicker','Responsibility boundary','Overseas processing');
    replaceText('.business-section.alt h2','Support is not the same as overseas recruitment authorization.','Recruitment support and overseas processing have separate responsibilities.');
  }

  if(path==='candidates.html'){
    replaceText('.process-step p','Your profile may be reviewed against suitable verified manpower requirements.','Your profile may be reviewed against suitable available manpower requirements.');
    replaceText('.profile-card p',"Reviewed public job updates through AVC's website and official WhatsApp Channel.","Current job updates through AVC's website and official WhatsApp Channel.");
    replaceText('.profile-heading .section-kicker','Prepare responsibly','Before you apply');
    replaceText('.profile-heading h2','Typical information you may be asked to keep ready.','What to keep ready before applying.');
  }

  if(path==='employers.html'){
    replaceText('.scope-panel.boundary h3','Process / authorization details','Processing details');
    replaceText('.scope-panel.boundary li','Deployment timeline should be presented as an estimate, not a guarantee','Expected deployment timeline and known dependencies');
    replaceText('.profile-heading p','Sector availability depends on actual employer and authorized recruitment requirements.','Sector coverage follows the manpower requirements received from employers and recruitment partners.');
  }

  if(path==='partners.html'){
    replaceText('.about-hero .lead','AVC works with recruitment stakeholders on candidate sourcing, demand communication, interview coordination and documentation readiness while keeping legal recruitment responsibilities with the properly authorized parties.','AVC works with recruitment stakeholders on candidate sourcing, demand communication, interview coordination and document readiness, with each party\'s role agreed clearly from the start.');
    replaceText('.scope-panel.boundary h3','AVC working principles','How AVC prefers to work');
    replaceText('.scope-panel.boundary li','No fabricated demand, employer identity or visa claim','Job and employer details should come from the actual requirement');
    replaceText('.scope-panel.boundary li','No guaranteed selection or deployment statement','Selection and deployment expectations should be communicated accurately');
    replaceText('.scope-panel.boundary li','No bypass of clearly documented recruitment responsibility','Agreed recruitment responsibilities should be respected');
    replaceText('.profile-section.alt .section-kicker','Public compliance position','Recruitment responsibility');
    replaceText('.profile-section.alt .profile-heading h2','AVC does not replace a legally required Recruiting Agent.','Licensed recruitment responsibilities stay with the authorized party.');
  }

  if(path==='trust-center.html'){
    replaceText('.trust-hero .lead',"AVC's Trust Center explains the company's verified public identity, business registrations, official channels, vacancy-verification rules and the responsibility boundary for overseas recruitment.","Use this page to check AVC's business identity, registrations, contact details, vacancy information and the responsible parties in an overseas recruitment process.");
    replaceText('.trust-heading h2','What AVC does — and what AVC does not claim to do.','AVC support and overseas recruitment responsibilities.');
  }

  const graph=[{
    '@type':['Organization','ProfessionalService'],
    '@id':orgId,
    name:'Assignment Venue Center',
    alternateName:'AVC',
    url:base,
    logo:{'@type':'ImageObject',url:officialLogo},
    image:officialLogo,
    email:'info@assignmentvenuecentre.me',
    telephone:'+91 9473286356',
    taxID:'10AOVPH3197L1ZI',
    identifier:[{'@type':'PropertyValue',name:'Udyam Registration',value:'UDYAM-BR-10-0047094'}],
    founder:{'@type':'Person',name:'Mehdi Hasan',jobTitle:'Founder & Business Head'},
    address:{'@type':'PostalAddress',streetAddress:'Ground Floor, Assignment Venue Center, Kamtaul Road, Madhupur, Tekatar',addressLocality:'Darbhanga',addressRegion:'Bihar',postalCode:'847306',addressCountry:'IN'},
    contactPoint:{'@type':'ContactPoint',telephone:'+91 9473286356',email:'info@assignmentvenuecentre.me',contactType:'business enquiries',areaServed:'IN'},
    description:'Recruitment support, candidate sourcing, application coordination, CV/profile support, document readiness, interview coordination and manpower coordination.',
    sameAs:[
      'https://www.youtube.com/@AssignmentvenueCentre',
      'https://www.facebook.com/assignmentvenuecentre',
      'https://www.linkedin.com/in/mehdihasan-avc/',
      'https://whatsapp.com/channel/0029Vb7mJuWF1YlQJ0sKSn06'
    ]
  },{
    '@type':'WebSite',
    '@id':base+'#website',
    url:base,
    name:'Assignment Venue Center',
    alternateName:'AVC',
    publisher:{'@id':orgId},
    inLanguage:'en-IN'
  }];

  const labels={
    'about.html':'About AVC','company-verification.html':'Company Verification','brochure.html':'Company Brochure','resources.html':'Resources & Tools','knowledge.html':'Knowledge & FAQ Center','medical-booking.html':'Wafid Medical Booking Assistance','payment-trust.html':'Payment Trust Center','payment-refund.html':'Payment & Refund Policy','candidate-readiness.html':'Candidate Readiness Checklist','services.html':'Services','candidate-sourcing.html':'Candidate Sourcing','application-coordination.html':'Application Coordination','cv-profile-support.html':'CV & Profile Support','document-guidance.html':'Document Guidance','interview-coordination.html':'Interview Coordination','employer-manpower-support.html':'Employer Manpower Support','jobs.html':'Jobs','access.html':'Access Center','candidates.html':'Candidates','employers.html':'Employers','employer-requirement.html':'Employer Requirement','partners.html':'Recruitment Partners','partner-enquiry.html':'Partner Enquiry','office.html':'Office & Interview Support','media.html':'Media & Official Channels','trust-center.html':'Trust Center','contact.html':'Contact & Support','fraud-safety.html':'Fraud Safety','privacy.html':'Privacy Policy','terms.html':'Terms','disclaimer.html':'Disclaimer'
  };
  if(labels[path]){
    graph.push({
      '@type':'BreadcrumbList',
      itemListElement:[
        {'@type':'ListItem',position:1,name:'Home',item:base},
        {'@type':'ListItem',position:2,name:labels[path],item:base+path}
      ]
    });
  }

  const script=document.createElement('script');
  script.type='application/ld+json';
  script.dataset.avcVerifiedSchema='true';
  script.text=JSON.stringify({'@context':'https://schema.org','@graph':graph});
  document.head.appendChild(script);
})();
