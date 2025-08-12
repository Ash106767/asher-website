// Year in footer
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// === Lightbox for images & videos ===
document.addEventListener('DOMContentLoaded', () => {
  // Add an expand button to every .media figure
  document.querySelectorAll('.media').forEach(fig => {
    const btn = document.createElement('button');
    btn.className = 'expand';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open full view');
    btn.innerHTML = `
  <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
    <!-- fullscreen corners -->
    <path d="M5 9V5h4M15 5h4v4M5 15v4h4M15 19h4v-4"
          stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

    fig.appendChild(btn);

    // Clicking an image itself also opens; leave videos alone (so controls work)
    fig.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') btn.click();
    });

    btn.addEventListener('click', () => openLightbox(fig));
  });

  // Build the overlay once
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="close" aria-label="Close">×</button>
    <figure>
      <div class="media-wrap"></div>
      <figcaption class="caption"></figcaption>
    </figure>`;
  document.body.appendChild(lb);

  const wrap = lb.querySelector('.media-wrap');
  const caption = lb.querySelector('.caption');
  const closeBtn = lb.querySelector('.close');

  const close = () => {
    lb.classList.remove('open');
    wrap.innerHTML = '';           // remove media node
    document.body.style.overflow = ''; // re-enable scroll
  };

  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  function openLightbox(fig){
  wrap.innerHTML = '';
  const img = fig.querySelector('img');
  const vid = fig.querySelector('video');
  let node;

  if (img) {
    node = document.createElement('img');
    node.src = img.currentSrc || img.src;
    node.alt = img.alt || '';
  } else if (vid) {
    // Clone the actual <video> so we keep all <source> children & attributes
    node = vid.cloneNode(true);
    node.removeAttribute('width');
    node.removeAttribute('height');
    node.controls = true;
    node.muted = true;          // allow autoplay reliably
    node.autoplay = true;
    node.playsInline = true;
    // if you want loop in the lightbox:
    if (vid.hasAttribute('loop')) node.loop = true;

    // Make sure the browser selects a source, then try to play
    node.load();
    node.addEventListener('loadeddata', () => {
      // ignore the promise rejection if user gesture is needed
      node.play().catch(()=>{});
    });
  }

  if (node) wrap.appendChild(node);
  caption.textContent = fig.querySelector('figcaption')?.textContent?.trim() || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

});






