# Estrategia CRO, contenido y tráfico orgánico — Yanbal

Fecha del diagnóstico: 2026-09-09.

## Diagnóstico del sitio actual

- El build publica 469 fichas de producto y 500 rutas; sitemap, canonical, SKU, imagen y precio están verificados.
- Hay 401 referencias con precio anterior y 40 promociones modeladas. Las promociones combinables conservan sus reglas verificadas.
- Las 469 fichas tienen beneficios e imagen propia, pero todas las descripciones tienen menos de 12 palabras y solo existen 150 descripciones únicas. Esta es la principal debilidad de contenido.
- Las páginas de categoría y ciudad tienen entre 404 y 870 palabras y enlazan entre 24 y 48 productos. El catálogo completo depende principalmente del sitemap para descubrir las referencias que no aparecen en la primera vista.
- No hay testimonios, fotos de entregas ni identidad de la consultora configurados. Añadirlos sin evidencia reduciría la confianza, por lo que deben recopilarse y publicarse con autorización real.
- Las tarifas de envío no están definidas. El checkout las trata correctamente como no disponibles y bloquea el cobro; este bloqueo comercial debe resolverse con tarifas confirmadas.
- El embudo mide `view_item`, `add_to_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `purchase` y `whatsapp_click`. Se añadió `add_payment_info` sin retirar `payment_click`.

## Prioridad 0: habilitar ventas medibles

1. **Definir tarifas y promesa de entrega.** Configurar costos reales para Cúcuta, Bogotá y cobertura nacional, además de tiempos de despacho y entrega. Mostrar el costo o un cálculo antes de pedir los datos completos. La investigación de Baymard indica que una parte relevante de compradores busca el costo de envío en la ficha y abandona cuando no conoce el total.
2. **Cerrar Mercado Pago real.** Registrar el secreto entregado por el webhook de Mercado Pago, ejecutar el pago de prueba aprobado/pendiente/rechazado y verificar que solo el webhook marque el pedido como pagado.
3. **Completar el embudo GA4.** Validar en DebugView los eventos y parámetros de productos; después construir el informe de checkout por dispositivo, ciudad y fuente. Google usa `begin_checkout`, `add_shipping_info`, `add_payment_info` y `purchase` para ese informe.
4. **Incorporar confianza verificable.** Publicar nombre y foto autorizada de la consultora, condiciones de entrega, medios de contacto, política de cambios clara, fotografías propias y reseñas de compradores con consentimiento. No crear valoraciones sintéticas ni usar reseñas de terceros como propias.

## Prioridad 1: aumentar conversión

1. **Enriquecer primero las 30 fichas con mayor intención.** Priorizar ofertas, perfumes, Total Block, maquillaje y referencias que ya reciben impresiones. Cada ficha debe responder, con información comprobada: para quién es, contenido/presentación, acabado o familia olfativa, modo de uso, ocasión, diferencias frente a variantes, código Yanbal, política de entrega y preguntas reales recibidas por WhatsApp.
2. **Galerías propias.** Añadir fotos del empaque, escala real, textura o tono, aplicación y contenido de la caja. Agregar video corto propio cuando aporte una demostración. Mantener `img` con `src`, texto alternativo descriptivo, dimensiones y versiones responsive.
3. **Costo total visible.** Una vez configurado el envío, ofrecer un calculador por municipio en la ficha y el carrito, y mostrar una fecha estimada real. No usar mensajes de “envío gratis” sin una tarifa de base confirmada.
4. **Asistencia de elección.** Crear comparadores útiles: perfume por ocasión y perfil aromático; Total Block por zona de uso, acabado y etiqueta oficial; maquillaje por tono/acabado. Las recomendaciones deben basarse en fichas oficiales y experiencia real, evitando afirmaciones médicas no sustentadas.
5. **Prueba social cerca de la compra.** Mostrar reseñas verificadas, preguntas y respuestas, y fotos reales junto al bloque de compra. Separar claramente la opinión de la consultora de las especificaciones de Yanbal.
6. **Recuperación con consentimiento.** Permitir que el comprador solicite por WhatsApp conservar el carrito o recibir aviso de disponibilidad. No enviar campañas posteriores sin consentimiento explícito.

## Prioridad 1: tráfico orgánico y descubrimiento

1. **Paginación rastreable.** Crear URLs HTML enlazables para todas las páginas del catálogo y para categorías grandes. Google recomienda enlaces `<a href>` desde categoría hasta cada producto; el sitemap ayuda, pero no sustituye una arquitectura interna clara.
2. **Google Merchant Center.** Generar un feed con `id`, título, descripción única, enlace, imagen, precio, disponibilidad, marca y estado. Activar fichas gratuitas para Colombia cuando envío, cambios y disponibilidad sean exactos. Google confirma que pueden aparecer en Búsqueda, Shopping, Maps, Imágenes, Lens, YouTube y Gemini.
3. **Datos estructurados comerciales.** Mantener `Product` y `BreadcrumbList`; añadir `MerchantReturnPolicy` y `OfferShippingDetails` solo cuando existan reglas comerciales confirmadas. Agrupar variantes con `ProductGroup` únicamente después de validar qué referencias son tonos o tamaños del mismo producto.
4. **Google Search Console.** Enviar sitemap, revisar indexación y separar consultas de marca y sin marca. Cada dos semanas: detectar consultas con impresiones y CTR bajo, mejorar título/descripcion y ampliar la respuesta de la página correspondiente.
5. **SEO local válido.** Crear o mejorar el Perfil de Negocio solamente si existe atención presencial o entrega en persona conforme a las reglas de Google. Un negocio exclusivamente en línea no es elegible y no debe usar una oficina virtual.

## Sistema de contenido valioso

Publicar menos piezas y hacerlas útiles con experiencia propia. Google recomienda contenido original, completo, con autor identificado y creado para resolver la necesidad del lector, no páginas masivas destinadas a cubrir variaciones de palabras clave.

### Grupos de intención

- **Elección:** cómo escoger perfume para clima cálido, oficina, regalo o noche; diferencias entre concentraciones cuando la etiqueta oficial lo confirme.
- **Uso:** cómo aplicar y conservar perfumes; cómo elegir y reaplicar protector según las instrucciones oficiales; preparación de piel antes del maquillaje.
- **Comparación:** matrices de productos de una misma línea, tamaños, acabados y tonos con ventajas y límites concretos.
- **Regalo:** guías por presupuesto, destinatario y fecha, enlazadas a productos disponibles y con costo total real.
- **Campaña:** novedades verificadas, cambios de precio y promociones de la campaña, con fecha de vigencia visible.
- **Preguntas reales:** convertir dudas recibidas por WhatsApp en respuestas públicas, manteniendo datos personales fuera del contenido.

### Plantilla editorial

Cada guía debe tener autor/revisor, fecha de revisión real, una respuesta directa al inicio, evidencia propia, fotografías o video originales, tabla de comparación cuando sea útil, preguntas frecuentes reales y enlaces a las fichas relevantes. Las páginas se actualizan cuando cambia el contenido, sin cambiar fechas solo para aparentar frescura.

## Plan de 90 días

### Semanas 1–2

- Definir envío y cerrar pruebas de Mercado Pago.
- Verificar GA4/GTM/Ads en producción controlada.
- Configurar Search Console y Merchant Center.
- Hacer rastreables todas las páginas del catálogo.
- Recopilar identidad, políticas, cinco testimonios verificables y diez fotos propias.

### Semanas 3–6

- Enriquecer 30 fichas prioritarias.
- Publicar cuatro guías de elección basadas en preguntas reales.
- Crear dos comparadores: perfumes y Total Block.
- Añadir feed de Merchant Center y datos estructurados de envío/devolución validados.

### Semanas 7–12

- Ampliar solo páginas que ganen impresiones o ayuden a convertir.
- Probar una variable por experimento: texto del CTA, posición del cálculo de envío, orden de beneficios o formato de prueba social.
- Publicar videos demostrativos propios y reutilizarlos en la ficha, redes y WhatsApp.
- Revisar consultas sin marca, CTR, adición al carrito, avance por checkout, compra y contacto por WhatsApp.

## Métricas de decisión

- SEO: páginas indexadas, impresiones y clics sin marca, CTR por página, tráfico de Imágenes y Merchant Center.
- CRO: `view_item → add_to_cart`, `add_to_cart → begin_checkout`, `begin_checkout → add_shipping_info`, `add_shipping_info → add_payment_info` y `add_payment_info → purchase`.
- Negocio: tasa de compra, pedidos por WhatsApp, ticket medio, margen por pedido, costo de envío y tasa de devolución.
- Contenido: páginas que generan entrada orgánica, productos asistidos por guía y ventas donde una guía apareció antes de la compra.

## Fuentes de referencia

- [Contenido útil y centrado en personas — Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Estructura de navegación para ecommerce — Google Search Central](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure?hl=es)
- [Datos estructurados de producto — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Datos de Merchant Listing, envío y devoluciones — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing)
- [Fichas gratuitas en Colombia — Google Merchant Center](https://support.google.com/merchants/answer/13889434?hl=es-CO)
- [Buenas prácticas para imágenes — Google Search Central](https://developers.google.com/search/docs/appearance/google-images)
- [Embudo de checkout de GA4 — Google Analytics](https://support.google.com/analytics/answer/14000977)
- [Investigación de fichas de producto — Baymard Institute](https://baymard.com/research/product-page)
- [Investigación de checkout — Baymard Institute](https://baymard.com/research/checkout-usability)
- [Requisitos del Perfil de Negocio — Google](https://support.google.com/business/answer/13763036)

