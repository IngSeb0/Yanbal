const scenes = {
  odontologia: {button:'Abrir ruta de la consulta', opened:'Cerrar ruta de la consulta', face:'Ruta de la primera visita', layers:['Conversamos','Valoramos','Planeamos']},
  restaurante: {button:'Servir el plato', opened:'Volver a la cocina', face:'De la brasa a la mesa', layers:['Fuego','Plato','Mesa']},
  veterinaria: {button:'Abrir ficha de cuidados', opened:'Cerrar ficha de cuidados', face:'Cuidados de tu mascota', layers:['Historial','Prevención','Seguimiento']},
  estetica: {button:'Desplegar el ritual', opened:'Cerrar la carta del ritual', face:'Carta de rituales', layers:['Preparación','Ritual','Pausa']},
  inmobiliaria: {button:'Desplegar la planta en 3D', opened:'Plegar la planta', face:'Planta ilustrativa', layers:['Sala','Cocina','Dormitorio']},
  limpieza: {button:'Desglosar el servicio', opened:'Reunir las capas', face:'Capas del servicio', layers:['Superficies','Pisos','Detalles']},
  automotriz: {button:'Desmontar la rueda', opened:'Montar la rueda', face:'Anatomía de una rueda', layers:['Neumático','Rin','Disco']},
};

export function signatureScene(slug) {
  const {button, opened, face, layers} = scenes[slug];
  return `<section id="escena-3d" class="signature" aria-label="${face}" data-signature>
  <div class="signature-stage" aria-hidden="true">
    <div class="signature-floor"></div>
    <div class="signature-object">
    ${layers.map((layer, index) => `<div class="signature-layer layer-${index + 1}"><span><b>0${index + 1}</b> ${layer}</span></div>`).join('')}
    </div>
  </div>
  <div class="signature-controls">
    <button type="button" data-scene-button data-opened="${opened}" data-closed="${button}" aria-expanded="false" aria-controls="signature-details" hidden><span>${button}</span><b aria-hidden="true">↗</b></button>
    <p id="signature-details" hidden>${layers.join(' · ')}</p>
  </div>
  </section>`;
}
