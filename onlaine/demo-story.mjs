const editorial = {
  odontologia: ['Una consulta pensada para ti', [['Prevención','La limpieza y la revisión ayudan a conocer el estado de tu salud oral.','photo-1629909613654-28e377c37b09'],['Primera visita','Empieza con una conversación sobre tus necesidades y una valoración.','photo-1588776814546-1ffcf47267a5'],['Plan personalizado','Conoce las opciones y decide cómo continuar después de la valoración.','photo-1609840114035-3c981b782dfe']], [['¿Qué llevo a la primera cita?','Si tienes radiografías recientes o una lista de medicamentos, llévalas para revisarlas en consulta.'],['¿Puedo elegir el tratamiento de inmediato?','La valoración permite revisar primero las opciones adecuadas para tu caso.']]],
  restaurante: ['De la cocina a tu mesa', [['La mesa','Un espacio para comidas en familia y encuentros entre amigos.','photo-1552566626-52f8b828add9'],['A la brasa','Platos principales para descubrir y pedir desde la carta.','photo-1504674900247-0877df9cc836'],['Algo dulce','Imagina una carta que también abre el apetito para el postre.','photo-1551024506-0bccd828d307']], [['¿Puedo consultar alérgenos?','En un sitio real, cada plato puede incluir sus ingredientes y advertencias.'],['¿Puedo cambiar mi pedido?','Usa el botón para vaciar la selección y prueba otra combinación.']]],
  veterinaria: ['Acompañamos cada etapa', [['Primeros cuidados','Organiza un control inicial para conversar sobre vacunas y hábitos.','photo-1552053831-71594a27632d'],['Bienestar felino','Reserva una consulta según las necesidades de tu gato.','photo-1573865526739-10659fec78a5'],['Seguimiento','Mantén a mano el historial para dar continuidad a los controles.','photo-1587300003388-59208cc962cb']], [['¿Qué debo llevar a la consulta?','Ten a mano el carné de vacunas y el historial de tu mascota.'],['¿La agenda atiende urgencias?','La agenda muestra un recorrido de consulta programada.']]],
  estetica: ['Tu pausa empieza aquí', [['Ambiente','Luz suave y espacios tranquilos para desconectarte.','photo-1570172619644-dfd03ed5d881'],['Cuidado facial','Explora un ritual con tiempo para preparar y cuidar la piel.','photo-1600334129128-685c5582fd35'],['Momentos de descanso','Combina tratamientos y reserva tiempo para disfrutarlos.','photo-1604654894610-df63bc536371']], [['¿Puedo combinar tratamientos?','Sí. Añade varios al planificador y revisa el tiempo estimado.'],['¿Cuándo llego al estudio?','Considera tiempo para conversar sobre el servicio antes de empezar.']]],
  inmobiliaria: ['Recorre la próxima dirección', [['Sala','Imagina la distribución antes de programar una visita.','photo-1600210492486-724fe5c67fb0'],['Cocina','Revisa los espacios que más usas en el día a día.','photo-1556911220-bff31c812dba'],['Dormitorio','Descubre los detalles y la iluminación de cada ambiente.','photo-1616594039964-ae9021a400a0']], [['¿Cómo funciona la búsqueda?','Filtra por venta o arriendo. Cada resultado permite simular una visita.'],['¿Las propiedades siguen disponibles?','El catálogo muestra propiedades de ejemplo para probar el recorrido.']]],
  limpieza: ['Un servicio para cada espacio', [['Hogar','Elige el alcance según la superficie y las zonas que quieres atender.','photo-1527515637462-cff94eecc1ac'],['Oficinas','Planifica un servicio que encaje con el horario del equipo.','photo-1497366754035-f200968a6e72'],['Fin de obra','Calcula una referencia para preparar espacios recién intervenidos.','photo-1600566753086-00f18fb6b3ea']], [['¿Qué incluye el estimado?','El cálculo multiplica el área por una tarifa ficticia del servicio seleccionado.'],['¿Se puede ajustar el alcance?','Sí. Cambia el área o el tipo de espacio para comparar.']]],
  automotriz: ['Conoce el taller', [['Inspección','Identifica qué revisar antes de autorizar un servicio.','photo-1503376780353-7e6692767b70'],['Mantenimiento','Programa el tiempo según la intervención que requiere el vehículo.','photo-1485291571150-772bcfc10da5'],['Entrega','Revisa el trabajo realizado y aclara dudas al recoger el vehículo.','photo-1492144534655-ae79c964c9d7']], [['¿Qué datos necesito?','El modelo y el servicio bastan para ensayar la reserva.'],['¿Cuánto demora el servicio?','La lista muestra tiempos ficticios. En una visita real se confirmarían después del diagnóstico.']]],
};

const fourthPhoto = {'odontologia': 'photo-1598256989800-fe5f95da9787', 'automotriz': 'photo-1503736334956-4c8f8e92946d'};

export function story(slug, image, items) {
  const [heading, original, faq] = editorial[slug];
  const isStation = ['odontologia','automotriz','estetica'].includes(slug);
  const slides = isStation ? items.map(([title, detail], index) => [
    title, original[index % original.length][1] + ' Duración de ejemplo: ' + (slug === 'estetica' ? detail + ' min.' : detail + '.'), (original[index]?.[2] ?? fourthPhoto[slug]),
  ]) : original;
  return {
    gallery: `<section class="show-content show-story" id="galeria" aria-labelledby="story-title">
    <h2 id="story-title">${heading}</h2>
    <div class="show-carousel" data-carousel role="group" aria-label="${heading}" tabindex="0">
    <div class="show-controls" hidden><button type="button" data-prev aria-label="Anterior">←</button><div data-dots>${slides.map(([title], index) => `<button type="button" data-slide="${index}" aria-label="${title}">${index + 1}</button>`).join('')}</div><button type="button" data-next aria-label="Siguiente">→</button><button type="button" data-preview>Ver giro 3D</button><output data-count></output></div>
    <div class="show-rail" data-rail>${slides.map(([title, text, photo], index) => `<figure class="show-slide">
    <img src="${image(photo,950)}" alt="" width="950" height="610" loading="lazy">
    <figcaption><span>0${index + 1} / 0${slides.length}</span><h3>${title}</h3><p>${text}</p>
    ${isStation ? `<a class="show-button" data-pick="${title}" href="#solicitud">Elegir ${slug==='automotriz'?'este servicio':slug==='estetica'?'este ritual':'este tratamiento'}</a>` : ''}
    ${slug==='inmobiliaria' ? '<button type="button" data-expand>Ampliar foto</button>' : ''}</figcaption></figure>`).join('')}</div>

    </div>
    ${slug==='inmobiliaria' ? '<dialog data-property-gallery aria-label="Fotografía ampliada"><img alt="Ambiente del inmueble de ejemplo" width="950" height="610"><div class="brand-dialog-controls"><button data-image-prev type="button">Anterior</button><span data-image-count aria-live="polite"></span><button data-image-next type="button">Siguiente</button><form method="dialog"><button autofocus>Cerrar</button></form></div></dialog>' : ''}
    </section>`,
    faq: `<section class="show-content show-faq"><h2>Antes de tu visita</h2>${faq.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}<div class="show-callout"><h3>Prueba el recorrido completo</h3><a class="show-button" href="#experiencia">Volver a la experiencia ↑</a></div></section>`,
  };
}
