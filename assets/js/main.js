/**
 * ATTDIV LLC - Modern Mobile-First Architectural Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initComparisonSlider();
  initHotspots();
  initPortfolioModal();
  initContactForm();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.header');
  const toggleBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!drawer.contains(e.target) && !toggleBtn.contains(e.target) && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE 3D SIMULATOR (TOUCH & MOUSE LOCKED)
   ========================================================================== */
function initComparisonSlider() {
  const viewer = document.querySelector('.comparison-viewer');
  const toggleBtns = document.querySelectorAll('.sim-btn');

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

  // Mouse Events with preventDefault
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

  // Touch Events (passive: false with e.preventDefault to lock page scroll)
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

  viewer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0] || e.changedTouches[0];
    updateSliderPosition(touch.clientX);
  }, { passive: false });

  // Mode Switcher Buttons
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
}

/* ==========================================================================
   3. SIMULATOR HOTSPOTS
   ========================================================================== */
function initHotspots() {
  const pins = document.querySelectorAll('.hotspot-pin');
  const cards = document.querySelectorAll('.sim-hotspot-card');

  pins.forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const pinNum = pin.textContent.trim();

      cards.forEach(c => {
        if (c.dataset.pin === pinNum) {
          c.classList.add('active');
          c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          c.classList.remove('active');
        }
      });
    });
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const pinNum = card.dataset.pin;
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      pins.forEach(p => {
        if (p.textContent.trim() === pinNum) {
          p.style.transform = 'scale(1.4)';
          setTimeout(() => p.style.transform = '', 500);
        }
      });
    });
  });
}

/* ==========================================================================
   4. PORTFOLIO MODAL LIGHTBOX
   ========================================================================== */
function initPortfolioModal() {
  const projectCards = document.querySelectorAll('.project-card');
  const modalOverlay = document.getElementById('projectModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalClose = document.querySelector('.modal-close-btn');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      if (!modalOverlay) return;

      const title = card.dataset.title || card.querySelector('.project-title')?.textContent || 'Proyecto 3D';
      const imgSrc = card.querySelector('img')?.getAttribute('src') || '';
      const desc = card.dataset.desc || card.querySelector('.project-desc')?.textContent || 'Desarrollo integral de planos arquitectónicos 3D online con entrega digital y cumplimiento normativo.';
      const specs = card.dataset.specs || card.querySelector('.project-specs-line')?.textContent || 'Entrega 100% Online';

      if (modalTitle) modalTitle.textContent = title;
      if (modalImg && imgSrc) {
        modalImg.src = imgSrc;
        modalImg.style.display = 'block';
      }
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
   5. CONTACT FORM (Client Feedback & Direct Email)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('quoteContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value || 'Cliente';
    const email = form.querySelector('[name="email"]')?.value || 'admin@attdiv.com';
    const type = form.querySelector('[name="project_type"]')?.value || 'Proyecto 3D';
    const area = form.querySelector('[name="area"]')?.value || 'No especificada';
    const msg = form.querySelector('[name="message"]')?.value || '';

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Enviando solicitud...</span>`;

    setTimeout(() => {
      submitBtn.innerHTML = `<span>✓ ¡Solicitud Recibida!</span>`;
      submitBtn.style.backgroundColor = '#10b981';

      alert(
        `¡Muchas gracias, ${name}!\n\nHemos registrado correctamente tu solicitud de planos 3D para "${type}" (${area}).\nUn especialista técnico de ATTDIV LLC revisará tus especificaciones y se comunicará a ${email}.\n\nTambién puedes escribirnos directamente a: admin@attdiv.com.`
      );

      // Open mail client as well
      const mailtoUrl = `mailto:admin@attdiv.com?subject=${encodeURIComponent("Solicitud Planos 3D: " + type)}&body=${encodeURIComponent("Nombre: " + name + "\nCorreo: " + email + "\nTipo: " + type + "\nSuperficie: " + area + "\n\nDetalles:\n" + msg)}`;
      window.location.href = mailtoUrl;

      form.reset();
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = '';
      }, 4000);
    }, 800);
  });
}
