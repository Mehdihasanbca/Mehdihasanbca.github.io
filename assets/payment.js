(()=>{
  const cfg=window.AVC_PAYMENT_CONFIG||{};
  const status=document.querySelector('[data-payment-status]');
  const pay=document.querySelector('[data-razorpay-pay]');
  const trust=document.querySelector('[data-razorpay-trust-status]');
  const caseRef=new URLSearchParams(location.search).get('case')||'';

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

  const ready=Boolean(cfg.checkoutEnabled&&cfg.razorpayKeyId&&cfg.orderEndpoint&&cfg.verifyEndpoint);
  if(pay){
    pay.disabled=!ready;
    pay.setAttribute('aria-disabled',String(!ready));
    if(!ready){
      pay.classList.add('payment-disabled');
      pay.title='Secure online checkout is not activated yet.';
      setStatus('Online payment not active yet','The AVC payment foundation is ready, but real payments remain disabled until the Razorpay public Key ID and secure server-side order/verification endpoints are configured.','pending');
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
    setStatus('Preparing secure payment','Creating a server-verified Razorpay order…');
    try{
      const response=await fetch(cfg.orderEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service:'wafid_booking_assistance',caseReference:caseRef})});
      if(!response.ok)throw new Error('Order creation failed');
      const order=await response.json();
      if(!order?.orderId||!Number.isInteger(order?.amount)||!order?.currency)throw new Error('Invalid order response');
      await loadCheckout();
      const rzp=new window.Razorpay({
        key:cfg.razorpayKeyId,
        order_id:order.orderId,
        amount:order.amount,
        currency:order.currency,
        name:'Assignment Venue Center',
        description:order.description||'Medical booking assistance',
        image:'https://assignmentvenuecentre.me/assets/avc-logo.png',
        notes:{case_reference:caseRef.slice(0,80)},
        theme:{},
        handler:async payment=>{
          setStatus('Verifying payment','Payment was completed in Checkout. AVC is verifying the Razorpay signature server-side before marking the case paid.');
          const verify=await fetch(cfg.verifyEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({caseReference:caseRef,razorpay_payment_id:payment.razorpay_payment_id,razorpay_order_id:payment.razorpay_order_id,razorpay_signature:payment.razorpay_signature})});
          if(!verify.ok)throw new Error('Payment verification failed');
          const result=await verify.json();
          if(result?.verified!==true)throw new Error('Payment could not be verified');
          setStatus('Payment verified','Razorpay payment verification is complete. Keep the AVC case reference and Razorpay payment reference for your records.','ready');
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
