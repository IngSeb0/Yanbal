import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [sourcePath = "C:/Users/Acer/Downloads/yanbal_c9_2026_productos_precios.csv"] =
  process.argv.slice(2);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  const [rawHeaders, ...records] = rows;
  const headers = rawHeaders.map((header) => header.replace(/^\uFEFF/, "").trim());
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])),
  );
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 96);
}

function number(value) {
  const clean = String(value || "").replace(/[^\d]/g, "");
  return clean ? Number(clean) : null;
}

function fullName(row) {
  return [row.producto, row.variante].filter(Boolean).join(" - ");
}

function imageForPage(page) {
  return `/catalog/c9-page-${String(page).padStart(3, "0")}.webp`;
}

function imageForProduct(productId, page) {
  return productId ? `/products/${productId}.webp` : imageForPage(page);
}

function descriptionFor(row) {
  const parts = [
    row.contenido ? `Presentación ${row.contenido}` : "",
    row.promocion ? row.promocion : "",
    row.detalle_promocion ? row.detalle_promocion : "",
  ].filter(Boolean);
  return parts.join(". ");
}

const csv = await readFile(sourcePath, "utf8");
const rows = parseCsv(csv);
const products = rows
  .map((row, index) => {
    const price = number(row.precio_oferta_cop);
    if (!price || !row.codigo || !row.producto) {
      return null;
    }

    const page = Number(row.pagina || 0);
    const productName = fullName(row);

    const id = `${row.codigo}-${slugify(productName)}`;

    return {
      id,
      sku: String(row.codigo),
      name: productName,
      base_name: row.producto,
      variant: row.variante,
      category: row.categoria,
      page,
      content: row.contenido,
      price,
      promo_price: price,
      normal_price: number(row.precio_normal_cop),
      promotion: row.promocion,
      promotion_detail: row.detalle_promocion,
      inventory: 20,
      description: descriptionFor(row),
      benefits: [row.promocion, row.contenido, row.detalle_promocion].filter(Boolean),
      image: imageForProduct(id, page),
      campaign_code: "C9-2026",
      brand: "Yanbal",
      sort_order: index + 1,
      published: true,
    };
  })
  .filter(Boolean);

const output = `// Generated from ${path.basename(sourcePath)}. Do not edit by hand.
export const catalogProducts = ${JSON.stringify(products, null, 2)};
`;

await writeFile("lib/catalog-products.js", output, "utf8");
console.log(`Generated ${products.length} products in lib/catalog-products.js`);
