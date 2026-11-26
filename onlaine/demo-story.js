const reducedGalleryMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.show-slide')];
  const controls = carousel.querySelector('.show-controls');
  const dots = [...controls.querySelectorAll('[data-slide]')];
  const playback = controls.querySelector('[data-gallery-playback]');
  const count = controls.querySelector('[data-count]');
  const rail = carousel.querySelector('[data-rail]');
  const wraps = new WeakMap();
  let current = 0;
  let timer;
  let inView = false;
  let hovering = false;
  let focused = false;
  let paused = false;
  let motionOverride = false;
  let hasAdvanced = false;
  let touchStart;
  let ignoreClickUntil = 0;

  const motionEnabled = () => !reducedGalleryMotion.matches || motionOverride;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      const relative = (position - current + slides.length) % slides.length;
      const slot = relative <= 1 ? relative : relative === slides.length - 1 ? -1 : 2;
      const active = position === current;
      const previous = Number(slide.dataset.slot);
      const movesBehind = motionEnabled() && Math.abs(previous - slot) > 1 && previous !== 0 && slot !== 0;
      if (movesBehind) {
        const start = getComputedStyle(slide);
        const startTransform = start.transform;
        const startOpacity = start.opacity;
        wraps.get(slide)?.cancel();
        slide.classList.add('is-wrapping');
        slide.dataset.slot = slot;
        const finish = getComputedStyle(slide);
        const animation = slide.animate([
          {transform:startTransform, opacity:startOpacity},
          {transform:'translate3d(0, 2%, -560px) rotateY(0deg)', opacity:.12, offset:.52},
          {transform:finish.transform, opacity:finish.opacity},
        ], {duration:780, easing:'cubic-bezier(.26,.02,.2,1)'});
        wraps.set(slide, animation);
        animation.onfinish = () => {
          wraps.delete(slide);
          slide.classList.remove('is-wrapping');
        };
      } else {
        wraps.get(slide)?.cancel();
        slide.classList.remove('is-wrapping');
        slide.dataset.slot = slot;
      }
      slide.classList.toggle('is-current', active);
      slide.querySelector('figcaption').inert = !active;
      dots[position].setAttribute('aria-current', String(active));
    });
    count.value = (current + 1) + ' / ' + slides.length;
  }

  function schedule() {
    clearTimeout(timer);
    if (!inView || hovering || focused || paused || document.hidden || !motionEnabled()) return;
    timer = setTimeout(() => {
      hasAdvanced = true;
      show(current + 1);
      schedule();
    }, hasAdvanced ? 4200 : 1200);
  }

  function syncPlayback() {
    carousel.classList.toggle('allow-gallery-motion', motionOverride);
    const label = !motionEnabled() ? 'Activar animación' : paused ? 'Reanudar' : 'Pausar';
    playback.textContent = label;
    playback.setAttribute('aria-label', motionEnabled() ? label + ' giro automático' : label);
    schedule();
  }

  function select(index) {
    show(index);
    schedule();
  }

  carousel.classList.add('is-coverflow');
  controls.hidden = false;
  rail.querySelector('.gallery-arrows').hidden = false;
  show(0);
  syncPlayback();

  rail.querySelector('[data-prev]').addEventListener('click', () => select(current - 1));
  rail.querySelector('[data-next]').addEventListener('click', () => select(current + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => select(index)));
  playback.addEventListener('click', () => {
    const start = !motionEnabled() || paused;
    if (!motionEnabled()) motionOverride = true;
    paused = !start;
    syncPlayback();
    if (start) {
      hasAdvanced = true;
      show(current + 1);
      schedule();
    }
  });
  rail.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    const overPhoto = Boolean(event.target.closest('.show-slide img'));
    if (hovering === overPhoto) return;
    hovering = overPhoto;
    schedule();
  });
  rail.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    hovering = false;
    schedule();
  });
  carousel.addEventListener('focusin', () => {
    focused = carousel.matches(':focus-within') && Boolean(carousel.querySelector(':focus-visible'));
    schedule();
  });
  carousel.addEventListener('focusout', (event) => {
    focused = Boolean(event.relatedTarget && carousel.contains(event.relatedTarget) && event.relatedTarget.matches(':focus-visible'));
    schedule();
  });
  carousel.addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key) || event.target.closest('dialog')) return;
    event.preventDefault();
    select(current + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  rail.addEventListener('click', (event) => {
    if (performance.now() < ignoreClickUntil) return;
    const slide = event.target.closest('.show-slide');
    if (!slide) return;
    paused = true;
    syncPlayback();
    if (slide !== slides[current]) select(slides.indexOf(slide));
  });
  rail.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' || event.target.closest('button,a')) return;
    touchStart = {x:event.clientX,y:event.clientY};
  });
  rail.addEventListener('pointerup', (event) => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = undefined;
    if (Math.abs(dx) <= 35 || Math.abs(dx) <= Math.abs(dy)) return;
    ignoreClickUntil = performance.now() + 250;
    select(current + (dx > 0 ? -1 : 1));
  });
  rail.addEventListener('pointercancel', () => { touchStart = undefined; });

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    schedule();
  }, {threshold:.35});
  observer.observe(rail);
  document.addEventListener('visibilitychange', schedule);
  reducedGalleryMotion.addEventListener('change', () => {
    motionOverride = false;
    slides.forEach(slide => {
      wraps.get(slide)?.cancel();
      slide.classList.remove('is-wrapping');
    });
    syncPlayback();
  });
});
