/* ============================================
   Harvesting Hope — Main JavaScript
   Vanilla ES6+ | Zero dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initActiveNav();
  initFadeAnimations();
  initCounters();
  initForms();
  initFAQ();
  initModal();
});

/* --- Page Loader --- */
function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 400);
    }, 300);
  });
}

/* --- Sticky Navbar --- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');
  if (!hamburger || !navLinks) return;

  const toggle = () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    overlay?.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const close = () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggle);
  overlay?.addEventListener('click', close);
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* --- Smooth Scroll --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 80;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    });
  });
}

/* --- Active Nav Link --- */
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (!link.classList.contains('nav-cta')) {
      link.classList.remove('active');
    }
  });
}

/* --- Fade-in Animations --- */
function initFadeAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* --- Counter Animations --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + '+';
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* --- Forms --- */
function initForms() {
  const endpoint = window.SITE_CONFIG?.formEndpoint;

  async function submitToFormService(data, formType) {
    if (!endpoint) return false;
    const payload = { ...data, _subject: `${formType} — Harvesting Hope`, _template: 'table' };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      const data = Object.fromEntries(new FormData(contactForm));
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending...';
      try {
        const sent = await submitToFormService(data, 'Contact Enquiry');
        if (sent) {
          showToast('Message sent! Carin will get back to you soon.', 'success');
          contactForm.reset();
        } else {
          window.location.href = `mailto:carin@harvestinghope.africa?subject=Website Enquiry&body=Name: ${encodeURIComponent(data.name)}%0AEmail: ${encodeURIComponent(data.email)}%0A%0A${encodeURIComponent(data.message)}`;
        }
      } catch {
        window.location.href = `mailto:carin@harvestinghope.africa?subject=Website Enquiry&body=Name: ${encodeURIComponent(data.name)}%0AEmail: ${encodeURIComponent(data.email)}%0A%0A${encodeURIComponent(data.message)}`;
      }
      btn.disabled = false; btn.textContent = 'Send Message';
    });
  }

  const giftForm = document.getElementById('giftForm');
  if (giftForm) {
    giftForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(giftForm)) return;
      const data = Object.fromEntries(new FormData(giftForm));
      const btn = giftForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending...';
      try {
        const sent = await submitToFormService(data, 'Gift a Kit Request');
        if (sent) {
          showToast('Gift kit request sent to Carin!', 'success');
          giftForm.reset();
          closeModal();
        } else {
          window.location.href = `mailto:carin@harvestinghope.africa?subject=Gift a Kit Request&body=From: ${encodeURIComponent(data.senderName)} (${encodeURIComponent(data.senderEmail)})%0ARecipient: ${encodeURIComponent(data.recipientName)} (${encodeURIComponent(data.recipientEmail)})%0AMessage: ${encodeURIComponent(data.giftMessage || 'N/A')}`;
        }
      } catch {
        window.location.href = `mailto:carin@harvestinghope.africa?subject=Gift a Kit Request&body=From: ${encodeURIComponent(data.senderName)}`;
      }
      btn.disabled = false; btn.textContent = 'Send Gift Kit Request';
    });
  }

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      if (!email) return;
      try { await submitToFormService({ email }, 'Newsletter Signup'); } catch {}
      showToast('Subscribed! Welcome to the community.', 'success');
      newsletterForm.reset();
    });
  }
}

function validateForm(form) {
  let valid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  form.querySelectorAll('[required]').forEach(input => {
    const errorEl = input.nextElementSibling;
    if (!input.value.trim()) {
      input.classList.add('error');
      if (errorEl?.classList.contains('form-error')) { errorEl.textContent = 'This field is required'; errorEl.classList.add('visible'); }
      valid = false;
    } else if (input.type === 'email' && !emailRegex.test(input.value)) {
      input.classList.add('error');
      if (errorEl?.classList.contains('form-error')) { errorEl.textContent = 'Please enter a valid email'; errorEl.classList.add('visible'); }
      valid = false;
    } else {
      input.classList.remove('error');
      if (errorEl?.classList.contains('form-error')) { errorEl.classList.remove('visible'); }
    }
  });
  return valid;
}

/* --- Toast Notifications --- */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* --- FAQ Accordion --- */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(openItem => openItem.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* --- Modal --- */
function initModal() {
  const openBtns = document.querySelectorAll('[data-modal]');
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('modal');
  if (!backdrop || !modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      backdrop.classList.add('active');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  modal.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeModal));
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function closeModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('modal');
  if (backdrop) backdrop.classList.remove('active');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}
