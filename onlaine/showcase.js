const showcase = document.querySelector('[data-showcase]');

if (showcase) {
  const sector = showcase.dataset.showcase;
  const status = showcase.querySelector('[role=status]');
  const slots = showcase.querySelector('[data-slots]');
  const reset = showcase.querySelector('[data-reset]');
  const selection = new Map();
  let pending;
  const prices = new Intl.NumberFormat('es-CO', {style:'currency',currency:'COP',maximumFractionDigits:0});

  showcase.querySelector('[data-filter]')?.addEventListener('change', (event) => {
    let visible = 0;
    showcase.querySelectorAll('[data-entry]').forEach((entry) => {
      entry.hidden = Boolean(event.target.value && entry.dataset.entry !== event.target.value);
      visible += Number(!entry.hidden);
    });
    slots.hidden = true;
    pending = undefined;
    status.textContent = visible + (visible === 1 ? ' propiedad visible.' : ' propiedades visibles.');
  });

  reset?.addEventListener('click', () => {
    selection.clear();
    status.textContent = 'Selección vacía.';
    showcase.querySelector('[data-choice]')?.focus();
    reset.hidden = true;
  });

  showcase.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    const {choice, detail} = button.dataset;
    if (sector === 'restaurante' || sector === 'estetica') {
      const count = (selection.get(choice)?.count || 0) + 1;
      selection.set(choice, {count, total:count * Number(detail)});
      const total = [...selection.values()].reduce((sum, item) => sum + item.total, 0);
      const summary = [...selection].map(([label, item]) => item.count + ' × ' + label).join(', ');
      status.textContent = summary + ' · Total: ' + (sector === 'restaurante' ? prices.format(total) : total + ' min');
      reset.hidden = false;
      return;
    }
    if (sector === 'limpieza') {
      const area = showcase.querySelector('[data-area]');
      if (!area.reportValidity()) return;
      status.textContent = choice + ' · ' + area.value + ' m² · Estimado ficticio: ' + prices.format(Number(detail) * area.valueAsNumber);
      return;
    }
    const vehicle = showcase.querySelector('[data-vehicle]');
    if (vehicle && (!vehicle.reportValidity() || !vehicle.value.trim())) return;
    pending = vehicle ? choice + ' · ' + vehicle.value.trim() : choice;
    slots.hidden = false;
    status.textContent = pending + ' · Elige un horario de ejemplo.';
    slots.querySelector('select').focus();
  }));

  slots.querySelector('[data-confirm]').addEventListener('click', () => {
    if (!pending) return;
    status.textContent = 'Simulación completada · ' + pending + ' · ' + slots.querySelector('select').value;
  });
}
