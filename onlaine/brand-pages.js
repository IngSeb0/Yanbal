const brandPage = document.querySelector('.showcase');

if (brandPage) {
  const booking = brandPage.querySelector('[data-booking]');
  const service = booking?.elements.namedItem('selección');
  const review = booking?.querySelector('[data-review]');
  const bookingStatus = booking?.querySelector('[role=status]');
  const date = booking?.elements.namedItem('fecha');
  if (date) {
    const now = new Date();
    date.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  booking?.addEventListener('input', () => {
    review.hidden = true;
    bookingStatus.textContent = '';
  });
  booking?.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = new FormData(booking);
    review.querySelector('[data-summary]').textContent = ['selección','vehículo','personas','fecha','franja','nombre']
      .map(key => fields.get(key)).filter(Boolean).join(' · ');
    review.hidden = false;
    review.querySelector('button').focus();
  });
  booking?.querySelector('[data-done]').addEventListener('click', () => {
    review.hidden = true;
    bookingStatus.textContent = 'Demostración completada. No se envió ninguna solicitud.';
    booking.querySelector('[type=submit]').focus();
  });

  brandPage.querySelectorAll('[data-pick]').forEach((button) => button.addEventListener('click', () => {
    const value = button.dataset.pick;
    if (service && [...service.options].some(option => option.value === value)) {
      service.value = value;
      const model = booking.elements.namedItem('vehículo');
      const heroModel = brandPage.querySelector('[data-vehicle]');
      if (model && heroModel?.value.trim()) model.value = heroModel.value.trim();
      review.hidden = true;
      bookingStatus.textContent = '';
      booking.scrollIntoView({block:'start'});
      service.focus({preventScroll:true});
    }
  }));

  const menu = [...brandPage.querySelectorAll('[data-menu]')];
  function filterMenu(active) {
    menu.forEach(button => button.setAttribute('aria-pressed', String(button === active)));
    brandPage.querySelectorAll('[data-food]').forEach(card => {
      card.hidden = Boolean(active.dataset.menu && card.dataset.food !== active.dataset.menu);
    });
  }
  if (menu.length) {
    filterMenu(menu[0]);
    menu.forEach(button => button.addEventListener('click', () => filterMenu(button)));
  }

  const focusNote = brandPage.querySelector('[data-species-note]');
  if (focusNote) {
    const photos = brandPage.querySelectorAll('.brand-media img');
    const dog = photos[0].src;
    const cat = photos[1].src;
    brandPage.querySelectorAll('[name=species]').forEach(radio => radio.addEventListener('change', () => {
      const feline = radio.value === 'Gato';
      photos[0].src = feline ? cat : dog;
      photos[1].src = feline ? dog : cat;
      focusNote.textContent = feline ? 'Controles, vacunas y seguimiento para gatos.' : 'Controles, vacunas y seguimiento para perros.';
      brandPage.querySelector('[data-species-help]').textContent = feline ? 'Trae a tu gato en una transportadora ventilada.' : 'Trae a tu perro con correa o en su transportadora.';
      brandPage.querySelectorAll('[data-choice]').forEach(button => {
        button.querySelector('.demo-sr').textContent = ' · ' + button.dataset.choice + ' para ' + radio.value.toLowerCase();
      });
    }));
  }

  const filter = brandPage.querySelector('[data-filter]');
  if (filter) {
    const zone = brandPage.querySelector('[data-zone]');
    const budget = brandPage.querySelector('[data-budget]');
    const cards = [...brandPage.querySelectorAll('[data-zone-card]')];
    const results = brandPage.querySelector('[data-results]');
    function update() {
      let visible = 0;
      cards.forEach(card => {
        card.hidden = Boolean(
          (filter.value && card.dataset.entry !== filter.value) ||
          (zone.value && card.dataset.zoneCard !== zone.value) ||
          (budget.value && Number(card.dataset.price) > Number(budget.value))
        );
        visible += Number(!card.hidden);
      });
      results.textContent = visible ? visible + (visible === 1 ? ' inmueble disponible en el catálogo de muestra.' : ' inmuebles en el catálogo de muestra.') : 'No encontramos inmuebles. Amplía tu presupuesto o cambia la zona.';
    }
    filter.addEventListener('change', update);
    zone.addEventListener('change', update);
    budget.addEventListener('input', update);
    update();
  }

  const dialog = brandPage.querySelector('[data-property-gallery]');
  if (dialog) {
    const slides = [...brandPage.querySelectorAll('.show-slide img')];
    let selected = 0;
    let opener;
    function show(index) {
      selected = Math.min(slides.length - 1, Math.max(0, index));
      dialog.querySelector('img').src = slides[selected].src;
      dialog.querySelector('[data-image-count]').textContent = (selected + 1) + ' de ' + slides.length;
      dialog.querySelector('[data-image-prev]').disabled = selected === 0;
      dialog.querySelector('[data-image-next]').disabled = selected === slides.length - 1;
    }
    brandPage.querySelectorAll('[data-expand]').forEach((button, index) => button.addEventListener('click', () => {
      opener = button;
      show(index);
      dialog.showModal();
    }));
    dialog.querySelector('[data-image-prev]').addEventListener('click', () => show(selected - 1));
    dialog.querySelector('[data-image-next]').addEventListener('click', () => show(selected + 1));
    dialog.addEventListener('close', () => opener?.focus());
  }

  brandPage.querySelectorAll('[name=space]').forEach(radio => radio.addEventListener('change', () => {
    brandPage.querySelector('[data-space-selected]').textContent = radio.value;
    const target = [...brandPage.querySelectorAll('[data-choice]')].find(button => button.dataset.choice === radio.value);
    if (target) target.click();
  }));
}
