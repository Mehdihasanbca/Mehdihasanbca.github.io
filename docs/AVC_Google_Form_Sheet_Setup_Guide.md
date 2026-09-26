# AVC Google Form & Google Sheet CRM Automation Setup Guide
**Google Form**: [AVC Candidate Registration – Gulf Job Opportunities](https://docs.google.com/forms/d/10VxnfNRb5Rdj8Mr5rUfRwm5pF4WO5rSW-eV73r2PNs4/edit?usp=drivesdk)  
**Google Sheet**: [AVC Candidate Registration Responses](https://docs.google.com/spreadsheets/d/1V-9H3jhpS2Sy5bTqWIN3z88YPDjod5wzBKeJXqwskRI/edit?usp=drivesdk)  
**Automation Code**: [`scripts/AVC_CRM_AutoReply_and_API_Script.gs`](file:///c:/Users/MehdiHasanBCA-2023/Desktop/Assighnment/scripts/AVC_CRM_AutoReply_and_API_Script.gs)  
*Assignment Venue Center (Darbhanga, Bihar) | Operations Automation Desk*

---

## 1. What This Automation Does Automatically (Zero Manual Work)

1. **Auto-Logs Every Lead**:
   Whenever a candidate fills the Google Form or the website form, their details are parsed into clean columns: `Candidate ID`, `Name`, `Phone`, `Trade`, `Experience`, `Gulf Experience`, `Passport Status`, `Passport Expiry`, `Application Date`, `Status`.
2. **Instant Candidate Acknowledgment Email**:
   Sends an official, branded HTML email to the candidate from `info@assignmentvenuecentre.me` with their unique **Application Token (AVC-CAND-XXXX)**, trade details, and zero-fee compliance notice.
3. **Instant Admin Alert Notification**:
   Sends an immediate alert to `info@assignmentvenuecentre.me` so the recruitment team can call or WhatsApp high-demand trades (e.g. 6G Welders, Electricians) within 15 minutes.
4. **180-Day Passport Expiry Warning**:
   Runs a daily automatic check. If a candidate's passport has less than 6 months validity, it flags `⚠️ EXPIRING SOON` in the Sheet so they can renew before client interview dates.
5. **Bidirectional Webhook Bridge**:
   Connects website submissions on [assignmentvenuecentre.me](https://assignmentvenuecentre.me/) directly to this Google Sheet!

---

## 2. Step-by-Step 3-Minute Setup Instructions

### Step 1: Open Google Sheet Apps Script Editor
1. Open your Google Sheet: [AVC Candidate Registration Responses](https://docs.google.com/spreadsheets/d/1V-9H3jhpS2Sy5bTqWIN3z88YPDjod5wzBKeJXqwskRI/edit?usp=drivesdk).
2. In the top menu bar, click on **Extensions** (विस्तार) ➔ **Apps Script**.
3. You will see an empty code editor with `function myFunction() {}`. Delete all existing code.

### Step 2: Copy-Paste the Master Automation Code
1. Open [`scripts/AVC_CRM_AutoReply_and_API_Script.gs`](file:///c:/Users/MehdiHasanBCA-2023/Desktop/Assighnment/scripts/AVC_CRM_AutoReply_and_API_Script.gs) in this repository.
2. Select All (`Ctrl + A`) and Copy (`Ctrl + C`).
3. Paste (`Ctrl + V`) into the Apps Script editor.
4. Click the **Save** icon (💾 or `Ctrl + S`). Name the project: `AVC Recruitment Engine`.

### Step 3: Run the Initialization & Grant Permissions
1. At the top of the Apps Script window, in the function dropdown, select **`initializeCrmSystem`**.
2. Click **Run** (▶️).
3. Google will ask for **Authorization** (Permissions):
   * Click **Review Permissions**.
   * Choose your Google account (`info@assignmentvenuecentre.me` or connected Google account).
   * Click **Advanced** (उन्नत) ➔ **Go to AVC Recruitment Engine (unsafe)** (यह सुरक्षित है, आपकी निजी स्क्रिप्ट है).
   * Click **Allow**.
4. The execution log will show: `✅ AVC CRM System Initialized Successfully`.

### Step 4: Add the Form Submit Trigger (Instant Auto-Reply)
1. On the left sidebar of Apps Script, click the **Triggers** icon (⏰ clock symbol).
2. Click **+ Add Trigger** (blue button at bottom right).
3. Set the following fields:
   * **Choose which function to run**: `onFormSubmitTrigger`
   * **Choose which deployment should run**: `Head`
   * **Select event source**: `From spreadsheet`
   * **Select event type**: `On form submit`
   * **Failure notification settings**: `Notify me daily`
4. Click **Save**.

### Step 5: (Optional) Deploy as Web App for Website Bridge
To have website forms push directly into this same Google Sheet:
1. Click **Deploy** (blue button at top right) ➔ **New deployment**.
2. Select type: **Web app** (gear icon).
3. Description: `AVC Live Website Bridge`.
4. **Execute as**: `Me` (`your email`).
5. **Who has access**: `Anyone`.
6. Click **Deploy**.
7. Copy the **Web App URL** (looks like: `https://script.google.com/macros/s/.../exec`).
8. Paste this URL into your browser console on the website or save it in your admin panel:
   ```javascript
   localStorage.setItem('avc_webhook_url', 'YOUR_WEB_APP_URL_HERE');
   ```

---

## 3. How to Test the Entire Flow (60 Seconds)

1. Open your live Google Form: [AVC Candidate Registration](https://docs.google.com/forms/d/10VxnfNRb5Rdj8Mr5rUfRwm5pF4WO5rSW-eV73r2PNs4/edit?usp=drivesdk).
2. Fill a test application with your own email and phone number (e.g., Name: `Test Welder`, Trade: `6G Welder`, Experience: `3 Years`, Email: `your personal email`).
3. Submit the form.
4. Within 30 seconds:
   * **Check your Google Sheet**: A new row will appear with generated Candidate ID (`AVC-CAND-XXXX`) and status `Stage 1: Profile Verified`.
   * **Check Candidate Email**: You will receive an official branded auto-reply with token and next steps.
   * **Check Admin Inbox** (`info@assignmentvenuecentre.me`): You will receive a high-priority recruitment lead notification.

---

## 4. Troubleshooting & FAQ

* **Q: Will it charge anything?**  
  *No, Google Apps Script and Gmail sending for standard forms are 100% free.*
* **Q: What if candidate enters phone number with spaces?**  
  *The script automatically sanitizes the number, strips spaces, and adds country code `+91`.*
* **Q: What if candidate doesn't provide an email?**  
  *The script logs the candidate in the Google Sheet and dispatches an admin alert. Candidate communication will then happen via WhatsApp.*
