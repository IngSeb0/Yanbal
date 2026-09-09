# Reporte de preproducción del flujo de compra

Fecha: 8 de septiembre de 2026. Estado: **fase abierta**.

No se hizo commit, push, despliegue, cambio de DNS ni migración remota.

## A. Supabase remoto

El repositorio no está vinculado a Supabase: `supabase projects list` informó
`Cannot find project ref` y no existe `supabase/.temp/project-ref`. En Vercel,
el proyecto `yanbal-promos-cucuta-bogota` solo tiene
`MERCADO_PAGO_ACCESS_TOKEN`; no hay variables `SUPABASE_*`.

El único candidato por nombre y fecha es:

- Proyecto: `Yumega Store`.
- Ref: `vahcdfzyiipjhrkkrbxt`.
- Estado: `INACTIVE`.
- PostgreSQL: 17.

Las consultas de tablas y migraciones terminaron por timeout porque el proyecto
está inactivo. Por tanto, **no se conocen todavía con evidencia remota** sus
tablas, columnas, constraints, índices, RLS, policies, foreign keys, funciones o
triggers. `supabase/migrations/20260822_yanbal_commerce.sql` describe una
instalación local anterior, pero no se usa como prueba del estado remoto.

Está preparada `supabase/inspect_checkout_schema.sql`, una consulta de solo
lectura que devuelve todo el inventario solicitado cuando el proyecto correcto
esté activo.

## B. Migración

`supabase/migrations/20260908163022_national_checkout.sql` está preparada como
migración incremental y forward-only:

- usa tablas separadas `yanbal_orders` y `yanbal_payment_events` para no tocar
  `orders` ni `order_items` históricos;
- usa `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS` e índices con
  nombres estables;
- no contiene `DROP TABLE`, `DROP COLUMN`, `TRUNCATE` ni `DELETE`;
- una colisión de valores que impida un índice único hace fallar la transacción,
  sin borrar ni corregir datos automáticamente;
- habilita RLS, revoca acceso de `public`, `anon` y `authenticated`, y limita
  tablas y RPC a `service_role`;
- usa funciones `SECURITY INVOKER` con `search_path` vacío.

Se probó dos veces sobre PostgreSQL embebido, incluyendo una tabla
`yanbal_orders` parcial y filas históricas. Las filas se conservaron, se
completaron columnas y la segunda ejecución fue idempotente.

No puede declararse completamente segura para el remoto hasta ejecutar el
inventario y comparar tipos, nombres y datos duplicados reales. No se aplicó.

## C. Envíos

La configuración única está en `config/store.js`; la guía está en
`docs/configuracion-envios.md` y las variables están documentadas en
`.env.example`.

Prioridad verificada:

1. override exacto por código DIVIPOLA en `shippingConfig.cities`;
2. `SHIPPING_CUCUTA` / `SHIPPING_BOGOTA` o sus valores en `shippingConfig`;
3. `SHIPPING_NATIONAL_DEFAULT` o `shippingConfig.nationalDefault`;
4. `SHIPPING_UNAVAILABLE` si no existe ninguno.

En el cuarto caso el total es `null`, el pago queda deshabilitado, nunca se
muestra $0 y aparece exactamente: “Estamos confirmando el valor del envío para
tu ubicación. Escríbenos por WhatsApp para finalizar tu pedido.”

`FREE_SHIPPING_THRESHOLD` está preparado y desactivado por defecto. Nunca se
aplica a un destino sin tarifa.

Faltan las tres tarifas reales y cualquier override de ciudad autorizado.

## D. Mercado Pago

El ciclo se probó localmente con los handlers reales, PostgreSQL embebido y
respuestas de Mercado Pago simuladas y aisladas de la red:

- approved: pedido pasa a `PAID`; `/pedido/exitoso` muestra el pedido correcto;
- pending: permanece `PAYMENT_PENDING` y la página no afirma pago;
- rejected: permanece sin pagar, conserva el carrito y muestra reintento;
- estado desconocido: permanece sin pagar.

Se verificó que el pedido existe antes de crear la preferencia, el
`external_reference` coincide con el ID único, la suma enviada coincide con el
total server-side y las back URLs usan las tres rutas correctas.

**No hubo pago real en sandbox.** Faltan Supabase conectado, secreto de webhook,
confirmación de que el access token es de prueba, usuario/tarjeta de prueba y una
URL pública de preview o túnel para recibir el webhook. La variable presente en
Vercel no indica si el token es test o producción y `MERCADO_PAGO_USE_SANDBOX`
no está configurada.

## E. Webhook

Ruta: `POST /api/mercadopago/webhook`. Valida firma HMAC, request ID, payment ID
en query y payload, acepta solo eventos `payment`, consulta el pago a Mercado
Pago y valida `external_reference`, COP, total, modo live/sandbox y collector si
se configura.

Pruebas:

- firma inválida: 401;
- ID del body distinto: 400;
- fallo recuperable: 503 para que Mercado Pago reintente;
- notificación idéntica dos veces: una fila lógica en
  `yanbal_payment_events`, ningún pedido adicional y ningún purchase adicional;
- rechazo tardío no revierte un pedido pagado o despachado;
- refund/chargeback queda como estado final de devolución.

Se añadieron logs estructurados con outcome, request ID, payment ID, order ID y
estado, sin secretos ni datos personales.

## F. Seguridad

Los ataques enviados directamente al endpoint incluyeron precio, descuento,
envío, total y estado falsos; ID inexistente; cantidad decimal/fuera de rango; y
una promoción combinable con cantidad impar. Resultado: 400/409 antes de Mercado
Pago y cero pedidos creados. El caso válido ignoró precio/descuento/envío/estado
del cliente y guardó subtotal 121000, envío de fixture 10000 y total 131000.

El backend obtiene el producto por ID del catálogo local, reconstruye SKU,
nombre, precio y promoción, valida enteros 1–20 y grupos de dos, calcula
subtotal, obtiene el envío configurado y compara el total aceptado antes de
persistir.

El cliente REST de Supabase quedó compatible con claves nuevas `sb_secret_*`:
las envía solo en `apikey`. Conserva `Authorization: Bearer` para las claves JWT
legacy. Esto evita `Invalid JWT` con el modelo de claves de 2026.

`npm audit --omit=dev` reportó cero vulnerabilidades de producción. El árbol de
herramientas de build/desarrollo conserva 23 avisos (0 críticos), principalmente
Vite/vinext/Cloudflare; actualizar ese stack requiere una fase separada con
regresión completa.

## G. Tracking

El runtime de tracking prueba estos eventos y sus cargas ecommerce:

- `view_item`;
- `add_to_cart`;
- `begin_checkout`;
- `payment_click`;
- `purchase`;
- `whatsapp_click`.

`purchase` incluye `transaction_id`, `value`, `shipping`, `currency: COP` e
items con `item_id`, `item_name`, categoría, precio y cantidad. El endpoint solo
entrega el evento cuando el pedido persistido tiene `payment_status=approved`.

El navegador integrado verificó las interacciones reales, pero su contexto de
lectura está aislado de `window.dataLayer`; una lectura mediante URL ejecutable
fue bloqueada por su política. La forma de los eventos se validó en un runtime
JavaScript aislado y la autorización de purchase mediante API/DB. Falta revisar
la recepción real con GTM Preview, GA4 DebugView y Google Ads.

## H. Google Ads

Se preservaron GTM `GTM-NBHK5MMR` y Ads `AW-18340615060`.

- Secundaria begin_checkout:
  `AW-18340615060/2pBzCITFmOYcEJSnvqlE`.
- Secundaria whatsapp_click:
  `AW-18340615060/JBeHCK6u3ukcEJSnvqlE`.
- Principal purchase: evento ecommerce `purchase`, pendiente de confirmar su
  tag/objetivo principal en el contenedor GTM publicado.

WhatsApp también emite `generate_lead`, pero nunca `purchase` ni usa el objetivo
de compra.

## I. Catálogo

Auditoría automática: 469 referencias. Anomalías encontradas: **0**.

- precio cero: 0;
- precio negativo: 0;
- precio actual superior al anterior: 0;
- slug ausente/duplicado: 0/0;
- código duplicado: 0;
- imagen inexistente: 0;
- promoción inconsistente: 0;
- “2 por” con unidad/cantidad mal modelada: 0;
- descuento fuera de 0–100: 0;
- nombre vacío: 0.

Los tres archivos fuente originales del catálogo no tienen diferencias con
HEAD. No se modificaron datos comerciales sin evidencia.

## J. SEO

Se probaron por HTTP las 469 rutas: 469 respuestas 200 y cero fallos. Todas
tienen title, description, canonical, imagen, precio y SKU; el HTML exportado
incluye Product JSON-LD y BreadcrumbList.

El sitemap contiene las fichas y excluye checkout, APIs y resultados privados.
`robots.txt` desautoriza `/api/`, `/checkout`, `/pedido/` y `/gracias`.
Checkout y los tres resultados llevan `noindex,nofollow`; los resultados además
usan `no-referrer`. Una ficha inexistente devuelve 404 real.

## K. Pruebas móviles

- 375 × 812: home/hero/navegación, sin overflow horizontal.
- 390 × 844: buscador/filtros/tarjetas y ficha Pasión, imagen/SKU/precio/compra;
  carrito modal y persistencia, sin overflow horizontal.
- 414 × 896: checkout, formulario, 33 opciones territoriales más placeholder,
  selector de municipio, resumen y pago bloqueado sin tarifa; sin overflow.
- 1440 × 900: resultado pendiente correcto, navegación y consola sin errores.

También se revisaron visualmente approved y rejected con fixtures locales. El
primero confirma; el segundo conserva reintento. No se abrió Mercado Pago real.

## L. Datos y configuración que debe aportar el propietario

1. Confirmar el project ref Supabase. Si es `vahcdfzyiipjhrkkrbxt`, reactivar
   `Yumega Store` para ejecutar la inspección de solo lectura.
2. `SUPABASE_URL` y `SUPABASE_SECRET_KEY` del proyecto confirmado.
3. Tarifa real de Cúcuta, Bogotá y resto de Colombia; overrides de ciudad y
   umbral gratis solo si se autorizan.
4. `MERCADO_PAGO_WEBHOOK_SECRET`.
5. Confirmar/proveer token de Mercado Pago de prueba y datos de comprador de
   prueba; luego validar collector y modo sandbox.
6. URL pública temporal para webhook (`SITE_URL`) sin desplegar producción.
7. Confirmar en GTM qué tag convierte `purchase` en la conversión principal de
   Google Ads y qué propiedad GA4 recibe los eventos.

## M. Bloqueadores para producción

1. Supabase remoto correcto sin confirmar y candidato inactivo.
2. Esquema remoto, advisors y Data API sin inspeccionar.
3. Migración no aplicada ni validada en un entorno remoto de prueba.
4. Tarifas reales ausentes; checkout está correctamente bloqueado.
5. Sandbox real de Mercado Pago y webhook público sin ejecutar.
6. Secreto del webhook ausente.
7. Recepción y deduplicación en GTM/GA4/Ads sin validar en las cuentas reales.
8. Objetivo principal de purchase en Google Ads sin confirmar.

La implementación local está en condiciones de pasar a validación externa. Aún
no corresponde afirmar “técnicamente lista para producción, faltan únicamente
datos/configuración del propietario” hasta resolver los puntos 1–7.
