import { brandHero, brandVisit, directions, inventory } from './brand-pages.mjs';
import { story } from './demo-story.mjs';

const examples = {
  odontologia: ['Clara Dental','Vuelve a sonreír con confianza.','Odontología preventiva y estética','Encuentra tu cita','photo-1606811971618-4486d14f3f99','Agenda de ejemplo','Selecciona una consulta y luego un horario.','Seleccionar horario', [['Consulta general','45 min'],['Limpieza dental','30 min'],['Ortodoncia','60 min'],['Estética dental','45 min']]],
  restaurante: ['Brasa & Mesa','La mesa está servida.','Cocina de temporada','Explorar la carta','photo-1517248135467-4c7edcad34c4','Carta interactiva','Arma un pedido y consulta el total.','Añadir al pedido', [['Arepas de maíz asado',22000],['Pollo a la brasa',42000],['Papas al romero',14000],['Torta tibia de chocolate',18000]]],
  veterinaria: ['Huella Clínica','Cuidamos a quien te acompaña.','Bienestar para perros y gatos','Encontrar una consulta','photo-1548199973-03cce0bbc87b','Guía de consultas','Elige un tipo de atención y sigue el recorrido de reserva.','Elegir consulta', [['Control preventivo','Revisión de bienestar'],['Vacunación','Revisión del esquema'],['Consulta general','Evaluación clínica']]],
  estetica: ['Casa Nacar','Haz espacio para ti.','Estudio de cuidado facial y corporal','Elegir un ritual','photo-1540555700478-4be289fbecef','Combina tus tratamientos','Prueba distintas combinaciones y consulta el tiempo total.','Añadir tratamiento', [['Ritual facial',50],['Masaje relajante',60],['Cuidado de manos',25]]],
  inmobiliaria: ['Umbral','Un lugar que se siente tuyo.','Inmuebles en Bogotá','Ver propiedades','photo-1600607687939-ce8a6c25118c','Encuentra tu espacio','Filtra el catálogo y selecciona una propiedad para ensayar la visita.','Simular visita', [['Apartamento · Chapinero','Arriendo'],['Casa · Cedritos','Venta'],['Estudio · Teusaquillo','Arriendo']]],
  limpieza: ['En Orden','Más tiempo. Menos pendientes.','Limpieza residencial y empresarial','Calcular un estimado','photo-1581578731548-c64695cc6952','Cotizador de ejemplo','Selecciona el tipo de espacio y ajusta el área para ver el estimado.','Calcular', [['Residencial',2900],['Oficinas',2400],['Posobra',4900]]],
  automotriz: ['Kilómetro 9','Tu carro, listo para lo que sigue.','Servicio y mantenimiento automotriz','Planear mi visita','photo-1486262715619-67b85e0b08d3','Prepara tu visita','Selecciona el servicio, indica el vehículo y prueba la confirmación.','Preparar visita', [['Diagnóstico','60 min'],['Cambio de aceite','45 min'],['Revisión de frenos','75 min'],['Alineación','40 min']]],
};

const menuDetails = [
  ['Maíz asado, queso fresco y mantequilla de hierbas.','photo-1601050690597-df0568f70950'],
  ['Pollo dorado al fuego con limón y especias.','photo-1555939594-58d7cb561ad1'],
  ['Papas al horno con romero y sal gruesa.','photo-1518013431117-eb1465fa5752'],
  ['Torta de chocolate servida tibia.','photo-1578985545062-69928b1d9587'],
];
const propertyPhotos = ['photo-1600607687939-ce8a6c25118c','photo-1600596542815-ffad4c1539a9','photo-1522708323590-d24dbb6b0267'];

const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money = amount => new Intl.NumberFormat('es-CO', {style:'currency',currency:'COP',maximumFractionDigits:0}).format(amount);

export function gallery(demos) {
  return demos.map(({slug,name}) => {
    const [brand,,,cta,photo] = examples[slug];
    return `<li><a href="/demostraciones/${slug}" class="demo-tile"><img alt="" loading="lazy" width="640" height="420" src="${image(photo,640)}"><span><small>${name}</small><strong>${brand}</strong><span>${cta} ↗</span></span></a></li>`;
  }).join('');
}

const image = (photo,width) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=${width}&q=76`;

export function showcaseDemo({slug,name,images,contact,hours,location,sections}) {
  const [brand, headline, niche, cta, photo, heading, instruction, action, items] = examples[slug];
  const narrative = story(slug, image, items);
  const visit = brandVisit(slug, items.map(([label]) => label));
  const totals = ['restaurante','estetica'].includes(slug);
  const entries = items.map(([label, detail], index) => `<article data-entry="${escape(detail)}" ${slug==='restaurante' ? `data-food="${index}"` : ''} ${inventory[label] ? `data-zone-card="${inventory[label][0]}" data-price="${inventory[label][1]}"` : ''}>${slug === 'restaurante' ? `<img alt="" width="540" height="340" loading="lazy" src="${image(menuDetails[index][1],540)}">` : ''}
  ${slug === 'inmobiliaria' ? `<img alt="" width="540" height="340" loading="lazy" src="${image(propertyPhotos[index],540)}">` : ''}
  <h3>${escape(label)}</h3>${slug === 'restaurante' ? `<p>${menuDetails[index][0]}</p>` : ''}<p>${slug === 'restaurante' ? money(detail) : slug === 'estetica' ? detail + ' min' : slug === 'limpieza' ? money(detail) + '/m²' : inventory[label] ? detail + ' · ' + inventory[label][2] + ' m² · ' + money(inventory[label][1]) + inventory[label][3] : escape(detail)}</p>${sections.includes('interaction') ? `<button type="button" data-choice="${escape(label)}" data-detail="${escape(detail)}" ${totals || slug==='limpieza' ? '' : `data-pick="${escape(label)}"`}>${action}<span class="demo-sr"> · ${escape(label)}</span></button>` : ''}</article>`).join('');
  return `<div class="showcase theme-${slug}" data-showcase="${slug}">
  <div class="show-top"><strong>${brand}</strong><span>Demostración · ${name}</span><nav aria-label="Demostración"><a href="#galeria">${directions[slug].nav}</a><a href="#experiencia">${cta}</a></nav></div>
  ${brandHero(slug, niche, cta, escape(images[0]?.src || image(photo,1200)), image)}
  ${narrative.gallery}
  <section class="show-content" id="experiencia"><p class="show-kicker">${brand}</p><h2>${heading}</h2><p>${instruction}</p>
  ${slug === 'inmobiliaria' ? '<p data-results role="status"></p><a href="#inicio-filtros" data-return-filter>Editar filtros</a>' : ''}
  ${slug === 'limpieza' ? '<label>Área aproximada (m²)<input data-area type="number" value="60" min="20" max="1000" step="1" required></label><p>Espacio elegido: <strong data-space-selected>Residencial</strong></p>' : ''}
  ${slug === 'automotriz' ? '<label>Vehículo<input data-vehicle placeholder="Ej. Mazda 2" maxlength="80" required></label>' : ''}
  ${slug==='restaurante' ? '<div class="food-nav" aria-label="Categorías de la carta"><button type="button" data-menu="">Toda la carta</button><button type="button" data-menu="0">Entradas</button><button type="button" data-menu="1">A la brasa</button><button type="button" data-menu="2">Acompañamientos</button><button type="button" data-menu="3">Postres</button></div>' : ''}
  ${visit.extras}
  ${sections.includes('services') ? `<div class="show-items">${entries}</div>` : ''}
  <div class="show-result"><p role="status"></p>${totals ? '<button data-reset type="button" hidden>Vaciar selección</button>' : ''}<div data-slots hidden><label>Horario de ejemplo<select><option>09:00</option><option>11:30</option><option>15:00</option></select></label><button type="button" data-confirm>Confirmar simulación</button></div></div>
  ${slug==='veterinaria' ? '<p data-species-help>Trae a tu perro con correa o en su transportadora.</p>' : ''}
  <p class="show-note">Sitio ficticio de Onlaine. Las selecciones son de prueba y no se envían.</p>
  ${[location,hours,contact].filter(Boolean).map(value => `<p>${escape(value)}</p>`).join('')}</section>${visit.body}${narrative.faq}</div>`;
}
