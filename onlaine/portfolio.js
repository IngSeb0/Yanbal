const portfolioMotion = matchMedia('(prefers-reduced-motion: no-preference)');
const precisePointer = matchMedia('(hover:hover) and (pointer:fine)');
const stage = document.querySelector('.agency-stage');
if (stage) {
  const button = stage.querySelector('button');
  const stack = stage.querySelector('.agency-stack');
  function stop() {
    stage.classList.remove('is-playing');
    button.hidden = !portfolioMotion.matches;
    button.textContent = 'Repetir animación';
  }
  function play() {
    if (!portfolioMotion.matches) return;
    stage.classList.add('is-playing');
    button.textContent = 'Detener animación';
  }
  stop();
  portfolioMotion.addEventListener('change', stop);
  button.addEventListener('click', () => stage.classList.contains('is-playing') ? stop() : play());
  stack.addEventListener('animationend', (event) => {if (event.target === stack) stop();});
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    play();
    heroObserver.disconnect();
  }, {threshold:.3});
  heroObserver.observe(stage);
}

const reveal = new IntersectionObserver((entries) => {
  entries.forEach(({target, isIntersecting}) => {
    if (!isIntersecting) return;
    if (portfolioMotion.matches) target.classList.add('entered');
    reveal.unobserve(target);
  });
}, {threshold:.18});
document.querySelectorAll('.demo-gallery li,.show-items article').forEach(box => reveal.observe(box));

document.querySelectorAll('.demo-gallery li').forEach((box) => {
  const tile = box.querySelector('a');
  let frame = 0;
  function reset() {
    cancelAnimationFrame(frame);
    tile.style.removeProperty('--tile-x');
    tile.style.removeProperty('--tile-y');
  }
  box.addEventListener('pointermove', (event) => {
    if (!portfolioMotion.matches || !precisePointer.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = box.getBoundingClientRect();
      tile.style.setProperty('--tile-x', (5 - 10 * (event.clientY - bounds.top) / bounds.height).toFixed(2) + 'deg');
      tile.style.setProperty('--tile-y', (12 * (event.clientX - bounds.left) / bounds.width - 6).toFixed(2) + 'deg');
    });
  });
  box.addEventListener('pointerleave', reset);
  portfolioMotion.addEventListener('change', reset);
});
