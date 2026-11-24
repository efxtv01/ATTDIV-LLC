/**
 * ATTDIV LLC - Modern Architectural Website Interactive Script
 * Faithful to the live reference site with 100% responsive UX/UI
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initComparisonSlider();
  initHotspots();
  initInteractiveTooltips();
  initPortfolio();
  initCounters();
  initAnimatedIcons();
  initContactForm();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header');
  const toggleBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    navMenu.querySelectorAll('.nav-link, .nav-menu-cta a, .btn').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE 3D BLUEPRINT VS. RENDER COMPARISON SLIDER
   - Prevents page dragging / scrolling when sliding
   - Works flawlessly on touch & mouse
   ========================================================================== */
function initComparisonSlider() {
  const viewer = document.querySelector('.comparison-viewer');
  const toggleBtns = document.querySelectorAll('.sim-toggle-btn');

  if (!viewer) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = viewer.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));

    viewer.style.setProperty('--slider-pos', `${percentage}%`);

    toggleBtns.forEach(btn => {
      const mode = btn.dataset.mode;
      if (mode === 'blueprint' && percentage <= 5) {
        btn.classList.add('active');
      } else if (mode === 'render' && percentage >= 95) {
        btn.classList.add('active');
      } else if (mode === 'split' && percentage > 35 && percentage < 65) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Mouse Events with preventDefault to avoid page drag
  viewer.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updateSliderPosition(e.clientX);
  });

  // Touch Events with gesture lock so dragging slider does not move page
  viewer.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    updateSliderPosition(touch.clientX);
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchcancel', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    updateSliderPosition(touch.clientX);
  }, { passive: false });

  // Preset Buttons
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.mode;
      if (mode === 'split') {
        viewer.style.setProperty('--slider-pos', '50%');
      } else if (mode === 'blueprint') {
        viewer.style.setProperty('--slider-pos', '0%');
      } else if (mode === 'render') {
        viewer.style.setProperty('--slider-pos', '100%');
      }
    });
  });

  viewer.style.setProperty('--slider-pos', '50%');
}

/* ==========================================================================
   3. HOTSPOTS ON 3D BLUEPRINT
   ========================================================================== */
function initHotspots() {
  const hotspots = document.querySelectorAll('.hotspot-pin');
  const modalOverlay = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalImg = document.getElementById('modalImg');

  hotspots.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = pin.dataset.title || 'Detalle Técnico';
      const desc = pin.dataset.desc || 'Información de plano 3D';

      if (modalOverlay && modalTitle && modalDesc) {
        modalTitle.textContent = title;
        modalCategory.textContent = 'Detalle Técnico 3D - ATTDIV LLC';
        modalDesc.textContent = desc;
        if (modalSpecs) modalSpecs.textContent = 'Modulación milimétrica digital • Tolerancia 0 colisiones';
        if (modalImg) modalImg.src = 'assets/img/plano-sala-web.jpg';

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        alert(`[ATTDIV LLC - Detalle 3D]\n\n${title}\n${desc}`);
      }
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE TOOLTIPS (Desktop Hover + Mobile Tap)
   ========================================================================== */
function initInteractiveTooltips() {
  const tooltips = document.querySelectorAll('.has-tooltip');

  tooltips.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.tooltip-card')) return;

      const wasActive = item.classList.contains('active');
      tooltips.forEach(t => t.classList.remove('active'));

      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-tooltip')) {
      tooltips.forEach(t => t.classList.remove('active'));
    }
  });
}

/* ==========================================================================
   5. PORTFOLIO FILTER & LIGHTBOX MODAL
   ========================================================================== */
function initPortfolio() {
  const filterBtns = document.querySelectorAll('.port-filter-btn');
  const projectCards = document.querySelectorAll('.portfolio-card');
  const modalOverlay = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalImg = document.getElementById('modalImg');
  const modalSpecs = document.getElementById('modalSpecs');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'flex';
            setTimeout(() => { card.style.opacity = '1'; }, 20);
          } else {
            card.style.opacity = '0';
            setTimeout(() => { card.style.display = 'none'; }, 250);
          }
        });
      });
    });
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!modalOverlay) return;

      const title = card.querySelector('.portfolio-title')?.textContent || 'Proyecto 3D';
      const category = card.querySelector('.portfolio-category-tag')?.textContent || 'Planos 3D';
      const imgSrc = card.querySelector('img')?.getAttribute('src') || '';
      const desc = card.dataset.desc || 'Desarrollo integral de planos arquitectónicos 3D online con entrega digital y cumplimiento normativo.';
      const specs = card.dataset.specs || 'Formato: DWG + RVT + PDF | Entrega 100% Online';

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;
      if (modalImg) modalImg.src = imgSrc;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalSpecs) modalSpecs.textContent = specs;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================================
   6. ANIMATED STATISTICS COUNTERS
   ========================================================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  if (statNumbers.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const duration = 1500;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          el.textContent = `${prefix}${Math.floor(start)}${suffix}`;
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. ANIMATED ICONS
   ========================================================================== */
function initAnimatedIcons() {
  const iconBoxes = document.querySelectorAll('.icon-box, .step-badge, .diff-icon');

  if ('IntersectionObserver' in window) {
    const iconObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('icon-animated-entry');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    iconBoxes.forEach(box => iconObserver.observe(box));
  }
}

/* ==========================================================================
   8. CONTACT FORM SUBMISSION FEEDBACK
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('quoteContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="client_name"]')?.value || '';
    const email = form.querySelector('[name="client_email"]')?.value || '';
    const phone = form.querySelector('[name="client_phone"]')?.value || '';
    const type = form.querySelector('[name="project_type"]')?.value || 'Proyecto Arquitectónico';

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Procesando solicitud técnica...</span>`;

    setTimeout(() => {
      submitBtn.innerHTML = `<span>✓ ¡Solicitud Recibida con Éxito!</span>`;
      submitBtn.style.backgroundColor = '#10b981';

      alert(
        `¡Muchas gracias, ${name}!\n\nHemos recibido correctamente tu solicitud de planos 3D para "${type}".\nUn especialista de ATTDIV LLC revisará tus especificaciones y se comunicará en menos de 24 horas a ${email}.\n\nTambién puedes escribirnos directamente a: admin@attdiv.com.`
      );

      form.reset();
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = '';
      }, 4000);
    }, 1000);
  });
}
