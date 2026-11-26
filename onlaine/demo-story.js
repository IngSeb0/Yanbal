document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const rail = carousel.querySelector('[data-rail]');
  const slides = [...rail.children];
  const controls = carousel.querySelector('.show-controls');
  const dots = [...controls.querySelectorAll('[data-slide]')];
  let current = 0;
  let selected = 0;

  function mark(index) {
    current = index;
    dots.forEach((dot, position) => {
      dot.setAttribute('aria-current', String(position === index));
      slides[position].classList.toggle('is-current', position === index);
    });
  }

  function show(index) {
    selected = (index + slides.length) % slides.length;
    rail.scrollTo({
      left: slides[selected].offsetLeft - slides[0].offsetLeft,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  controls.hidden = false;
  mark(0);
  controls.querySelector('[data-prev]').addEventListener('click', () => show(selected - 1));
  controls.querySelector('[data-next]').addEventListener('click', () => show(selected + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => show(index)));
  carousel.addEventListener('keydown', (event) => {
    if (event.target !== carousel || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    show(selected + (event.key === 'ArrowLeft' ? -1 : 1));
  });
  rail.addEventListener('scroll', () => {
    const index = slides.reduce((nearest, slide, position) =>
      Math.abs(slide.offsetLeft - slides[0].offsetLeft - rail.scrollLeft) <
      Math.abs(slides[nearest].offsetLeft - slides[0].offsetLeft - rail.scrollLeft) ? position : nearest, 0);
    if (index !== current) mark(index);
  }, {passive:true});
  rail.addEventListener('scrollend', () => {selected = current;});
});
