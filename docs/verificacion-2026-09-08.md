# Verificación Yanbal — 8 de septiembre de 2026

**Estado: trabajo en curso. Ninguna fase se declara terminada. No se hizo commit, despliegue ni migración remota.**

Proyecto: `C:\Users\Acer\Documents\Codex\2026-08-15\cr`.
Base de comparación: rama `main`, HEAD `31fa8a3e485c765591f62c45dd7ee068b0ca1a1f`.
Hay cambios locales y archivos nuevos sin seguimiento. El resumen de `git diff --stat` no incluye los archivos nuevos: no representa por sí solo cuánto código se trasladó a módulos nuevos.

## Build y errores

- `npm test`: correcto. Ejecuta el build vinext/Vite, exporta **500 rutas, incluidas 469 fichas**, y pasa 5 pruebas de HTML/SEO.
- `npm run test:commerce`: 10 pruebas correctas.
- `npm run test:sql`: suite correcta con 9 casos internos; el runner informa 10 contando la suite.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: correcto.
- ESLint sobre todos los archivos de código modificados/nuevos: **0 errores, 5 advertencias** sobre imágenes HTML. No se afirma que el lint de todo el repositorio histórico esté limpio.
- Vinext avisa que no puede clasificar estáticamente algunas rutas. La exportación solicita cada ruta y falla si no obtiene el estado HTTP esperado.

Corregidos: await inválido al resolver parámetros de producto; tipos del entorno Worker; retorno antiguo que podía mostrar éxito sin verificación; objetivos de Ads perdidos; mensajes de envío desactualizados; carrito con almacenamiento inválido; pérdida del primer view_item al aceptar consentimiento en la ficha; dependencia innecesaria del almacenamiento de sesión para abrir el pago; errores de lint.
El código cambiado se formateó para facilitar su revisión. No se sustituyeron bibliotecas ni se actualizó el stack.

## Comparación con los archivos anteriores

Se consultaron con `git show HEAD:<archivo>`.

| Archivo anterior | Conservación o reemplazo comprobado |
| --- | --- |
| app/page.tsx | Ofertas, regalables, categorías, contacto, contenido local, preguntas frecuentes y acceso al catálogo. La home muestra una selección limitada; las 469 referencias siguen en catálogo. Se conservan anclas descuentos, amor-amistad y productos-definidos. |
| app/layout.tsx | Metadatos, identidad, navegación, footer, WhatsApp e identificadores GTM/Ads. Los scripts de medición se cargan tras consentimiento; el carrito es global. |
| app/storefront-ui.tsx | Tarjetas, fotos, SKU, precios anteriores, precios actuales, promociones y enlaces WhatsApp. Carrito y checkout se trasladaron a public/commerce.js y app/checkout, manteniendo la firma usada por landings antiguas. |
| public/conversion-tracking.js | GTM-NBHK5MMR, AW-18340615060, objetivos específicos de checkout y WhatsApp, generate_lead y compatibilidad con funciones antiguas. purchase tiene un flujo distinto, autorizado por backend. |
| app/catalogo/page.tsx | Las páginas originales y recortes del catálogo siguen en /catalogo-paginas. /catalogo contiene ahora buscador, filtros, ordenación y carga progresiva. |

El flujo principal antiguo orientado a pedir por WhatsApp se reemplaza intencionalmente por carrito y checkout nacional. WhatsApp permanece como asistencia. No se afirma que toda interacción secundaria antigua haya sido reproducida de forma idéntica.

## Catálogo: 469 referencias

- Son **468 registros originales y un combo virtual existente**.
- `lib/catalog-products.js`, `lib/virtual-products.js` y `app/catalog-data.ts` no tienen cambios contra HEAD.
- Las pruebas comparan datos originales, SKU, imágenes existentes, precios, precios anteriores, promociones y referencias de páginas.
- 469 slugs únicos y 469 documentos HTML con imagen, SKU, canonical y datos estructurados.
- Las promociones se definen mediante reglas explícitas en `config/promotions.js`, contrastadas con el texto original. No se interpreta indiscriminadamente cualquier “2 por” como bundle.
- Se distinguen paquetes de dos unidades y pares combinables por grupo permitido. El backend rechaza cantidades incompatibles.
- La disponibilidad publicada es “disponible para pedido”; schema usa BackOrder u OutOfStock, sin afirmar inventario físico confirmado.
- Falta validación comercial final de vigencia de campaña, inventario y taxonomías inferidas como género/regalables.

## Checkout y envío

Compra como invitado, validación de datos personales y dirección, selector de **32 departamentos + Bogotá** y **1.122 registros territoriales oficiales recuperados**; algunos corresponden a áreas no municipalizadas.
Los accesos rápidos a Cúcuta y Bogotá seleccionan sus códigos correctos.

El backend recalcula precios y total. Las tarifas no definidas son null: se muestra “Pendiente de envío” y el botón de pago queda deshabilitado. **No se cobra $0 como envío gratuito.**
Las tarifas pueden configurarse por municipio, departamento, Cúcuta, Bogotá o valor nacional en `config/store.js` y las variables soportadas por `lib/shipping.js`. El umbral de envío gratis solo se aplica a destinos con tarifa configurada.

Falta recibir tarifas y cobertura comerciales reales. No se han inventado plazos ni tarifas.

## Mercado Pago

Implementado y probado con respuestas simuladas:

- Guardar pedido antes de solicitar la preferencia.
- external_reference único, clave de idempotencia y token de consulta privado.
- Precios y envío calculados por backend.
- Firma del webhook; consulta server-side del pago; validación de moneda, importe y entorno.
- Registro idempotente de eventos; rechazos tardíos no revierten pedidos pagados/despachados.
- Estados aprobado, pendiente, rechazado y devuelto.
- Ningún retorno confirma el pago por parámetros de URL.
- Carrito conservado hasta aprobación; eliminación de cantidades compradas una sola vez.

**No se realizó una transacción real ni una transacción contra la API sandbox de Mercado Pago.** La revisión de variables de Vercel mostró MERCADO_PAGO_ACCESS_TOKEN, pero no el secreto de webhook ni la conexión Supabase requerida. El mock local de envío de $10.000 es exclusivamente una fixture y no configura el negocio.

Pendiente: validar credenciales del entorno correcto, titular/collector, webhook público y reintentos reales; recuperación operativa de preferencias fallidas o respuestas de red perdidas; límites de solicitudes antes de habilitar tráfico público.

## Supabase

Migración: `supabase/migrations/20260908163022_national_checkout.sql`.

Crea tablas separadas yanbal_orders y yanbal_payment_events; no elimina tablas ni datos históricos. Incluye RLS, permisos limitados a service_role y funciones transaccionales para creación, conciliación y reclamación de purchase.

La migración se aplicó dos veces en PostgreSQL embebido PGlite, preservando una tabla histórica de prueba. Se probaron restricciones de acceso, persistencia previa al pago e idempotencia.

**El esquema remoto actual del proyecto correcto todavía no está validado.** No se debe interpretar la prueba aislada como garantía de compatibilidad con producción. No se aplicó ninguna migración remota.
Pendiente identificar y conectar la instancia correcta, inspeccionar tablas/roles/funciones existentes en lectura, resolver posibles colisiones y validar en un entorno de prueba antes de producción.

## Tracking y SEO

Eventos: view_item, add_to_cart, view_cart, begin_checkout, add_shipping_info, payment_click, purchase y whatsapp_click; UTMs y gclid se conservan en sesión con consentimiento.

Se restauraron los objetivos Ads anteriores:
- Checkout: AW-18340615060/2pBzCITFmOYcEJSnvqlE.
- WhatsApp: AW-18340615060/JBeHCK6u3ukcEJSnvqlE.

No se reutilizan para purchase. La clasificación de estos objetivos como primarios/secundarios debe revisarse en Google Ads.
El contenedor GTM permanece; **no se verificó su configuración publicada de GA4 ni la recepción de eventos en DebugView/Ads**. No se inventó un measurement ID.

purchase solo se entrega para pedidos aprobados y se reclama atómicamente para evitar duplicados. Limitación: si el navegador falla después de reclamarlo y antes de enviarlo, puede perderse el evento; falta confirmar una estrategia de entrega/reconciliación antes de cerrar analítica.
Los tokens privados se retiran de la URL antes de cargar tags.

Sitemap generado con las fichas de producto; checkout, retornos privados y APIs excluidos. Canonical, metadatos y JSON-LD comprobados en HTML. Rutas locales antiguas preservadas y 404 real para productos inexistentes.

## Verificación de navegador realizada

Navegador real contra HTML exportado y handlers Node locales:

- Home: revisión visual desktop 1440×900 y consola sin errores observados.
- Catálogo: móvil 360×800 sin desbordamiento horizontal; buscador con acentos; cero resultados; limpiar filtros; carga de 24 a 48; categoría Protección solar y precios ascendentes.
- Ficha Pasión: imagen, SKU, contenido promocional, precio anterior, descuento y barra móvil de compra.
- Agregar, aumentar cantidad, recargar y comprobar persistencia; Comprar ahora añade y navega al checkout.
- Checkout móvil 390×844; departamentos y municipios; Antioquia/Medellín, Cúcuta y Bogotá; pago bloqueado sin tarifa.
- Retornos aprobado, pendiente y rechazado: UI conectada a handlers reales con base en memoria y datos sintéticos. Aprobado confirma, pendiente no confirma y rechazo permite reintento.
- /gracias?status=approved&payment_id=123: muestra que no puede verificar el estado, sin confirmar compra.
- Enlaces WhatsApp mantienen número y contexto de producto/pedido. No se enviaron mensajes.
- Webhook, importe manipulado, fallo de base, reintentos y purchase duplicado se comprobaron mediante pruebas automatizadas.

No se han verificado exhaustivamente todos los dispositivos, navegación por teclado/lectores de pantalla, condiciones de red, etiquetas en cuentas externas o toda combinación de filtros/promociones. Se conserva esto como pendiente.

## Reproducción y siguiente trabajo

```powershell
npm test
npm run test:commerce
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run preview:commerce
```

Las pruebas SQL y fixtures usan una herramienta aislada, fuera de dependencias de producción:

```powershell
npm install --prefix outputs/verification-tools --no-save --ignore-scripts @electric-sql/pglite@0.5.8
npm run test:sql
node tests/preview-payments.mjs
```

La última orden inicia fixtures en 127.0.0.1:4183, con red externa bloqueada y datos sintéticos; nunca usarla como servidor de producción.

Antes de optimizaciones secundarias: completar esquema y configuración de servicios, tarifas reales y prueba integral sandbox; validar GTM/GA4/Ads; revisar recuperación de pagos y entrega de purchase. Después, ampliar QA de accesibilidad/dispositivos y completar contenido comercial auténtico (identidad de asesora, campañas y evidencia autorizada). El trabajo queda abierto.
