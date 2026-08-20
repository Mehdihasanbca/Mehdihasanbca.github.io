(()=>{
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const base='https://assignmentvenuecentre.me/';
  const orgId=base+'#organization';
  const officialLogo=base+'assets/avc-logo.png';

  if(!document.documentElement.lang||document.documentElement.lang.toLowerCase()==='en')document.documentElement.lang='en-IN';

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

  const gridPages=new Set([
    'index.html','about.html','services.html','jobs.html','candidates.html','employers.html','partners.html',
    'trust-center.html','contact.html','resources.html','access.html','company-verification.html','office.html','media.html',
    'candidate-sourcing.html','application-coordination.html','cv-profile-support.html','document-guidance.html',
    'interview-coordination.html','employer-manpower-support.html','employer-requirement.html','partner-enquiry.html'
  ]);
  if(gridPages.has(path)){
    if(!document.querySelector('link[href*="avc-gridline.css"]')){
      const gridStyle=document.createElement('link');gridStyle.rel='stylesheet';gridStyle.href='assets/avc-gridline.css?v=20260813-g1';document.head.appendChild(gridStyle);
    }

    const uiAlreadyLoaded=window.__AVC_GRIDLINE_UI__||document.querySelector('script[src*="avc-gridline.js"]');
    if(!uiAlreadyLoaded){
      const ui=document.createElement('script');
      ui.src='assets/avc-gridline.js?v=20260818-t1';
      ui.defer=true;
      ui.dataset.avcGridlineLoader='true';
      document.head.appendChild(ui);
    }
  }

  const graph=[{
    '@type':['Organization','ProfessionalService'],'@id':orgId,name:'Assignment Venue Center',alternateName:'AVC',url:base,
    logo:{'@type':'ImageObject',url:officialLogo},image:officialLogo,email:'info@assignmentvenuecentre.me',telephone:'+91 9473286356',taxID:'10AOVPH3197L1ZI',
    identifier:[{'@type':'PropertyValue',name:'Udyam Registration',value:'UDYAM-BR-10-0047094'}],
    founder:{'@type':'Person',name:'Mehdi Hasan',jobTitle:'Founder & Business Head'},
    address:{'@type':'PostalAddress',streetAddress:'Ground Floor, Assignment Venue Center, Kamtaul Road, Madhupur, Tekatar',addressLocality:'Darbhanga',addressRegion:'Bihar',postalCode:'847306',addressCountry:'IN'},
    contactPoint:{'@type':'ContactPoint',telephone:'+91 9473286356',email:'info@assignmentvenuecentre.me',contactType:'business enquiries',areaServed:'IN'},
    description:'Candidate sourcing, recruitment support, application coordination, interview coordination, document readiness and manpower coordination.',
    sameAs:['https://www.youtube.com/@AssignmentvenueCentre','https://www.facebook.com/assignmentvenuecentre','https://www.linkedin.com/in/mehdihasan-avc/','https://whatsapp.com/channel/0029Vb7mJuWF1YlQJ0sKSn06']
  },{'@type':'WebSite','@id':base+'#website',url:base,name:'Assignment Venue Center',alternateName:'AVC',publisher:{'@id':orgId},inLanguage:'en-IN'}];

  const labels={
    'about.html':'About AVC','company-verification.html':'Company Verification','brochure.html':'Company Brochure','resources.html':'Resources & Tools','knowledge.html':'Knowledge & FAQ Center','candidate-readiness.html':'Candidate Readiness Checklist','services.html':'Services','candidate-sourcing.html':'Candidate Sourcing','application-coordination.html':'Application Coordination','cv-profile-support.html':'CV & Profile Support','document-guidance.html':'Document Guidance','interview-coordination.html':'Interview Coordination','employer-manpower-support.html':'Employer Manpower Support','jobs.html':'Jobs','access.html':'Access Center','candidates.html':'Candidates','employers.html':'Employers','employer-requirement.html':'Employer Requirement','partners.html':'Recruitment Partners','partner-enquiry.html':'Partner Enquiry','office.html':'Office & Interview Support','media.html':'Media & Official Channels','trust-center.html':'Trust Center','contact.html':'Contact & Support','fraud-safety.html':'Fraud Safety','privacy.html':'Privacy Policy','terms.html':'Terms','disclaimer.html':'Disclaimer'
  };
  if(labels[path])graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:base},{'@type':'ListItem',position:2,name:labels[path],item:base+path}]});

  if(!document.querySelector('script[data-avc-verified-schema]')){
    const script=document.createElement('script');script.type='application/ld+json';script.dataset.avcVerifiedSchema='true';script.text=JSON.stringify({'@context':'https://schema.org','@graph':graph});document.head.appendChild(script);
  }

  if(!document.querySelector('script[data-avc-public-routing]')){
    const routing=document.createElement('script');
    routing.src='assets/public-routing.js?v=20260815-r1';
    routing.defer=true;
    routing.dataset.avcPublicRouting='true';
    document.head.appendChild(routing);
  }
})();
