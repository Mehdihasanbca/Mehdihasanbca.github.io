/* ==================================================
   GLOBAL ANALYTICS DEPLOYMENT (GA4, CLARITY, POSTHOG)
   ================================================== */
   
// 1. Google Analytics 4 (GA4)
(function() {
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'; // Replace with actual ID
  script.async = true;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX'); // Replace with actual ID
})();

// 2. Microsoft Clarity
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "PLACEHOLDER_CLARITY_ID");

// 3. PostHog
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once set_config opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing start_session_recording stop_session_recording onSessionId set_person_profiles set_group_properties update_group_properties reset_group_properties get_group_properties reset_groups group".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_PLACEHOLDER_POSTHOG_KEY', {
    api_host:'https://us.i.posthog.com',
    person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
});

/**
 * Assignment Venue Center (AVC)
 * Enterprise Client-Side Analytics & Conversion Telemetry Engine
 * Tracks user interactions, funnel progression, form abandonments,
 * lead downloads, and external outreach channels.
 */

(() => {
  'use strict';

  const STORAGE_KEY = 'avc_analytics_events';
  const SESSION_KEY = 'avc_session_id';

  // Generate or retrieve persistent anonymous session ID
  const getSessionId = () => {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = 'avc_s_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  };

  // Helper: Retrieve event ledger
  const getLedger = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  };

  // Helper: Save event
  const logEvent = (eventName, params = {}) => {
    const timestamp = new Date().toISOString();
    const eventObj = {
      event: eventName,
      session_id: getSessionId(),
      path: window.location.pathname,
      timestamp,
      url: window.location.href,
      device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      ...params
    };

    // Store up to 250 latest events in local ledger
    const ledger = getLedger();
    ledger.push(eventObj);
    if (ledger.length > 250) ledger.shift();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger));
    } catch (e) {
      // storage full or disabled
    }

    // Google Tag Manager / GA4 layer compatibility
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(eventObj);
    }

    // Log to console in development
    if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
      console.log(`[AVC Analytics] ðŸ“Š ${eventName}`, params);
    }

    // Dispatch custom DOM event
    window.dispatchEvent(new CustomEvent('avc_analytics_event', { detail: eventObj }));
  };

  // Public Telemetry Interface
  window.AVCAnalytics = {
    track: logEvent,

    getLedger: getLedger,

    getSummary: () => {
      const ledger = getLedger();
      const counts = {};
      const stepDrops = { step1: 0, step2: 0, step3: 0, step4: 0, completed: 0 };

      ledger.forEach((item) => {
        counts[item.event] = (counts[item.event] || 0) + 1;
        if (item.event === 'wizard_step_view' && item.step) {
          stepDrops['step' + item.step] = (stepDrops['step' + item.step] || 0) + 1;
        }
        if (item.event === 'form_complete') {
          stepDrops.completed = (stepDrops.completed || 0) + 1;
        }
      });

      return {
        total_events: ledger.length,
        session_id: getSessionId(),
        events_breakdown: counts,
        funnel_flow: stepDrops
      };
    },

    clearData: () => {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      console.log('[AVC Analytics] Telemetry cleared.');
    }
  };

  // Auto-Instrumentation when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Page view
    logEvent('page_view', {
      title: document.title,
      referrer: document.referrer || 'direct'
    });

    // 2. Track WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"], [data-track-whatsapp]').forEach((el) => {
      el.addEventListener('click', () => {
        logEvent('whatsapp_click', {
          cta_text: el.innerText.trim().substring(0, 50),
          location: el.closest('header') ? 'header' : el.closest('footer') ? 'footer' : el.classList.contains('floating-whatsapp-cta') ? 'floating_widget' : 'page_body'
        });
      });
    });

    // 3. Track Telephone calls
    document.querySelectorAll('a[href^="tel:"]').forEach((el) => {
      el.addEventListener('click', () => {
        logEvent('call_click', {
          phone_number: el.getAttribute('href').replace('tel:', ''),
          location: el.closest('.topbar') ? 'topbar' : el.closest('header') ? 'header' : 'page_body'
        });
      });
    });

    // 4. Track Government Verification link clicks
    document.querySelectorAll('a[href*="gst.gov.in"], a[href*="udyamregistration.gov.in"], a[href*="company-verification"]').forEach((el) => {
      el.addEventListener('click', () => {
        logEvent('verification_click', {
          target: el.getAttribute('href'),
          text: el.innerText.trim().substring(0, 40)
        });
      });
    });

    // 5. Form First Interaction (Form Start)
    const candidateForm = document.getElementById('candidate-apply-form');
    if (candidateForm) {
      let formStarted = false;
      candidateForm.addEventListener('focusin', () => {
        if (!formStarted) {
          formStarted = true;
          logEvent('form_start', { form_id: 'candidate-apply-form' });
        }
      }, { once: true });
    }

    const employerForm = document.getElementById('employer-intake-form');
    if (employerForm) {
      let employerStarted = false;
      employerForm.addEventListener('focusin', () => {
        if (!employerStarted) {
          employerStarted = true;
          logEvent('form_start', { form_id: 'employer-intake-form' });
        }
      }, { once: true });
    }

    // 6. Track Lead Magnet downloads
    document.querySelectorAll('[data-track-lead-magnet]').forEach((el) => {
      el.addEventListener('click', () => {
        logEvent('lead_magnet_click', {
          guide_name: el.getAttribute('data-guide-name') || el.innerText.trim()
        });
      });
    });

    // 7. Track Video play triggers
    document.querySelectorAll('[data-video-modal-trigger]').forEach((el) => {
      el.addEventListener('click', () => {
        logEvent('video_view_click', {
          video_title: el.getAttribute('data-video-title') || el.innerText.trim()
        });
      });
    });
  });
})();

