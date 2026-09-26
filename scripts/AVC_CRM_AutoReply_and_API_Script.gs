/**
 * ============================================================================
 * ASSIGNMENT VENUE CENTER (AVC) — RECRUITMENT CRM AUTOMATION ENGINE
 * ============================================================================
 * Official Workspace: Darbhanga, Bihar - 847306, India
 * Domain: assignmentvenuecentre.me | Email: info@assignmentvenuecentre.me
 * Founder & Head: Mehdi Hasan (+91 9473286356)
 *
 * This Google Apps Script powers:
 * 1. Automatic Google Form & Webhook Ingestion
 * 2. Instant Candidate Acknowledgment Email (HTML & Plaintext via Gmail)
 * 3. Instant Admin Alert Notification to info@assignmentvenuecentre.me
 * 4. Master Candidate ID Generation (AVC-CAND-XXXX)
 * 5. Live Application Status API (doGet) for assignmentvenuecentre.me
 * 6. Webhook Ingestion API (doPost) for website forms
 * 7. Daily Compliance & Passport Expiry Scan (< 6 Months Alert)
 * ============================================================================
 */

// Global Configuration
const AVC_CONFIG = {
  adminEmail: "info@assignmentvenuecentre.me",
  backupAdminEmail: "avcgulf@gmail.com",
  adminPhone: "+91 9473286356",
  companyName: "Assignment Venue Center (AVC)",
  venueAddress: "Ground Floor, Kamtaul Road, Madhupur, Tekatar, Darbhanga, Bihar - 847306, India",
  websiteUrl: "https://assignmentvenuecentre.me",
  statusCheckerUrl: "https://assignmentvenuecentre.me/apply.html#status-checker",
  masterSheetName: "Candidates",
  employerSheetName: "Employer Requirements"
};

/**
 * ----------------------------------------------------------------------------
 * 1. TRIGGER: onFormSubmit(e)
 * Runs automatically when a candidate submits the Google Form
 * ----------------------------------------------------------------------------
 */
function onFormSubmitTrigger(e) {
  try {
    const sheet = e.range ? e.range.getSheet() : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const row = e.range ? e.range.getRow() : sheet.getLastRow();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Map row values into dictionary
    const data = {};
    headers.forEach((h, idx) => {
      data[h.toString().trim()] = rowData[idx];
    });

    // Extract core fields
    const fullName = findField(data, ["Full Name", "Candidate Name", "Name", "Applicant Name"]) || "Candidate";
    const email = findField(data, ["Email", "Email Address", "Candidate Email"]);
    const phone = findField(data, ["Phone", "Mobile Number", "WhatsApp Number", "Contact Number", "Phone Number"]) || "";
    const trade = findField(data, ["Position Applied", "Trade", "Designation Applied", "Job Role", "Trade Applied"]) || "General Technical";
    const experience = findField(data, ["Total Experience", "Experience", "Work Experience"]) || "Not specified";
    const gulfExperience = findField(data, ["Gulf Experience", "GCC Experience", "Overseas Experience"]) || "None";
    const passportStatus = findField(data, ["Passport Status", "ECR / ECNR", "Passport Category"]) || "Under Review";
    const passportExpiry = findField(data, ["Passport Expiry", "Expiry Date", "Passport Validity"]) || "";
    const cvLink = findField(data, ["Upload CV", "CV", "Resume", "CV Link", "Verified CV Drive Link"]) || "";

    // Generate or fetch Candidate Ref ID
    let candidateId = `AVC-CAND-${padZero(row, 4)}`;
    
    // Check if ID column exists, else append
    let idColIndex = headers.indexOf("Candidate ID");
    if (idColIndex === -1) {
      idColIndex = headers.indexOf("Reference ID");
    }
    if (idColIndex !== -1) {
      sheet.getRange(row, idColIndex + 1).setValue(candidateId);
    }

    // Update Status column
    let statusColIndex = headers.indexOf("Pipeline Status");
    if (statusColIndex === -1) statusColIndex = headers.indexOf("Status");
    if (statusColIndex !== -1) {
      sheet.getRange(row, statusColIndex + 1).setValue("Stage 2: Technical Pre-Screening");
    }

    // Update Date Processed
    let processedColIndex = headers.indexOf("System Acknowledged");
    if (processedColIndex !== -1) {
      sheet.getRange(row, processedColIndex + 1).setValue(new Date());
    }

    // 1. Send Candidate Acknowledgment Email
    if (email && isValidEmail(email)) {
      sendCandidateAcknowledgmentEmail({
        fullName: fullName,
        email: email,
        phone: phone,
        trade: trade,
        experience: experience,
        gulfExperience: gulfExperience,
        candidateId: candidateId,
        passportStatus: passportStatus
      });
    }

    // 2. Send Admin Notification Email
    sendAdminNotificationEmail({
      fullName: fullName,
      email: email,
      phone: phone,
      trade: trade,
      experience: experience,
      candidateId: candidateId,
      cvLink: cvLink,
      source: "Google Form Ingestion"
    });

  } catch (error) {
    Logger.log("Error in onFormSubmitTrigger: " + error.toString());
  }
}

/**
 * ----------------------------------------------------------------------------
 * 2. WEB APP API: doPost(e)
 * Accepts direct submissions from assignmentvenuecentre.me website
 * ----------------------------------------------------------------------------
 */
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = e.parameter;
      }
    } else {
      payload = e.parameter || {};
    }

    const submissionType = payload.type || payload.form_type || "candidate_application";
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (submissionType === "employer_requirement") {
      // Handle Employer Requirement
      let empSheet = ss.getSheetByName(AVC_CONFIG.employerSheetName);
      if (!empSheet) {
        empSheet = ss.insertSheet(AVC_CONFIG.employerSheetName);
        empSheet.appendRow([
          "Timestamp", "Requirement Token", "Company Name", "Representative Name",
          "Email", "Phone", "Target Country", "Industry Sector",
          "Trades & Volume", "Interview Mode", "Timeline", "Notes", "Status"
        ]);
      }

      const reqToken = payload.reqToken || `AVC-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      empSheet.appendRow([
        new Date(),
        reqToken,
        payload.companyName || "",
        payload.repName || "",
        payload.email || "",
        payload.phone || "",
        payload.country || "",
        payload.industry || "",
        payload.tradesHeadcount || "",
        payload.interviewMode || "",
        payload.timeline || "",
        payload.notes || "",
        "New Sourcing Brief"
      ]);

      // Notify Admin
      MailApp.sendEmail({
        to: AVC_CONFIG.adminEmail,
        cc: AVC_CONFIG.backupAdminEmail,
        subject: `[AVC CRM ALERT] New Employer Manpower Brief: ${payload.companyName} [${reqToken}]`,
        htmlBody: `
          <h3>New Enterprise Manpower Brief Received</h3>
          <p><strong>Company:</strong> ${payload.companyName}</p>
          <p><strong>Contact:</strong> ${payload.repName} (${payload.phone} / ${payload.email})</p>
          <p><strong>Country:</strong> ${payload.country} | <strong>Industry:</strong> ${payload.industry}</p>
          <p><strong>Trades & Volume:</strong><br><pre>${payload.tradesHeadcount}</pre></p>
          <p><strong>Selection Mode:</strong> ${payload.interviewMode}</p>
          <p><strong>Target Timeline:</strong> ${payload.timeline}</p>
          <br>
          <p>View in Google Sheets: <a href="${ss.getUrl()}">Open AVC Recruitment CRM</a></p>
        `
      });

      return createCorsResponse({
        status: "success",
        message: "Employer requirement recorded successfully",
        token: reqToken
      });

    } else {
      // Default: Candidate Application
      let candSheet = ss.getSheetByName(AVC_CONFIG.masterSheetName) || ss.getSheets()[0];
      const lastRow = candSheet.getLastRow();
      const candId = payload.appRef || `AVC-CAND-${padZero(lastRow + 1, 4)}`;

      candSheet.appendRow([
        new Date(),
        candId,
        payload.fullName || payload.name || "",
        payload.phone || "",
        payload.altPhone || "",
        payload.email || "",
        payload.trade || "",
        payload.expTotal || payload.experience || "",
        payload.expGulf || "",
        payload.passport || "",
        payload.district || "",
        payload.targetCountry || "",
        payload.jobRef || "Website Direct Gateway",
        payload.notes || "",
        "Stage 2: Technical Pre-Screening",
        "Website Online Intake"
      ]);

      // Send Acknowledgment if email present
      if (payload.email && isValidEmail(payload.email)) {
        sendCandidateAcknowledgmentEmail({
          fullName: payload.fullName || payload.name,
          email: payload.email,
          phone: payload.phone,
          trade: payload.trade,
          experience: payload.expTotal,
          gulfExperience: payload.expGulf,
          candidateId: candId,
          passportStatus: payload.passport
        });
      }

      // Notify Admin
      sendAdminNotificationEmail({
        fullName: payload.fullName || payload.name,
        email: payload.email,
        phone: payload.phone,
        trade: payload.trade,
        experience: payload.expTotal,
        candidateId: candId,
        cvLink: "",
        source: "assignmentvenuecentre.me (Direct Gateway)"
      });

      return createCorsResponse({
        status: "success",
        message: "Candidate application recorded successfully",
        token: candId
      });
    }

  } catch (err) {
    return createCorsResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * ----------------------------------------------------------------------------
 * 3. WEB APP API: doGet(e)
 * Real-time Candidate Status Lookup for assignmentvenuecentre.me
 * ----------------------------------------------------------------------------
 */
function doGet(e) {
  try {
    const q = (e.parameter.q || e.parameter.query || "").toString().trim().toLowerCase();
    if (!q) {
      return createCorsResponse({
        status: "ready",
        system: "Assignment Venue Center CRM API",
        version: "2026.09.26"
      });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(AVC_CONFIG.masterSheetName) || ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return createCorsResponse({ status: "not_found", query: q });
    }

    const headers = data[0].map(h => h.toString().toLowerCase().trim());
    const idIdx = headers.findIndex(h => h.includes("id") || h.includes("ref"));
    const nameIdx = headers.findIndex(h => h.includes("name"));
    const phoneIdx = headers.findIndex(h => h.includes("phone") || h.includes("mobile") || h.includes("whatsapp"));
    const tradeIdx = headers.findIndex(h => h.includes("trade") || h.includes("position") || h.includes("role"));
    const statusIdx = headers.findIndex(h => h.includes("status") || h.includes("stage"));
    const dateIdx = headers.findIndex(h => h.includes("timestamp") || h.includes("date"));

    // Normalize query
    const cleanQ = q.replace(/[^a-zA-Z0-9]/g, "");

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rawId = (row[idIdx] || "").toString().toLowerCase();
      const rawPhone = (row[phoneIdx] || "").toString().replace(/[^0-9]/g, "");
      const rawName = (row[nameIdx] || "").toString().toLowerCase();

      if (
        (rawId && rawId.includes(q)) ||
        (cleanQ.length >= 6 && rawPhone.includes(cleanQ)) ||
        (rawName && rawName === q)
      ) {
        return createCorsResponse({
          status: "found",
          candidateId: row[idIdx] || `AVC-CAND-${padZero(i, 4)}`,
          fullName: maskName(row[nameIdx] || "Candidate"),
          trade: row[tradeIdx] || "Technical Trade",
          pipelineStatus: row[statusIdx] || "Stage 2: Technical Pre-Screening",
          registeredDate: row[dateIdx] ? new Date(row[dateIdx]).toLocaleDateString("en-IN") : "Recent",
          nextStep: "Your profile is active in our talent pool. AVC trade coordinators match candidates with upcoming GCC client delegations in Darbhanga.",
          venue: AVC_CONFIG.venueAddress,
          zeroFeeNotice: "100% Free Intake under Emigration Act 1983. No agent charges."
        });
      }
    }

    return createCorsResponse({
      status: "not_found",
      query: q,
      message: "No active record found matching query. Please verify reference token or WhatsApp number."
    });

  } catch (err) {
    return createCorsResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * ----------------------------------------------------------------------------
 * 4. EMAIL AUTOMATION: sendCandidateAcknowledgmentEmail()
 * ----------------------------------------------------------------------------
 */
function sendCandidateAcknowledgmentEmail(c) {
  const subject = `Application Received: ${c.trade} [${c.candidateId}] | Assignment Venue Center`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; color: #1e293b;">
      <table align="center" width="600" style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
        <tr>
          <td style="background: #071827; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 20px; margin: 0; letter-spacing: 1px;">ASSIGNMENT VENUE CENTER</h1>
            <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0;">Official Overseas Recruitment Support &amp; Trade Testing Hub &bull; Darbhanga, Bihar</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 28px;">
            <h2 style="color: #0f172a; font-size: 17px; margin-top: 0;">Dear ${c.fullName},</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Thank you for registering with <strong>Assignment Venue Center (AVC)</strong>. Your candidate profile for <strong>${c.trade}</strong> has been successfully ingested into our recruitment management database.
            </p>

            <table width="100%" style="background: #f1f5f9; border-radius: 6px; padding: 14px; margin: 18px 0; font-size: 13.5px; border-collapse: collapse;">
              <tr><td style="padding: 6px 10px; font-weight: bold; width: 160px; color: #475569;">Application ID:</td><td style="padding: 6px 10px; font-weight: bold; color: #0284c7;">${c.candidateId}</td></tr>
              <tr><td style="padding: 6px 10px; font-weight: bold; color: #475569;">Primary Trade:</td><td style="padding: 6px 10px; color: #0f172a;">${c.trade}</td></tr>
              <tr><td style="padding: 6px 10px; font-weight: bold; color: #475569;">Total Experience:</td><td style="padding: 6px 10px; color: #0f172a;">${c.experience} (Gulf: ${c.gulfExperience})</td></tr>
              <tr><td style="padding: 6px 10px; font-weight: bold; color: #475569;">Current Status:</td><td style="padding: 6px 10px; color: #059669; font-weight: bold;">Stage 2 — Technical Pre-Screening</td></tr>
              <tr><td style="padding: 6px 10px; font-weight: bold; color: #475569;">Registration Fee:</td><td style="padding: 6px 10px; color: #059669; font-weight: bold;">₹0 (Strict Zero-Fee Policy)</td></tr>
            </table>

            <h3 style="color: #0f172a; font-size: 15px; margin: 20px 0 8px;">What Happens Next?</h3>
            <ol style="font-size: 13.5px; line-height: 1.6; color: #334155; padding-left: 20px; margin: 0;">
              <li><strong>Profile Matching:</strong> Our technical team matches your trade credentials with incoming employer demands from Saudi Arabia, Oman, UAE, and Qatar.</li>
              <li><strong>Interview Call Letter:</strong> When an employer delegation or trade test drive is scheduled at our Darbhanga venue, you will receive an official notification via WhatsApp and email.</li>
              <li><strong>Track Status:</strong> You can check your live application status anytime at <a href="${AVC_CONFIG.websiteUrl}" style="color: #0284c7; text-decoration: none;">assignmentvenuecentre.me</a> using your reference token or mobile number.</li>
            </ol>

            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 22px 0; font-size: 12.5px; color: #991b1b; line-height: 1.5;">
              <strong>⚠️ CRITICAL FRAUD ADVISORY:</strong><br>
              AVC operates strictly under the Emigration Act 1983. <strong>We NEVER charge candidates fees for registration, interview call slips, or trade testing.</strong> Never pay any personal UPI, agent, or broker claiming guaranteed visas. Report suspicious callers to our official WhatsApp: <strong>${AVC_CONFIG.adminPhone}</strong>.
            </div>

            <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">
              Best regards,<br>
              <strong>Recruitment Operations Team</strong><br>
              Assignment Venue Center (AVC)<br>
              Ground Floor, Kamtaul Road, Madhupur, Tekatar, Darbhanga, Bihar - 847306<br>
              Web: <a href="${AVC_CONFIG.websiteUrl}" style="color: #0284c7;">assignmentvenuecentre.me</a> &bull; WhatsApp: ${AVC_CONFIG.adminPhone}
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  GmailApp.sendEmail(c.email, subject, "", {
    name: "Assignment Venue Center",
    htmlBody: htmlBody,
    replyTo: AVC_CONFIG.adminEmail
  });
}

/**
 * ----------------------------------------------------------------------------
 * 5. ADMIN ALERT: sendAdminNotificationEmail()
 * ----------------------------------------------------------------------------
 */
function sendAdminNotificationEmail(c) {
  const subject = `[AVC CRM LEAD] New ${c.trade}: ${c.fullName} [${c.candidateId}]`;
  const body = `
    New candidate registered into AVC Recruitment CRM:

    Candidate ID: ${c.candidateId}
    Full Name: ${c.fullName}
    Trade: ${c.trade}
    Phone / WhatsApp: ${c.phone}
    Email: ${c.email || 'N/A'}
    Experience: ${c.experience}
    Source: ${c.source}
    CV Upload: ${c.cvLink || 'None attached'}

    Live Database: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;

  MailApp.sendEmail({
    to: AVC_CONFIG.adminEmail,
    cc: AVC_CONFIG.backupAdminEmail,
    subject: subject,
    body: body
  });
}

/**
 * ----------------------------------------------------------------------------
 * 6. COMPLIANCE SCANNER: dailyCandidateAudit()
 * Runs daily to alert on expiring passports (< 6 months)
 * ----------------------------------------------------------------------------
 */
function dailyCandidateAudit() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(AVC_CONFIG.masterSheetName) || ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;

  const headers = data[0].map(h => h.toString().toLowerCase().trim());
  const expiryIdx = headers.findIndex(h => h.includes("expiry"));
  const nameIdx = headers.findIndex(h => h.includes("name"));
  const tradeIdx = headers.findIndex(h => h.includes("trade") || h.includes("position"));
  const phoneIdx = headers.findIndex(h => h.includes("phone") || h.includes("mobile"));

  if (expiryIdx === -1) return;

  const now = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(now.getMonth() + 6);

  const atRiskCandidates = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const expiryRaw = row[expiryIdx];
    if (expiryRaw) {
      const expDate = new Date(expiryRaw);
      if (!isNaN(expDate.getTime()) && expDate < sixMonthsFromNow && expDate > now) {
        atRiskCandidates.push({
          row: i + 1,
          name: row[nameIdx],
          trade: row[tradeIdx],
          phone: row[phoneIdx],
          expiry: expDate.toLocaleDateString("en-IN")
        });
      }
    }
  }

  if (atRiskCandidates.length > 0) {
    let report = `Found ${atRiskCandidates.length} candidate(s) with passports expiring in less than 6 months (Gulf visa rejection risk):\n\n`;
    atRiskCandidates.forEach(c => {
      report += `• ${c.name} (${c.trade}) - Expiry: ${c.expiry} - Phone: ${c.phone}\n`;
    });

    MailApp.sendEmail({
      to: AVC_CONFIG.adminEmail,
      subject: `[AVC COMPLIANCE ALERT] ${atRiskCandidates.length} Candidates Require Urgent Passport Renewal`,
      body: report
    });
  }
}

/**
 * ----------------------------------------------------------------------------
 * HELPER UTILITIES
 * ----------------------------------------------------------------------------
 */
function findField(obj, possibleKeys) {
  for (let k of possibleKeys) {
    for (let key in obj) {
      if (key.toLowerCase().includes(k.toLowerCase())) {
        return obj[key];
      }
    }
  }
  return "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function padZero(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function maskName(name) {
  if (!name || name.length <= 3) return name;
  const parts = name.split(" ");
  return parts.map(p => p.length > 2 ? p.slice(0, 2) + "***" : p).join(" ");
}

function createCorsResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
