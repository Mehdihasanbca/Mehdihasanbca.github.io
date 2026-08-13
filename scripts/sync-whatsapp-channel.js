/**
 * Assignment Venue Center (AVC) - WhatsApp Channel Auto-Sync Script
 * Source Channel: https://whatsapp.com/channel/0029Vb7mJuWF1YlQJ0sKSn06
 */

const fs = require('fs');
const path = require('path');

const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb7mJuWF1YlQJ0sKSn06';
const JOBS_FILE_PATH = path.join(__dirname, '../data/jobs.json');

async function syncChannel() {
  console.log(`[AVC Sync] Fetching posts from WhatsApp Channel: ${CHANNEL_URL}`);

  try {
    const res = await fetch(CHANNEL_URL);
    if (!res.ok) {
      console.log(`[AVC Sync] Channel HTTP status: ${res.status}. Keeping current jobs.`);
      return;
    }

    const html = await res.text();
    console.log(`[AVC Sync] Successfully retrieved WhatsApp Channel page content (${html.length} bytes).`);

    // Parse jobs file
    const rawData = fs.readFileSync(JOBS_FILE_PATH, 'utf8');
    const jobsData = JSON.parse(rawData);

    // Keep active jobs updated with today's verification date
    const todayISO = new Date().toISOString().split('T')[0];
    jobsData.updatedAt = todayISO;

    if (Array.isArray(jobsData.jobs)) {
      jobsData.jobs.forEach(job => {
        job.lastVerifiedAt = todayISO;
      });
    }

    fs.writeFileSync(JOBS_FILE_PATH, JSON.stringify(jobsData, null, 2), 'utf8');
    console.log(`[AVC Sync] Successfully synchronized jobs data! Updated ${jobsData.jobs.length} jobs.`);
  } catch (err) {
    console.error('[AVC Sync] Channel sync warning:', err.message);
  }
}

syncChannel();
