# AVC Razorpay Medical Payment Activation

This document defines the production-safe activation path for AVC Wafid/GAMCA medical booking assistance payments.

## Current public state

- Payment Trust Center: public.
- Medical Booking Assistance: public.
- Payment & Refund Policy: public.
- Razorpay client foundation: present but disabled.
- Live checkout: **disabled** until secure backend configuration is complete.
- Razorpay Trusted Business status: **not claimed** unless Razorpay actually enables the account/transaction indicator.
- Razorpay Buyer Protection / Money Back Promise: **not claimed** unless the relevant Razorpay program marks the transaction eligible.

## Secrets policy

Never commit or expose any of the following in this public repository:

- Razorpay Key Secret
- Razorpay webhook secret
- database credentials
- service-account private keys
- customer card/PIN/CVV/UPI PIN/OTP data

Razorpay Key ID (`rzp_test_...` or `rzp_live_...`) is a public identifier and may be used by the browser only after the backend is ready.

## Required backend contract

The static GitHub Pages site cannot safely create Razorpay Orders by itself. A separate HTTPS backend/serverless service is required.

### POST /payments/razorpay/order

Input from browser:

```json
{
  "service": "wafid_booking_assistance",
  "caseReference": "AVC-MED-..."
}
```

Server responsibilities:

1. Authenticate/validate the AVC medical case.
2. Confirm that the case is payable and not already paid.
3. Load the approved amount **from the server-side case record**. Never accept the amount supplied by the browser.
4. Create a Razorpay Order using the server-held Key ID + Key Secret.
5. Store the Razorpay order ID against the AVC case.
6. Return only the minimum browser-safe values:

```json
{
  "orderId": "order_...",
  "amount": 12345,
  "currency": "INR",
  "description": "Wafid medical booking assistance"
}
```

### POST /payments/razorpay/verify

Input from Razorpay Checkout handler:

```json
{
  "caseReference": "AVC-MED-...",
  "razorpay_payment_id": "pay_...",
  "razorpay_order_id": "order_...",
  "razorpay_signature": "..."
}
```

Server responsibilities:

1. Load the expected Razorpay order ID from the server-side case record.
2. Verify the Razorpay signature with HMAC-SHA256 using the Key Secret.
3. Use a timing-safe comparison.
4. Store the payment ID idempotently to prevent duplicate fulfilment.
5. Mark the medical case paid only after successful verification and/or verified Razorpay order/payment state.
6. Return:

```json
{"verified": true}
```

## Webhook

Create a separate HTTPS Razorpay webhook endpoint and configure a strong webhook secret in the Razorpay Dashboard. Recommended payment automation should use relevant events such as `order.paid` and reconcile late/duplicate events idempotently.

Webhook responsibilities:

- verify webhook signature before processing;
- reject unknown/mismatched orders;
- handle duplicate deliveries idempotently;
- never trust arbitrary client amount/status;
- update payment/case state only from validated Razorpay data.

## Public config activation

Only after the backend has been deployed and tested, update `assets/payment-config.js`:

```js
window.AVC_PAYMENT_CONFIG=Object.freeze({
  mode:'live',
  checkoutEnabled:true,
  trustedBusinessClaimEnabled:false,
  razorpayKeyId:'rzp_live_REAL_PUBLIC_KEY_ID',
  orderEndpoint:'https://SECURE_BACKEND/payments/razorpay/order',
  verifyEndpoint:'https://SECURE_BACKEND/payments/razorpay/verify',
  webhookManagedServerSide:true,
  supportEmail:'info@assignmentvenuecentre.me',
  supportPhone:'+91 9473286356'
});
```

Do not set `trustedBusinessClaimEnabled:true` merely because Razorpay is the payment gateway. Enable trust claims only after the Razorpay Dashboard/account status and current official integration instructions are verified.

## Wafid operating flow

1. AVC creates/approves a medical case reference.
2. Candidate sees the current third-party/Wafid cost and AVC assistance charge separately.
3. Candidate pays through server-created Razorpay Checkout.
4. AVC backend verifies payment.
5. Operator performs the required Wafid booking step on the official Wafid system.
6. Operator records Wafid booking/slip reference against the AVC case.
7. Candidate receives the official next-step/slip information.

AVC does not collect or store card PIN, CVV, UPI PIN, internet banking password or Razorpay payment OTP.

## Go-live checklist

- [ ] Razorpay KYC/live payments enabled.
- [ ] Test Key ID/Secret stored only in backend secrets.
- [ ] Test Order API works.
- [ ] Checkout handler works.
- [ ] Server signature verification tested.
- [ ] Webhook secret/signature validation tested.
- [ ] Duplicate payment/idempotency test passes.
- [ ] Failed and cancelled checkout states tested.
- [ ] Refund path tested in Test Mode where supported.
- [ ] Live Key ID/Secret moved to backend secrets.
- [ ] HTTPS backend/webhook URL confirmed.
- [ ] Payment/refund policy reviewed for actual AVC fee structure.
- [ ] Razorpay Trusted Business eligibility checked in Dashboard.
- [ ] Money Back Promise / Buyer Protection is not advertised unless actually enabled/eligible.
- [ ] `assets/payment-config.js` switched to live only after all gates pass.
