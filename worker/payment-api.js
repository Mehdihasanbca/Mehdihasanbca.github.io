const ALLOWED_ORIGINS=new Set(['https://assignmentvenuecentre.me','https://www.assignmentvenuecentre.me']);
const CASE_RE=/^AVC-MED-[A-Z0-9-]{4,64}$/;
const AVC_SERVICE_BASE_PAISE=150000;
const AVC_GST_RATE=18;
const AVC_GST_PAISE=27000;
const AVC_SERVICE_TOTAL_PAISE=177000;
const WEBHOOK_EVENTS=new Set(['payment.authorized','payment.captured','payment.failed','order.paid']);
const json=(data,status=200,origin='')=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...(origin&&ALLOWED_ORIGINS.has(origin)?{'access-control-allow-origin':origin,'vary':'Origin'}:{})}});
const cors=(origin)=>new Response(null,{status:204,headers:{...(ALLOWED_ORIGINS.has(origin)?{'access-control-allow-origin':origin}:{'access-control-allow-origin':'https://assignmentvenuecentre.me'}),'access-control-allow-methods':'POST,GET,OPTIONS','access-control-allow-headers':'Content-Type,X-Razorpay-Signature','access-control-max-age':'86400','vary':'Origin'}});
const b64=(s)=>btoa(unescape(encodeURIComponent(s)));
const auth=(env)=>`Basic ${b64(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)}`;
const enc=new TextEncoder();
async function hmac(secret,text){const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const sig=await crypto.subtle.sign('HMAC',key,enc.encode(text));return [...new Uint8Array(sig)].map(b=>b.toString(16).padStart(2,'0')).join('');}
function safeEqual(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0;}
function configured(env){return Boolean(env.RAZORPAY_KEY_ID&&env.RAZORPAY_KEY_SECRET);}
async function razorpayGet(path,env){const r=await fetch(`https://api.razorpay.com/v1/${path}`,{headers:{authorization:auth(env)}});const data=await r.json().catch(()=>({}));return {ok:r.ok,status:r.status,data};}
async function validateOrder(orderId,env){if(!/^order_[A-Za-z0-9]+$/.test(String(orderId||'')))return {ok:false};const out=await razorpayGet(`orders/${encodeURIComponent(orderId)}`,env);const o=out.data||{};const caseReference=String(o.receipt||'').trim().toUpperCase();const ok=out.ok&&o.id===orderId&&Number(o.amount)===AVC_SERVICE_TOTAL_PAISE&&o.currency==='INR'&&CASE_RE.test(caseReference);return {ok,order:o,caseReference};}
async function validatePayment(paymentId,env){if(!/^pay_[A-Za-z0-9]+$/.test(String(paymentId||'')))return {ok:false};const out=await razorpayGet(`payments/${encodeURIComponent(paymentId)}`,env);const p=out.data||{};if(!out.ok||p.id!==paymentId||Number(p.amount)!==AVC_SERVICE_TOTAL_PAISE||p.currency!=='INR'||!p.order_id)return {ok:false};const order=await validateOrder(p.order_id,env);return {ok:order.ok,payment:p,order:order.order,caseReference:order.caseReference};}
async function createOrder(req,env,origin){
  if(!configured(env))return json({error:'payment_not_configured'},503,origin);
  let body;try{body=await req.json()}catch{return json({error:'invalid_json'},400,origin)};
  const service=String(body?.service||'');
  const caseReference=String(body?.caseReference||'').trim().toUpperCase();
  if(service!=='wafid_booking_assistance')return json({error:'unsupported_service'},400,origin);
  if(!CASE_RE.test(caseReference))return json({error:'invalid_case_reference'},400,origin);
  const payload={amount:AVC_SERVICE_TOTAL_PAISE,currency:'INR',receipt:caseReference,notes:{service:'wafid_booking_assistance',case_reference:caseReference,merchant:'Assignment Venue Center',avc_service_base_paise:String(AVC_SERVICE_BASE_PAISE),gst_rate_percent:String(AVC_GST_RATE),gst_paise:String(AVC_GST_PAISE),wafid_third_party_fee_included:'no'}};
  const r=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{authorization:auth(env),'content-type':'application/json'},body:JSON.stringify(payload)});
  const data=await r.json().catch(()=>({}));
  if(!r.ok||!data.id)return json({error:'razorpay_order_failed'},502,origin);
  return json({orderId:data.id,amount:data.amount,currency:data.currency,description:'AVC Wafid medical booking assistance service fee',caseReference,breakdown:{serviceBasePaise:AVC_SERVICE_BASE_PAISE,gstRate:AVC_GST_RATE,gstPaise:AVC_GST_PAISE,totalPaise:AVC_SERVICE_TOTAL_PAISE,wafidThirdPartyFeeIncluded:false}},200,origin);
}
async function verifyPayment(req,env,origin){
  if(!configured(env))return json({verified:false,error:'payment_not_configured'},503,origin);
  let body;try{body=await req.json()}catch{return json({verified:false,error:'invalid_json'},400,origin)};
  const caseReference=String(body?.caseReference||'').trim().toUpperCase();
  const paymentId=String(body?.razorpay_payment_id||'');
  const orderId=String(body?.razorpay_order_id||'');
  const signature=String(body?.razorpay_signature||'');
  if(!CASE_RE.test(caseReference)||!/^pay_[A-Za-z0-9]+$/.test(paymentId)||!/^order_[A-Za-z0-9]+$/.test(orderId)||!/^[a-f0-9]{64}$/i.test(signature))return json({verified:false,error:'invalid_payment_payload'},400,origin);
  const expected=await hmac(env.RAZORPAY_KEY_SECRET,`${orderId}|${paymentId}`);
  if(!safeEqual(expected.toLowerCase(),signature.toLowerCase()))return json({verified:false,error:'signature_mismatch'},400,origin);
  const checked=await validatePayment(paymentId,env);
  const p=checked.payment||{};
  const verified=checked.ok&&p.order_id===orderId&&checked.caseReference===caseReference&&['authorized','captured'].includes(p.status);
  if(!verified)return json({verified:false,error:'razorpay_payment_not_confirmed'},400,origin);
  return json({verified:true,paymentId,orderId,status:p.status,caseReference,amountPaise:AVC_SERVICE_TOTAL_PAISE},200,origin);
}
async function webhook(req,env){
  if(!configured(env))return json({error:'payment_not_configured'},503);
  const raw=await req.text();
  let signatureVerified=false;
  if(env.RAZORPAY_WEBHOOK_SECRET){
    const signature=req.headers.get('x-razorpay-signature')||'';
    if(!/^[a-f0-9]{64}$/i.test(signature))return json({error:'missing_or_invalid_webhook_signature'},400);
    const expected=await hmac(env.RAZORPAY_WEBHOOK_SECRET,raw);
    if(!safeEqual(expected.toLowerCase(),signature.toLowerCase()))return json({error:'invalid_webhook_signature'},400);
    signatureVerified=true;
  }
  let event;try{event=JSON.parse(raw)}catch{return json({error:'invalid_webhook_json'},400)};
  const eventName=String(event?.event||'');
  if(!WEBHOOK_EVENTS.has(eventName))return json({ok:true,ignored:true,event:eventName},200);
  const paymentEntity=event?.payload?.payment?.entity||null;
  const orderEntity=event?.payload?.order?.entity||null;
  let checked={ok:false};
  if(paymentEntity?.id)checked=await validatePayment(String(paymentEntity.id),env);
  else if(orderEntity?.id)checked=await validateOrder(String(orderEntity.id),env);
  if(!checked.ok)return json({error:'webhook_entity_not_verified',event:eventName},400);
  const p=checked.payment||{};const o=checked.order||{};
  if(eventName==='payment.captured'&&p.id&&p.status!=='captured')return json({error:'payment_not_captured'},409);
  if(eventName==='payment.authorized'&&p.id&&!['authorized','captured'].includes(p.status))return json({error:'payment_not_authorized'},409);
  if(eventName==='payment.failed'&&p.id&&p.status!=='failed')return json({error:'payment_not_failed'},409);
  if(eventName==='order.paid'&&o.id&&o.status!=='paid')return json({error:'order_not_paid'},409);
  return json({ok:true,verified:true,event:eventName,caseReference:checked.caseReference,verification:signatureVerified?'hmac_and_razorpay_api':'razorpay_api_revalidation'},200);
}
export default{async fetch(req,env){
  const url=new URL(req.url);const origin=req.headers.get('origin')||'';
  if(req.method==='OPTIONS')return cors(origin);
  if(origin&&!ALLOWED_ORIGINS.has(origin)&&url.pathname!=='/api/payments/health')return json({error:'origin_not_allowed'},403);
  if(url.pathname==='/api/payments/health'&&req.method==='GET')return json({ok:true,service:'avc-payment-api',razorpayConfigured:configured(env),tariffConfigured:true,serviceBasePaise:AVC_SERVICE_BASE_PAISE,gstRate:AVC_GST_RATE,gstPaise:AVC_GST_PAISE,totalPaise:AVC_SERVICE_TOTAL_PAISE,wafidThirdPartyFeeIncluded:false,webhookConfigured:true,webhookSecretConfigured:Boolean(env.RAZORPAY_WEBHOOK_SECRET),webhookVerificationMode:env.RAZORPAY_WEBHOOK_SECRET?'hmac_and_api':'api_revalidation'});
  if(url.pathname==='/api/payments/order'&&req.method==='POST')return createOrder(req,env,origin);
  if(url.pathname==='/api/payments/verify'&&req.method==='POST')return verifyPayment(req,env,origin);
  if(url.pathname==='/api/payments/webhook'&&req.method==='POST')return webhook(req,env);
  return json({error:'not_found'},404,origin);
}};
