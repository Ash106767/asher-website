// --- Config toggles (turn off if you want it calmer) ---
const ENABLE_TILT = true;          // card tilt on hover
const ENABLE_PRESS_SQUISH = true;  // click/tap squish
const ENABLE_STAGGER = true;       // stagger media items on reveal

// Year in footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Respect reduced motion
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- On-scroll reveal (transform-only; slight overshoot) ---
if (!REDUCED && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;

      // Pop-in for the project card
      const anim = el.animate(
        [
          { transform: 'translateY(14px) scale(0.98)' },
          { transform: 'translateY(-2px) scale(1.015)', offset: 0.7 },
          { transform: 'translateY(0) scale(1)' },
        ],
        { duration: 650, easing: 'cubic-bezier(.22,1.4,.36,1)', fill: 'forwards' }
      );
      // release transform so tilt can take over
      anim.onfinish = () => anim.cancel();

      // Stagger media items inside this project
      if (ENABLE_STAGGER) {
        const items = el.querySelectorAll('.media');
        items.forEach((it, i) => {
          const a = it.animate(
            [
              { transform: 'translateY(12px)' },
              { transform: 'translateY(0)' }
            ],
            { duration: 400, delay: 60 * i, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
          );
          a.onfinish = () => a.cancel();
        });
      }

      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

  document.querySelectorAll('.project').forEach((el) => io.observe(el));
}

// --- Gummy tilt on hover (pointer devices only) ---
if (ENABLE_TILT && matchMedia('(pointer:fine)').matches && !REDUCED) {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const handleMove = (el, e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;    // 0..1
    const y = (e.clientY - r.top) / r.height;    // 0..1
    const rx = clamp((0.5 - y) * 8, -6, 6);      // tilt up/down
    const ry = clamp((x - 0.5) * 10, -8, 8);     // tilt left/right
    el.style.setProperty('--rx', rx.toFixed(2) + 'deg');
    el.style.setProperty('--ry', ry.toFixed(2) + 'deg');
  };

  document.querySelectorAll('.project').forEach((el) => {
    let raf = null;
    el.addEventListener('pointerenter', (e) => {
      el.style.setProperty('--scale', '1.01');
    });
    el.addEventListener('pointermove', (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => handleMove(el, e));
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--scale', '1');
    });
  });
}

// --- Gummy press (squish on click/tap) ---
if (ENABLE_PRESS_SQUISH && !REDUCED) {
  const rebound = (el) => {
    const a = el.animate(
      [
        { transform: 'scale(0.985)' },
        { transform: 'scale(1.012)', offset: 0.6 },
        { transform: 'scale(1)' }
      ],
      { duration: 220, easing: 'cubic-bezier(.22,1.4,.36,1)', fill: 'forwards' }
    );
    a.onfinish = () => a.cancel();
  };

  document.querySelectorAll('.project').forEach((el) => {
    el.addEventListener('pointerdown', () => el.style.setProperty('--scale', '0.985'));
    ['pointerup','pointercancel','pointerleave'].forEach(ev => {
      el.addEventListener(ev, () => {
        el.style.setProperty('--scale', '1');
        rebound(el);
      });
    });
  });
}
