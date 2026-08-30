import { catalogProducts } from "../lib/catalog-products.js";
import { virtualProducts } from "../lib/virtual-products.js";
import type { StorefrontProduct } from "./storefront-ui";

export const storefrontProducts = [...(virtualProducts as StorefrontProduct[]), ...(catalogProducts as StorefrontProduct[])]
  .filter((product) => product.price > 0)
  .sort((first, second) => {
    if (first.category !== second.category) {
      return first.category.localeCompare(second.category, "es");
    }

    return first.name.localeCompare(second.name, "es");
  });

export const storefrontCategories = Array.from(
  new Set(storefrontProducts.map((product) => product.category)),
);

export const storefrontProductGroups = storefrontCategories.map((category) => ({
  category,
  products: storefrontProducts.filter((product) => product.category === category),
}));

function normalizedText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function productSearchText(product: StorefrontProduct) {
  return normalizedText(
    [
      product.name,
      product.category,
      product.variant,
      product.content,
      product.promotion,
      product.promotion_detail,
      product.description,
      ...(product.benefits ?? []),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function productsById(ids: string[]) {
  const byId = new Map(storefrontProducts.map((product) => [product.id, product]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as StorefrontProduct[];
}

export const perfumeProducts = storefrontProducts
  .filter((product) => {
    const search = productSearchText(product);
    return (
      product.category === "Perfumes y colonias" ||
      product.category === "Mundo hombre" ||
      /\b(parfum|perfume|colonia|eau de parfum|fragancia)\b/.test(search)
    );
  })
  .slice(0, 48);

export const sunCareProducts = storefrontProducts
  .filter((product) => {
    const search = productSearchText(product);
    return /total block|spf|proteccion solar|ultraproteccion|bloqueador|solar/.test(search);
  })
  .slice(0, 36);

export const discountProducts = productsById([
  "2203-pasion-parfum",
  "231-ccori-parfum",
  "2040-dulce-amor-edl-eau-de-parfum",
  "2191-icono-eau-de-parfum",
  "4719-jelly-stick-iluminador-en-barra-cool-shine",
  "5209-balsamo-labial-edicion-limitada-lip-oil-balm-aura-rose",
  "775-biomilk-soy-unica-crema-corporal-edl",
  "2210-soy-unica-colonia",
]);

export const loveAndFriendshipProducts = productsById([
  "200-ohm-parfum-ohm",
  "43715-collar-amira",
  "2040-dulce-amor-edl-eau-de-parfum",
  "combo-soy-unica-c9",
  "4719-jelly-stick-iluminador-en-barra-cool-shine",
  "5209-balsamo-labial-edicion-limitada-lip-oil-balm-aura-rose",
]);

const giftKeywords = [
  "amor",
  "amistad",
  "parfum",
  "eau de parfum",
  "colonia",
  "collar",
  "aretes",
  "pulsera",
  "argollas",
  "set",
  "bálsamo",
  "balsamo",
  "iluminador",
  "lip oil",
  "soy única",
  "soy unica",
  "ohm",
  "dulce",
];

export const giftableProducts = storefrontProducts.filter((product) => {
  const search = productSearchText(product);

  return giftKeywords.some((keyword) =>
    search.includes(normalizedText(keyword)),
  );
});

export const giftSections = [
  {
    title: "Perfumes y colonias para regalar",
    description:
      "Aromas buscados para detalles de Amor y Amistad, cumpleaños o regalos especiales en Cúcuta y Bogotá.",
    products: giftableProducts
      .filter((product) => product.category === "Perfumes y colonias" || product.category === "Mundo hombre")
      .slice(0, 18),
  },
  {
    title: "Joyería y detalles especiales",
    description:
      "Collares, aretes, argollas y sets que funcionan como regalo listo para entregar.",
    products: giftableProducts.filter((product) => product.category === "Joyería para mujer").slice(0, 18),
  },
  {
    title: "Maquillaje y cuidado personal",
    description:
      "Iluminadores, bálsamos, cremas y productos de cuidado con precio de campaña.",
    products: giftableProducts
      .filter((product) => ["Maquillaje", "Cuidado personal", "Tratamiento facial"].includes(product.category))
      .slice(0, 18),
  },
].filter((section) => section.products.length > 0);
