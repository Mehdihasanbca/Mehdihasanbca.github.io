# Assignment Venue Center (AVC) — WhatsApp Recruitment Automation Flow

**Platform Goal**: Eliminate phone call overhead, provide instant updates to jobseekers, increase trade test attendance from 45% to 85%+, and maintain strict zero-fee statutory transparency.

---

## Funnel Architecture

```
[Trigger 1: Inbound Lead / Inquiry]
        │
        ▼
   STAGE 1: Auto Welcome & Center Introduction
        │
[Trigger 2: Form Submission on apply.html]
        │
        ▼
   STAGE 2: Registration Confirmation & Document Checklist
        │
[Trigger 3: Pre-Screening Review by Coordinator]
        │
        ▼
   STAGE 3: Trade Pre-Screening Clearance
        │
[Trigger 4: Client Delegation Arrival at Darbhanga Venue]
        │
        ▼
   STAGE 4: Interview Hall Ticket & Reporting Token
        │
[Trigger 5: Trade Test Passed / Client Selection]
        │
        ▼
   STAGE 5: Selection Notification & Next Handoff
        │
[Trigger 6: Monthly Nurturing / Inactive Candidates]
        │
        ▼
   STAGE 6: Re-Engagement & New Demand Alert
```

---

## Copy-Paste Message Templates (Bilingual Hindi / English)

### Stage 1: Inbound Lead / Inquiry (Auto Welcome)
*Trigger: When a new candidate sends a WhatsApp message or clicks "Chat on WhatsApp".*

> **नमस्ते {{Candidate_Name}},**  
> **Welcome to Assignment Venue Center (AVC) Darbhanga.**  
>  
> हम बिहार के कुशल कामगारों (Electricians, Welders, HVAC, Drivers, Civil Trades) को गल्फ (Saudi, UAE, Qatar, Oman) के वेरिफाइड जॉब इंटरव्यू और ट्रेड टेस्ट से जोड़ते हैं।  
>  
> 🛡️ **AVC Zero-Fee Policy**:  
> हमारे यहाँ रजिस्ट्रेशन और इंटरव्यू का **₹0 (कोई शुल्क नहीं)** लगता है। दलालों को पैसे न दें।  
>  
> 📋 **अगला कदम (Next Step)**:  
> अपने ट्रेड के लिए 1 मिनट में अपना फ्री प्रोफाइल रजिस्टर करें:  
> 👉 https://assignmentvenuecentre.me/apply.html  
>  
> या अपना **नाम**, **ट्रेड (Trade)**, और **अनुभव (Years of Experience)** इसी चैट में लिखकर भेजें।  
>  
> — **AVC ऑपरेशंस डेस्क, दरभंगा**  
> 📍 कमतौल रोड, मधुपुर, दरभंगा, बिहार  
> 📞 +91 9473286356

---

### Stage 2: Registration Confirmation & Document Checklist
*Trigger: Immediately upon candidate form completion on website.*

> **बधाई हो {{Candidate_Name}} जी!**  
> आपका AVC प्रोफाइल सफलतापूर्वक रजिस्टर हो गया है।  
>  
> 🎟️ **Application Reference Token**: `{{Candidate_Token}}`  
> 🔧 **ट्रेड (Trade)**: {{Trade}}  
> 🌍 **टारगेट देश**: {{Target_Country}}  
>  
> 📄 **कृपया इंटरव्यू के लिए ये डाक्यूमेंट्स तैयार रखें (Document Checklist)**:  
> 1. ओरिजिनल पासपोर्ट (कम से कम 8 महीने की वैलिडिटी)  
> 2. 4 पासपोर्ट साइज फोटो (सफेद बैकग्राउंड, गल्फ साइज)  
> 3. आधार कार्ड की फोटोकॉपी  
> 4. ITI / डिप्लोमा / ट्रेड सर्टिफिकेट (यदि उपलब्ध हो)  
> 5. गल्फ रिटर्न भाइयों के लिए: पुराना वीजा कॉपी या GCC ड्राइविंग लाइसेंस  
>  
> हमारी टीम आपके डाक्यूमेंट्स रिव्यू करके आगामी क्लाइंट इंटरव्यू की तारीख WhatsApp पर भेजेगी।  
>  
> अपनी एप्लीकेशन का लाइव स्टेटस यहाँ चेक करें:  
> 👉 https://assignmentvenuecentre.me/apply.html  
>  
> — **Assignment Venue Center, दरभंगा**

---

### Stage 3: Trade Pre-Screening Clearance
*Trigger: When sourcing coordinator approves candidate's phone/trade credentials.*

> **नमस्ते {{Candidate_Name}} जी,**  
>  
> आपके **{{Trade}}** प्रोफाइल का टेक्निकल प्री-स्क्रीनिंग पूरा हो गया है। आप AVC के **Verified Ready Pool** में शामिल कर लिए गए हैं।  
>  
> ✅ **Screening Status**: Verified Active  
> 🏢 **Matching Demand**: {{Assigned_Demand}}  
> 🛠️ **Testing Bay**: Darbhanga Practical Workshop  
>  
> आगामी क्लाइंट डेलिगेशन इंटरव्यू के लिए अपना फोन और WhatsApp एक्टिव रखें। इंटरव्यू से 3 से 5 दिन पहले आपको वेन्यू रिपोर्टिंग टाइमिंग और हॉल टिकट भेजा जाएगा।  
>  
> किसी भी सवाल के लिए हमारी हेल्पलाइन पर संपर्क करें:  
> 📞 +91 9473286356

---

### Stage 4: Client Interview Alert & Hall Ticket Token
*Trigger: 3-5 days before a physical or remote interview delegation.*

> 🚨 **URGENT INTERVIEW CALL LETTER: AVC DARBHANGA**  
>  
> **उम्मीदवार का नाम**: {{Candidate_Name}}  
> **टोकन नंबर**: `{{Candidate_Token}}`  
> **ट्रेड**: {{Trade}}  
> **प्रोजेक्ट / देश**: {{Country}}  
>  
> 🗓️ **इंटरव्यू की तारीख (Date)**: {{Interview_Date}}  
> ⏰ **रिपोर्टिंग समय (Time)**: 09:30 AM IST Sharp  
> 📍 **वेन्यू का पता (Venue)**:  
> Assignment Venue Center (AVC), कमतौल रोड, मधुपुर, तेकतार, दरभंगा, बिहार - 847306  
> 🗺️ Google Maps Location: https://maps.google.com/?q=26.2307,85.8344  
>  
> ⚠️ **महत्वपूर्ण निर्देश**:  
> - ओरिजिनल पासपोर्ट और वर्किंग टूल्स/सेफ्टी शूज़ साथ लाएं।  
> - सेंटर पर ₹0 फीस ली जाती है। किसी भी व्यक्ति को कैश या UPI न दें।  
> - एंट्री गेट पर अपना टोकन नंबर `{{Candidate_Token}}` दिखाएं।  
>  
> क्या आप आ रहे हैं? पुष्टि करने के लिए **"YES"** लिखकर रिप्लाई करें।

---

### Stage 5: Selection Notification & Next Handoff
*Trigger: When candidate clears client interview and trade test.*

> 🌟 **CONGRATULATIONS {{Candidate_Name}}! YOU ARE SELECTED!**  
>  
> हमें आपको बताते हुए खुशी हो रही है कि आपने **{{Company_Name}} ({{Country}})** के लिए अपना **{{Trade}}** ट्रेड टेस्ट सफलतापूर्वक पास कर लिया है!  
>  
> 💼 **सैलरी ऑफर**: {{Salary_Terms}}  
> 🏠 **सुविधाएं**: फ्री आवास + ट्रांसपोर्ट + मेडिकल + एयर टिकट  
>  
> 📋 **अगले चरण (Next Official Steps)**:  
> 1. अधिकृत मेडिकल सेंटर (Wafid / GAMCA) पर मेडिकल चेकअप।  
> 2. वीजा और एग्रीमेंट साइनिंग प्रक्रिया।  
> 3. विदेश मंत्रालय (MEA eMigrate) इमिग्रेशन क्लियरेंस।  
>  
> समस्त कानूनी प्रक्रिया सरकार द्वारा अधिकृत लाइसेंसी रिक्रूटिंग एजेंट के माध्यम से पूरी की जाएगी। AVC टीम आपके साथ लगातार संपर्क में रहेगी।  
>  
> — **मेहदी हसन & AVC टीम, दरभंगा**  
> 📞 +91 9473286356

---

### Stage 6: Monthly Nurturing / Inactive Candidates
*Trigger: Broadcast every 30 days to candidates who haven't been scheduled yet.*

> **नमस्ते {{Candidate_Name}} जी,**  
>  
> यह मैसेज Assignment Venue Center (AVC) दरभंगा से है। आपका **{{Trade}}** प्रोफाइल हमारे एक्टिव पूल में मौजूद है।  
>  
> 📢 **आगामी इंटरव्यू अपडेट**:  
> अगले हफ्ते **Saudi Arabia** और **Oman** के नए प्रोजेक्ट्स के लिए इंटरव्यू डेलिगेशन दरभंगा आ रही हैं।  
>  
> यदि आपका पासपोर्ट तैयार है और आप इंटरव्यू देना चाहते हैं, तो कृपया इसी मैसेज पर **"ACTIVE"** लिखकर भेजें ताकि हम आपकी सीट ब्लॉक कर सकें।  
>  
> नई वेकेंसी देखने के लिए:  
> 👉 https://assignmentvenuecentre.me/jobs.html  
>  
> धन्यवाद!  
> **AVC ऑपरेशंस डेस्क**
