(()=>{
  'use strict';

  const TOTAL_PAISE=177000;
  const API_CANDIDATES=[
    '',
    'https://api.assignmentvenuecentre.me',
    'https://live.assignmentvenuecentre.me'
  ];
  const RAZORPAY_SRC='https://checkout.razorpay.com/v1/checkout.js';
  let apiBase=null;
  let config=null;
  let razorpayPromise=null;

  const $=(sel,root=document)=>root.querySelector(sel);
  const $$=(sel,root=document)=>[...root.querySelectorAll(sel)];
  const form=$('#medical-booking-form');
  const payButton=$('#medical-pay-button');
  const gatewayState=$('#medical-gateway-state');
  const resultBox=$('#medical-result');
  const statusForm=$('#medical-status-form');
  const statusBox=$('#medical-status-result');
  const statusButton=$('#medical-status-button');
  const slipButton=$('#medical-slip-button');

  const setGateway=(kind,title,message)=>{
    if(!gatewayState)return;
    gatewayState.dataset.state=kind;
    gatewayState.innerHTML=`<strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>`;
  };

  const escapeHtml=(value)=>String(value??'').replace(/[&<>'"]/g,(ch)=>({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[ch]));

  const normalizeBase=(base)=>String(base||'').replace(/\/$/,'');
  const apiUrl=(base,path)=>`${normalizeBase(base)}${path}`;

  const fetchJson=async(base,path,options={})=>{
    const response=await fetch(apiUrl(base,path),{
      mode:base?'cors':'same-origin',
      credentials:'omit',
      cache:'no-store',
      referrerPolicy:'strict-origin-when-cross-origin',
      ...options,
      headers:{'Content-Type':'application/json',...(options.headers||{})}
    });
    const contentType=response.headers.get('content-type')||'';
    const body=contentType.includes('application/json')?await response.json():null;
    if(!response.ok){
      const detail=body?.detail||body?.message||`Request failed (${response.status})`;
      throw new Error(typeof detail==='string'?detail:'Request failed');
    }
    return body;
  };

  const resolveApi=async()=>{
    for(const candidate of API_CANDIDATES){
      try{
        const payload=await fetchJson(candidate,'/api/v1/gamca-medical/public/config',{method:'GET'});
        const data=payload?.data??payload;
        if(data && Number(String(data.total_inr||'0').replace(/,/g,''))===1770){
          apiBase=candidate;
          config=data;
          return true;
        }
      }catch(_err){ /* try next trusted AVC origin */ }
    }
    return false;
  };

  const loadRazorpay=()=>{
    if(window.Razorpay)return Promise.resolve(true);
    if(razorpayPromise)return razorpayPromise;
    razorpayPromise=new Promise((resolve)=>{
      const existing=document.querySelector(`script[src="${RAZORPAY_SRC}"]`);
      if(existing){
        existing.addEventListener('load',()=>resolve(true),{once:true});
        existing.addEventListener('error',()=>resolve(false),{once:true});
        return;
      }
      const script=document.createElement('script');
      script.src=RAZORPAY_SRC;
      script.async=true;
      script.onload=()=>resolve(true);
      script.onerror=()=>resolve(false);
      document.head.appendChild(script);
    });
    return razorpayPromise;
  };

  const formPayload=()=>{
    const data=new FormData(form);
    return {
      email:String(data.get('email')||'').trim(),
      phone:String(data.get('phone')||'').trim(),
      first_name:String(data.get('first_name')||'').trim(),
      last_name:String(data.get('last_name')||'').trim(),
      gender:String(data.get('gender')||'').trim(),
      date_of_birth:String(data.get('date_of_birth')||'').trim(),
      marital_status:String(data.get('marital_status')||'').trim(),
      passport_number:String(data.get('passport_number')||'').replace(/\s+/g,'').toUpperCase(),
      passport_issue_date:String(data.get('passport_issue_date')||'').trim(),
      passport_expiry_date:String(data.get('passport_expiry_date')||'').trim(),
      passport_issue_place:String(data.get('passport_issue_place')||'').trim(),
      traveling_country:String(data.get('traveling_country')||'').trim(),
      preferred_medical_city:String(data.get('preferred_medical_city')||'').trim(),
      visa_type:String(data.get('visa_type')||'').trim(),
      job_position:String(data.get('job_position')||'').trim(),
      consent:Boolean(data.get('consent'))
    };
  };

  const validateForm=(payload)=>{
    if(!form.reportValidity())return false;
    if(!payload.consent){alert('Please accept the service, privacy and refund terms before payment.');return false;}
    const issue=new Date(`${payload.passport_issue_date}T00:00:00`);
    const expiry=new Date(`${payload.passport_expiry_date}T00:00:00`);
    if(!(issue<expiry)){alert('Passport expiry date must be after issue date.');return false;}
    if(expiry<=new Date()){alert('Passport must be valid and not expired.');return false;}
    return true;
  };

  const populateOptions=()=>{
    const addOptions=(select,values)=>{
      if(!select||!Array.isArray(values))return;
      const selected=select.value;
      select.innerHTML='<option value="">Select</option>'+values.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
      if(values.includes(selected))select.value=selected;
    };
    addOptions($('#traveling_country'),config?.countries||['Saudi Arabia','Oman','UAE','Qatar','Kuwait','Bahrain']);
    addOptions($('#preferred_medical_city'),config?.cities||['Delhi','Mumbai','Patna','Lucknow','Hyderabad','Chennai','Kolkata']);
    addOptions($('#visa_type'),config?.visa_types||['Employment Visa','Work Visa','Family Visa','Visit Visa','Residence Visa']);
  };

  const init=async()=>{
    payButton.disabled=true;
    setGateway('checking','Connecting to secure AVC payment service','Verifying the private AVC medical API and Razorpay configuration.');
    const ok=await resolveApi();
    if(!ok){
      setGateway('blocked','Secure payment temporarily unavailable','No verified AVC medical API endpoint could be reached. No payment can be taken from this page right now.');
      return;
    }
    populateOptions();
    if(!config?.payment_enabled || !String(config?.razorpay_key_id||'').startsWith('rzp_')){
      setGateway('blocked','Razorpay configuration pending','The AVC backend is reachable, but live Razorpay checkout is not enabled on that backend.');
      return;
    }
    payButton.disabled=false;
    setGateway('ready','Secure Razorpay checkout ready','AVC service payment is fixed server-side at ₹1,770. Official Wafid/third-party cost is separate.');
  };

  payButton?.addEventListener('click',async()=>{
    const payload=formPayload();
    if(!validateForm(payload))return;
    if(!apiBase && apiBase!==''){
      setGateway('blocked','Payment unavailable','Secure AVC API connection is not ready.');
      return;
    }
    payButton.disabled=true;
    payButton.textContent='Creating secure order…';
    try{
      // No candidate/passport data is sent to Razorpay order notes/receipt.
      const order=await fetchJson(apiBase,'/api/v1/gamca-medical/public/order',{method:'POST',body:'{}'});
      if(Number(order.amount)!==TOTAL_PAISE || String(order.currency).toUpperCase()!=='INR'){
        throw new Error('Server payment amount verification failed.');
      }
      const loaded=await loadRazorpay();
      if(!loaded||!window.Razorpay)throw new Error('Razorpay checkout could not be loaded.');

      const rzp=new window.Razorpay({
        key:order.razorpay_key_id||config.razorpay_key_id,
        amount:order.amount,
        currency:'INR',
        name:'Assignment Venue Center',
        description:'AVC Wafid booking-assistance service (₹1,500 + GST)',
        order_id:order.order_id,
        prefill:{
          name:`${payload.first_name} ${payload.last_name}`.trim(),
          email:payload.email,
          contact:payload.phone
        },
        notes:{service:'AVC medical booking assistance'},
        theme:{color:'#0b1f3a'},
        handler:async(response)=>{
          try{
            setGateway('checking','Payment received — verifying','AVC is verifying the Razorpay signature and creating your private medical case.');
            const created=await fetchJson(apiBase,'/api/v1/gamca-medical/public/requests',{
              method:'POST',
              body:JSON.stringify({
                ...payload,
                razorpay_order_id:response.razorpay_order_id,
                razorpay_payment_id:response.razorpay_payment_id,
                razorpay_signature:response.razorpay_signature
              })
            });
            const ref=created.reference_code||created?.data?.reference_code||'';
            resultBox.hidden=false;
            resultBox.innerHTML=`<strong>Payment verified. Medical case created.</strong><p>AVC Reference: <code>${escapeHtml(ref)}</code></p><p>Status: ${escapeHtml(created.status||'PAID')}</p><p>Save this reference. AVC will now process the official Wafid booking manually and contact you if Wafid requires OTP/verification.</p><button type="button" class="button outline" data-copy-ref>Copy reference</button>`;
            $('[data-copy-ref]',resultBox)?.addEventListener('click',()=>navigator.clipboard?.writeText(ref));
            setGateway('ready','Payment verified','Your AVC medical case is now linked to the captured Razorpay payment.');
            form.reset();
            populateOptions();
          }catch(err){
            resultBox.hidden=false;
            resultBox.innerHTML=`<strong>Payment succeeded but case creation needs reconciliation.</strong><p>${escapeHtml(err.message||'Please contact AVC with your Razorpay Payment ID.')}</p><p>Razorpay Payment ID: <code>${escapeHtml(response.razorpay_payment_id||'')}</code></p>`;
            setGateway('blocked','Payment reconciliation required','Do not pay again. Contact AVC with the Razorpay Payment ID shown below.');
          }finally{
            payButton.disabled=false;
            payButton.textContent='Pay ₹1,770 securely with Razorpay';
          }
        },
        modal:{ondismiss:()=>{
          payButton.disabled=false;
          payButton.textContent='Pay ₹1,770 securely with Razorpay';
        }}
      });
      rzp.on('payment.failed',async(event)=>{
        try{
          await fetchJson(apiBase,'/api/v1/gamca-medical/public/payment-failures',{
            method:'POST',
            body:JSON.stringify({
              razorpay_order_id:event?.error?.metadata?.order_id||null,
              razorpay_payment_id:event?.error?.metadata?.payment_id||null,
              failure_code:event?.error?.code||null,
              failure_reason:event?.error?.reason||event?.error?.description||null
            })
          });
        }catch(_err){ /* no PII is persisted on failure either way */ }
        setGateway('ready','Payment not completed','No medical case was created. Review the details and retry when ready.');
      });
      rzp.open();
    }catch(err){
      setGateway('blocked','Could not start secure payment',err.message||'Please try again later.');
      payButton.disabled=false;
      payButton.textContent='Pay ₹1,770 securely with Razorpay';
    }
  });

  const getStatusCredentials=()=>({
    reference_code:String($('#status_reference')?.value||'').trim().toUpperCase(),
    passport_number:String($('#status_passport')?.value||'').replace(/\s+/g,'').toUpperCase()
  });

  statusForm?.addEventListener('submit',async(event)=>{
    event.preventDefault();
    const creds=getStatusCredentials();
    if(!creds.reference_code||!creds.passport_number)return;
    statusButton.disabled=true;
    statusBox.hidden=false;
    statusBox.innerHTML='<strong>Checking secure case status…</strong>';
    try{
      if(apiBase===null)await resolveApi();
      if(apiBase===null)throw new Error('AVC medical API is unavailable.');
      const response=await fetchJson(apiBase,'/api/v1/gamca-medical/public/status',{method:'POST',body:JSON.stringify(creds)});
      const data=response.data||response;
      statusBox.innerHTML=`<strong>${escapeHtml(data.status||'Status available')}</strong><p>Reference: <code>${escapeHtml(data.reference_code||creds.reference_code)}</code></p><p>${data.medical_center_name?`Medical center: ${escapeHtml(data.medical_center_name)}${data.medical_center_city?`, ${escapeHtml(data.medical_center_city)}`:''}`:'Medical center: pending official Wafid processing'}</p><p>${data.appointment_at?`Appointment: ${escapeHtml(new Date(data.appointment_at).toLocaleString())}`:'Appointment: pending'}</p><p>${data.wafid_slip_number?`Wafid slip/reference: ${escapeHtml(data.wafid_slip_number)}`:'Wafid slip/reference: pending'}</p><p>${data.result_status?`Result status: ${escapeHtml(data.result_status)}`:'Result status: check after medical completion'}</p>`;
      slipButton.hidden=!data.slip_available;
    }catch(err){
      statusBox.innerHTML=`<strong>Case could not be verified.</strong><p>${escapeHtml(err.message||'Check the reference and passport number.')}</p>`;
      slipButton.hidden=true;
    }finally{
      statusButton.disabled=false;
    }
  });

  slipButton?.addEventListener('click',async()=>{
    const creds=getStatusCredentials();
    slipButton.disabled=true;
    try{
      if(apiBase===null)await resolveApi();
      const response=await fetch(apiUrl(apiBase,'/api/v1/gamca-medical/public/slip'),{
        method:'POST',
        mode:apiBase?'cors':'same-origin',
        credentials:'omit',
        cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(creds)
      });
      if(!response.ok)throw new Error('Slip is not available yet.');
      const blob=await response.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      a.download=`AVC_Wafid_Slip_${creds.reference_code}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch(err){alert(err.message||'Unable to download slip.');}
    finally{slipButton.disabled=false;}
  });

  // Do not ingest sensitive values from URL params. Scrub legacy values if a
  // user arrives from an old link before any analytics script can use them.
  try{
    const url=new URL(location.href);
    let changed=false;
    ['passport','autopay','pay','checkout'].forEach((key)=>{
      if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true;}
    });
    if(changed)history.replaceState({},document.title,`${url.pathname}${url.search}${url.hash}`);
  }catch(_err){/* no-op */}

  init();
})();
