# AVC Razorpay Hosted Payment Page — Live Configuration

This page is intentionally created in the Razorpay Dashboard because Razorpay documents Payment Pages as a Dashboard/WYSIWYG product rather than a public merchant API.

## Page

- Mode: Live
- Title: `AVC Medical Booking Assistance`
- Description: `Assignment Venue Center (AVC) Wafid/GAMCA medical booking assistance service. AVC service fee is ₹1,500 plus 18% GST. Official Wafid/third-party booking cost is separate and handled at actual cost where applicable.`
- Contact email: `info@assignmentvenuecentre.me`
- Contact phone: `+91 9473286356`
- Theme: use the current AVC brand settings/logo already configured in Razorpay.

## Price field

- Type: Fixed Amount
- Label: `AVC Wafid Medical Booking Assistance`
- Currency: INR
- Amount: `1770`
- Mandatory: Yes
- Description: `₹1,500 AVC service fee + ₹270 GST. Wafid official/third-party fee is not included.`

## Customer/onboarding fields

Razorpay already requires Email and Phone. Add these custom input fields and mark them mandatory unless noted:

1. `Full Name as per Passport`
2. `Passport Number`
3. `Nationality`
4. `GCC Destination Country`
5. `Current City / Medical City`
6. `Profession / Trade`
7. `AVC Case Reference` — optional when no case has been issued yet

Do not ask for card PIN, CVV, UPI PIN, internet-banking password or payment OTP in any custom field.

## Terms text

Use the Payment Page Terms & Conditions section to state:

`The ₹1,770 payment is for AVC medical booking-assistance service only (₹1,500 service fee + ₹270 GST). Official Wafid/third-party booking charges are separate and are handled at actual cost where applicable. Payment does not guarantee medical fitness, visa approval, recruitment selection or overseas deployment. Candidate details must be accurate. Refund treatment is governed by the AVC Payment & Refund Policy at https://assignmentvenuecentre.me/payment-refund.html.`

## Receipt

Enable Razorpay automated receipts. If Razorpay allows one custom field on the receipt, use `Full Name as per Passport` or `AVC Case Reference`.

## Successful-payment action

Select `Redirect to your website` and set:

`https://assignmentvenuecentre.me/payment-confirmation.html`

## After publishing

Copy the live Payment Page URL. It should be an official Razorpay hosted URL such as `https://rzp.io/l/...` or `https://pages.razorpay.com/...`.

Connect that URL in `assets/payment-page-config.js` by setting:

- `enabled:true`
- `url:'<LIVE RAZORPAY PAYMENT PAGE URL>'`

Do not put Razorpay Key Secret or webhook secret in this file.

## Operational confirmation

Before Wafid booking starts, staff should verify in Razorpay Payment Page Transaction Details:

- payment is successful/captured
- total amount is ₹1,770
- email and phone are present
- required onboarding input fields are present
- payment belongs to the correct candidate/case

A screenshot alone is not final confirmation.
