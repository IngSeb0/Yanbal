# Supabase — configuración del proyecto Yanbal

Fecha de verificación: 2026-09-09.

## Proyecto

- Organización: `Yanbal Tienda` (`xpanbkomdlwjfmcthskv`).
- Proyecto: `Yanbal Tienda` (`gefvmzclgwzlzmbnnfxu`).
- Región: São Paulo (`sa-east-1`).
- Estado verificado: `ACTIVE_HEALTHY`.
- Repositorio enlazado con Supabase CLI.

## Esquema aplicado

- `20260822_yanbal_commerce.sql`: esquema base autocontenido, campaña, catálogo y bucket público `yanbal-catalogs`.
- `20260908163022_national_checkout.sql`: pedidos privados, eventos de pago y funciones atómicas del checkout.
- `20260909150000_schema_hardening.sql`: índices de claves foráneas para pedidos históricos.

Las migraciones son aditivas. No contienen `DROP`, `TRUNCATE` ni borrados de datos.

## Seguridad y pruebas

- RLS está activo en las tablas expuestas.
- `yanbal_orders` y `yanbal_payment_events` revocan acceso a `anon` y `authenticated`.
- Las funciones del checkout solo son ejecutables por `service_role`.
- `supabase db lint --linked --level warning`: sin errores de esquema.
- `npm run test:sql`: 12 pruebas aprobadas.
- `npm run test:supabase`: catálogo público accesible, pedidos bloqueados con clave pública, RPC privada operativa y dato técnico eliminado.
- Tipos remotos generados en `lib/database.types.ts`.

## Variables

`.env.local` contiene `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` y una clave `service_role`; el archivo está ignorado por Git.

Vercel tiene `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` y la clave `service_role` compatible en Preview y Production. La misma clave superó la prueba real local antes de cargarse. Vercel confirmó la actualización, pero no permite volver a descargar el valor de una variable marcada como sensible para compararlo en texto claro.

## Límites actuales

- Las 469 referencias siguen en los archivos de catálogo versionados y se validan durante el build. La tabla remota mantiene siete productos opcionales de campaña; la aplicación combina esa capa con el catálogo local.
- Las tarifas de envío siguen sin definirse. El checkout bloquea el cobro y nunca interpreta una tarifa ausente como envío gratis.
- `MERCADO_PAGO_WEBHOOK_SECRET` debe obtenerse de la configuración real del webhook de Mercado Pago. No debe generarse de forma independiente.
- No se realizó commit, despliegue ni cambio de dominio.
