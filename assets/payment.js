(()=>{
  const cfg=window.AVC_PAYMENT_CONFIG||{};
  const status=document.querySelector('[data-payment-status]');
  const pay=document.querySelector('[data-razorpay-pay]');
  const trust=document.querySelector('[data-razorpay-trust-status]');
  const caseRef=(new URLSearchParams(location.search).get('case')||'').trim().toUpperCase();
  const CASE_RE=/^AVC-MED-[A-Z0-9-]{4,64}$/;
  const validCase=CASE_RE.test(caseRef);

  const setStatus=(title,body,type='pending')=>{
    if(!status)return;
    status.className='payment-state';
    status.dataset.state=type;
    status.innerHTML=`<strong>${title}</strong><p>${body}</p>`;
  };

  if(trust){
    trust.textContent=cfg.trustedBusinessClaimEnabled
      ?'Razorpay Trusted Business indicator enabled only after account eligibility is verified.'
      :'AVC does not currently claim Razorpay Trusted Business status on this page. If Razorpay enables the badge for the merchant account, the official indicator can appear in Razorpay Checkout.';
  }

  const configured=Boolean(cfg.checkoutEnabled&&cfg.razorpayKeyId&&cfg.orderEndpoint&&cfg.verifyEndpoint);
  const ready=Boolean(configured&&validCase);
  if(pay){
    pay.disabled=!ready;
    pay.setAttribute('aria-disabled',String(!ready));
    if(!configured){
      pay.classList.add('payment-disabled');
      pay.title='Secure online checkout is not activated yet.';
      setStatus('Online payment not active yet','Secure Razorpay checkout is still waiting for server-side activation.','pending');
    }else if(!validCase){
      pay.classList.add('payment-disabled');
      pay.title='A valid AVC medical case reference is required.';
      setStatus('AVC case reference required','For safety, the ₹1,770 AVC service payment opens only from a valid AVC medical case link such as AVC-MED-…. Contact AVC for your case reference. The official Wafid/third-party fee is not included in this Razorpay payment.','pending');
    }else{
      pay.classList.remove('payment-disabled');
      pay.textContent='Pay ₹1,770 securely with Razorpay';
      setStatus('Secure payment ready',`AVC case ${caseRef}: ₹1,500 service fee + ₹270 GST = ₹1,770. Wafid/third-party booking cost is separate.`,'ready');
    }
  }

  const loadCheckout=()=>new Promise((resolve,reject)=>{
    if(window.Razorpay)return resolve();
    const s=document.createElement('script');
    s.src='https://checkout.razorpay.com/v1/checkout.js';
    s.onload=resolve;s.onerror=()=>reject(new Error('Unable to load Razorpay Checkout'));
    document.head.appendChild(s);
  });

  pay?.addEventListener('click',async()=>{
    if(!ready)return;
    pay.disabled=true;
    setStatus('Preparing secure payment','Creating the server-verified ₹1,770 Razorpay order…');
    try{
      const response=await fetch(cfg.orderEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service:'wafid_booking_assistance',caseReference:caseRef})});
      if(!response.ok)throw new Error('Order creation failed');
      const order=await response.json();
      if(!order?.orderId||order?.amount!==177000||order?.currency!=='INR')throw new Error('Invalid order response');
      if(order?.breakdown?.wafidThirdPartyFeeIncluded!==false)throw new Error('Unexpected fee configuration');
      await loadCheckout();
      const rzp=new window.Razorpay({
        key:cfg.razorpayKeyId,
        order_id:order.orderId,
        amount:order.amount,
        currency:order.currency,
        name:'Assignment Venue Center',
        description:'AVC Wafid medical booking assistance service fee',
        image:'https://assignmentvenuecentre.me/assets/avc-logo.png',
        notes:{case_reference:caseRef},
        theme:{},
        handler:async payment=>{
          setStatus('Verifying payment','Payment completed in Razorpay Checkout. AVC is verifying the payment signature and amount server-side before marking the case paid.');
          const verify=await fetch(cfg.verifyEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({caseReference:caseRef,razorpay_payment_id:payment.razorpay_payment_id,razorpay_order_id:payment.razorpay_order_id,razorpay_signature:payment.razorpay_signature})});
          if(!verify.ok)throw new Error('Payment verification failed');
          const result=await verify.json();
          if(result?.verified!==true||result?.amountPaise!==177000)throw new Error('Payment could not be verified');
          setStatus('Payment verified',`₹1,770 AVC service payment verified for ${caseRef}. Keep the AVC case reference and Razorpay payment reference. Wafid/third-party cost remains separate.`,'ready');
          pay.disabled=true;
        },
        modal:{ondismiss:()=>{pay.disabled=false;setStatus('Payment not completed','Checkout was closed before verified payment completion. No booking should be processed as paid unless server verification confirms it.');}}
      });
      rzp.on('payment.failed',()=>{pay.disabled=false;setStatus('Payment failed','Razorpay reported that the payment did not complete. You may retry after checking the payment method.','blocked');});
      rzp.open();
    }catch(err){
      pay.disabled=false;
      setStatus('Payment unavailable',err?.message||'Unable to prepare secure payment. Please use official AVC support.','blocked');
    }
  });
})();
