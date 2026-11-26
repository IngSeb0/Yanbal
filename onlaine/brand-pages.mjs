import { floatingPhoto } from './floating-photos.mjs';

export const directions = {
  odontologia: {title:'Una consulta dental, paso a paso', intro:'En la primera visita revisamos tu salud oral, conversamos sobre tus dudas y definimos contigo cómo continuar.', nav:'Tratamientos', secondary:'Explorar tratamientos', flow:'Encuentra tu cita', steps:['Bienvenida y conversación','Valoración de salud oral','Opciones y próximos pasos'], note:'El equipo de esta clínica ficticia representa las funciones de recepción, odontología general y acompañamiento.'},
  restaurante: {title:'Cocina al fuego, hecha para compartir', intro:'Una carta de temporada para abrir el apetito y una mesa para quedarte un rato más.', nav:'El salón', secondary:'Reservar una mesa', flow:'Reserva una mesa', steps:['Elige una fecha','Indica cuántas personas vienen','Revisa tu solicitud de ejemplo'], note:'Los platos y precios son ilustrativos. Consulta ingredientes y alérgenos con el restaurante antes de pedir.'},
  veterinaria: {title:'Cuidamos a quien hace parte de tu familia', intro:'Encuentra una consulta según la especie, el motivo de visita y la etapa de vida.', nav:'Cuidados', secondary:'Qué llevar', flow:'Encuentra una consulta', steps:['Trae el carné de vacunas','Anota cambios de conducta o apetito','Comparte el historial con el equipo'], note:'La atención programada de esta clínica ficticia sirve para explorar controles y seguimiento.'},
  estetica: {title:'Un momento para volver a ti', intro:'Una carta de rituales de rostro, cuerpo y manos, con duración y condiciones claras desde el inicio.', nav:'La experiencia', secondary:'Ver todos los rituales', flow:'Reserva un ritual', steps:['Llegada y breve conversación','Preparación del espacio','Ritual y cierre tranquilo'], note:'Las duraciones son ilustrativas. Deja margen para cambiarte o conversar antes de empezar.'},
  inmobiliaria: {title:'Espacios para la vida que imaginas', intro:'Explora inmuebles de ejemplo en Bogotá y conoce sus espacios antes de planear una visita.', nav:'Espacios', secondary:'Recorrer espacios', flow:'Solicita una visita', steps:['Define tu presupuesto','Compara área y ubicación','Elige un inmueble y solicita una visita'], note:'Inventario, áreas y precios ilustrativos.'},
  limpieza: {title:'Tu espacio limpio, con todo claro', intro:'Selecciona el espacio y calcula un rango según el área, la frecuencia y los extras.', nav:'Casos de servicio', secondary:'Explorar casos', flow:'Calcula un estimado', steps:['Define tipo y tamaño del espacio','Elige la frecuencia','Revisa el rango y lo que incluye'], note:'Los rangos usan tarifas de ejemplo. El acceso, las superficies y el estado del lugar requieren confirmación.'},
  automotriz: {title:'Tu carro, en manos que te explican', intro:'El taller revisa el vehículo, explica los hallazgos y solicita tu autorización antes de intervenir.', nav:'Estaciones', secondary:'Ver los servicios', flow:'Planea tu visita', steps:['Recepción','Revisión','Propuesta','Autorización','Entrega'], note:'La revisión presencial determina el trabajo y su tiempo. Puedes solicitar orientación si desconoces el servicio.'},
};

const options = values => values.map(value => `<option>${value}</option>`).join('');
const label = (title, field) => `<label>${title}${field}</label>`;
const propertyFilters = `<div class="brand-filters" id="inicio-filtros">
${label('Operación','<select data-filter><option value="">Todas</option><option>Venta</option><option>Arriendo</option></select>')}
${label('Zona','<select data-zone><option value="">Todas</option>'+options(['Chapinero','Cedritos','Teusaquillo'])+'</select>')}
${label('Presupuesto máximo','<input type="number" min="0" step="100000" data-budget placeholder="COP">')}
</div>`;
const species = `<fieldset class="species"><legend>¿A quién atendemos?</legend><label><input type="radio" name="species" value="Perro" checked> Perro</label><label><input type="radio" name="species" value="Gato"> Gato</label></fieldset>`;
const spaces = `<fieldset class="species"><legend>Tipo de espacio</legend>${['Residencial','Oficinas','Posobra'].map((space,i)=>`<label><input type="radio" name="space" value="${space}" ${i===0?'checked':''}> ${space}</label>`).join('')}</fieldset>`;

export function brandHero(slug, niche, cta, photo, image) {
  const direction = directions[slug];
  const secondTarget = slug === 'restaurante' ? 'solicitud' : slug === 'veterinaria' ? 'visita' : slug === 'estetica' ? 'experiencia' : 'galeria';
  const motionControl = '<button class="photo-motion" type="button" data-photo-motion hidden>Repetir movimiento</button>';
  return `<section class="show-hero">
  <div class="brand-copy"><p class="show-kicker">${niche}</p><h1>${direction.title}</h1><p class="brand-intro">${direction.intro}</p>
  ${slug === 'veterinaria' ? species + '<p data-species-note>Controles, vacunas y seguimiento para perros.</p>' : ''}
  ${slug === 'limpieza' ? spaces : ''}
  <div class="brand-actions"><a class="show-button" href="#experiencia">${cta} <span aria-hidden="true">↗</span></a><a href="#${secondTarget}">${direction.secondary}</a></div>${slug === 'restaurante' ? motionControl : ''}</div>
  <div class="brand-media"><img data-hero-photo src="${photo}" alt="" width="1200" height="850" fetchpriority="high">
  ${slug === 'veterinaria' ? `<img src="${image('photo-1514888286974-6c03e2ca1dba',480)}" alt="" width="480" height="440" loading="lazy">` : ''}
  ${floatingPhoto(slug, image)}
  ${slug === 'restaurante' ? '' : motionControl}
  ${slug === 'inmobiliaria' ? '<div class="brand-feature">Chapinero · 74 m² · Arriendo · $2.800.000/mes</div>' : ''}</div>
  ${slug === 'inmobiliaria' ? propertyFilters : ''}</section>`;
}

export const inventory = {
  'Apartamento · Chapinero': ['Chapinero',2800000,74,'/mes'],
  'Casa · Cedritos': ['Cedritos',780000000,148,''],
  'Estudio · Teusaquillo': ['Teusaquillo',1850000,39,'/mes'],
};

export function brandVisit(slug, items) {
  const {flow,steps,note} = directions[slug];
  const choices = slug === 'automotriz' ? [...items,'Necesito orientación'] : items;
  const fields = slug === 'limpieza' ? `<label>Frecuencia<select data-frequency><option value="1">Una vez</option><option value=".9">Semanal</option><option value=".95">Quincenal</option></select></label><label class="option-line"><input type="checkbox" data-extra> Limpieza interior de ventanas</label>` :
  `<section id="solicitud" class="show-content brand-booking"><h2>${flow}</h2><p>Completa el recorrido con datos ficticios.</p><form data-booking>
  <div class="booking-fields">
  ${slug === 'restaurante' ? label('Número de personas','<input name="personas" required type="number" min="1" max="12" value="2">') : label('Selección','<select name="selección" required><option value="">Elige una opción</option>'+options(choices)+'</select>')}
  ${slug === 'automotriz' ? label('Vehículo','<input name="vehículo" required maxlength="80">') : ''}
  ${label('Fecha','<input type="date" name="fecha" required>')}
  ${label('Franja de ejemplo','<select name="franja" required><option value="">Elige una franja</option>'+options(slug==='restaurante'?['12:30','18:00','20:00']:['09:00','11:30','15:00'])+'</select>')}
  ${label('Nombre ficticio','<input name="nombre" required maxlength="80">')}
  ${label('Correo de prueba','<input name="correo" type="email" required maxlength="120" value="demo@example.com">')}
  </div><button type="submit">Revisar selección</button>
  <div data-review hidden><h3>Resumen editable</h3><p data-summary></p><button type="button" data-done>Completar demostración</button></div><p role="status"></p>
  </form></section>`;
  return {extras:slug==='limpieza'?fields:'', body:`<section class="show-content brand-visit" id="visita"><h2>${slug==='automotriz'?'Así pasa tu carro por el taller':'Cómo transcurre tu visita'}</h2><ol>${steps.map(step=>`<li>${step}</li>`).join('')}</ol><p>${note}</p></section>${slug==='limpieza'?'':fields}`};
}
