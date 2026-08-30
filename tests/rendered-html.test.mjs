import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Yanbal C9 campaign storefront with local SEO", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Yanbal C9/);
  assert.match(html, /WhatsApp 302 629 3535/);
  assert.match(html, /Comprar por WhatsApp/);
  assert.match(html, /Elige lo que buscas y escribe directo/);
  assert.match(html, /Pedir en Cúcuta/);
  assert.match(html, /Pedir en Bogotá/);
  assert.match(html, /Consultar perfumes/);
  assert.match(html, /Consultar bloqueador/);
  assert.match(html, /Tengo un código/);
  assert.match(html, /Respuestas rápidas para comprar Yanbal/);
  assert.match(html, /¿Puedo preguntar antes de pagar\?/);
  assert.match(html, /Escríbeme y te confirmo la promo disponible/);
  assert.match(html, /No tienes que pagar para preguntar/);
  assert.match(html, /Pagar seguro con Mercado Pago/);
  assert.match(html, /Enviar pedido por WhatsApp/);
  assert.match(html, /Quién soy/);
  assert.match(html, /Productos Yanbal con descuento/);
  assert.match(html, /Productos de belleza, bloqueadores y perfumes en Cúcuta y Bogotá/);
  assert.match(html, /Productos de belleza Yanbal en Cúcuta/);
  assert.match(html, /Bloqueadores Yanbal Total Block en Bogotá/);
  assert.match(html, /Perfumes Yanbal con descuento/);
  assert.match(html, /Descuentos Yanbal C9/);
  assert.match(html, /Regalos Amor y Amistad/);
  assert.match(html, /Todos los productos/);
  assert.match(html, /Combo Soy Única/);
  assert.match(html, /Dulce Amor EDL Eau de Parfum/);
  assert.match(html, /Catálogo separado/);
  assert.match(html, /productos cargados con precio de campaña/);
  assert.match(html, /data-product-search/);
  assert.match(html, /Cód\.\s*(?:<!-- -->)?2203/);
  assert.match(html, /Pasión Parfum/);
  assert.match(html, /\/products\/2040-dulce-amor-edl-eau-de-parfum\.webp/);
  assert.match(html, /\/storefront\.js/);
  assert.match(html, /\/conversion-tracking\.js/);
  assert.match(html, /Agregar al carrito/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /Yanbal Cúcuta/);
  assert.match(html, /Yanbal Bogotá/);
  assert.match(html, /\/cucuta/);
  assert.match(html, /\/bogota/);
  assert.match(html, /\/regalos-amor-amistad-colombia/);
  assert.match(html, /\/perfumes-yanbal-cucuta-bogota/);
  assert.match(html, /\/bloqueadores-yanbal-cucuta-bogota/);
  assert.match(html, /Tus datos están seguros y protegidos/);
  assert.match(html, /Los datos de tarjeta no pasan por esta página/);
  assert.match(html, /Mercado Pago/);
  assert.match(html, /bloqueadores solares Total Block/);
  assert.match(html, /productos de belleza Yanbal/);
  assert.match(html, /id="google-tag-manager"/);
  assert.match(html, /GTM-NBHK5MMR/);
  assert.match(html, /googletagmanager\.com\/gtm\.js/);
  assert.match(html, /googletagmanager\.com\/ns\.html\?id=GTM-NBHK5MMR/);
  assert.match(html, /gtag\/js\?id=AW-18340615060/);
  assert.match(html, /id="google-ads-tag"/);
  assert.match(html, /gtag\('config', 'AW-18340615060'\)/);
  assert.match(html, /id="vercel-web-analytics"/);
  assert.match(html, /\/_vercel\/insights\/script\.js/);
  assert.match(html, /https:\/\/wa\.me\/573026293535\?text=/);
  assert.match(html, /\/yanbal-banner\.webp/);
  for (const hiddenOffer of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]) {
    assert.doesNotMatch(html, new RegExp(`Oferta semanal ${hiddenOffer}(?!\\d)`));
  }
  assert.doesNotMatch(html, /Catálogo completo C9/);
  assert.doesNotMatch(html, /Catálogo Yanbal C9 completo/);
  assert.doesNotMatch(html, /Catálogo visible C9/);
  assert.doesNotMatch(html, /Flujo completo para vender sin fricción/);
  assert.doesNotMatch(html, /Subir catálogo de campaña/);
  assert.doesNotMatch(html, /Campañas en servidor/);
  assert.doesNotMatch(html, /\/weekly\/solo-c9-s2-page-001-01\.webp/);
  assert.doesNotMatch(html, /\/weekly\/solo-c9-s2-page-002-01\.webp/);
  assert.doesNotMatch(html, /\/weekly\/solo-c9-s2-page-002-03\.webp/);
  assert.doesNotMatch(html, /\/weekly\/solo-c9-s2-page-003-03\.webp/);
  assert.doesNotMatch(html, /Total Block Kids[\s\S]*?\$85\.000/);
  assert.doesNotMatch(html, /Total Block Sport[\s\S]*?\$85\.000/);
  assert.doesNotMatch(html, /brand-banner/);
  assert.doesNotMatch(
    html,
    /codex-preview|SkeletonPreview|react-loading-skeleton|Your site is taking shape/,
  );
});

test("uses optimized WebP assets and the Yanbal logo as the hero background", async () => {
  const [
    page,
    layout,
    catalogPage,
    giftsPage,
    thanksPage,
    cucutaPage,
    bogotaPage,
    loveColombiaPage,
    perfumesPage,
    bloqueadoresPage,
    categoryLanding,
    storefrontUi,
    productSelections,
    styles,
    packageJson,
    promoAssets,
    catalogAssets,
    productAssets,
    weeklyAssets,
    api,
    paymentReturn,
    paymentStatus,
    webhook,
    products,
    storefront,
    conversionTracking,
    paymentThanks,
    cartCheckout,
    catalogList,
    uploadCatalog,
    storeProducts,
    supabaseRest,
    catalogProducts,
    exportScript,
    envExample,
    vercelJson,
  ] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/catalogo/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/regalables/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/gracias/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cucuta/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/bogota/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/regalos-amor-amistad-colombia/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/perfumes-yanbal-cucuta-bogota/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/bloqueadores-yanbal-cucuta-bogota/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/category-landing.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/storefront-ui.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/product-selections.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../public/promos/", import.meta.url)),
    readdir(new URL("../public/catalog/", import.meta.url)),
    readdir(new URL("../public/products/", import.meta.url)),
    readdir(new URL("../public/weekly/", import.meta.url)),
    readFile(new URL("../api/mercadopago/create-preference.js", import.meta.url), "utf8"),
    readFile(new URL("../api/mercadopago/return.js", import.meta.url), "utf8"),
    readFile(new URL("../api/mercadopago/payment-status.js", import.meta.url), "utf8"),
    readFile(new URL("../api/mercadopago/webhook.js", import.meta.url), "utf8"),
    readFile(new URL("../lib/mercadopago-products.js", import.meta.url), "utf8"),
    readFile(new URL("../public/storefront.js", import.meta.url), "utf8"),
    readFile(new URL("../public/conversion-tracking.js", import.meta.url), "utf8"),
    readFile(new URL("../public/payment-thanks.js", import.meta.url), "utf8"),
    readFile(new URL("../api/cart/checkout.js", import.meta.url), "utf8"),
    readFile(new URL("../api/catalog/list.js", import.meta.url), "utf8"),
    readFile(new URL("../api/admin/upload-catalog.js", import.meta.url), "utf8"),
    readFile(new URL("../lib/store-products.js", import.meta.url), "utf8"),
    readFile(new URL("../lib/supabase-rest.js", import.meta.url), "utf8"),
    readFile(new URL("../lib/catalog-products.js", import.meta.url), "utf8"),
    readFile(new URL("../scripts/export-vercel-static.mjs", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
    readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  ]);

  assert.deepEqual(promoAssets.sort(), [
    "43n-paralel.webp",
    "bb-cream.webp",
    "dendur.webp",
    "dulce-amor.webp",
    "gaia-eternal.webp",
    "gaia-parfum.webp",
    "total-block-kids.webp",
    "total-block-sport-plus.webp",
    "total-block-sport.webp",
  ]);

  assert.ok(catalogAssets.length >= 100);
  assert.ok(productAssets.length >= 469);
  assert.ok(weeklyAssets.length >= 10);
  assert.ok(catalogAssets.every((asset) => asset.endsWith(".webp")));
  assert.ok(productAssets.every((asset) => asset.endsWith(".webp")));
  assert.ok(weeklyAssets.every((asset) => asset.endsWith(".webp")));
  assert.ok(productAssets.includes("combo-soy-unica-c9.webp"));
  assert.ok(productAssets.includes("2040-dulce-amor-edl-eau-de-parfum.webp"));
  assert.ok(productAssets.includes("200-ohm-parfum-ohm.webp"));

  assert.doesNotMatch(page, /\.png/);
  assert.doesNotMatch(page, /brand-banner|_sites-preview|SkeletonPreview/);
  assert.match(page, /storefrontProducts/);
  assert.match(page, /lead-panel/);
  assert.match(page, /quickIntentLinks/);
  assert.match(page, /buyingQuestions/);
  assert.match(page, /quick-order/);
  assert.match(page, /answer-panel/);
  assert.match(page, /button--whatsapp/);
  assert.match(page, /No tienes que pagar para preguntar/);
  assert.match(page, /localSeoTopics/);
  assert.match(page, /Productos de belleza, bloqueadores y perfumes en Cúcuta y Bogotá/);
  assert.match(page, /knowsAbout/);
  assert.match(page, /department/);
  assert.match(page, /https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\//);
  assert.match(page, /sameAs/);
  assert.match(layout, /Belleza, bloqueadores y perfumes/);
  assert.match(layout, /productos de belleza Cúcuta/);
  assert.match(layout, /bloqueador Yanbal Total Block/);
  assert.match(layout, /@vercel\/analytics\/next/);
  assert.match(layout, /<Analytics \/>/);
  assert.match(layout, /googleTagManagerId = "GTM-NBHK5MMR"/);
  assert.match(layout, /googleAdsId = "AW-18340615060"/);
  assert.match(layout, /id="google-tag-manager"/);
  assert.match(layout, /googletagmanager\.com\/gtm\.js/);
  assert.match(layout, /googletagmanager\.com\/ns\.html/);
  assert.match(layout, /gtag\/js\?id=\$\{googleAdsId\}/);
  assert.match(layout, /id="google-ads-tag"/);
  assert.match(layout, /gtag\('config', '\$\{googleAdsId\}'\)/);
  assert.match(layout, /\/conversion-tracking\.js/);
  assert.match(layout, /vercelAnalyticsSdkVersion = "2\.0\.1"/);
  assert.match(layout, /id="vercel-web-analytics"/);
  assert.match(layout, /\/_vercel\/insights\/script\.js/);
  assert.match(layout, /script\.dataset\.sdkn='@vercel\/analytics'/);
  assert.match(page, /id="descuentos"/);
  assert.match(page, /id="amor-amistad"/);
  assert.match(page, /ProductCatalogCard/);
  assert.match(page, /data-product-search/);
  assert.match(page, /CartExperience/);
  assert.match(page, /Catálogo separado/);
  assert.match(page, /\/regalables/);
  assert.match(page, /\/perfumes-yanbal-cucuta-bogota/);
  assert.match(page, /\/bloqueadores-yanbal-cucuta-bogota/);
  assert.doesNotMatch(page, /visibleWeeklyOfferPages|hiddenWeeklyOfferTitles|paymentFlow/);
  assert.match(catalogPage, /Catálogo Yanbal C9 completo/);
  assert.match(catalogPage, /catalogPages/);
  assert.match(catalogPage, /CatalogCard/);
  assert.doesNotMatch(catalogPage, /data-add-to-cart|storefront\.js/);
  assert.match(giftsPage, /Regalables Yanbal/);
  assert.match(giftsPage, /loveAndFriendshipProducts/);
  assert.match(giftsPage, /giftSections/);
  assert.match(giftsPage, /data-cart-open/);
  assert.match(thanksPage, /Gracias por tu compra Yanbal/);
  assert.match(thanksPage, /robots/);
  assert.match(thanksPage, /Confirmar por WhatsApp/);
  assert.match(thanksPage, /Mercado Pago/);
  assert.match(cucutaPage, /Yanbal Cúcuta/);
  assert.match(cucutaPage, /Productos de belleza Yanbal en Cúcuta/);
  assert.match(cucutaPage, /perfumes Yanbal/);
  assert.match(cucutaPage, /bloqueadores Total Block/);
  assert.match(cucutaPage, /paga seguro por Mercado Pago/);
  assert.match(cucutaPage, /CartExperience/);
  assert.match(bogotaPage, /Yanbal Bogotá/);
  assert.match(bogotaPage, /Perfumes, maquillaje y bloqueadores Yanbal en Bogotá/);
  assert.match(bogotaPage, /productos de belleza/);
  assert.match(bogotaPage, /Mercado Pago/);
  assert.match(bogotaPage, /CartExperience/);
  assert.match(loveColombiaPage, /Regalos Amor y Amistad Colombia/);
  assert.match(loveColombiaPage, /loveAndFriendshipProducts/);
  assert.match(loveColombiaPage, /giftSections/);
  assert.match(loveColombiaPage, /Ohm,/);
  assert.match(loveColombiaPage, /Collar Amira/);
  assert.match(loveColombiaPage, /Dulce Amor/);
  assert.match(loveColombiaPage, /Combo Soy Única/);
  assert.match(loveColombiaPage, /Jelly Stick Iluminador/);
  assert.match(loveColombiaPage, /Bálsamo Lip Oil/);
  assert.match(loveColombiaPage, /CartExperience/);
  assert.match(perfumesPage, /Perfumes Yanbal Cúcuta y Bogotá/);
  assert.match(perfumesPage, /perfumeProducts/);
  assert.match(perfumesPage, /consultar perfumes Yanbal con descuento/);
  assert.match(bloqueadoresPage, /Bloqueadores Yanbal Total Block/);
  assert.match(bloqueadoresPage, /sunCareProducts/);
  assert.match(bloqueadoresPage, /consultar bloqueadores Yanbal Total Block/);
  assert.match(categoryLanding, /BreadcrumbList/);
  assert.match(categoryLanding, /FAQPage/);
  assert.match(categoryLanding, /category-proof/);
  assert.match(categoryLanding, /ProductCatalogCard/);
  assert.match(categoryLanding, /CartExperience/);
  assert.match(storefrontUi, /data-add-to-cart/);
  assert.match(storefrontUi, /Comprar por WhatsApp/);
  assert.match(storefrontUi, /Comprar \$\{product\.name\} por WhatsApp/);
  assert.match(storefrontUi, /data-whatsapp-cta/);
  assert.match(storefrontUi, /CartExperience/);
  assert.match(storefrontUi, /\/storefront\.js/);
  assert.match(storefrontUi, /data-cart-count hidden/);
  assert.match(storefrontUi, /checkout-safe-note/);
  assert.match(storefrontUi, /Pagar seguro con Mercado Pago/);
  assert.match(storefrontUi, /Enviar pedido por WhatsApp/);
  assert.match(storefrontUi, /Tus datos están seguros y protegidos/);
  assert.match(productSelections, /combo-soy-unica-c9/);
  assert.match(productSelections, /loveAndFriendshipProducts/);
  assert.match(productSelections, /perfumeProducts/);
  assert.match(productSelections, /sunCareProducts/);
  assert.doesNotMatch(page, /id: "total-block-sport"[\s\S]*?numericPrice: "85000"/);
  assert.doesNotMatch(page, /id: "total-block-kids"[\s\S]*?numericPrice: "85000"/);
  assert.match(styles, /url\("\/yanbal-banner\.webp"\)/);
  assert.match(styles, /\.copy-grid--seo/);
  assert.match(styles, /\.category-proof/);
  assert.match(styles, /\.quick-order__grid/);
  assert.match(styles, /\.footer-links/);
  assert.doesNotMatch(styles, /url\("\/promos\/dendur\.webp"\)/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(packageJson, /"@vercel\/analytics":/);
  assert.match(api, /MERCADO_PAGO_ACCESS_TOKEN/);
  assert.match(api, /https:\/\/api\.mercadopago\.com\/checkout\/preferences/);
  assert.match(api, /notification_url/);
  assert.match(api, /\/api\/mercadopago\/webhook/);
  assert.match(api, /whatsappFallback/);
  assert.match(paymentReturn, /buildWhatsAppUrl/);
  assert.match(paymentReturn, /\/gracias/);
  assert.match(paymentReturn, /normalizedStatus/);
  assert.match(paymentStatus, /https:\/\/api\.mercadopago\.com\/v1\/payments/);
  assert.match(webhook, /fetchPayment/);
  assert.doesNotMatch(products, /"total-block-sport":/);
  assert.doesNotMatch(products, /"total-block-kids":/);
  assert.match(products, /fallbackProducts/);
  assert.match(storefront, /\/api\/cart\/checkout/);
  assert.match(storefront, /setStatus/);
  assert.match(storefront, /AW-18340615060\/2pBzCITFmOYcEJSnvqlE/);
  assert.match(storefront, /AW-18340615060\/JBeHCK6u3ukcEJSnvqlE/);
  assert.match(storefront, /yanbalTrackBeginCheckout/);
  assert.match(storefront, /trackBeginCheckout/);
  assert.match(storefront, /trackAddToCart/);
  assert.match(storefront, /add_to_cart/);
  assert.match(storefront, /begin_checkout/);
  assert.match(storefront, /gtag\("event", "conversion"/);
  assert.match(conversionTracking, /yanbalTrackWhatsAppLead/);
  assert.match(conversionTracking, /generate_lead/);
  assert.match(conversionTracking, /AW-18340615060\/2pBzCITFmOYcEJSnvqlE/);
  assert.match(conversionTracking, /AW-18340615060\/JBeHCK6u3ukcEJSnvqlE/);
  assert.match(conversionTracking, /googleAdsWhatsAppConversion/);
  assert.match(conversionTracking, /dataset\.whatsappCta/);
  assert.match(conversionTracking, /wa\.me/);
  assert.match(conversionTracking, /api\.whatsapp\.com/);
  assert.match(storefront, /result\.checkoutUrl/);
  assert.match(storefront, /Mercado Pago no devolvió una pasarela disponible/);
  assert.match(storefront, /\/api\/catalog\/list/);
  assert.match(storefront, /\/api\/admin\/upload-catalog/);
  assert.match(storefront, /filterProducts/);
  assert.match(storefront, /productCode/);
  assert.match(paymentThanks, /URLSearchParams/);
  assert.match(paymentThanks, /data-thanks-title/);
  assert.match(paymentThanks, /Referencia Mercado Pago/);
  assert.match(cartCheckout, /MERCADO_PAGO_ACCESS_TOKEN/);
  assert.match(cartCheckout, /PAYLOAD_TOO_LARGE/);
  assert.match(cartCheckout, /mercadoPagoConfigured/);
  assert.match(cartCheckout, /Mercado Pago no devolvió una URL/);
  assert.match(cartCheckout, /orderId/);
  assert.match(cartCheckout, /Cod\./);
  assert.match(catalogList, /campaigns/);
  assert.match(uploadCatalog, /CATALOG_ADMIN_TOKEN/);
  assert.match(uploadCatalog, /timingSafeEqual/);
  assert.match(uploadCatalog, /PAYLOAD_TOO_LARGE/);
  assert.match(uploadCatalog, /La URL externa debe ser HTTPS/);
  assert.match(storeProducts, /loadStoreProducts/);
  assert.match(storeProducts, /catalogProducts/);
  assert.match(storeProducts, /virtualProducts/);
  assert.match(storeProducts, /id: "total-block-sport-plus"/);
  assert.doesNotMatch(storeProducts, /id: "total-block-sport"[\s\S]*?85000/);
  assert.doesNotMatch(storeProducts, /id: "total-block-kids"[\s\S]*?85000/);
  assert.match(supabaseRest, /SUPABASE_PUBLISHABLE_KEY/);
  assert.match(supabaseRest, /SUPABASE_SECRET_KEY/);
  assert.match(catalogProducts, /"id": "2203-pasion-parfum"/);
  assert.match(catalogProducts, /"image": "\/products\/2203-pasion-parfum\.webp"/);
  assert.match(catalogProducts, /"category": "Perfumes y colonias"/);
  assert.match(catalogProducts, /"price": 121000/);
  assert.match(catalogProducts, /"id": "725-total-block-ultraproteccion-spf-100-sport"/);
  assert.match(exportScript, /_next/);
  assert.match(exportScript, /catalogo\.html/);
  assert.match(exportScript, /regalables\.html/);
  assert.match(exportScript, /gracias\.html/);
  assert.match(exportScript, /cucuta\.html/);
  assert.match(exportScript, /bogota\.html/);
  assert.match(exportScript, /regalos-amor-amistad-colombia\.html/);
  assert.match(exportScript, /perfumes-yanbal-cucuta-bogota\.html/);
  assert.match(exportScript, /bloqueadores-yanbal-cucuta-bogota\.html/);
  assert.match(envExample, /SUPABASE_PUBLISHABLE_KEY/);
  assert.match(envExample, /CATALOG_ADMIN_TOKEN/);
  assert.match(vercelJson, /Content-Security-Policy/);
  assert.match(vercelJson, /Strict-Transport-Security/);
  assert.match(vercelJson, /X-Frame-Options/);
  assert.match(vercelJson, /Permissions-Policy/);
  assert.match(vercelJson, /www\.googleadservices\.com/);
  assert.match(vercelJson, /googleads\.g\.doubleclick\.net/);
});

test("server-renders the separated catalog page", async () => {
  const response = await render("/catalogo");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Catálogo Yanbal C9 completo/);
  assert.match(html, /Recortes por categoría/);
  assert.match(html, /\/catalog\/c9-page-017\.webp/);
  assert.match(html, /Consultar por WhatsApp/);
  assert.match(html, /Ir a productos con descuento/);
  assert.doesNotMatch(html, /data-add-to-cart|data-product-search|\/storefront\.js/);
  assert.doesNotMatch(html, /Oferta semanal 2|Oferta semanal 3/);
});

test("server-renders the special giftables page with cart actions", async () => {
  const response = await render("/regalables");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Regalables Yanbal/);
  assert.match(html, /Amor y Amistad con descuento/);
  assert.match(html, /Los seis regalables recomendados/);
  assert.match(html, /Ohm Parfum - Ohm/);
  assert.match(html, /Collar Amira/);
  assert.match(html, /Dulce Amor EDL Eau de Parfum/);
  assert.match(html, /Combo Soy Única/);
  assert.match(html, /Jelly Stick Iluminador/);
  assert.match(html, /Bálsamo Labial/);
  assert.match(html, /data-add-to-cart/);
  assert.match(html, /\/storefront\.js/);
  assert.match(html, /\/products\/combo-soy-unica-c9\.webp/);
  assert.doesNotMatch(html, /Oferta semanal 2|Oferta semanal 3/);
  assert.doesNotMatch(html, /Catálogo Yanbal C9 completo|Subir catálogo de campaña/);
});

test("server-renders local SEO landing pages with cart actions", async () => {
  const [cucuta, bogota, loveColombia, perfumes, bloqueadores] = await Promise.all([
    render("/cucuta"),
    render("/bogota"),
    render("/regalos-amor-amistad-colombia"),
    render("/perfumes-yanbal-cucuta-bogota"),
    render("/bloqueadores-yanbal-cucuta-bogota"),
  ]);

  assert.equal(cucuta.status, 200);
  assert.equal(bogota.status, 200);
  assert.equal(loveColombia.status, 200);
  assert.equal(perfumes.status, 200);
  assert.equal(bloqueadores.status, 200);

  const [cucutaHtml, bogotaHtml, loveColombiaHtml, perfumesHtml, bloqueadoresHtml] = await Promise.all([
    cucuta.text(),
    bogota.text(),
    loveColombia.text(),
    perfumes.text(),
    bloqueadores.text(),
  ]);

  assert.match(cucutaHtml, /Productos de belleza Yanbal en Cúcuta/);
  assert.match(cucutaHtml, /Perfumes Yanbal Cúcuta/);
  assert.match(cucutaHtml, /Bloqueadores Total Block Cúcuta/);
  assert.match(cucutaHtml, /data-add-to-cart/);
  assert.match(cucutaHtml, /Pagar seguro con Mercado Pago/);

  assert.match(bogotaHtml, /Productos Yanbal en Bogotá/);
  assert.match(bogotaHtml, /Perfumes, maquillaje y bloqueadores Yanbal en Bogotá/);
  assert.match(bogotaHtml, /Bloqueadores Yanbal Total Block/);
  assert.match(bogotaHtml, /data-add-to-cart/);
  assert.match(bogotaHtml, /Tus datos y tu pago están protegidos/);

  assert.match(loveColombiaHtml, /Regalos Amor y Amistad Colombia/);
  assert.match(loveColombiaHtml, /Ohm Parfum - Ohm/);
  assert.match(loveColombiaHtml, /Collar Amira/);
  assert.match(loveColombiaHtml, /Dulce Amor EDL Eau de Parfum/);
  assert.match(loveColombiaHtml, /Pagar seguro con Mercado Pago/);
  assert.match(loveColombiaHtml, /application\/ld\+json/);

  assert.match(perfumesHtml, /Perfumes Yanbal Cúcuta y Bogotá/);
  assert.match(perfumesHtml, /fragancias femeninas, masculinas/);
  assert.match(perfumesHtml, /data-add-to-cart/);
  assert.match(perfumesHtml, /Pagar seguro con Mercado Pago/);
  assert.match(perfumesHtml, /FAQPage/);

  assert.match(bloqueadoresHtml, /Bloqueadores Yanbal Total Block/);
  assert.match(bloqueadoresHtml, /SPF 100/);
  assert.match(bloqueadoresHtml, /data-add-to-cart/);
  assert.match(bloqueadoresHtml, /Pagar seguro con Mercado Pago/);
  assert.match(bloqueadoresHtml, /FAQPage/);
});

test("server-renders the thank-you payment page", async () => {
  const response = await render(
    "/gracias?status=success&orderId=YAN-PRUEBA&reference=123456&product=Dulce%20Amor&wa=https%3A%2F%2Fwa.me%2F573026293535",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /Gracias, recibimos tu pago/);
  assert.match(html, /Confirmar por WhatsApp/);
  assert.match(html, /Mercado Pago/);
  assert.match(html, /YAN-PRUEBA/);
  assert.match(html, /Dulce Amor/);
  assert.match(html, /Referencia Mercado Pago:\s*(?:<!-- -->)?123456/);
  assert.match(html, /Cúcuta y Bogotá/);
  assert.doesNotMatch(html, /\/storefront\.js/);
});

test("exports a Vercel-ready static storefront", async () => {
  const [
    html,
    catalogHtml,
    giftsHtml,
    cucutaHtml,
    bogotaHtml,
    loveColombiaHtml,
    perfumesHtml,
    bloqueadoresHtml,
    thanksHtml,
    robots,
    sitemap,
  ] = await Promise.all([
    readFile(new URL("../vercel-dist/index.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/catalogo.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/regalables.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/cucuta.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/bogota.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/regalos-amor-amistad-colombia.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/perfumes-yanbal-cucuta-bogota.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/bloqueadores-yanbal-cucuta-bogota.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/gracias.html", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../vercel-dist/sitemap.xml", import.meta.url), "utf8"),
  ]);

  assert.match(html, /Yanbal C9/);
  assert.match(html, /WhatsApp 302 629 3535/);
  assert.match(html, /Comprar por WhatsApp/);
  assert.match(html, /Elige lo que buscas y escribe directo/);
  assert.match(html, /Pedir en Cúcuta/);
  assert.match(html, /Pedir en Bogotá/);
  assert.match(html, /Respuestas rápidas para comprar Yanbal/);
  assert.match(html, /Escríbeme y te confirmo la promo disponible/);
  assert.match(html, /https:\/\/wa\.me\/573026293535\?text=/);
  assert.match(html, /Quién soy/);
  assert.match(html, /Descuentos Yanbal C9/);
  assert.match(html, /Regalos Amor y Amistad/);
  assert.match(html, /Catálogo separado/);
  assert.match(html, /data-product-category-filter/);
  assert.match(html, /Pagar seguro con Mercado Pago/);
  assert.match(html, /Tus datos están seguros y protegidos/);
  assert.match(html, /\/storefront\.js/);
  assert.match(html, /\/conversion-tracking\.js/);
  assert.match(html, /\/products\/200-ohm-parfum-ohm\.webp/);
  assert.match(html, /\/_next\/static\/css\//);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /<body><noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-NBHK5MMR"/);
  assert.match(html, /id="google-tag-manager"/);
  assert.match(html, /GTM-NBHK5MMR/);
  assert.match(html, /googletagmanager\.com\/gtm\.js/);
  assert.match(html, /googletagmanager\.com\/ns\.html\?id=GTM-NBHK5MMR/);
  assert.match(html, /gtag\/js\?id=AW-18340615060/);
  assert.match(html, /id="google-ads-tag"/);
  assert.match(html, /gtag\('config', 'AW-18340615060'\)/);
  assert.match(html, /<script id="vercel-web-analytics">/);
  assert.match(html, /\/_vercel\/insights\/script\.js/);
  assert.match(html, /script\.dataset\.sdkn='@vercel\/analytics'/);
  for (const hiddenOffer of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]) {
    assert.doesNotMatch(html, new RegExp(`Oferta semanal ${hiddenOffer}(?!\\d)`));
  }
  assert.doesNotMatch(html, /Catálogo completo C9|Catálogo visible C9|Subir catálogo de campaña/);
  assert.doesNotMatch(html, /\/weekly\/solo-c9-s2-page-001-01\.webp/);
  assert.doesNotMatch(html, /\/weekly\/solo-c9-s2-page-002-01\.webp/);
  assert.doesNotMatch(html, /\/weekly\/solo-c9-s2-page-002-03\.webp/);
  assert.doesNotMatch(html, /\/weekly\/solo-c9-s2-page-003-03\.webp/);
  assert.doesNotMatch(html, /modulepreload|type="module"|localhost:3000/);
  assert.doesNotMatch(html, /vinext\.navigationRuntime/);
  assert.match(catalogHtml, /Catálogo Yanbal C9 completo/);
  assert.match(catalogHtml, /\/catalog\/c9-page-017\.webp/);
  assert.doesNotMatch(catalogHtml, /data-product-search|\/storefront\.js/);
  assert.match(giftsHtml, /Regalables Yanbal/);
  assert.match(giftsHtml, /Combo Soy Única/);
  assert.match(giftsHtml, /\/products\/combo-soy-unica-c9\.webp/);
  assert.match(giftsHtml, /\/storefront\.js/);
  assert.match(cucutaHtml, /Productos de belleza Yanbal en Cúcuta/);
  assert.match(cucutaHtml, /Perfumes Yanbal Cúcuta/);
  assert.match(cucutaHtml, /Pagar seguro con Mercado Pago/);
  assert.match(bogotaHtml, /Productos Yanbal en Bogotá/);
  assert.match(bogotaHtml, /Bloqueadores Yanbal Total Block/);
  assert.match(bogotaHtml, /Pagar seguro con Mercado Pago/);
  assert.match(loveColombiaHtml, /Regalos Amor y Amistad Colombia/);
  assert.match(loveColombiaHtml, /Ohm Parfum - Ohm/);
  assert.match(loveColombiaHtml, /Collar Amira/);
  assert.match(loveColombiaHtml, /\/storefront\.js/);
  assert.match(perfumesHtml, /Perfumes Yanbal Cúcuta y Bogotá/);
  assert.match(perfumesHtml, /elegir el aroma correcto/);
  assert.match(perfumesHtml, /\/storefront\.js/);
  assert.match(bloqueadoresHtml, /Bloqueadores Yanbal Total Block/);
  assert.match(bloqueadoresHtml, /protectores solares para rostro, cuerpo, deporte/);
  assert.match(bloqueadoresHtml, /\/storefront\.js/);
  assert.match(thanksHtml, /Gracias, tu pago está pendiente/);
  assert.match(thanksHtml, /Confirmar por WhatsApp/);
  assert.match(thanksHtml, /Mercado Pago/);
  assert.match(thanksHtml, /\/payment-thanks\.js/);
  assert.doesNotMatch(thanksHtml, /\/storefront\.js/);
  assert.match(
    robots,
    /Sitemap: https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/sitemap\.xml/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/catalogo<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/regalables<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/cucuta<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/bogota<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/regalos-amor-amistad-colombia<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/perfumes-yanbal-cucuta-bogota<\/loc>/,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/bloqueadores-yanbal-cucuta-bogota<\/loc>/,
  );
  assert.doesNotMatch(
    sitemap,
    /<loc>https:\/\/yanbal-promos-cucuta-bogota\.vercel\.app\/gracias<\/loc>/,
  );
});
