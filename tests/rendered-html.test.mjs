import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { products, productPath } from "../lib/commerce-products.js";
import {
  CATALOG_PAGE_COUNT,
  catalogPagePath,
} from "../lib/catalog-pagination.js";
const html = (r) =>
  fs.readFileSync(
    "vercel-dist/" + (r === "/" ? "index" : r.slice(1)) + ".html",
    "utf8",
  );
test("home is bounded, buy-first and keeps catalog/city/support navigation", () => {
  const s = html("/");
  assert.ok((s.match(/data-product-card/g) || []).length <= 24);
  assert.match(s, /Productos Yanbal/);
  assert.match(s, /Comprar ahora/);
  assert.match(s, /\/catalogo/);
  assert.match(s, /\/yanbal-cucuta/);
  assert.match(s, /\/yanbal-bogota/);
  assert.match(s, /\/yanbal-colombia/);
  assert.doesNotMatch(s, /schema.org\/InStock/);
});
test("shareable fragrance guide is crawlable and links verified catalog products", () => {
  const s = html("/guias/combinar-perfumes");
  assert.match(s, /Cómo combinar perfumes y lociones paso a paso/);
  assert.match(s, /data-content-share="whatsapp"/);
  assert.match(s, /data-content-share="native"/);
  assert.match(s, /BreadcrumbList/);
  assert.match(s, /"@type":"Article"/);
  assert.ok((s.match(/data-product-card/g) || []).length === 8);
  assert.match(html("/"), /\/guias\/combinar-perfumes/);
  assert.match(html("/guias"), /\/guias\/combinar-perfumes/);
});
test("469 independent HTML pages preserve SKU, image, metadata and truthful schema", () => {
  for (const p of products) {
    const s = html(productPath(p));
    assert.match(s, /<title>[^<]+<\/title>/, p.id + " title");
    assert.match(
      s,
      /<meta name="description" content="[^"]+"/,
      p.id + " description",
    );
    assert.ok(s.includes(p.sku), p.id);
    assert.ok(s.includes(p.image), p.id);
    assert.ok(s.includes(String(p.price)), p.id + " price");
    assert.ok(s.includes('rel="canonical"'), p.id);
    assert.ok(s.includes("Product"), p.id + " product schema");
    assert.ok(s.includes("BreadcrumbList"), p.id);
    assert.ok(s.includes("BackOrder") || s.includes("OutOfStock"), p.id);
  }
});
test("catalog has crawlable pagination for every product and preserves search", () => {
  const s = html("/catalogo");
  assert.equal((s.match(/data-product-card/g) || []).length, 24);
  assert.match(s, /data-catalog-form/);
  assert.match(s, /data-load-more/);
  const linkedProducts = new Set();
  for (let page = 1; page <= CATALOG_PAGE_COUNT; page += 1) {
    const pageHtml = html(catalogPagePath(page));
    for (const product of products)
      if (pageHtml.includes(`href="${productPath(product)}"`))
        linkedProducts.add(product.id);
    if (page > 1) assert.match(pageHtml, /rel="prev"/);
    if (page < CATALOG_PAGE_COUNT) assert.match(pageHtml, /rel="next"/);
  }
  assert.equal(linkedProducts.size, products.length);
  const archive = html("/catalogo-paginas");
  assert.match(archive, /\/catalog\/c9-page-017.webp/);
  assert.match(archive, /Recortes por categoría/);
});
test("sitemap covers every product and excludes checkout, private returns and API", () => {
  const s = fs.readFileSync("vercel-dist/sitemap.xml", "utf8");
  for (const p of products) assert.ok(s.includes(productPath(p)));
  for (let page = 2; page <= CATALOG_PAGE_COUNT; page += 1)
    assert.ok(s.includes(catalogPagePath(page)));
  assert.doesNotMatch(s, /<loc>[^<]*\/(checkout|pedido|gracias|api)/);
  for (const r of [
    "/cucuta",
    "/bogota",
    "/regalables",
    "/perfumes-yanbal-cucuta-bogota",
    "/bloqueadores-yanbal-cucuta-bogota",
    "/regalos-amor-amistad-colombia",
  ])
    assert.ok(html(r));
  const robots = fs.readFileSync("vercel-dist/robots.txt", "utf8");
  for (const path of ["/api/", "/checkout", "/pedido/", "/gracias"])
    assert.match(robots, new RegExp("Disallow: " + path.replace("/", "\\/")));
});
test("Merchant feed includes all references without inventing stock", () => {
  const feed = fs.readFileSync("vercel-dist/google-merchant-feed.xml", "utf8");
  assert.equal((feed.match(/<item>/g) || []).length, products.length);
  for (const p of products) {
    assert.ok(feed.includes(`<g:id>${p.id}</g:id>`));
    assert.ok(feed.includes(productPath(p)));
  }
  assert.match(feed, /<g:shipping_label>standard-colombia<\/g:shipping_label>/);
  assert.doesNotMatch(feed, /<g:availability>in_stock<\/g:availability>/);
});
test("no return page renders an unverified success message; missing product is real 404", () => {
  for (const r of [
    "/pedido/exitoso",
    "/pedido/pendiente",
    "/pedido/error",
    "/gracias",
  ]) {
    const s = html(r);
    assert.match(s, /Verificando el estado/);
    assert.match(s, /noindex/);
    assert.doesNotMatch(s, /<h1[^>]*>Gracias, recibimos tu pago/);
  }
  assert.ok(fs.existsSync("vercel-dist/404.html"));
  assert.doesNotMatch(
    fs.readFileSync("vercel-dist/404.html", "utf8"),
    /Ofertas destacadas/,
  );
});
