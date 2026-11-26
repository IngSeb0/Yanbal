# Onlaine

Aplicación estática independiente, con una función Node.js de captación. Requiere Node.js 24. Desde este directorio ejecuta `npm run build` y `npm test`. Publica el contenido de este directorio como raíz de un repositorio independiente o configúralo como Root Directory de un proyecto Vercel de prueba. Los HTML quedan en `dist/`. Para probar la función en local usa Vercel Dev con la configuración del proyecto de prueba.

## Captación

`/api/leads` valida los datos y envía al proveedor mediante POST HTTPS. Configura `LEADS_WEBHOOK_URL` y `LEADS_WEBHOOK_TOKEN` con permisos mínimos. El proveedor debe guardar los datos y responder 2xx solo tras aceptarlos. Completa el aviso con el nombre del responsable, un canal real para ejercer derechos y los detalles del tratamiento y conservación. Luego activa `ONLAINE_PRIVACY_READY=true`. Aplica límites de tráfico al endpoint en Vercel y comprueba el flujo con datos de prueba. Si falta configuración el formulario aparece deshabilitado.

## Demostraciones

Añade configuraciones en `content.mjs`. Cada entrada admite color, servicios, imágenes y textos de contacto, ubicación y horario. Para nuevas rutas cortas, actualiza la regla del host de demostraciones. Las páginas lleven noindex y quedan fuera del sitemap. Para contenido privado utiliza autenticación o protección de despliegue, ya que el control de indexación no restringe acceso.

## Migración y reversión

1. Identifica en Vercel el despliegue actual de Yanbal, su rama de producción, dominios y registros DNS. Exporta los registros de correo para contrastarlos después.
2. Agrega `yanbal.onlaine.cloud` al proyecto actual. Comprueba HTTPS, sesión, cookies, URLs canónicas, catálogo, imágenes y APIs, incluidos callbacks y webhooks. Comprueba el flujo de compra con credenciales de prueba.
3. Despliega Onlaine en un proyecto separado con URL de prueba. Verifica escritorio, móvil, accesibilidad, Lighthouse, formularios, demos y respuesta de errores.
4. Con las verificaciones completas, solicita la aprobación de corte. Después asigna `onlaine.cloud` a Onlaine y configura `www.onlaine.cloud` como redirección permanente al dominio raíz. Asocia `demo.onlaine.cloud` al proyecto de Onlaine. Conserva MX, SPF, DKIM y DMARC. Reserva app y api para proyectos futuros.
5. Si falla el corte, restaura la asociación del dominio y redirección anteriores en Vercel, revierte únicamente los registros web modificados y comprueba HTTPS y las rutas críticas de Yanbal.

Confirma los costos y cuotas del equipo Vercel, protección de previews y proveedor de captación antes de contratar. Se requieren permisos sobre los proyectos, dominios y DNS, además de credenciales de prueba para las integraciones de Yanbal.
