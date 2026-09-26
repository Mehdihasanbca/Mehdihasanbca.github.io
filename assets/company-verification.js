/**
 * Assignment Venue Center (AVC) - Company Verification Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy-to-Clipboard functionality
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;
      
      try {
        await navigator.clipboard.writeText(text);
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied';
        btn.classList.add('copied');
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    });
  });

  // 2. FAQ Accordion functionality
  const faqItems = document.querySelectorAll('.verif-faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.verif-faq-question');
    if (!questionBtn) return;
    
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
        }
      });
      
      // Toggle current item
      item.classList.toggle('open', !isOpen);
    });
  });

  // 3. Verification Request Form Handling
  const verifForm = document.getElementById('verificationRequestForm');
  const formStatus = document.getElementById('formStatusMessage');
  
  if (verifForm) {
    verifForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = verifForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting Request...';
      }
      
      setTimeout(() => {
        verifForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Verification Request';
        }
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.innerHTML = `
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; padding:14px 18px; border-radius:8px; margin-top:16px;">
              <strong>✓ Verification Request Received!</strong> Our compliance officer will review your request and dispatch certified verification records within 1 business day.
            </div>
          `;
        }
      }, 900);
    });
  }

  // 4. Update dynamic year
  const yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });
});
