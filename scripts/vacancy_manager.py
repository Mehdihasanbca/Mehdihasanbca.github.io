#!/usr/bin/env python3
import argparse
import json
import re
import sys
from copy import deepcopy
from datetime import date, datetime
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = ROOT / 'data' / 'jobs.json'
PUBLIC_STATUSES = {'open', 'closing-soon'}
ALL_STATUSES = {'open', 'closing-soon', 'hold', 'closed'}
SLUG_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
REQUIRED_PUBLIC = ['id','slug','title','summary','country','category','status','publishedAt','lastVerifiedAt','validThrough']
FORBIDDEN = [
    '9162530999',
    '100% job guarantee',
    'guaranteed visa',
    'government approved recruitment agency',
    'recruitos',
    'candidate portal',
    'crm',
    'erp',
]
DEFAULT_FORM = 'https://forms.gle/1nVwzXHiHV9Cjw4A9'


def today():
    return date.today()


def load_json(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))


def save_json(path: Path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def parse_day(value, field, errors, jobid):
    try:
        return date.fromisoformat(str(value))
    except Exception:
        errors.append(f'{jobid}: invalid {field} date {value!r}; expected YYYY-MM-DD')
        return None


def valid_https(value):
    if not value:
        return True
    try:
        u = urlparse(str(value))
        return u.scheme == 'https' and bool(u.netloc)
    except Exception:
        return False


def schema_eligible(job):
    org = job.get('hiringOrganization') or {}
    return bool(
        org.get('public') is True and org.get('name') and job.get('country') and
        job.get('title') and job.get('summary') and job.get('publishedAt') and job.get('validThrough')
    )


def validate_job(job, *, enforce_freshness=True):
    errors, warnings = [], []
    jid = str(job.get('id') or '<missing-id>')
    status = str(job.get('status') or '').lower()

    if status not in ALL_STATUSES:
        errors.append(f'{jid}: invalid status {status!r}; allowed: {sorted(ALL_STATUSES)}')

    if status in PUBLIC_STATUSES:
        for field in REQUIRED_PUBLIC:
            if not job.get(field):
                errors.append(f'{jid}: missing public field {field}')

        slug = str(job.get('slug') or '')
        if slug and not SLUG_RE.fullmatch(slug):
            errors.append(f'{jid}: invalid slug {slug!r}; use lowercase letters, numbers and hyphens only')

        expiry = parse_day(job.get('validThrough'), 'validThrough', errors, jid) if job.get('validThrough') else None
        verified = parse_day(job.get('lastVerifiedAt'), 'lastVerifiedAt', errors, jid) if job.get('lastVerifiedAt') else None
        posted = parse_day(job.get('publishedAt'), 'publishedAt', errors, jid) if job.get('publishedAt') else None

        if expiry and expiry < today():
            errors.append(f'{jid}: public vacancy expired on {expiry.isoformat()}')
        if verified and verified > today():
            errors.append(f'{jid}: lastVerifiedAt cannot be in the future')
        if posted and posted > today():
            errors.append(f'{jid}: publishedAt cannot be in the future')
        if enforce_freshness and verified and (today() - verified).days > 14:
            errors.append(f'{jid}: lastVerifiedAt is older than 14 days')

    text = json.dumps(job, ensure_ascii=False).lower()
    for token in FORBIDDEN:
        if token.lower() in text:
            errors.append(f'{jid}: forbidden/unapproved token detected: {token}')

    for field in ['applicationUrl']:
        if job.get(field) and not valid_https(job[field]):
            errors.append(f'{jid}: {field} must use a valid HTTPS URL')

    org = job.get('hiringOrganization') or {}
    if org.get('sameAs') and not valid_https(org.get('sameAs')):
        errors.append(f'{jid}: hiringOrganization.sameAs must use HTTPS')

    if job.get('baseSalary'):
        bs = job.get('baseSalary') or {}
        if bool(bs.get('value')) != bool(bs.get('currency')):
            errors.append(f'{jid}: baseSalary requires both value and currency')

    if status in PUBLIC_STATUSES and not job.get('applicationUrl'):
        warnings.append(f'{jid}: applicationUrl not supplied; official AVC form will be used')

    if status in PUBLIC_STATUSES and not schema_eligible(job):
        warnings.append(f'{jid}: detail page can publish, but JobPosting schema will not be generated until actual hiring organization is public-approved')

    return errors, warnings


def validate_db(db, *, enforce_freshness=True):
    errors, warnings = [], []
    jobs = db.get('jobs') or []
    if not isinstance(jobs, list):
        return ['jobs must be an array'], []
    ids, slugs = set(), set()
    for job in jobs:
        if not isinstance(job, dict):
            errors.append('each jobs item must be an object')
            continue
        jid = str(job.get('id') or '')
        slug = str(job.get('slug') or '')
        if jid:
            if jid in ids: errors.append(f'duplicate vacancy id: {jid}')
            ids.add(jid)
        if slug:
            if slug in slugs: errors.append(f'duplicate vacancy slug: {slug}')
            slugs.add(slug)
        e, w = validate_job(job, enforce_freshness=enforce_freshness)
        errors.extend(e); warnings.extend(w)
    return errors, warnings


def summary(job):
    return {
        'id': job.get('id'),
        'slug': job.get('slug'),
        'title': job.get('title'),
        'status': job.get('status'),
        'country': job.get('country'),
        'city': job.get('city'),
        'category': job.get('category'),
        'publishedAt': job.get('publishedAt'),
        'lastVerifiedAt': job.get('lastVerifiedAt'),
        'validThrough': job.get('validThrough'),
        'detailUrl': f"https://assignmentvenuecentre.me/vacancies/{job.get('slug')}.html" if job.get('slug') else None,
        'applicationUrl': job.get('applicationUrl') or DEFAULT_FORM,
        'jobPostingEligible': schema_eligible(job),
        'hiringOrganizationPublic': bool((job.get('hiringOrganization') or {}).get('public') is True),
    }


def find_job(jobs, jid):
    for i, job in enumerate(jobs):
        if str(job.get('id')) == jid:
            return i, job
    raise SystemExit(f'Vacancy {jid!r} not found')


def commit_or_preview(db_path, db, *, apply, action, preview=None):
    errors, warnings = validate_db(db)
    print(json.dumps({'action': action, 'apply': apply, 'errors': errors, 'warnings': warnings, 'preview': preview}, indent=2, ensure_ascii=False))
    if errors:
        raise SystemExit(1)
    if not apply:
        print('DRY RUN ONLY: no file was changed. Re-run with --apply after reviewing the output.')
        return
    db['updatedAt'] = today().isoformat()
    save_json(db_path, db)
    print(f'UPDATED: {db_path}')


def cmd_validate(args):
    db = load_json(args.db)
    errors, warnings = validate_db(db)
    result = {'status': 'success' if not errors else 'failed', 'jobs': len(db.get('jobs') or []), 'errors': errors, 'warnings': warnings}
    print(json.dumps(result, indent=2, ensure_ascii=False))
    if errors: raise SystemExit(1)


def cmd_list(args):
    db = load_json(args.db)
    jobs = db.get('jobs') or []
    rows = [summary(j) for j in jobs]
    print(json.dumps(rows, indent=2, ensure_ascii=False))


def cmd_preview(args):
    job = load_json(args.input)
    errors, warnings = validate_job(job)
    print(json.dumps({'status':'success' if not errors else 'failed','errors':errors,'warnings':warnings,'preview':summary(job),'publicRecord':job}, indent=2, ensure_ascii=False))
    if errors: raise SystemExit(1)


def cmd_publish(args):
    db = load_json(args.db)
    job = load_json(args.input)
    status = str(job.get('status') or '').lower()
    if status not in PUBLIC_STATUSES:
        raise SystemExit('publish requires status open or closing-soon')
    jobs = db.setdefault('jobs', [])
    existing_index = None
    for i, row in enumerate(jobs):
        if str(row.get('id')) == str(job.get('id')):
            existing_index = i
            break
    if existing_index is None:
        jobs.append(job)
        action = 'publish-new'
    else:
        jobs[existing_index] = job
        action = 'publish-update'
    commit_or_preview(args.db, db, apply=args.apply, action=action, preview=summary(job))


def cmd_state(args, new_status):
    db = load_json(args.db)
    jobs = db.setdefault('jobs', [])
    idx, job = find_job(jobs, args.id)
    updated = deepcopy(job)
    updated['status'] = new_status
    updated['lastVerifiedAt'] = today().isoformat()
    jobs[idx] = updated
    commit_or_preview(args.db, db, apply=args.apply, action=f'set-{new_status}', preview=summary(updated))


def cmd_reverify(args):
    db = load_json(args.db)
    jobs = db.setdefault('jobs', [])
    idx, job = find_job(jobs, args.id)
    updated = deepcopy(job)
    updated['lastVerifiedAt'] = today().isoformat()
    if args.valid_through:
        updated['validThrough'] = args.valid_through
    if args.status:
        if args.status not in PUBLIC_STATUSES:
            raise SystemExit('reverify --status must be open or closing-soon')
        updated['status'] = args.status
    jobs[idx] = updated
    commit_or_preview(args.db, db, apply=args.apply, action='reverify', preview=summary(updated))


def build_parser():
    p = argparse.ArgumentParser(description='AVC verified vacancy content manager. Writes are dry-run unless --apply is supplied.')
    p.add_argument('--db', type=Path, default=DEFAULT_DB, help='Path to published jobs.json')
    sub = p.add_subparsers(dest='command', required=True)

    s = sub.add_parser('validate', help='Validate the published vacancy database')
    s.set_defaults(func=cmd_validate)

    s = sub.add_parser('list', help='List current stored vacancy records')
    s.set_defaults(func=cmd_list)

    s = sub.add_parser('preview', help='Validate and preview one local vacancy JSON file without writing')
    s.add_argument('--input', type=Path, required=True)
    s.set_defaults(func=cmd_preview)

    s = sub.add_parser('publish', help='Add or replace one approved vacancy record; dry-run by default')
    s.add_argument('--input', type=Path, required=True)
    s.add_argument('--apply', action='store_true')
    s.set_defaults(func=cmd_publish)

    for name in ['hold','close']:
        s = sub.add_parser(name, help=f'Set an existing vacancy to {name}; dry-run by default')
        s.add_argument('id')
        s.add_argument('--apply', action='store_true')
        s.set_defaults(func=(lambda a, state='hold' if name=='hold' else 'closed': cmd_state(a, state)))

    s = sub.add_parser('reverify', help='Refresh lastVerifiedAt and optionally validity/status; dry-run by default')
    s.add_argument('id')
    s.add_argument('--valid-through')
    s.add_argument('--status', choices=sorted(PUBLIC_STATUSES))
    s.add_argument('--apply', action='store_true')
    s.set_defaults(func=cmd_reverify)
    return p


def main():
    args = build_parser().parse_args()
    args.db = args.db.resolve()
    args.func(args)


if __name__ == '__main__':
    main()
