import fs from "node:fs";
import { productPath, products } from "../lib/commerce-products.js";
import { store } from "../config/store.js";
import municipalities from "../config/municipalities.json" with { type: "json" };
const fields = [
  "id",
  "sku",
  "name",
  "category",
  "variant",
  "page",
  "content",
  "price",
  "normal_price",
  "discount",
  "savings",
  "image",
  "slug",
  "availability",
  "unitsPerPack",
  "promotionGroup",
  "requiredQuantity",
  "bundlePrice",
  "saleLabel",
  "giftable",
  "description",
  "promotion_detail",
];
fs.writeFileSync(
  "public/commerce-products.json",
  JSON.stringify({
    products: products.map((p) =>
      Object.fromEntries(fields.map((k) => [k, p[k]])),
    ),
    featured: store.featuredProducts,
    whatsapp: store.whatsapp,
    related: store.relatedProducts,
  }),
);
fs.writeFileSync("public/municipalities.json", JSON.stringify(municipalities));
const xml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
const absolute = (value) =>
  /^https?:\/\//i.test(value) ? value : store.url + value;
const merchantItems = products
  .map((p) => {
    const regularPrice =
        Number(p.normal_price) > Number(p.price) ? p.normal_price : p.price,
      salePrice = regularPrice > p.price ? p.price : null,
      description = [
        p.description,
        p.content,
        p.promotion_detail,
        `Categoría: ${p.category}. Código Yanbal: ${p.sku}.`,
      ]
        .filter(Boolean)
        .join(" ");
    return [
      "<item>",
      `<g:id>${xml(p.id)}</g:id>`,
      `<g:title>${xml(p.name)}</g:title>`,
      `<g:description>${xml(description)}</g:description>`,
      `<g:link>${xml(store.url + productPath(p))}</g:link>`,
      `<g:image_link>${xml(absolute(p.image))}</g:image_link>`,
      `<g:availability>${store.merchantAvailability[p.id] === "in_stock" ? "in_stock" : "out_of_stock"}</g:availability>`,
      "<g:condition>new</g:condition>",
      `<g:price>${regularPrice} COP</g:price>`,
      salePrice ? `<g:sale_price>${salePrice} COP</g:sale_price>` : "",
      "<g:brand>Yanbal</g:brand>",
      `<g:mpn>${xml(p.sku)}</g:mpn>`,
      `<g:product_type>${xml(p.category)}</g:product_type>`,
      "<g:shipping_label>standard-colombia</g:shipping_label>",
      "</item>",
    ].join("");
  })
  .join("");
fs.writeFileSync(
  "public/google-merchant-feed.xml",
  `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel><title>${xml(store.name)}</title><link>${xml(store.url)}</link><description>Catálogo de productos Yanbal disponible para compra en Colombia.</description>${merchantItems}</channel></rss>`,
);
console.log(
  "Exported",
  products.length,
  "products and",
  municipalities.length,
  "locations",
);
