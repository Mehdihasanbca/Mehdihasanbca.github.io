# Assignment Venue Center public website

Production source for **https://assignmentvenuecentre.me/**.

## Public UI architecture

- Shared base: `assets/site.css`, `assets/company.css`, `assets/phase8.css`
- Gridline design system: `assets/avc-gridline.css`
- Homepage source of truth: `assets/avc-gridline-home.css`
- Shared accessibility/runtime guardrails: `assets/avc-runtime.css`, `assets/site.js`
- Candidate operations: `assets/avc-candidate-hub.css`
- Jobs: `assets/avc-jobs-ledger.css`, `assets/jobs.js`, `data/jobs.json`

Retired compatibility layers such as `final-polish.css`, `human-home.css`, `human-pages.css`, and `candidate-hub.js` must not be reintroduced.

The retired Wafid medical-booking and payment systems, including Razorpay integration files, payment worker configuration, related workflows, status artifacts and setup documentation, must not be reintroduced into the public website unless they are intentionally rebuilt as a new reviewed system.

## Verification

Run the static integrity gate before public-site changes:

```bash
python scripts/verify_site_integrity.py
```

The `AVC Public Site Integrity` GitHub Actions workflow runs this check for public-site pull requests and main-branch changes, then performs a production smoke test after relevant pushes to `main`.

## Protected operational areas

Vacancy generation, jobs content gates, DNS/TLS diagnostics and their status automation are separate operational systems. Public UI cleanup should not rewrite their business logic or generated status files unless the change specifically targets that system.
