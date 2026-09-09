import fs from "node:fs";
const pages = {
  "yanbal-cucuta": [
    "Yanbal Cúcuta: perfumes, maquillaje y Total Block",
    "Cúcuta es una de nuestras principales zonas de atención. Elige tus productos, selecciona Cúcuta en la entrega y revisa el costo antes de pagar. Para áreas cercanas, selecciona tu municipio real; la cobertura se confirma según la zona.",
    "",
  ],
  "yanbal-bogota": [
    "Productos Yanbal en Bogotá",
    "Encuentra perfumes para el día a día, maquillaje y cuidado personal con entrega en Bogotá según zona. Indica tu dirección, barrio y apartamento para facilitar el despacho. El envío aparece antes de abrir Mercado Pago.",
    "",
  ],
  "yanbal-colombia": [
    "Comprar Yanbal online en Colombia",
    "Compra sin crear una cuenta. Elige tu departamento y municipio para conocer el envío; si tu ubicación aún requiere cotización, puedes solicitarla por WhatsApp. La tienda recibe pedidos para Colombia y prioriza la atención en Cúcuta y Bogotá.",
    "",
  ],
  "perfumes-yanbal": [
    "Perfumes Yanbal",
    "Encuentra tu próxima fragancia: perfumes y colonias para uso diario, ocasiones especiales o regalos. Revisa la presentación y el precio de cada producto antes de elegir.",
    "parfum",
  ],
  "perfumes-mujer": [
    "Perfumes Yanbal para mujer",
    "Explora fragancias femeninas y sus presentaciones. Si necesitas orientación sobre aromas, puedes consultarnos por WhatsApp.",
    "parfum",
    "mujer",
  ],
  "perfumes-hombre": [
    "Perfumes Yanbal para hombre",
    "Fragancias masculinas para distintos estilos y ocasiones. Compra directamente o pide asesoría para elegir tu aroma.",
    "parfum",
    "hombre",
  ],
  "bloqueadores-total-block": [
    "Bloqueadores Yanbal Total Block",
    "Explora la línea Total Block para rostro, cuerpo y actividades al aire libre. Consulta las características y recomendaciones de uso en el producto y su empaque.",
    "total block",
  ],
  "maquillaje-yanbal": [
    "Maquillaje Yanbal",
    "Labiales, máscaras y maquillaje para tu rutina. Revisa el tono y las promociones combinables antes de agregar tus favoritos.",
    "maquillaje",
  ],
  "regalos-yanbal": [
    "Regalos Yanbal",
    "Perfumes, joyería y detalles de belleza para regalar. Elige la presentación y compra con el costo de entrega visible antes de pagar.",
    "",
  ],
  "cuidado-facial": [
    "Cuidado facial Yanbal",
    "Productos de limpieza y cuidado para completar tu rutina facial. Lee las indicaciones del producto y elige según tus necesidades.",
    "facial",
  ],
  "cuidado-personal": [
    "Cuidado personal Yanbal",
    "Cremas, cuidado corporal y productos para tu rutina diaria. Explora las presentaciones y ofertas del catálogo.",
    "cuidado personal",
  ],
  ofertas: [
    "Ofertas Yanbal",
    "Descubre descuentos calculados sobre el precio anterior del catálogo. Las promociones de dos unidades indican sus condiciones para que sepas exactamente qué recibes.",
    "",
  ],
};
for (const [slug, [title, intro, filter, gender]] of Object.entries(pages)) {
  fs.mkdirSync(`app/${slug}`, { recursive: true });
  fs.writeFileSync(
    `app/${slug}/page.tsx`,
    `import type { Metadata } from "next";\nimport { Landing } from "../landing-page";\nexport const metadata:Metadata=${JSON.stringify({ title, description: intro, alternates: { canonical: `/${slug}` }, openGraph: { title, description: intro, url: `/${slug}` }, twitter: { title, description: intro } })};\nexport default function Page(){return <Landing title=${JSON.stringify(title)} intro=${JSON.stringify(intro)} filter=${JSON.stringify(filter)} gender=${JSON.stringify(gender || "")}/>;}\n`,
  );
}
const policies = {
  envios: [
    "Envíos en Colombia",
    [
      "Atendemos pedidos para Colombia según cobertura de la logística, con atención prioritaria en Cúcuta y Bogotá.",
      "Selecciona tu departamento y municipio en el checkout. Verás subtotal, envío y total antes de pagar. Si tu ubicación requiere confirmar el envío, el pago se habilitará cuando exista una tarifa.",
      "El pedido se procesa una vez aprobado el pago. Preparamos los productos disponibles o los solicitamos a Yanbal y coordinamos el despacho. Los plazos dependen de la disponibilidad y la ubicación; no ofrecemos entrega inmediata garantizada.",
      "Para consultar cobertura o seguimiento, escríbenos por WhatsApp indicando únicamente el número de pedido.",
    ],
  ],
  "cambios-y-devoluciones": [
    "Cambios y devoluciones",
    [
      "Si un producto se agota después del pago, te contactaremos para ofrecerte un reemplazo o la devolución del valor correspondiente.",
      "Si recibes un producto distinto o con un inconveniente, contáctanos por WhatsApp con el número de pedido y una descripción del problema. Conserva el producto y su empaque mientras coordinamos la solución.",
      "Las solicitudes de cambio, garantía, retracto o reversión se atienden conforme a los derechos que correspondan a la compra y la normativa aplicable en Colombia. Esta página no limita tus derechos.",
      "No envíes datos de tarjeta por WhatsApp. Te indicaremos los pasos y condiciones aplicables a tu solicitud antes de realizar una devolución.",
    ],
  ],
  privacidad: [
    "Política de privacidad",
    [
      "Somos una tienda de asesoría independiente de productos Yanbal. Puedes contactarnos en el WhatsApp 302 629 3535 para consultas sobre el tratamiento de tus datos.",
      "Usamos nombre, celular, email, dirección, barrio y ubicación para registrar el pedido, procesar la entrega y dar soporte. Los pedidos se almacenan en nuestra base de datos con acceso restringido.",
      "Mercado Pago procesa el pago y recibe la información necesaria para ello. No almacenamos los datos de tu tarjeta. La información de entrega se comparte con los participantes necesarios para gestionar el despacho.",
      "Con tu consentimiento usamos Google Tag Manager y herramientas de medición para conocer visitas, productos consultados y compras. Asociamos parámetros de campaña al pedido cuando autorizas la medición. No enviamos nombre, celular, email ni dirección a dataLayer.",
      "Puedes aceptar o rechazar la medición sin afectar tu compra, y cambiar tus preferencias en el pie de página. El carrito se conserva en este navegador durante 30 días; los datos del formulario no se guardan localmente.",
      "Puedes solicitar consulta, corrección o eliminación de tus datos por nuestro canal de contacto. Conservamos la información del pedido durante el tiempo necesario para gestionar la compra y cumplir las obligaciones aplicables. No usamos tus datos para campañas de mensajes sin autorización.",
    ],
  ],
  terminos: [
    "Términos de compra",
    [
      "Esta es una tienda de asesoría independiente; no se presenta como tienda oficial de Yanbal. Ofrecemos los productos y presentaciones indicados en el catálogo.",
      "Los precios se expresan en pesos colombianos. Antes del pago se muestran los productos, promociones, envío y total. Las promociones combinables requieren la cantidad indicada.",
      "Puedes comprar como invitado. Debes proporcionar datos correctos para gestionar el pedido y la entrega. El pago completo se procesa mediante Mercado Pago; la confirmación depende de su aprobación.",
      "Los productos están sujetos a disponibilidad al procesar el pedido. Si alguno se agota después de comprar, podrás elegir un reemplazo o solicitar la devolución del valor correspondiente.",
      "La cobertura y los costos se consultan antes de pagar. Revisa las páginas de envíos, cambios y devoluciones y privacidad para más información. Para aclaraciones, contáctanos por WhatsApp.",
    ],
  ],
  contacto: [
    "Contacto y asesoría",
    [
      "¿Necesitas ayuda para elegir un aroma, un tono o conocer el estado de tu pedido? Estamos disponibles por WhatsApp antes y después de comprar.",
      "Atendemos Cúcuta, Bogotá y pedidos para Colombia según cobertura. Para seguimiento, comparte el número de pedido; no envíes información de tarjeta.",
    ],
  ],
};
for (const [slug, [title, paragraphs]] of Object.entries(policies)) {
  fs.mkdirSync(`app/${slug}`, { recursive: true });
  fs.writeFileSync(
    `app/${slug}/page.tsx`,
    `import type { Metadata } from "next";\nimport { store } from "../../config/store.js";\nexport const metadata:Metadata=${JSON.stringify({ title, alternates: { canonical: `/${slug}` } })};\nexport default function Page(){return <main className="shop-main shop-section policy-page"><h1>${title}</h1>${paragraphs.map((p) => `<p>${p}</p>`).join("")}<a className="button button--ghost" href={\`https://wa.me/\${store.whatsapp}\`} target="_blank" rel="noreferrer">Consultar por WhatsApp</a></main>;}\n`,
  );
}
