/* ═══════════════════════════════════
   TAMIL LITERATURE — Interactive JS
═══════════════════════════════════ */

// ─── SCROLL REVEAL ───
(function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.timeline-item, .script-card, .poet-card, .anthology-card, .tinai-card, ' +
    '.poem-card, .kural-item, .overview-card, .epic-card, .poet-card-full, ' +
    '.era-item, .str-card, .comp-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => {
    el.classList.add('scroll-hidden');
    observer.observe(el);
  });
})();

// ─── NAV SHRINK ON SCROLL ───
(function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });
})();

// ─── ACTIVE NAV LINK ───
(function initActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  links.forEach((link) => {
    const href = link.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path) {
      link.classList.add('nav-active');
    }
  });
})();

// ─── KURAL RANDOM SPOTLIGHT ───
(function initKuralSpotlight() {
  const btn = document.getElementById('randomKural');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.dispatchEvent(new CustomEvent('kural-random'));
  });
})();

// ─── SMOOTH COUNTER ANIMATION ───
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

(function initCounters() {
  const counters = document.querySelectorAll('.hero-stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.replace(/[^0-9.]/g, '');
        const suffix = el.textContent.replace(/[0-9,.]/g, '');
        el.dataset.target = raw;
        el.dataset.suffix = suffix;
        animateCounter(el);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((c) => observer.observe(c));
})();
