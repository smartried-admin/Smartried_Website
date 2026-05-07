/* ============================================================
   SMARTRIED — main.js
   Modern animations, interactions, and scroll effects
============================================================ */

(function () {
  'use strict';

  const SITE_DEPLOY_VERSION = '2026-05-07-01';

  /* ── Cache/Cookie Hygiene ────────────────────────────── */
  function initSiteDataHygiene() {
    const markerKey = 'smartried_site_data_hygiene_version';
    const previousVersion = localStorage.getItem(markerKey);
    if (previousVersion === SITE_DEPLOY_VERSION) return;

    // Clear site cookies for root path and possible domain scopes.
    document.cookie.split(';').forEach(function (cookie) {
      const eqIdx = cookie.indexOf('=');
      const name = (eqIdx > -1 ? cookie.slice(0, eqIdx) : cookie).trim();
      if (!name) return;

      const host = window.location.hostname;
      const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';

      document.cookie = name + '=;' + expires + ';path=/';
      document.cookie = name + '=;' + expires + ';path=/;domain=' + host;

      if (host.split('.').length > 2) {
        const parent = host.split('.').slice(-2).join('.');
        document.cookie = name + '=;' + expires + ';path=/;domain=.' + parent;
      }
    });

    // Best-effort cache storage cleanup.
    if ('caches' in window) {
      caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (key) {
          return caches.delete(key);
        }));
      }).catch(function () {
        // No-op: cache API may be unavailable in restricted environments.
      });
    }

    // Remove any active service workers to avoid stale cached responses.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (reg) {
          reg.unregister();
        });
      }).catch(function () {
        // No-op.
      });
    }

    localStorage.setItem(markerKey, SITE_DEPLOY_VERSION);
  }

  /* ── Page Loader ──────────────────────────────────────── */
  function initLoader() {
    const body = document.body;

    // Inject loader
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:20px;">
        <img src="/img/favicon.png" alt="Smartried" style="width:80px;height:80px;object-fit:contain;">
        <div class="loader-bar"></div>
      </div>`;
    document.body.prepend(loader);

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('done');
        setTimeout(function () { loader.remove(); }, 500);
      }, 300);
    });
  }

  /* ── Header Scroll Effect ─────────────────────────────── */
  function initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Hamburger / Mobile Menu ──────────────────────────── */
  function initMobileMenu() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('navMenu');
    const mobileMedia = window.matchMedia('(max-width: 768px)');
    if (!btn || !menu) return;

    function closeMenu() {
      menu.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      menu.querySelectorAll('.has-dropdown.mob-open').forEach(function (item) {
        item.classList.remove('mob-open');
      });
    }

    btn.addEventListener('click', function () {
      const open = !menu.classList.contains('is-open');
      menu.classList.toggle('is-open', open);
      btn.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('menu-open', open);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Mobile dropdown toggles
    document.querySelectorAll('.has-dropdown').forEach(function (item) {
      const link = item.querySelector('.nav-link');
      if (!link) return;

      link.addEventListener('click', function (e) {
        if (!mobileMedia.matches) return;
        e.preventDefault();
        e.stopPropagation();

        const willOpen = !item.classList.contains('mob-open');
        menu.querySelectorAll('.has-dropdown.mob-open').forEach(function (openItem) {
          openItem.classList.remove('mob-open');
        });
        item.classList.toggle('mob-open', willOpen);
      });
    });

    // Close menu on nav link click
    menu.querySelectorAll('a.nav-link, .dropdown a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeMenu();
      });
    });

    mobileMedia.addEventListener('change', function (e) {
      if (!e.matches) closeMenu();
    });
  }

  /* ── Scroll Animations ────────────────────────────────── */
  function initScrollAnimations() {
    // Define animation targets with direction rules
    const rules = [
      // Fade up
      {
        selector: '.feature-card, .service-card, .testimonial-card, .vm-card, .sidebar-card, .project-item, .tech-badge',
        dir: 'up',
        stagger: true,
      },
      // Diff cards: alternate left/right by index
      {
        selector: '.diff-card',
        dir: 'alternate',
        stagger: true,
      },
      // Process steps: left to right
      {
        selector: '.process-step',
        dir: 'left',
        stagger: true,
      },
      // Program cards: up
      {
        selector: '.program-card',
        dir: 'up',
        stagger: true,
      },
      // Placement features
      {
        selector: '.placement-feature',
        dir: 'left',
        stagger: true,
      },
      // Stats card from right
      {
        selector: '.placement-stats-card',
        dir: 'right',
        stagger: false,
      },
      // About text from left, visual from right
      {
        selector: '.about-text',
        dir: 'left',
        stagger: false,
      },
      {
        selector: '.about-visual',
        dir: 'right',
        stagger: false,
      },
      // Contact info from left, form from right
      {
        selector: '.contact-info',
        dir: 'left',
        stagger: false,
      },
      {
        selector: '.contact-form-card',
        dir: 'right',
        stagger: false,
      },
      // Service detail: content left, visual right
      {
        selector: '.service-detail-content',
        dir: 'left',
        stagger: false,
      },
      {
        selector: '.service-visual-card',
        dir: 'right',
        stagger: false,
      },
      // Placement content from left, stats from right
      {
        selector: '.placement-content',
        dir: 'left',
        stagger: false,
      },
      // Course catalog items alternate
      {
        selector: '.course-catalog-item',
        dir: 'up',
        stagger: true,
      },
      // Curriculum modules fade up
      {
        selector: '.curriculum-module',
        dir: 'up',
        stagger: true,
      },
      // Contact items
      {
        selector: '.contact-item',
        dir: 'left',
        stagger: true,
      },
      // Section headers
      {
        selector: '.section-header, .page-hero .container > *',
        dir: 'down',
        stagger: true,
      },
      // Hero content
      {
        selector: '.hero-content > *',
        dir: 'up',
        stagger: true,
      },
      // Stats row
      {
        selector: '.stats-row',
        dir: 'right',
        stagger: true,
      },
      // Service check item, visual item
      {
        selector: '.service-visual-item',
        dir: 'right',
        stagger: true,
      },
      {
        selector: '.service-check-item',
        dir: 'left',
        stagger: true,
      },
      // Hero stats
      {
        selector: '.hero-stat-item',
        dir: 'up',
        stagger: true,
      },
      // FAQ items
      {
        selector: '.faq-item',
        dir: 'up',
        stagger: true,
      },
    ];

    const allAnimated = new WeakSet();
    const delayClasses = ['', 'anim-delay-1', 'anim-delay-2', 'anim-delay-3', 'anim-delay-4', 'anim-delay-5', 'anim-delay-6'];

    rules.forEach(function (rule) {
      const els = document.querySelectorAll(rule.selector);
      els.forEach(function (el, i) {
        if (allAnimated.has(el)) return;
        allAnimated.add(el);

        let dir = rule.dir;
        if (dir === 'alternate') dir = i % 2 === 0 ? 'left' : 'right';

        el.classList.add('anim-' + dir);

        if (rule.stagger) {
          const delay = Math.min(i % 6, 6);
          if (delay > 0) el.classList.add('anim-delay-' + delay);
        }
      });
    });

    // IntersectionObserver
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    });

    document.querySelectorAll('.anim-up, .anim-down, .anim-left, .anim-right, .anim-fade').forEach(function (el) {
      io.observe(el);
    });
  }

  /* ── Counter Animation ────────────────────────────────── */
  function animateCounter(el, target, suffix, duration) {
    // Prevent double-run
    if (el.dataset.counted) return;
    el.dataset.counted = '1';

    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Quartic ease-out for snappy feel
      const ease  = 1 - Math.pow(1 - progress, 4);
      const value = target * ease;
      el.textContent = (isFloat ? value.toFixed(1) : Math.round(value).toLocaleString()) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initCounters() {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // Parse number and suffix from existing text content
        const text   = el.textContent.trim();
        const num    = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/^[\d.,]+/, ''); // everything after the number

        if (!isNaN(num) && num > 0) {
          animateCounter(el, num, suffix, 1800);
        }

        io.unobserve(el);
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -40px 0px' });

    // Target all stat number elements across the site
    document.querySelectorAll(
      '.stats-row-value, .hero-stat-item strong, [style*="font-size:2.5rem"], [style*="font-size: 2.5rem"]'
    ).forEach(function (el) {
      io.observe(el);
    });
  }

  /* ── Curriculum Accordion ─────────────────────────────── */
  function initAccordion() {
    document.querySelectorAll('.curriculum-module').forEach(function (module, i) {
      const header = module.querySelector('.module-header');
      const body   = module.querySelector('.module-body');
      if (!header || !body) return;

      // Open first module by default
      if (i === 0) {
        module.classList.add('is-open');
        body.classList.add('is-open');
      }

      header.addEventListener('click', function () {
        const isOpen = module.classList.contains('is-open');
        // Close all
        document.querySelectorAll('.curriculum-module.is-open').forEach(function (m) {
          m.classList.remove('is-open');
          const b = m.querySelector('.module-body');
          if (b) b.classList.remove('is-open');
        });
        // Toggle clicked
        if (!isOpen) {
          module.classList.add('is-open');
          body.classList.add('is-open');
        }
      });
    });
  }

  /* ── FAQ Accordion ────────────────────────────────────── */
  function initFAQ() {
    // Auto-enhance existing FAQ blocks (static HTML div blocks in contact.html)
    const faqContainer = document.querySelector('.section-alt + .section .container > div[style*="flex-direction"]');

    // Also look for any div with faq-item class
    document.querySelectorAll('.faq-item').forEach(function (item) {
      const question = item.querySelector('.faq-question');
      const answer   = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq-item.is-open').forEach(function (f) {
          f.classList.remove('is-open');
          const a = f.querySelector('.faq-answer');
          if (a) a.classList.remove('is-open');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          answer.classList.add('is-open');
        }
      });
    });

    // Transform plain FAQ divs in contact.html to enhanced version
    const plainFaqDivs = document.querySelectorAll('.section div[style*="flex-direction:column"] > div[style*="border:1px"]');
    if (!plainFaqDivs.length) return;

    plainFaqDivs.forEach(function (div, i) {
      const h4 = div.querySelector('h4');
      const p  = div.querySelector('p');
      if (!h4 || !p) return;

      div.className = 'faq-item';
      div.removeAttribute('style');

      div.innerHTML = `
        <div class="faq-question">
          <span>${h4.textContent}</span>
          <span class="faq-arrow"><i class="fa-solid fa-chevron-down"></i></span>
        </div>
        <div class="faq-answer">
          <p>${p.innerHTML}</p>
        </div>`;

      const question = div.querySelector('.faq-question');
      const answer   = div.querySelector('.faq-answer');

      question.addEventListener('click', function () {
        const isOpen = div.classList.contains('is-open');
        document.querySelectorAll('.faq-item.is-open').forEach(function (f) {
          f.classList.remove('is-open');
          f.querySelector('.faq-answer').classList.remove('is-open');
        });
        if (!isOpen) {
          div.classList.add('is-open');
          answer.classList.add('is-open');
        }
      });
    });
  }

  /* ── Scroll to Top Button ─────────────────────────────── */
  function initScrollTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Contact Form ─────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    function showToast(message, type) {
      let toast = document.querySelector('.toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
      }
      toast.textContent = message;
      toast.className = 'toast ' + (type || '');
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 3500);
    }

    function validateField(field) {
      const val = field.value.trim();
      let valid = true;
      field.style.borderColor = '';

      if (field.required && !val) valid = false;
      if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) valid = false;
      if (field.type === 'tel' && val && !/^[\d\s\+\-\(\)]{7,15}$/.test(val)) valid = false;

      if (!valid) {
        field.style.borderColor = '#DC2626';
        field.style.boxShadow = '0 0 0 4px rgba(220,38,38,.1)';
      } else if (val) {
        field.style.borderColor = '#16A34A';
        field.style.boxShadow = '0 0 0 4px rgba(22,163,74,.1)';
      }
      return valid;
    }

    // Live validation
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.style.borderColor === 'rgb(220, 38, 38)') validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let allValid = true;

      form.querySelectorAll('input, select, textarea').forEach(function (field) {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        showToast('Please fill in all required fields correctly.', 'error');
        return;
      }

      // Simulate submission
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      setTimeout(function () {
        showToast('Thank you! We will get back to you shortly.', 'success');
        form.reset();
        form.querySelectorAll('input, select, textarea').forEach(function (f) {
          f.style.borderColor = '';
          f.style.boxShadow = '';
        });
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1600);
    });
  }

  /* ── Active Nav Link ──────────────────────────────────── */
  function initActiveNav() {
    const currentPath = window.location.pathname.replace(/\/+$/, '') || '/home';
    document.querySelectorAll('.nav-link[href]').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '/' && href === '/home')) {
        link.classList.add('active');
      }
    });
  }

  /* ── Smooth Hover Tilt on Cards ───────────────────────── */
  function initCardTilt() {
    if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

    const TILT = 6; // max degrees
    document.querySelectorAll('.program-card, .service-card, .testimonial-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${-y * TILT}deg) rotateY(${x * TILT}deg)`;
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* initInlineStats — merged into initCounters */

  /* ── Ripple Effect on Buttons ─────────────────────────── */
  function initRipple() {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height) * 2;

        Object.assign(ripple.style, {
          position: 'absolute',
          width: size + 'px',
          height: size + 'px',
          left: (x - size / 2) + 'px',
          top: (y - size / 2) + 'px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,.25)',
          transform: 'scale(0)',
          animation: 'ripple .6s linear',
          pointerEvents: 'none',
        });

        // Ensure btn has overflow:hidden
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 650);
      });
    });

    // Add ripple keyframe
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = '@keyframes ripple { to { transform: scale(1); opacity: 0; } }';
      document.head.appendChild(style);
    }
  }

  /* ── Auto One-Line Card Rows ─────────────────────────── */
  function initAutoCardRows() {
    document.querySelectorAll('.features-grid, .services-grid, .differentiators-grid').forEach(function (grid) {
      if (grid.classList.contains('training-programs-scroll')) return;

      const cards = Array.from(grid.children).filter(function (child) {
        return child.classList.contains('feature-card') ||
               child.classList.contains('service-card') ||
               child.classList.contains('diff-card');
      });

      if (cards.length > 5) {
        grid.classList.add('cards-one-line-scroll');
      } else {
        grid.classList.remove('cards-one-line-scroll');
      }
    });
  }

  /* ── Hero Floating Particles ──────────────────────────── */
  function initHeroParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const count = 8;
    const sizes = [60, 90, 120, 80, 100, 70, 110, 50];
    const opacities = [.04, .06, .05, .07, .04, .06, .03, .05];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'hero-decoration';
      const s = sizes[i];
      Object.assign(p.style, {
        width:  s + 'px',
        height: s + 'px',
        top:    Math.random() * 100 + '%',
        left:   Math.random() * 100 + '%',
        opacity: opacities[i],
        animation: `float ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite alternate`,
      });
      hero.appendChild(p);
    }

    if (!document.getElementById('float-style')) {
      const style = document.createElement('style');
      style.id = 'float-style';
      style.textContent = `@keyframes float { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(${Math.random() > .5 ? '' : '-'}${10 + Math.random() * 20}px, ${Math.random() > .5 ? '' : '-'}${10 + Math.random() * 20}px) scale(1.1); } }`;
      document.head.appendChild(style);
    }
  }

  /* ── Hero Slideshow ──────────────────────────────────── */
  function initHeroSlideshow() {
    const slideshow = document.getElementById('heroSlideshow');
    if (!slideshow) return;

    const slides = Array.from(slideshow.querySelectorAll('.hero-slide'));
    if (slides.length < 2) return;

    const prevBtn = slideshow.querySelector('.hero-nav-prev');
    const nextBtn = slideshow.querySelector('.hero-nav-next');

    let activeIndex = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    if (activeIndex < 0) activeIndex = 0;
    let timerId = null;

    function showSlide(nextIndex) {
      slides[activeIndex].classList.remove('is-active');
      slides[nextIndex].classList.add('is-active');
      activeIndex = nextIndex;
    }

    function goNext() {
      const next = (activeIndex + 1) % slides.length;
      showSlide(next);
    }

    function goPrev() {
      const prev = (activeIndex - 1 + slides.length) % slides.length;
      showSlide(prev);
    }

    function restartAutoPlay() {
      if (timerId) clearInterval(timerId);
      timerId = setInterval(goNext, 6000);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goPrev();
        restartAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goNext();
        restartAutoPlay();
      });
    }

    restartAutoPlay();
  }

  /* ── Image Preload ───────────────────────────────────── */
  function preloadSiteImages() {
    const imagePaths = [
      'img/hero_1.jpg',
      'img/hero_2.jpg',
      'img/hero_3.jpg',
      'img/hero_4.jpg',
      'img/contact.jpg',
      'img/about_us.jpg',
      'img/trainings.jpg',
      'img/placements.jpg',
      'img/IT_outsourcing.jpg',
    ];

    imagePaths.forEach(function (src) {
      if (!document.head.querySelector('link[rel="preload"][as="image"][href="' + src + '"]')) {
        const preload = document.createElement('link');
        preload.rel = 'preload';
        preload.as = 'image';
        preload.href = src;
        document.head.appendChild(preload);
      }

      const img = new Image();
      img.decoding = 'async';
      img.src = src;
    });
  }

  /* ── Smooth page transitions ──────────────────────────── */
  function initPageTransitions() {
    document.querySelectorAll('a[href]').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http') || link.target === '_blank') return;

      link.addEventListener('click', function (e) {
        // Allow normal navigation, just add a subtle fade
        document.body.style.transition = 'opacity .2s ease';
        document.body.style.opacity = '.85';
      });
    });

    window.addEventListener('pageshow', function () {
      document.body.style.opacity = '1';
    });
  }
  /* ── Modals ──────────────────────────────────────────── */
  function initModals() {
    const footerLinks = document.querySelectorAll('.footer-bottom-links a');
    const privacyTrigger = document.getElementById('privacyTrigger') || footerLinks[0] || null;
    const termsTrigger = document.getElementById('termsTrigger') || footerLinks[1] || null;
    const privacyModal = document.getElementById('privacyModal');
    const termsModal = document.getElementById('termsModal');
    const closeButtons = document.querySelectorAll('.modal-close');

    if (!privacyModal && !termsModal) return;

    function openModal(modal) {
      if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal(modal) {
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
      }
    }

    if (privacyTrigger) {
      privacyTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(privacyModal);
      });
    }

    if (termsTrigger) {
      termsTrigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(termsModal);
      });
    }

    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const modal = this.closest('.modal');
        closeModal(modal);
      });
    });

    [privacyModal, termsModal].forEach(function (modal) {
      if (modal) {
        modal.addEventListener('click', function (e) {
          if (e.target === this) {
            closeModal(this);
          }
        });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeModal(privacyModal);
        closeModal(termsModal);
      }
    });
  }
  /* ── Init All ─────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initSiteDataHygiene();
    preloadSiteImages();
    initLoader();
    initHeader();
    initMobileMenu();
    initScrollTop();
    initScrollAnimations();
    initCounters();
    initAccordion();
    initFAQ();
    initContactForm();
    initActiveNav();
    initCardTilt();
    initRipple();
    initHeroSlideshow();
    initHeroParticles();
    initPageTransitions();
    initModals();
    initAutoCardRows();
  });

})();


