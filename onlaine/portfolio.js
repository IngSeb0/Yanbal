const portfolioMotion = matchMedia('(prefers-reduced-motion: no-preference)');
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
document.querySelectorAll('.show-items article').forEach(box => reveal.observe(box));
