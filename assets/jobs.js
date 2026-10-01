/**
 * Assignment Venue Center (AVC)
 * High-Converting Interactive Jobs Ledger & Vacancy Board Engine
 */

(() => {
  'use strict';

  const list = document.querySelector('[data-jobs-list]');
  if (!list) return;

  const search = document.querySelector('[data-job-search]');
  const country = document.querySelector('[data-job-country]');
  const category = document.querySelector('[data-job-category]');
  const count = document.querySelector('[data-job-count]');
  const empty = document.querySelector('[data-jobs-empty]');
  const quickChips = document.querySelectorAll('[data-quick-cat]');
  const channel = 'https://whatsapp.com/channel/0029Vb7mJuWF1YlQJ0sKSn06';
  const allowedStatuses = new Set(['open', 'closing-soon']);
  let jobs = [];

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[c]));

  const toDate = (v) => (v ? new Date(`${v}T23:59:59`) : null);
  const today = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const isCurrent = (j) => {
    const status = String(j.status || '').toLowerCase();
    if (!allowedStatuses.has(status)) return false;
    const expiry = toDate(j.validThrough);
    return !expiry || expiry >= today();
  };

  const fmtDate = (v) => {
    if (!v) return '';
    const d = new Date(`${v}T00:00:00`);
    return Number.isNaN(d.getTime())
      ? v
      : d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
  };

  const safeSlug = (v) => (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(v || '')) ? String(v) : '');

  const getCountryFlag = (c) => {
    const map = {
      'Saudi Arabia': '🇸🇦',
      UAE: '🇦🇪',
      Qatar: '🇶🇦',
      Oman: '🇴🇲',
      Kuwait: '🇰🇼',
      Bahrain: '🇧🇭',
      India: '🇮🇳'
    };
    return map[c] || '🌍';
  };

  let activeQuickCategory = '';

  const render = () => {
    const q = (search?.value || '').trim().toLowerCase();
    const c = country?.value || '';
    const cat = activeQuickCategory || category?.value || '';

    const filtered = jobs.filter((j) => {
      const matchQuery =
        !q ||
        [j.id, j.title, j.country, j.city, j.category, j.summary, j.requirements]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      const matchCountry = !c || j.country === c;
      const matchCat =
        !cat ||
        j.category?.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(j.category?.toLowerCase() || '');

      return matchQuery && matchCountry && matchCat;
    });

    if (count) count.textContent = String(filtered.length);
    list.innerHTML = '';

    if (!filtered.length) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    filtered.forEach((j) => {
      const article = document.createElement('article');
      article.className = 'job-card-modern';
      article.id = `job-${esc(j.id)}`;

      const slug = safeSlug(j.slug);
      const detailUrl = slug ? `vacancies/${encodeURIComponent(slug)}.html` : '';
      const applyUrl = `apply.html?source=jobs&job=${encodeURIComponent(String(j.id || ''))}`;
      const flag = getCountryFlag(j.country);

      // WhatsApp Share message
      const shareText = `*VACANCY ALERT — ASSIGNMENT VENUE CENTER (AVC)*
*Role:* ${j.title}
*Location:* ${j.country}${j.city ? ` (${j.city})` : ''}
*Salary:* ${j.salaryDisplay || 'Competitive + OT'}
*Requirements:* ${j.requirements || 'Trade Experience'}
*100% Free Candidate Registration:*
https://assignmentvenuecentre.me/apply.html?job=${j.id}`;
      const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

      article.innerHTML = `
        <div class="job-card-header">
          <div class="job-badges-top">
            <span class="job-ref-tag">${esc(j.id)}</span>
            <span class="job-cat-tag">${esc(j.category || 'Technical Trade')}</span>
            <span class="job-status-pill open">● Active Sourcing</span>
          </div>
          <h3 class="job-title-link">
            <a href="${esc(applyUrl)}">${esc(j.title)}</a>
          </h3>
          <p class="job-location-line">
            <span class="country-flag">${flag}</span>
            <strong>${esc(j.country || 'Gulf')}</strong>${j.city ? ` · ${esc(j.city)}` : ''}
          </p>
        </div>

        <div class="job-card-body">
          <p class="job-summary-text">${esc(j.summary || 'Verified vacancy for client interview drive at Darbhanga Venue.')}</p>

          <div class="job-salary-banner">
            <span class="salary-label">Offered Salary:</span>
            <span class="salary-amount">${esc(j.salaryDisplay || 'Competitive + Overtime')}</span>
          </div>

          ${
            j.requirements
              ? `<div class="job-detail-row">
                  <span class="detail-label">📋 Trade Criteria:</span>
                  <span class="detail-value">${esc(j.requirements)}</span>
                </div>`
              : ''
          }

          ${
            j.benefits
              ? `<div class="job-detail-row">
                  <span class="detail-label">🎁 Provisions:</span>
                  <span class="detail-value">${esc(j.benefits)}</span>
                </div>`
              : ''
          }

          <div class="job-meta-footer">
            <span class="job-date">📅 Apply by: <strong>${esc(fmtDate(j.validThrough))}</strong></span>
            <span class="job-free-tag">🛡️ ₹0 Candidate Fee Guaranteed</span>
          </div>
        </div>

        <div class="job-card-footer">
          <a class="btn-job-apply" href="${esc(applyUrl)}">
            <span>Apply Free</span>
            <span>➔</span>
          </a>
          <a class="btn-job-share" href="${esc(waShareUrl)}" target="_blank" rel="noopener noreferrer" title="Share on WhatsApp">
            <span>💬 Share</span>
          </a>
          ${
            detailUrl
              ? `<a class="btn-job-details" href="${esc(detailUrl)}" title="View Vacancy Details">Details</a>`
              : ''
          }
        </div>
      `;

      list.appendChild(article);
    });
  };

  const buildFilters = () => {
    const countries = [...new Set(jobs.map((j) => j.country).filter(Boolean))].sort();
    const cats = [...new Set(jobs.map((j) => j.category).filter(Boolean))].sort();

    countries.forEach((v) =>
      country?.insertAdjacentHTML('beforeend', `<option value="${esc(v)}">${esc(v)}</option>`)
    );
    cats.forEach((v) =>
      category?.insertAdjacentHTML('beforeend', `<option value="${esc(v)}">${esc(v)}</option>`)
    );
  };

  // Quick Chips Click Handler
  quickChips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      quickChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeQuickCategory = chip.dataset.quickCat || '';
      if (category) category.value = activeQuickCategory;
      render();
    });
  });

  // Fetch jobs
  fetch('data/jobs.json', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('jobs data unavailable'))))
    .then((data) => {
      jobs = (Array.isArray(data.jobs) ? data.jobs : [])
        .filter(isCurrent)
        .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')));
      buildFilters();
      render();
    })
    .catch(() => {
      jobs = [];
      render();
    });

  [search, country, category].forEach((el) =>
    el && el.addEventListener(el === search ? 'input' : 'change', () => {
      if (el === category) {
        activeQuickCategory = category.value;
        quickChips.forEach((c) => {
          c.classList.toggle('active', (c.dataset.quickCat || '') === activeQuickCategory);
        });
      }
      render();
    })
  );
})();
