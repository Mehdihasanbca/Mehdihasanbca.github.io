# AVC Razorpay Hosted Payment Page — Live Configuration

Razorpay documents Payment Pages as a Dashboard-created hosted product. Create and publish this page in Razorpay **Live Mode**. The public AVC website only links to the published Razorpay URL; no Razorpay Key Secret is required in the website.

## Page

- Mode: `Live`
- Title: `AVC Medical Booking Assistance`
- Description: `Assignment Venue Center (AVC) Wafid/GAMCA medical booking assistance service. AVC service fee is ₹1,500 plus 18% GST. Official Wafid/third-party booking cost is separate and handled at actual cost where applicable.`
- Contact email: `info@assignmentvenuecentre.me`
- Contact phone: `+91 9473286356`
- Theme/logo: use the official AVC brand already configured in Razorpay.
- Pay button label: `Pay ₹1,770` or the closest Razorpay-supported label.

## Price field

- Amount type: `Fixed Amount`
- Label: `AVC Wafid Medical Booking Assistance`
- Currency: `INR`
- Amount: `1770`
- Mandatory: `Yes`
- Description: `₹1,500 AVC service fee + ₹270 GST. Wafid official/third-party fee is not included.`

Do not use `Customer Decides Amount` for this service.

## Customer/onboarding fields

Razorpay Payment Pages include mandatory `Email` and `Phone` fields by default. Add the following custom input fields as `Single Line Text` fields unless Razorpay offers a more appropriate native field type:

1. `Full Name as per Passport` — mandatory
2. `Passport Number` — mandatory for the medical-booking case
3. `Nationality` — mandatory
4. `GCC Destination Country` — mandatory
5. `Current City / Medical City` — mandatory
6. `Profession / Trade` — mandatory
7. `AVC Case Reference` — optional when no case has been issued yet

### Sensitive-data rule

- Candidate must enter the passport number directly on the Razorpay-hosted Payment Page.
- **Never pre-populate a passport number or other sensitive identity value in a Razorpay Payment Page URL/query string.**
- Do not place passport number, card details, CVV, PIN, UPI PIN, banking password or OTP in analytics events, website URLs, email subject lines or public logs.
- AVC website must not collect payment-card credentials.

## Terms & candidate authorization

Use the Razorpay Payment Page `Terms & Conditions` area with the following text:

`The ₹1,770 payment is for Assignment Venue Center (AVC) medical booking-assistance service only (₹1,500 service fee + ₹270 GST). Official Wafid/third-party booking charges are separate and are handled at actual cost where applicable. By proceeding, I confirm that the onboarding information I provide is accurate and I authorize AVC to use the submitted identity and booking details only for payment reconciliation, Wafid/GAMCA medical booking assistance, related support and legally required records. Payment does not guarantee medical fitness, visa approval, recruitment selection or overseas deployment. Refund treatment is governed by the AVC Payment & Refund Policy at https://assignmentvenuecentre.me/payment-refund.html and privacy handling is described at https://assignmentvenuecentre.me/privacy.html.`

## Receipt

Enable Razorpay automated receipts.

Receipt/reconciliation preference:

- Primary customer identifier: `Full Name as per Passport`
- Secondary identifier: `AVC Case Reference`, when present
- Always retain Razorpay `Payment ID` in the transaction record.

Do not put the passport number in a public-facing receipt title or external message subject.

## Successful-payment action

Under `Action after successful payment`, select `Redirect to your website` and use:

`https://assignmentvenuecentre.me/payment-confirmation.html`

The confirmation page is a follow-up page only. Redirecting to it must **not** be treated as proof that payment is captured.

## Publish

Use `Save and Publish` in Razorpay Live Mode. Copy the published official Razorpay URL. Accepted AVC website link hosts are:

- `https://rzp.io/...`
- `https://pages.razorpay.com/...`

Then update `assets/payment-page-config.js`:

- `enabled:true`
- `url:'<LIVE RAZORPAY PAYMENT PAGE URL>'`

Do not put Razorpay Key Secret, webhook secret, Cloudflare token or any candidate personal value in this config file.

## Operational confirmation before Wafid booking

In Razorpay `Payment Pages → AVC Medical Booking Assistance → Transaction Details`, staff must verify:

- transaction/payment status is successful/captured
- total collected for the AVC service is exactly `₹1,770`
- Email and Phone are present
- required onboarding fields are present and readable
- candidate/case identity matches the booking request
- payment is not an obvious duplicate

A screenshot, redirect page or WhatsApp message alone is not final payment confirmation.

## Wafid cost

The `₹1,770` Razorpay Payment Page amount is only the AVC service fee plus GST. The official Wafid/third-party amount remains separately identified and handled at actual cost where applicable.

## Webhooks

Webhooks are optional for the first hosted-page release because staff can reconcile payments from Razorpay Payment Page Transaction Details. If automated reconciliation is added later, configure the webhook in Razorpay Dashboard and verify signatures server-side before changing any case status.
