# Assignment Venue Center (AVC) — Candidate CRM Database Architecture

**System Purpose**: Prevent candidate lead loss, structure talent pools by technical trade, track stage velocity, and ensure instant client dossier generation without sharing worker contact numbers.

---

## 1. Candidate Lifecycle Stages (Funnel Progression)

```
[STAGE 1: RAW INTAKE]
└── Source: apply.html / Google Form / Walk-in at Darbhanga Venue
    │
    ▼
[STAGE 2: TECHNICAL PRE-SCREENING]
└── Verification of Passport (ECR/ECNR), Trade Experience, and ITI/Diploma Certificate
    │
    ▼
[STAGE 3: DEMAND MATCHED]
└── Profile matched to open client demand (e.g. Saudi 30 Electricians DMD-SA-0001)
    │
    ▼
[STAGE 4: INTERVIEW / TRADE TEST SCHEDULED]
└── Reporting token assigned, hall ticket generated, venue bay scheduled
    │
    ▼
[STAGE 5: CLIENT SELECTED]
└── Trade test scorecard passed (>70%), candidate offer letter signed
    │
    ▼
[STAGE 6: MOBILIZED / DEPLOYED]
└── Medical clearance (Wafid), visa stamping, and flight departure via licensed RA
```

---

## 2. Core Data Dictionary (Master CRM Schema)

| Field Name | Data Type | Permitted Values / Format | Purpose |
| :--- | :--- | :--- | :--- |
| **Candidate_Token** | Text (Key) | `AVC-CAND-XXXX` or `AVC-APP-2026-XXXX` | Unique identifier (printed on screening slip) |
| **Full_Name** | Text | As per Passport / Aadhaar | Legal identity |
| **WhatsApp_No** | Phone | 10 digits without +91 (`9876543210`) | Primary communication & automation channel |
| **Alternate_No** | Phone | 10 digits | Emergency / Family contact |
| **Email_Address** | Email | Valid email format | Confirmation emails & auto-replies |
| **Primary_Trade** | Dropdown | `Electrician`, `6G Welder`, `HVAC Tech`, `Heavy Driver`, `Civil Mason`, `Plumber`, `Cleaner`, `Other` | Skill categorization |
| **Total_Experience** | Dropdown | `Fresher / ITI`, `1-3 Years`, `3-5 Years`, `5-10 Years`, `10+ Years` | Seniority rating |
| **Gulf_Experience** | Dropdown | `None (India Only)`, `1-3 Years GCC`, `3-5 Years GCC`, `5+ Years GCC` | Premium wage matching |
| **Passport_Status** | Dropdown | `ECNR Ready`, `ECR (Emigration Check Required)`, `Applying / In Process` | Emigration compliance check |
| **Passport_Expiry** | Date | `YYYY-MM-DD` | Audit alert if < 6 months remaining |
| **State_District** | Text / Dropdown | e.g. `Darbhanga, Bihar`, `Madhubani`, `Samastipur`, `Ranchi` | Catchment analysis |
| **Technical_Education** | Dropdown | `Practical Only`, `ITI Certified`, `Diploma in Engineering`, `Graduate` | Client qualification check |
| **Current_Stage** | Dropdown | `1-Intake`, `2-Screened`, `3-Matched`, `4-InterviewReady`, `5-Selected`, `6-Mobilized` | Pipeline tracking |
| **Assigned_Demand** | Text | e.g. `DMD-SA-0001` or `General Pool` | Client requisition tag |
| **Trade_Score** | Number | 0 to 100% | Practical test mark at Darbhanga Bay |
| **Last_Contact_Date** | Date | `YYYY-MM-DD` | Stale lead monitoring (re-engage every 30 days) |
| **Internal_Notes** | Long Text | Observations by Mehdi Hasan / Screening Coordinators | Interview observations |

---

## 3. Google Sheets Formula Setup (Self-Operating Functions)

If managing leads via Google Sheets (`AVC Candidate Registration Responses`):

1. **Auto-Generate Candidate Token (Column A)**:
   ```excel
   =IF(B2="","", "AVC-CAND-" & TEXT(ROW(A2)-1, "0000"))
   ```
2. **Passport Expiry Warning Flag (Column K)**:
   ```excel
   =IF(J2="","", IF(J2-TODAY()<180, "⚠️ EXPIRING SOON", "✅ VALID"))
   ```
3. **WhatsApp 1-Click Chat Link Generator (Column N)**:
   ```excel
   =HYPERLINK("https://wa.me/91" & C2 & "?text=" & ENCODEURL("Hi " & B2 & ", regarding your application with AVC (" & A2 & ") for " & F2 & "..."), "💬 Chat WhatsApp")
   ```

---

## 4. B2B Client Dossier Export Protocol (Bypass Protection)

When exporting candidate rosters to Gulf employers or Indian EPC contractors:
1. Contact numbers (`WhatsApp_No` and `Alternate_No`) **MUST BE EXCLUDED**.
2. Candidate IDs (`Candidate_Token`), `Trade`, `Total_Experience`, `Gulf_Experience`, and `Trade_Score` are presented.
3. This prevents unregulated sub-agents or competing contractors from poaching talent directly while preserving AVC's coordination ownership.
