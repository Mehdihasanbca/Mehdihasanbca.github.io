(()=>{
  const path=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const base='https://assignmentvenuecentre.me/';
  const orgId=base+'#organization';
  const graph=[{
    '@type':['Organization','ProfessionalService'],
    '@id':orgId,
    name:'Assignment Venue Center',
    alternateName:'AVC',
    url:base,
    logo:base+'assets/avc-logo.png',
    image:base+'assets/avc-logo-intro-poster.png',
    email:'info@assignmentvenuecentre.me',
    telephone:'+91 9162530999',
    taxID:'10AOVPH3197L1ZI',
    identifier:[{'@type':'PropertyValue',name:'Udyam Registration',value:'UDYAM-BR-10-0047094'}],
    founder:{'@type':'Person',name:'Mehdi Hasan',jobTitle:'Founder & Business Head'},
    address:{'@type':'PostalAddress',streetAddress:'Ground Floor, Assignment Venue Center, Kamtaul Road, Madhupur, Tekatar',addressLocality:'Darbhanga',addressRegion:'Bihar',postalCode:'847306',addressCountry:'IN'},
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
    publisher:{'@id':orgId},
    inLanguage:'en-IN'
  }];

  const labels={
    'about.html':'About AVC','company-verification.html':'Company Verification','services.html':'Services','candidate-sourcing.html':'Candidate Sourcing','application-coordination.html':'Application Coordination','cv-profile-support.html':'CV & Profile Support','document-guidance.html':'Document Guidance','interview-coordination.html':'Interview Coordination','employer-manpower-support.html':'Employer Manpower Support','jobs.html':'Jobs','candidates.html':'Candidates','employers.html':'Employers','partners.html':'Recruitment Partners','office.html':'Office & Interview Support','media.html':'Media & Official Channels','trust-center.html':'Trust Center','contact.html':'Contact & Support','fraud-safety.html':'Fraud Safety','privacy.html':'Privacy Policy','terms.html':'Terms','disclaimer.html':'Disclaimer'
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
