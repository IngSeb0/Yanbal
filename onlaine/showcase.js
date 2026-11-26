const showcase = document.querySelector('[data-showcase]');

if (showcase) {
  const sector = showcase.dataset.showcase;
  const status = showcase.querySelector('[role=status]');
  const slots = showcase.querySelector('[data-slots]');
  const reset = showcase.querySelector('[data-reset]');
  const selection = new Map();
  let pending;
  const prices = new Intl.NumberFormat('es-CO', {style:'currency',currency:'COP',maximumFractionDigits:0});

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
      const frequency = Number(showcase.querySelector('[data-frequency]').value);
      const extra = showcase.querySelector('[data-extra]').checked ? 18000 : 0;
      const base = Math.round(Number(detail) * area.valueAsNumber * frequency + extra);
      status.textContent = choice + ' · ' + area.value + ' m² · Rango ilustrativo: ' + prices.format(base) + ' a ' + prices.format(Math.round(base * 1.18));
      return;
    }
    if (button.hasAttribute('data-pick')) return;
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
