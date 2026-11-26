document.querySelectorAll('[data-signature]').forEach((scene) => {
  const button = scene.querySelector('[data-scene-button]');
  const label = button.querySelector('span');
  const details = scene.querySelector('#signature-details');
  button.hidden = false;

  const watcher = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    scene.classList.add('ready');
    watcher.disconnect();
  }, {threshold:.25});
  watcher.observe(scene);


  button.addEventListener('click', () => {
    scene.classList.remove('ready');
    const expanded = scene.toggleAttribute('data-open');
    button.setAttribute('aria-expanded', String(expanded));
    label.textContent = expanded ? button.dataset.opened : button.dataset.closed;
    details.hidden = !expanded;
  });
});
