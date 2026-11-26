const motion = matchMedia('(prefers-reduced-motion: no-preference)');
document.querySelectorAll('.show-hero').forEach((hero) => {
  const photo = hero.querySelector('.floating-photo');
  const control = hero.querySelector('[data-photo-motion]');
  if (!photo || !control) return;

  function stop() {
    hero.classList.remove('photo-playing');
    control.textContent = 'Repetir movimiento';
    control.hidden = !motion.matches;
  }

  function play() {
    if (!motion.matches) return;
    hero.classList.add('photo-playing');
    control.textContent = 'Detener movimiento';
  }

  control.hidden = !motion.matches;
  control.addEventListener('click', () => hero.classList.contains('photo-playing') ? stop() : play());
  photo.addEventListener('animationend', (event) => {
    if (event.animationName === 'photo-orbit') stop();
  });
  motion.addEventListener('change', stop);
  const watcher = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    play();
    watcher.disconnect();
  }, {threshold:.2});
  watcher.observe(photo);
});
