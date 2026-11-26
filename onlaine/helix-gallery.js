const fullMotion = matchMedia('(prefers-reduced-motion: no-preference)');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = (value, size) => ((value % size) + size) % size;

document.querySelectorAll('[data-helix]').forEach((gallery) => {
  const stage = gallery.querySelector('[data-helix-stage]');
  const cards = [...gallery.querySelectorAll('.helix-card')];
  const arrows = gallery.querySelector('.helix-arrows');
  const mode = gallery.querySelector('[data-helix-mode]');
  const modeButton = gallery.querySelector('[data-enable-motion]');
  let motionOverride = false;
  const motionEnabled = () => fullMotion.matches || motionOverride;
  const toolbar = gallery.querySelector('[data-helix-toolbar]');
  const play = gallery.querySelector('[data-play]');
  const activeLink = gallery.querySelector('[data-active-link]');
  const output = gallery.querySelector('[data-position]');
  const total = cards.length;
  let offset = 0;
  let velocity = 0;
  let travel = 0;
  let previousTime = 0;
  let lastScroll = window.scrollY;
  let request = 0;
  let visible = false;
  let playing = true;
  let drag;
  let suppressClickUntil = 0;
  let hovered;
  let keyboardFocus = false;
  let active = cards[0];
  let width = 0;
  let height = 0;

  function measure() {
    width = stage.clientWidth;
    height = stage.clientHeight;
  }

  function draw() {
    const radius = Math.min(width * .37, 370);
    const depth = Math.min(width * .3, 255);
    for (const [index, card] of cards.entries()) {
      const slot = wrap(index + offset + total / 2, total) - total / 2;
      const angle = slot * (Math.PI * 2 / 7);
      const front = (Math.cos(angle) + 1) / 2;
      const edge = clamp((total / 2 - Math.abs(slot)) / 2, 0, 1);
      const x = Math.sin(angle) * radius;
      const y = slot * height * .04 + Math.sin(angle) * height * .02;
      const z = (front - .62) * depth * 1.6 - Math.abs(slot) * 3;
      const focus = card === hovered && !drag?.moved ? 1.12 : 1;
      card.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${(-Math.sin(angle) * 38).toFixed(1)}deg) rotateZ(${(-Math.cos(angle) * 7).toFixed(1)}deg) scale(${focus})`;
      card.style.opacity = (edge * (.48 + front * .52)).toFixed(3);
      card.style.pointerEvents = edge < .15 ? 'none' : '';
    }
    const index = wrap(Math.round(-offset), total);
    const current = cards[index];
    if (active !== current || !output.value) {
      active = current;
      output.value = active.dataset.sector + ' · ' + (index + 1) + ' de ' + total;
      activeLink.href = active.href;
      activeLink.setAttribute('aria-label', 'Abrir demo de ' + active.dataset.sector);
    }
  }

  function run(time) {
    request = 0;
    if (!visible || !motionEnabled() || document.hidden) {
      previousTime = 0;
      return;
    }
    const dt = previousTime ? Math.min((time - previousTime) / 1000, .05) : 0;
    previousTime = time;
    if (travel) {
      const movement = Math.abs(travel) < .015 ? travel : travel * (1 - Math.exp(-8 * dt));
      offset = wrap(offset + movement, total);
      travel -= movement;
    } else if (!drag && !keyboardFocus && !hovered) {
      offset = wrap(offset + dt * (velocity + (playing ? .68 : 0)), total);
      velocity *= Math.exp(-4.8 * dt);
      if (Math.abs(velocity) < .01) velocity = 0;
    }
    draw();
    wake();
  }

  function wake() {
    if (!request && visible && !document.hidden && motionEnabled() && (travel || (playing && !hovered && !keyboardFocus) || (velocity && !hovered) || drag)) {
      request = requestAnimationFrame(run);
    } else if (!request && !drag && (!playing || !visible)) {
      previousTime = 0;
    }
  }

  function step(direction) {
    travel = Math.round(offset + travel) + direction - offset;
    velocity = 0;
    wake();
  }

  function setMode() {
    const enabled = motionEnabled();
    gallery.classList.toggle('is-3d', enabled);
    mode.hidden = fullMotion.matches;
    modeButton.textContent = motionOverride ? 'Volver a la vista estática' : 'Activar animación 3D';
    toolbar.hidden = !enabled;
    arrows.hidden = !enabled;
    stage.tabIndex = enabled ? 0 : -1;
    if (!enabled) {
      cancelAnimationFrame(request);
      request = 0;
      previousTime = 0;
      velocity = 0;
      travel = 0;
    }
    for (const card of cards) {
      card.tabIndex = enabled ? -1 : 0;
      if (!enabled) card.removeAttribute('style');
    }
    if (enabled) {
      measure();
      draw();
      wake();
    }
  }

  function setPlayback(value) {
    playing = value;
    velocity = 0;
    play.textContent = playing ? 'Pausar giro' : 'Reanudar giro';
    wake();
  }
  play.addEventListener('click', () => setPlayback(!playing));
  arrows.querySelector('[data-prev]').addEventListener('click', () => step(1));
  arrows.querySelector('[data-next]').addEventListener('click', () => step(-1));
  stage.addEventListener('focus', () => { keyboardFocus = stage.matches(':focus-visible'); });
  stage.addEventListener('blur', () => { keyboardFocus = false; wake(); });
  activeLink.addEventListener('focus', () => { keyboardFocus = true; });
  activeLink.addEventListener('blur', () => { keyboardFocus = false; wake(); });
  stage.addEventListener('keydown', (event) => {
    if (!motionEnabled() || event.target !== stage) return;
    if (event.key === 'Enter') { activeLink.click(); return; }
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? 1 : -1);
  });

  stage.addEventListener('pointerdown', (event) => {
    if (!motionEnabled() || !event.isPrimary || event.button !== 0 || drag || event.target.closest('button')) return;
    keyboardFocus = false;
    drag = {id:event.pointerId, x:event.clientX, y:event.clientY, last:event.clientX, time:event.timeStamp, moved:false};
    velocity = 0;
    travel = 0;
    wake();
  });
  stage.addEventListener('pointermove', (event) => {
    if (!motionEnabled()) return;
    if (!drag || drag.id !== event.pointerId) {
      hovered = event.pointerType === 'mouse' ? event.target.closest('.helix-card') : null;
      if (!travel) draw();
      wake();
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && (Math.abs(dx) < 7 || Math.abs(dx) < Math.abs(dy))) return;
    if (!drag.moved) {
      hovered = null;
      drag.moved = true;
      stage.setPointerCapture(event.pointerId);
      gallery.classList.add('is-dragging');
    }
    const difference = (event.clientX - drag.last) / Math.max(34, width / 17);
    offset = wrap(offset + difference, total);
    const elapsed = Math.max(8, event.timeStamp - drag.time);
    velocity = clamp(.35 * velocity + .65 * difference * 1000 / elapsed, -16, 16);
    drag.last = event.clientX;
    drag.time = event.timeStamp;
    draw();
  });

  function release(event) {
    if (!drag || event.pointerId !== drag.id) return;
    if (drag.moved) {
      suppressClickUntil = performance.now() + 280;
      if (event.type !== 'pointerup' || event.timeStamp - drag.time > 110) velocity = 0;
    }
    drag = undefined;
    gallery.classList.remove('is-dragging');
    wake();
  }
  window.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('lostpointercapture', release);
  stage.addEventListener('pointerleave', () => { hovered = null; draw(); wake(); });
  stage.addEventListener('click', (event) => {
    if (!motionEnabled() || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (performance.now() < suppressClickUntil) { event.preventDefault(); return; }
    const card = event.target.closest('.helix-card');
    if (!card) return;
    event.preventDefault();
    setPlayback(false);
    travel = wrap(-cards.indexOf(card) - offset + total / 2, total) - total / 2;
    wake();
  }, true);

  window.addEventListener('scroll', () => {
    const change = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    if (!visible || !motionEnabled() || drag || keyboardFocus || hovered || !playing) return;
    velocity = clamp(velocity + clamp(change, -100, 100) * .043, -10, 10);
    wake();
  }, {passive:true});
  document.addEventListener('visibilitychange', wake);
  new ResizeObserver(() => { if (motionEnabled()) { measure(); draw(); } }).observe(stage);
  new IntersectionObserver(([entry]) => {visible = entry.isIntersecting; wake();}, {threshold:.1}).observe(stage);
  modeButton.addEventListener('click', () => {
    motionOverride = !motionOverride;
    if (motionOverride) setPlayback(true);
    setMode();
    if (motionOverride) {
      stage.scrollIntoView({block:'center'});
      const bounds = stage.getBoundingClientRect();
      visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      step(-1);
    }
  });
  fullMotion.addEventListener('change', () => {
    motionOverride = false;
    setMode();
  });
  setMode();
});
