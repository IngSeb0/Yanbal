const depthPreference = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');

document.querySelectorAll('.brand-media').forEach((scene) => {
  let frame = 0;

  function resetDepth() {
    cancelAnimationFrame(frame);
    scene.style.removeProperty('--tilt-x');
    scene.style.removeProperty('--tilt-y');
  }

  scene.addEventListener('pointermove', (event) => {
    if (!depthPreference.matches || event.pointerType === 'touch') return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      scene.style.setProperty('--tilt-x', (-y * 10).toFixed(2) + 'deg');
      scene.style.setProperty('--tilt-y', (x * 14).toFixed(2) + 'deg');
    });
  });
  scene.addEventListener('pointerleave', resetDepth);
  depthPreference.addEventListener('change', resetDepth);
});
