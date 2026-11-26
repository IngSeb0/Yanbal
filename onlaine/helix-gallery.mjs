const photographs = {
  odontologia: ['photo-1606811841689-23dfddce3e95','photo-1588776814546-daab30f310ce','photo-1629909615184-74f495363b67'],
  restaurante: ['photo-1559339352-11d035aa65de','photo-1551218808-94e220e084d2','photo-1515003197210-e0cd71810b5f'],
  veterinaria: ['photo-1517849845537-4d257902454a','photo-1543466835-00a7907e9de1','photo-1574158622682-e40e69881006'],
  estetica: ['photo-1544161515-4ab6ce6db874','photo-1519415387722-a1c3bbef716c','photo-1524504388940-b1c1722653e1'],
  inmobiliaria: ['photo-1560448204-e02f11c3d0e2','photo-1505693416388-ac5ce068fe85','photo-1513694203232-719a280e022f'],
  limpieza: ['photo-1563453392212-326f5e854473','photo-1585421514738-01798e348b17','photo-1528740561666-dc2479dc08ab'],
  automotriz: ['photo-1530046339160-ce3e530c7d2f','photo-1504215680853-026ed2a45def','photo-1493238792000-8113da705763'],
};

export function helixGallery(demos) {
  const slides = [0, 1, 2].flatMap((round) => demos.map(({slug, name}) => ({
    slug, name, photo: photographs[slug][round],
  })));
  return `<div class="helix-gallery" data-helix role="region" aria-label="Galería de demostraciones en espiral">
    <p class="helix-hint">Arrastra o usa las flechas. Pulsa una foto para seleccionarla y detener el giro.</p>
    <div class="helix-mode" data-helix-mode hidden><button type="button" data-enable-motion>Activar animación 3D</button></div>
    <div class="helix-stage" tabindex="0" aria-label="Carrusel. Usa las flechas izquierda y derecha y pulsa Intro para abrir la demo." data-helix-stage>
      <div class="helix-orbit">
        ${slides.map(({slug, name, photo}) => `<a class="helix-card" href="/demostraciones/${slug}" data-sector="${name}">
          <img src="https://images.unsplash.com/${photo}?auto=format&amp;fit=crop&amp;w=420&amp;q=72" alt="" width="420" height="280" loading="lazy" decoding="async" draggable="false">
          <span>${name}<b aria-hidden="true">↗</b></span>
        </a>`).join('')}
      </div>
      <div class="helix-arrows" hidden><button type="button" data-prev aria-label="Foto anterior">‹</button><button type="button" data-next aria-label="Foto siguiente">›</button></div>
    </div>
    <div class="helix-toolbar" data-helix-toolbar hidden>
      <button type="button" data-play>Pausar giro</button>
      <a class="helix-open" data-active-link href="/demostraciones/odontologia">Abrir demo ↗</a>
      <output data-position aria-live="off"></output>
    </div>
  </div>`;
}
