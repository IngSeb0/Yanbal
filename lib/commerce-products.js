import { catalogProducts } from "./catalog-products.js";
import { virtualProducts } from "./virtual-products.js";
import { store } from "../config/store.js";
import { promotionFor } from "../config/promotions.js";

export const normalize = (s = "") =>
  String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export const slugify = (s) =>
  normalize(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const money = (n) => `$${Number(n).toLocaleString("es-CO")}`;
export function enrichProduct(p) {
  const rule = promotionFor(p);
  const bundle = rule?.kind === "pack";
  const mix = rule?.kind === "mix";
  const original = Number(p.promo_price ?? p.price);
  const price = mix ? original / 2 : original;
  const group = mix ? rule.group : null;
  const normal = Number(p.normal_price || 0);
  return {
    ...p,
    price,
    promo_price: price,
    slug: `${slugify(p.name)}-${slugify(p.sku)}`,
    normal_price: !mix && normal > price ? normal : null,
    savings: !mix && normal > price ? normal - price : 0,
    discount:
      !mix && normal > price
        ? Math.round(((normal - price) / normal) * 100)
        : 0,
    availability: store.availability[p.id] || "AVAILABLE_FOR_ORDER",
    unitsPerPack: bundle ? 2 : 1,
    promotionGroup: group,
    requiredQuantity: mix ? 2 : 1,
    bundlePrice: mix ? original : null,
    saleLabel: bundle
      ? "Paquete de 2 unidades"
      : mix
        ? `Por unidad al llevar 2 combinables por ${money(original)}`
        : "",
    giftable: /parfum|colonia|regalo|collar|aretes|pulsera|combo/i.test(
      p.name + " " + p.category,
    ),
  };
}
export const products = [...virtualProducts, ...catalogProducts].map(
  enrichProduct,
);
for (const combo of store.combos) {
  const included = combo.productIds.map((id) =>
    products.find((p) => p.id === id),
  );
  if (
    !included.length ||
    included.some((p) => !p || p.promotionGroup) ||
    !Number.isSafeInteger(combo.price) ||
    combo.price <= 0
  )
    throw new Error("Invalid configured combo");
  const separate = included.reduce((s, p) => s + p.price, 0);
  if (combo.price > separate)
    throw new Error("Combo price exceeds individual total");
  products.push(
    enrichProduct({
      ...combo,
      sku: combo.id,
      category: "Regalos",
      page: 0,
      normal_price: separate,
      content: included.map((p) => p.name).join(" + "),
    }),
  );
}
export const productPath = (p) => `/producto/${p.slug}`;
export const available = (p) => p.availability === "AVAILABLE_FOR_ORDER";
export function cartLines(items) {
  if (!Array.isArray(items) || !items.length || items.length > 50)
    throw new Error("Agrega entre 1 y 50 productos al carrito.");
  const seen = new Set();
  const lines = items.map((item) => {
    const p = products.find((p) => p.id === item.id);
    if (!p || !available(p) || seen.has(item.id))
      throw new Error(
        "Hay un producto no disponible o repetido en el carrito.",
      );
    if (
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    )
      throw new Error("La cantidad debe ser un número entero entre 1 y 20.");
    if (!Number.isSafeInteger(p.price) || p.price <= 0)
      throw new Error("Precio de producto no válido.");
    seen.add(item.id);
    return {
      id: p.id,
      sku: p.sku,
      name: p.name,
      category: p.category,
      image: p.image,
      price: p.price,
      quantity: item.quantity,
      unitsPerPack: p.unitsPerPack,
      promotionGroup: p.promotionGroup,
      saleLabel: p.saleLabel,
      content: p.content || "",
    };
  });
  const groups = new Map();
  for (const l of lines)
    if (l.promotionGroup)
      groups.set(
        l.promotionGroup,
        (groups.get(l.promotionGroup) || 0) + l.quantity,
      );
  for (const [group, qty] of groups)
    if (qty % 2)
      throw new Error(
        `Completa la promoción de ${lines.find((l) => l.promotionGroup === group).name}: selecciona 2 unidades combinables (o un múltiplo de 2).`,
      );
  return lines;
}
