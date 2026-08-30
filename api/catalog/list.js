import { loadCatalogUploads, loadStoreProducts } from "../../lib/store-products.js";

function json(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    json(response, 405, { ok: false, error: "Metodo no permitido" });
    return;
  }

  const [products, catalog] = await Promise.all([loadStoreProducts(), loadCatalogUploads()]);

  json(response, 200, {
    ok: true,
    products,
    campaigns: catalog.campaigns,
    uploads: catalog.uploads,
    databaseConfigured: catalog.configured,
  });
}
