/* ================================================
   Harvesting Hope — Main JS
   FreedomHub Agency Build | 2026-03-10
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  // ---- Scroll: shrink nav ----
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 50 ? '0 4px 24px rgba(0,0,0,0.1)' : '';
    });
  }

  // ---- Animated counters ----
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (current >= target) clearInterval(timer);
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));

  // ---- Scroll reveal ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObs.observe(el));

  // ---- Video placeholder click ----
  const videoPlaceholder = document.querySelector('.video-placeholder');
  const videoEl = document.querySelector('.video-wrapper video');
  if (videoPlaceholder && videoEl) {
    videoPlaceholder.addEventListener('click', () => {
      videoEl.play();
      videoPlaceholder.style.display = 'none';
    });
  }

  // ---- Contact form ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Formspree fallback — replace with n8n webhook when ready
      const data = Object.fromEntries(new FormData(contactForm));
      const endpoint = contactForm.dataset.webhook || '#';

      try {
        if (endpoint !== '#') {
          await fetch(endpoint, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) });
        }
        contactForm.innerHTML = '<div style="padding:2rem;text-align:center;background:var(--cream-dark);border-radius:12px"><h3 style="color:var(--green-dark);margin-bottom:0.5rem">Message sent!</h3><p>We\'ll get back to you within 24 hours.</p></div>';
      } catch {
        btn.textContent = orig;
        btn.disabled = false;
        alert('Something went wrong. Please email us at carin@harvestinghope.africa');
      }
    });
  }

  // ---- Donate form amount selection ----
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('custom-amount');
  const hiddenAmount = document.getElementById('donation-amount');
  if (amountBtns.length) {
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (customInput) customInput.value = '';
        if (hiddenAmount) hiddenAmount.value = btn.dataset.amount;
      });
    });
    if (customInput && hiddenAmount) {
      customInput.addEventListener('input', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        hiddenAmount.value = customInput.value;
      });
    }
  }

});

// ---- Reveal animation CSS (injected) ----
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
  .reveal.revealed { opacity: 1; transform: none; }
  .amount-btn { padding: 0.6rem 1.25rem; border: 2px solid var(--green); border-radius: 8px; background: transparent; color: var(--green); font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .amount-btn:hover, .amount-btn.active { background: var(--green); color: white; }
  .amount-grid { display: flex; gap: 0.75rem; flex-wrap: wrap; margin: 1rem 0; }
`;
document.head.appendChild(style);
