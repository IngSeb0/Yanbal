const reduceGalleryMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.show-slide')];
  const controls = carousel.querySelector('.show-controls');
  const dots = [...controls.querySelectorAll('[data-slide]')];
  const preview = controls.querySelector('[data-preview]');
  const count = controls.querySelector('[data-count]');
  const rail = carousel.querySelector('[data-rail]');
  let current = 0;
  let tour;
  let touchStart;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      const relative = (position - current + slides.length) % slides.length;
      const slot = relative <= 1 ? relative : relative === slides.length - 1 ? -1 : 2;
      const active = position === current;
      slide.dataset.slot = slot;
      slide.classList.toggle('is-current', active);
      slide.querySelector('figcaption').inert = !active;
      dots[position].setAttribute('aria-current', String(active));
    });
    count.value = (current + 1) + ' / ' + slides.length;
  }

  function stop() {
    clearTimeout(tour);
    tour = undefined;
    preview.textContent = 'Ver giro 3D';
    carousel.classList.remove('motion-preview');
  }

  function select(index) {
    stop();
    show(index);
  }

  carousel.classList.add('is-coverflow');
  controls.hidden = false;
  show(0);
  controls.querySelector('[data-prev]').addEventListener('click', () => select(current - 1));
  controls.querySelector('[data-next]').addEventListener('click', () => select(current + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => select(index)));
  preview.addEventListener('click', () => {
    if (tour) { stop(); return; }
    preview.textContent = 'Detener giro';
    carousel.classList.add('motion-preview');
    let remaining = slides.length;
    function advance() {
      show(current + 1);
      if (--remaining > 0) tour = setTimeout(advance, 900);
      else tour = setTimeout(stop, 620);
    }
    advance();
  });
  carousel.addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key) || event.target.closest('dialog')) return;
    event.preventDefault();
    select(current + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  rail.addEventListener('click', (event) => {
    const slide = event.target.closest('.show-slide');
    if (slide && slide !== slides[current]) select(slides.indexOf(slide));
  });
  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') return;
    touchStart = {x:event.clientX, y:event.clientY};
  });
  rail.addEventListener('pointerup', (event) => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = undefined;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) select(current + (dx > 0 ? -1 : 1));
  });
  rail.addEventListener('pointercancel', () => { touchStart = undefined; });
  reduceGalleryMotion.addEventListener('change', stop);
});
