const portraits = {
  odontologia: ['photo-1600170311833-c2cf5280ce49','Detalle del consultorio'],
  restaurante: ['photo-1476224203421-9ac39bcb3327','Un plato para compartir'],
  veterinaria: ['photo-1537151625747-768eb6cf92b2','Una visita con tu mascota'],
  estetica: ['photo-1515377905703-c4788e51af15','Una pausa de bienestar'],
  inmobiliaria: ['photo-1616486338812-3dadae4b4ace','Luz y textura en el interior'],
  limpieza: ['photo-1584622650111-993a426fbf0a','Superficies y acabados'],
  automotriz: ['photo-1541899481282-d53bffe3c35d','Detalles del vehÃ­culo'],
};

export function floatingPhoto(slug, image) {
  const [photo, caption] = portraits[slug];
  return `<figure class="floating-photo"><img alt="" src="${image(photo,620)}" width="620" height="780" decoding="async"><figcaption>${caption}</figcaption></figure>`;
}
