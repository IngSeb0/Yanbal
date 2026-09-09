// Reviewed against the original C9 catalog records (SKU, detail and total).
// Only these explicit references receive multi-unit pricing. New promotions need review.
export const promotionRules = [
  {
    kind: "pack",
    skus: ["2223"],
    total: 156000,
    detail: "Pide 1, recibe 2 por $156.000",
  },
  {
    kind: "pack",
    skus: ["2187", "2189", "2190", "2188"],
    total: 78000,
    detail: "Pide 1, recibe 2 por $78.000",
  },
  {
    kind: "pack",
    skus: ["6412"],
    total: 54000,
    detail: "Pide 1, recibe 2 por $54.000",
  },
  {
    kind: "pack",
    skus: ["151"],
    total: 90000,
    detail: "Pide 1, recibe 2 por $90.000",
  },
  {
    kind: "pack",
    skus: ["154"],
    total: 78000,
    detail: "Pide 1, recibe 2 por $78.000",
  },
  {
    kind: "pack",
    skus: ["217"],
    total: 156000,
    detail: "Pide 1, recibe 2 por $156.000",
  },
  {
    kind: "mix",
    group: "ojos-gel",
    skus: ["5318", "6238", "5317", "5316", "5319"],
    total: 50000,
    detail: "Cualquier combinación: 2 por $50.000",
  },
  {
    kind: "mix",
    group: "cejas",
    skus: ["5163", "4801"],
    total: 64000,
    detail: "Cualquier combinación: 2 por $64.000",
  },
  {
    kind: "mix",
    group: "hydra-lip",
    skus: [
      "6275",
      "6282",
      "6280",
      "6283",
      "6281",
      "6274",
      "4894",
      "5045",
      "5043",
      "4890",
      "4897",
      "5044",
      "6271",
      "4977",
      "4892",
      "4896",
      "4895",
      "4893",
    ],
    total: 62000,
    detail: "Cualquier combinación entre Satinado y Mate: 2 por $62.000",
  },
  {
    kind: "mix",
    group: "antigrasa",
    skus: ["13", "14"],
    total: 80000,
    detail: "Cualquier combinación: 2 por $80.000",
  },
  {
    kind: "mix",
    group: "blum",
    skus: ["723", "692", "722", "691"],
    total: 58000,
    detail: "Cualquier combinación entre estos productos: 2 por $58.000",
  },
];
export function promotionFor(product) {
  const rule = promotionRules.find((r) => r.skus.includes(product.sku));
  if (
    rule &&
    (product.promotion_detail !== rule.detail ||
      Number(product.promo_price ?? product.price) !== rule.total)
  )
    throw Error("Promotion source changed; review SKU " + product.sku);
  return rule;
}
