export const services = [
  ['Páginas web profesionales','Presenta tu negocio y facilita que te contacten.'],
  ['Landing pages','Convierte el interés de una campaña en solicitudes concretas.'],
  ['Tiendas virtuales','Organiza tu catálogo y simplifica el proceso de compra.'],
  ['Software a medida','Reúne datos y tareas en un sistema que siga tu operación.'],
  ['Automatización empresarial','Reduce el tiempo dedicado a registrar, copiar y conciliar información.'],
  ['Inteligencia artificial para negocios','Agiliza la clasificación de solicitudes y la consulta de información.'],
  ['Chatbots y asistentes inteligentes','Responde preguntas frecuentes incluso fuera del horario comercial.'],
  ['Integraciones con WhatsApp','Lleva las consultas a un canal familiar para tus clientes.'],
  ['Posicionamiento SEO','Ayuda a que encuentren tus servicios buscando en Google.'],
  ['Mantenimiento y soporte','Mantén tu sitio actualizado a medida que el negocio cambia.'],
];

export const demos = [
  ['odontologia','Odontología','Consulta general','Limpieza dental','Ortodoncia','#2456a4'],
  ['restaurante','Restaurantes','Menú del día','Carta de temporada','Reserva de mesa','#a33c24'],
  ['veterinaria','Veterinarias','Consulta veterinaria','Vacunación','Control preventivo','#1e6e57'],
  ['estetica','Centros de estética','Cuidado facial','Masaje','Asesoría estética','#875374'],
  ['inmobiliaria','Inmobiliarias','Apartamento en venta','Casa en arriendo','Visita guiada','#665322'],
  ['limpieza','Empresas de limpieza','Limpieza residencial','Limpieza de oficinas','Limpieza posobra','#235f7e'],
  ['automotriz','Talleres automotrices','Diagnóstico','Cambio de aceite','Revisión de frenos','#474384'],
].map(([slug, name, ...details]) => ({
  slug, name, services: details.slice(0, 3), color: details[3],
  images: [], contact: null, hours: null, location: null, sections: ['services', 'interaction'],
}));

export const faq = [
  ['¿Cuánto cuesta un proyecto?','La propuesta se cotiza según el alcance, los contenidos y las integraciones.'],
  ['¿Cuánto tarda el desarrollo?','El plazo se define después de revisar el alcance y la disponibilidad de materiales.'],
  ['¿Qué incluye la demostración gratuita?','Una propuesta visual inicial para revisar cómo podría presentarse tu negocio.'],
  ['¿Quién gestiona el alojamiento y el dominio?','Podemos ayudarte a configurarlos en cuentas bajo tu control. El costo depende del proveedor.'],
  ['¿Ofrecen mantenimiento?','Sí. Definimos el alcance y la frecuencia de las actualizaciones en la propuesta.'],
  ['¿De quién será el sitio?','La entrega, accesos, archivos y licencias se especifican antes de iniciar el proyecto.'],
];
