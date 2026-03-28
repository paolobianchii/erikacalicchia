/* ==========================================================================
   Erika Calicchia — Interactions & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loading');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('loading');
    });
  });

  initNavbar();
  initNavbarTheme();
  initMobileMenu();
  initRevealAnimations();
  initFAQ();
  initServicesAccordion();
  initSmoothScroll();
  initFloatingButtons();
  initActiveNav();
  initBackToTop();
  initCookieBanner();
  initCustomCursor();
});

/* --- Navbar scroll effect --- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Navbar theme (celeste on dark sections, dark on light sections) --- */
function initNavbarTheme() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const darkSections = document.querySelectorAll('.section--services, .section--quote, .section--contact');
  if (!darkSections.length) return;

  let ticking = false;

  const update = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const navBottom = navbar.getBoundingClientRect().bottom;
        let onDark = false;

        darkSections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= navBottom && rect.bottom > navBottom) {
            onDark = true;
          }
        });

        navbar.classList.toggle('navbar--on-dark', onDark);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* --- Mobile menu --- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open');
    toggle.classList.toggle('active');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* --- Scroll reveal animations --- */
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        const siblingDelay = getSiblingDelay(el);

        setTimeout(() => {
          el.classList.add('revealed');
        }, Number(delay) + siblingDelay);

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function getSiblingDelay(el) {
  const parent = el.parentElement;
  if (!parent) return 0;

  const siblings = parent.querySelectorAll(':scope > .reveal');
  if (siblings.length <= 1) return 0;

  const index = Array.from(siblings).indexOf(el);
  return index * 100;
}

/* --- FAQ Accordion --- */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* --- Services Accordion --- */
function initServicesAccordion() {
  const accordion = document.getElementById('servicesAccordion');
  if (!accordion) return;

  const items = accordion.querySelectorAll('.accordion-item');
  
  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items (accordion behavior)
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isOpen);
      header.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* --- Smooth scroll with offset --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbar = document.getElementById('navbar');
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* --- Floating buttons + mobile bar visibility --- */
function initFloatingButtons() {
  const fabContainer = document.getElementById('fabContainer');
  const mobileBar = document.getElementById('mobileBar');
  if (!fabContainer && !mobileBar) return;

  let ticking = false;
  const SHOW_AFTER = 400;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const show = window.scrollY > SHOW_AFTER;
        if (fabContainer) fabContainer.classList.toggle('visible', show);
        if (mobileBar) mobileBar.classList.toggle('visible', show);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Back to top button (mobile) --- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;
  const SHOW_AFTER = 800;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > SHOW_AFTER);
        ticking = false;
      });
      ticking = true;
    }
  };

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --- Active navigation link based on scroll position --- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const navbar = document.getElementById('navbar');
        const offset = (navbar ? navbar.offsetHeight : 0) + 60;
        let currentId = '';

        sections.forEach(section => {
          const top = section.offsetTop - offset;
          if (window.scrollY >= top) {
            currentId = section.id;
          }
        });

        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Cookie Banner --- */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');
  
  if (!banner || !acceptBtn) return;
  
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 800);
  }
  
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'true');
    banner.classList.remove('show');
  });
}

/* --- Custom Cursor --- */
function initCustomCursor() {
  // Solo su non-touch devices preferibilmente, ma se richiesto lo mostriamo
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const darkSections = document.querySelectorAll('.hero, .section--services, .section--quote, .section--contact');
  
  function animate() {
    let distX = mouseX - cursorX;
    let distY = mouseY - cursorY;
    
    cursorX += distX * 0.15;
    cursorY += distY * 0.15;
    
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    
    // Color detection
    let overDark = false;
    darkSections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (cursorX >= rect.left && cursorX <= rect.right && 
          cursorY >= rect.top && cursorY <= rect.bottom) {
        overDark = true;
      }
    });
    
    cursor.classList.toggle('custom-cursor--on-light', !overDark);
    
    requestAnimationFrame(animate);
  }
  
  animate();
}
