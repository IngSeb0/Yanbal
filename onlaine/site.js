const lead = document.querySelector('#lead');
if (lead) {
  const status = lead.querySelector('#form-status');
  const fields = lead.querySelector('fieldset');
  fetch('/api/leads', {cache:'no-store'})
    .then(async (response) => {
      if (!response.ok || !(await response.json()).available) throw new Error();
      fields.disabled = false;
    })
    .catch(() => {status.textContent = 'La recepción de solicitudes aún no está habilitada.';});
  lead.addEventListener('submit', async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(lead));
    fields.disabled = true;
    status.textContent = 'Enviando solicitud…';
    try {
      const response = await fetch('/api/leads', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body),
      });
      if (!response.ok) throw new Error();
      status.textContent = 'Recibimos tu solicitud de demostración.';
      lead.reset();
    } catch {
      status.textContent = 'No pudimos registrar la solicitud. Revisa los campos e intenta de nuevo.';
    } finally {
      fields.disabled = false;
    }
  });
}

const demo = document.querySelector('#demo');
demo?.addEventListener('submit', (event) => {
  event.preventDefault();
  const service = new FormData(demo).get('service');
  demo.querySelector('[role=status]').textContent = 'Simulación completada para ' + service + '.';
});
