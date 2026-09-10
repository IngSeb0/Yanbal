import { cp, mkdir, rm, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { products, productPath } from "../lib/commerce-products.js";
import { store } from "../config/store.js";
import {
  CATALOG_PAGE_COUNT,
  catalogPagePath,
} from "../lib/catalog-pagination.js";
const outDir = path.resolve("vercel-dist");
if (path.dirname(outDir) !== process.cwd())
  throw Error("Output outside project");
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp(path.resolve("dist/client"), outDir, { recursive: true });
const { default: worker } = await import(
  new URL("../dist/server/index.js", import.meta.url).href
);
async function render(route, expected = 200) {
  const res = await worker.fetch(
    new Request(store.url + route, { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
  if (res.status !== expected)
    throw Error("Render failed " + route + ": " + res.status);
  return (await res.text())
    .replace(/<link rel="modulepreload"[^>]*>/g, "")
    .replace(/<script>(?:(?!<\/script>).)*<\/script>/gs, "")
    .replace(/<script(?=[^>]*\bsrc=["'][^"']*\/_next\/)[^>]*><\/script>/g, "")
    .replaceAll("http://localhost:3000/", store.url + "/");
}
const directories = await readdir("app", { withFileTypes: true }),
  routes = ["/"];
for (const d of directories) {
  if (d.isDirectory() && !d.name.includes("[")) {
    if ((await readdir("app/" + d.name)).includes("page.tsx"))
      routes.push("/" + d.name);
  }
}
routes.push(
  "/guias/regalo-ideal",
  "/guias/combinar-perfumes",
  "/guias/elegir-perfume",
  "/guias/total-block",
  "/guias/elegir-tono-maquillaje",
  "/guias/regalos-por-presupuesto",
  ...Array.from({ length: CATALOG_PAGE_COUNT - 1 }, (_, index) =>
    catalogPagePath(index + 2),
  ),
  ...products.map(productPath),
  ...["exitoso", "pendiente", "error"].map((s) => "/pedido/" + s),
);
for (const route of routes) {
  const html = await render(route);
  const file = route === "/" ? "index.html" : route.slice(1) + ".html";
  await mkdir(path.dirname(path.join(outDir, file)), { recursive: true });
  await writeFile(path.join(outDir, file), html);
}
await writeFile(
  path.join(outDir, "404.html"),
  await render("/producto/no-existe", 404),
);
const indexable = routes.filter((r) => !/^\/(checkout|pedido|gracias)/.test(r));
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  indexable
    .map(
      (r) => "<url><loc>" + store.url + (r === "/" ? "/" : r) + "</loc></url>",
    )
    .join("") +
  "</urlset>";
await writeFile(path.join(outDir, "sitemap.xml"), sitemap);
await writeFile("public/sitemap.xml", sitemap);
await writeFile(
  path.join(outDir, "robots.txt"),
  "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /checkout\nDisallow: /pedido/\nDisallow: /gracias\nSitemap: " +
    store.url +
    "/sitemap.xml\n",
);
console.log(
  "Exported",
  routes.length,
  "routes;",
  products.length,
  "product pages",
);
