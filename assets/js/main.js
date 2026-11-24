/**
 * ATTDIV LLC - ARCHITECTURAL LUXURY INTERACTION SUITE
 * Inspired by Constructora García Template Interactions
 * Dual-Cursor, Hero Zoom, Scroll Reveal, Number Counters, 3D Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initHeroZoom();
  initScrollReveal();
  initCounters();
  initSimulator();
  initContactForm();
});

/* ==========================================================================
   1. CONSTRUCTORA GARCÍA DUAL MOUSE CURSOR
   ========================================================================== */
function initCursor() {
  const cur = document.getElementById('cur');
  const cr = document.getElementById('cring');
  if (!cur || !cr) return;

  // Touch devices check
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    cur.style.display = 'none';
    cr.style.display = 'none';
    return;
  }

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let active = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!active) {
      active = true;
      rx = mx;
      ry = my;
    }
    cur.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  (function tick() {
    if (active) {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cr.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`;
    }
    requestAnimationFrame(tick);
  })();

  const hoverTargets = 'a, button, .sv, .pj, .val, .sim-btn, .pr-step, input, select, textarea, .btn-w, .btn-g, .btn-sub';
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => cr.classList.add('hov'));
    el.addEventListener('mouseleave', () => cr.classList.remove('hov'));
  });
}

/* ==========================================================================
   2. NAVIGATION & MOBILE OVERLAY MENU
   ========================================================================== */
function initNav() {
  const nav = document.getElementById('nav');
  const hbg = document.getElementById('hbg');
  const mob = document.getElementById('mob');
  const mobX = document.getElementById('mobX');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('sc', window.scrollY > 40);
    }, { passive: true });
  }

  if (hbg && mob) {
    hbg.addEventListener('click', () => {
      mob.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobX && mob) {
    mobX.addEventListener('click', closeMob);
  }

  // Close when clicking any menu link inside mobile overlay
  if (mob) {
    mob.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMob);
    });
  }
}

function closeMob() {
  const mob = document.getElementById('mob');
  if (mob) {
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }
}
window.closeMob = closeMob;

/* ==========================================================================
   3. HERO BACKGROUND ZOOM
   ========================================================================== */
function initHeroZoom() {
  const hero = document.getElementById('hero');
  if (hero) {
    // Slight timeout for smooth GPU acceleration trigger
    setTimeout(() => {
      hero.classList.add('go');
    }, 150);
  }
}

/* ==========================================================================
   4. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.rv');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('v');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   5. NUMERIC COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-c]');
  if (!counters.length) return;

  function runCounter(el, target) {
    const duration = 1800;
    const start = performance.now();
    (function step(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - elapsed, 3); // ease-out cubic
      el.textContent = Math.floor(ease * target) + '+';
      if (elapsed < 1) {
        requestAnimationFrame(step);
      }
    })(start);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-c'), 10);
        if (!isNaN(target)) {
          runCounter(entry.target, target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   6. SIMULADOR INTERACTIVO 3D (CAD VS RENDER 3D)
   ========================================================================== */
function initSimulator() {
  const viewport = document.getElementById('simViewport');
  const handle = document.getElementById('simHandle');
  const buttons = document.querySelectorAll('.sim-btn');
  if (!viewport || !handle) return;

  let isDragging = false;

  function setPosition(percentage) {
    const clamped = Math.max(0, Math.min(100, percentage));
    viewport.style.setProperty('--sim-pos', `${clamped}%`);

    buttons.forEach((btn) => {
      const mode = btn.dataset.mode;
      if (mode === 'cad' && clamped >= 95) {
        btn.classList.add('active');
      } else if (mode === 'render' && clamped <= 5) {
        btn.classList.add('active');
      } else if (mode === 'split' && clamped > 35 && clamped < 65) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function handlePointer(clientX) {
    const rect = viewport.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    setPosition(percentage);
  }

  // Mouse Dragging
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    handlePointer(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handlePointer(e.clientX);
  });

  // Touch Dragging (Locked, prevents viewport scroll horizontally)
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  }, { passive: true });

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      isDragging = true;
      handlePointer(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length === 0) return;
    handlePointer(e.touches[0].clientX);
  }, { passive: true });

  // Preset Buttons
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      if (mode === 'cad') {
        setPosition(100);
      } else if (mode === 'render') {
        setPosition(0);
      } else if (mode === 'split') {
        setPosition(50);
      }
    });
  });
}

/* ==========================================================================
   7. FORMULARIO DE CONTACTO DIRECTO
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-sub');
    const name = document.getElementById('fname')?.value || '';
    const email = document.getElementById('femail')?.value || '';
    const phone = document.getElementById('fphone')?.value || '';
    const type = document.getElementById('ftype')?.value || 'Consulta Técnica';
    const message = document.getElementById('fmsg')?.value || '';

    if (btn) {
      btn.textContent = 'Procesando Envío...';
      btn.disabled = true;
    }

    const subject = encodeURIComponent(`Solicitud Técnica ATTDIV LLC - ${type} - ${name}`);
    const body = encodeURIComponent(
      `Estimado equipo técnico de ATTDIV LLC,\n\n` +
      `Solicito asesoría técnica para el siguiente proyecto:\n\n` +
      `Nombre / Contacto: ${name}\n` +
      `Correo: ${email}\n` +
      `Teléfono: ${phone}\n` +
      `Tipo de Servicio: ${type}\n\n` +
      `Descripción del Proyecto:\n${message}\n\n` +
      `----------------------------------------\n` +
      `Enviado desde el portal attdiv.com`
    );

    setTimeout(() => {
      window.location.href = `mailto:admin@attdiv.com?subject=${subject}&body=${body}`;
      if (btn) {
        btn.textContent = '¡Mensaje Preparado! ✓';
        btn.style.background = '#2e7d32';
        btn.style.color = '#ffffff';

        setTimeout(() => {
          btn.textContent = 'Enviar Solicitud de Planos';
          btn.style.background = '';
          btn.style.color = '';
          btn.disabled = false;
          form.reset();
        }, 4000);
      }
    }, 600);
  });
}
