(()=>{
  const cfg=window.AVC_RAZORPAY_PAYMENT_PAGE||{};
  const buttons=[...document.querySelectorAll('[data-razorpay-page]')];
  const states=[...document.querySelectorAll('[data-payment-page-status]')];
  const valid=cfg.enabled===true&&typeof cfg.url==='string'&&/^https:\/\/(rzp\.io|pages\.razorpay\.com)\//i.test(cfg.url);
  for(const button of buttons){
    if(valid){
      button.disabled=false;
      button.classList.remove('payment-disabled');
      button.classList.add('button','primary');
      button.textContent='Pay ₹1,770 on Razorpay';
      button.addEventListener('click',()=>{
        window.dispatchEvent(new CustomEvent('avc:engagement',{detail:{kind:'razorpay_payment_page',source:location.pathname}}));
        location.href=cfg.url;
      });
    }else{
      button.disabled=true;
      button.classList.add('payment-disabled');
      button.textContent='Razorpay Payment Page activation pending';
    }
  }
  for(const state of states){
    state.innerHTML=valid
      ? '<strong>Razorpay Hosted Payment Page is active</strong><p>Payment and onboarding details are collected on Razorpay. AVC verifies the transaction record before starting the Wafid booking step.</p>'
      : '<strong>Hosted Payment Page URL not configured yet</strong><p>No payment can be collected from this button until the live Razorpay Payment Page URL is connected.</p>';
  }
})();
