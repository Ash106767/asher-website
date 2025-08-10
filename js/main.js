// Year in footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Tag projects with slide direction (alternating left/right)
document.querySelectorAll('.project').forEach((el, i) => {
  el.classList.add(i % 2 === 0 ? 'slide-l' : 'slide-r');
});

if (!REDUCED && 'IntersectionObserver' in window) {
  // Reveal projects (slide from side)
  const projIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      projIO.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll('.project').forEach(el => projIO.observe(el));

  // Reveal media items (staggered slide-up)
  const mediaIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const delay = [...el.parentElement.children].indexOf(el) * 60; // 60ms stagger
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('in');
      mediaIO.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll('.media').forEach(el => mediaIO.observe(el));
}
