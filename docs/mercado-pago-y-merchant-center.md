# Cierre de Mercado Pago y Google Merchant Center

## Mercado Pago

Estado preparado en código:

- el backend vuelve a calcular precios, promociones, pedido mínimo y envío;
- el pedido se guarda antes de crear la preferencia;
- cada pedido usa `external_reference` único;
- el webhook exige firma HMAC, consulta el pago en Mercado Pago y procesa actualizaciones de forma idempotente;
- las páginas de aprobado, pendiente y rechazado consultan el estado del servidor y no confían en la URL de retorno;
- el checkout permanece bloqueado si falta la clave secreta del webhook.

Falta una acción en la cuenta de Mercado Pago: en **Tus integraciones → aplicación → Webhooks → Configurar notificación**, registrar el evento **Pagos**, guardar y copiar la clave secreta generada a `MERCADO_PAGO_WEBHOOK_SECRET`. La URL de producción será:

`https://yanbal-promos-cucuta-bogota.vercel.app/api/mercadopago/webhook`

No debe activarse esa URL hasta que la versión que contiene el endpoint haya sido publicada. Después se debe usar el simulador de Webhooks y ejecutar compras de prueba aprobada (`APRO`), pendiente (`CONT`) y rechazada (`OTHE`) con credenciales de prueba.

Documentación oficial:

- https://www.mercadopago.com.co/developers/es/docs/checkout-pro-preferences/payment-notifications
- https://www.mercadopago.com.co/developers/es/docs/checkout-pro-preferences/integration-test/test-purchases

## Google Merchant Center

El build genera `public/google-merchant-feed.xml` con las 469 referencias, URL canónica, imagen, precio normal, precio de oferta cuando corresponde, marca, código y categoría. Todos los artículos quedan como `out_of_stock` hasta confirmar inventario por referencia en `store.merchantAvailability`; así no se publica disponibilidad inventada.

Antes de activar fichas gratuitas:

1. publicar y verificar que la URL del feed responda correctamente;
2. confirmar en Merchant Center el dominio de la tienda;
3. configurar Colombia con tarifa nacional de $14.000, envío gratis desde $150.000 y las excepciones gratuitas para Cúcuta y Bogotá;
4. cargar y mantener disponibilidad real por referencia;
5. revisar las páginas de envíos, términos, privacidad y cambios y devoluciones;
6. añadir el feed por URL y revisar diagnósticos antes de activar destinos gratuitos.

No se debe cambiar masivamente el feed a `in_stock` sin una fuente operativa de inventario.

