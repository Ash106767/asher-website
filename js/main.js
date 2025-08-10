// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// IntersectionObserver: add 'in' class for non-fade reveals
const io = ('IntersectionObserver' in window)
  ? new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          // unobserve after first reveal
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 })
  : null;

document.querySelectorAll('.reveal').forEach(el => io && io.observe(el));

