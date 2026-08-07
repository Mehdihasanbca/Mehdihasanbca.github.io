# AVC Verified Vacancy Publishing Workflow

This repository is public. Unapproved vacancy drafts, private source documents, passports, employer credentials, payment details, phone lists, access tokens and internal evidence must **not** be committed here.

`data/jobs.json` is the single source of truth for public AVC vacancy data.

## 1. Prepare a draft locally

Keep draft JSON outside the repository, or inside one of the ignored local-only paths:

- `.avc-vacancy-drafts/`
- `*.vacancy-draft.json`

Use `docs/vacancy-input-schema.json` as the field contract. Do not use invented employer names, salaries, benefits, vacancy counts, deadlines, licences or guarantees.

## 2. Preview before publishing

Run:

```bash
python scripts/vacancy_manager.py preview --input <local-vacancy-file.json>
```

The preview validates the record and shows whether it is eligible for an individual JobPosting schema. Preview does not write to the public database.

## 3. Publishing checklist

Before publication confirm from the current recruitment source:

- job title and country/location
- category and key requirements
- current status (`open` or `closing-soon`)
- publication date
- last verification date
- validity/expiry date
- salary/benefits only where approved for public communication
- application URL, or allow the official AVC candidate form fallback
- actual hiring organization only where its name is approved for public disclosure
- recruiting stakeholder only where its name is approved for public disclosure

Do not place private verification evidence inside `jobs.json`.

## 4. Dry-run the publish action

```bash
python scripts/vacancy_manager.py publish --input <local-vacancy-file.json>
```

This is intentionally a dry run. It validates the merged public database and prints the proposed action without changing `data/jobs.json`.

## 5. Apply only after review

```bash
python scripts/vacancy_manager.py publish --input <local-vacancy-file.json> --apply
```

After `data/jobs.json` changes, GitHub Actions validates the content and generates/removes individual vacancy pages and the jobs sitemap.

## 6. Vacancy lifecycle

Hold a vacancy:

```bash
python scripts/vacancy_manager.py hold <VACANCY-ID>
python scripts/vacancy_manager.py hold <VACANCY-ID> --apply
```

Close a vacancy:

```bash
python scripts/vacancy_manager.py close <VACANCY-ID>
python scripts/vacancy_manager.py close <VACANCY-ID> --apply
```

Re-verify a vacancy:

```bash
python scripts/vacancy_manager.py reverify <VACANCY-ID> --valid-through YYYY-MM-DD
python scripts/vacancy_manager.py reverify <VACANCY-ID> --valid-through YYYY-MM-DD --apply
```

A write is never performed unless `--apply` is explicitly supplied.

## 7. Public page and Google Jobs rules

Every active public vacancy needs a stable lowercase slug and generates:

`/vacancies/<slug>.html`

A public vacancy detail page can exist without JobPosting structured data. JobPosting is generated only when the actual hiring organization is approved for public disclosure and the required job/location/date facts are present. Assignment Venue Center must not be substituted as the hiring employer.

Expired, hold and closed vacancies are removed from active public discovery.

## 8. Validation commands

Validate the published database:

```bash
python scripts/vacancy_manager.py validate
```

List stored public records:

```bash
python scripts/vacancy_manager.py list
```

The automated content, vacancy-page and Phase 14 gates remain the final release evidence.
