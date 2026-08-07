from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
FORM='https://forms.gle/1nVwzXHiHV9Cjw4A9'

def replace(path:str, old:str, new:str, minimum:int=1):
    p=ROOT/path
    text=p.read_text(encoding='utf-8')
    count=text.count(old)
    if count<minimum:
        raise SystemExit(f'{path}: expected at least {minimum} occurrences of {old!r}, found {count}')
    p.write_text(text.replace(old,new),encoding='utf-8')
    print(f'{path}: replaced {count}')

# Candidate page: route official candidate CTAs through the safe application gateway.
replace('candidates.html',f'href="{FORM}" target="_blank" rel="noopener noreferrer"','href="apply.html?source=candidates"',1)
replace('candidates.html','assets/measurement.js?v=20260807-p12','assets/measurement.js?v=20260807-p15',1)

# Employer page: requirement CTAs go to the structured intake page; plain contact email stays unchanged.
replace('employers.html','href="mailto:info@assignmentvenuecentre.me?subject=Employer%20manpower%20requirement"','href="employer-requirement.html?source=employers"',1)
replace('employers.html','assets/measurement.js?v=20260807-p12','assets/measurement.js?v=20260807-p15',1)

# Partner page: partnership CTAs go to the structured intake page; plain contact email stays unchanged.
replace('partners.html','href="mailto:info@assignmentvenuecentre.me?subject=Recruitment%20partnership%20enquiry"','href="partner-enquiry.html?source=partners"',1)
replace('partners.html','assets/measurement.js?v=20260807-p12','assets/measurement.js?v=20260807-p15',1)

# Jobs page generic registration CTAs use the gateway. Dynamic job cards add the vacancy reference themselves.
replace('jobs.html',f'href="{FORM}" target="_blank" rel="noopener noreferrer"','href="apply.html?source=jobs"',1)
replace('jobs.html','assets/jobs.js?v=20260807-p13','assets/jobs.js?v=20260807-p15',1)
replace('jobs.html','assets/measurement.js?v=20260807-p12','assets/measurement.js?v=20260807-p15',1)
