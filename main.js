/* ---------- AOS (scroll‑reveal) ---------- */
AOS.init({
  duration: 800,
  once: true,
});

/* ---------- GSAP animations ---------- */
/* Example 1: load‑time intro motion */
gsap.from("#heroTitle", {
  y: -60,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

/* Example 2: Scroll‑based parallax on hero title */
gsap.to("#heroTitle", {
  scrollTrigger: {
    trigger: "#heroTitle",
    start: "top center",
    end: "bottom top",
    scrub: true,
  },
  y: 150,
  scale: 1.3,
  ease: "none"
});

