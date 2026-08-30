import { hasSupabaseConfig, restSelect } from "./supabase-rest.js";
import { catalogProducts } from "./catalog-products.js";
import { virtualProducts } from "./virtual-products.js";

export const whatsappNumber = "573026293535";

const featuredFallbackProducts = [
  {
    id: "gaia-eternal",
    sku: "YAN-C9-GAIA-ETERNAL",
    name: "GAIA Eternal",
    category: "Perfumes y colonias",
    price: 121000,
    promo_price: 121000,
    inventory: 20,
    description:
      "Perfume femenino Yanbal con aroma luminoso y elegante para diario, oficina o regalo en Cúcuta y Bogotá.",
    benefits: ["Fragancia femenina", "Aroma elegante", "Buena opción para regalo"],
    image: "/promos/gaia-eternal.webp",
    campaign_code: "C9-2026",
    brand: "Yanbal",
    sort_order: -70,
  },
  {
    id: "gaia-parfum",
    sku: "YAN-C9-GAIA-PARFUM",
    name: "GAIA",
    category: "Perfumes y colonias",
    price: 121000,
    promo_price: 121000,
    inventory: 20,
    description:
      "Fragancia femenina sofisticada de Yanbal para uso personal o regalo especial en Bogotá y Cúcuta.",
    benefits: ["Toque sofisticado", "Perfume femenino", "Pedido rápido por WhatsApp"],
    image: "/promos/gaia-parfum.webp",
    campaign_code: "C9-2026",
    brand: "Yanbal",
    sort_order: -60,
  },
  {
    id: "bb-cream",
    sku: "YAN-C9-BB-CREAM",
    name: "BB Cream",
    category: "Maquillaje",
    price: 55000,
    promo_price: 55000,
    inventory: 20,
    description:
      "BB Cream Yanbal para unificar tono, hidratar y matificar en un solo paso con efecto buena cara.",
    benefits: ["Hidrata y matifica", "SPF 25", "Efecto buena cara"],
    image: "/promos/bb-cream.webp",
    campaign_code: "C9-2026",
    brand: "Yanbal",
    sort_order: -50,
  },
  {
    id: "dulce-amor",
    sku: "YAN-C9-DULCE-AMOR",
    name: "Dulce Amor",
    category: "Perfumes y colonias",
    price: 78000,
    promo_price: 78000,
    inventory: 20,
    description: "Eau de Parfum Yanbal de edición limitada para regalar en Amor y Amistad.",
    benefits: ["Edición limitada", "Ideal para regalar", "Eau de Parfum"],
    image: "/promos/dulce-amor.webp",
    campaign_code: "C9-2026",
    brand: "Yanbal",
    sort_order: -40,
  },
  {
    id: "43n-paralel",
    sku: "YAN-C9-43N-PARALEL",
    name: "43N Paralel",
    category: "Mundo hombre",
    price: 143000,
    promo_price: 143000,
    inventory: 20,
    description: "Perfume masculino Yanbal con carácter y presencia para regalo o uso personal.",
    benefits: ["Perfume masculino", "Aroma con carácter", "Buena duración percibida"],
    image: "/promos/43n-paralel.webp",
    campaign_code: "C9-2026",
    brand: "Yanbal",
    sort_order: -30,
  },
  {
    id: "dendur",
    sku: "YAN-C9-DENDUR",
    name: "Dendur",
    category: "Mundo hombre",
    price: 115000,
    promo_price: 115000,
    inventory: 20,
    description: "Eau de Parfum masculino intenso e impactante para ocasiones especiales.",
    benefits: ["Aroma intenso", "Eau de Parfum", "Para ocasiones especiales"],
    image: "/promos/dendur.webp",
    campaign_code: "C9-2026",
    brand: "Yanbal",
    sort_order: -20,
  },
  {
    id: "total-block-sport-plus",
    sku: "YAN-C9-TOTAL-BLOCK-SPORT-PLUS",
    name: "Total Block Sport Plus",
    category: "Protección solar",
    price: 80000,
    promo_price: 80000,
    inventory: 20,
    description:
      "Protector solar Yanbal SPF 100 resistente al agua y al sudor, con textura ligera para deporte y clima cálido.",
    benefits: ["UVA, UVB, IR y luz azul", "Textura ligera", "No irrita los ojos"],
    image: "/promos/total-block-sport-plus.webp",
    campaign_code: "C9-2026",
    brand: "Yanbal",
    sort_order: -10,
  },
];

export const fallbackProducts = [...featuredFallbackProducts, ...virtualProducts, ...catalogProducts];

export function formatCop(value) {
  return Number(value || 0).toLocaleString("es-CO");
}

export function currentPrice(product) {
  return Number(product.promo_price || product.price || 0);
}

export function buildWhatsAppUrl(text) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function normalizeProduct(product) {
  return {
    ...product,
    page: Number(product.page || 0),
    price: Number(product.price || 0),
    promo_price: product.promo_price == null ? null : Number(product.promo_price),
    normal_price: product.normal_price == null ? null : Number(product.normal_price),
    inventory: Number(product.inventory || 0),
    benefits: Array.isArray(product.benefits) ? product.benefits : [],
  };
}

function mergeProducts(databaseProducts) {
  const byId = new Map(fallbackProducts.map((product) => [product.id, normalizeProduct(product)]));
  databaseProducts.map(normalizeProduct).forEach((product) => byId.set(product.id, product));
  return [...byId.values()].sort((first, second) => {
    const firstOrder = Number(first.sort_order || 0);
    const secondOrder = Number(second.sort_order || 0);
    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }
    return String(first.name).localeCompare(String(second.name), "es");
  });
}

export async function loadStoreProducts() {
  if (!hasSupabaseConfig()) {
    return fallbackProducts.map(normalizeProduct);
  }

  try {
    const products = await restSelect(
      "products?select=id,sku,name,category,price,promo_price,inventory,description,benefits,image,campaign_code,brand,sort_order&brand=eq.Yanbal&published=eq.true&order=sort_order.asc",
    );
    return mergeProducts(products);
  } catch {
    return fallbackProducts.map(normalizeProduct);
  }
}

export async function loadCatalogUploads() {
  if (!hasSupabaseConfig()) {
    return { configured: false, campaigns: [], uploads: [] };
  }

  try {
    const [campaigns, uploads] = await Promise.all([
      restSelect("campaigns?select=id,name,campaign_code,starts_at,ends_at,status,catalog_url,thumbnail_url,notes&status=eq.active&order=starts_at.desc"),
      restSelect("catalog_uploads?select=id,campaign_id,title,file_name,public_url,mime_type,size_bytes,page_count,uploaded_at,status,notes&status=eq.active&order=uploaded_at.desc"),
    ]);

    return { configured: true, campaigns, uploads };
  } catch {
    return { configured: false, campaigns: [], uploads: [] };
  }
}

export function productMap(products) {
  return new Map(products.map((product) => [product.id, product]));
}

export function buildCartWhatsAppUrl(items, customer, orderId) {
  const lines = items.map(
    (item) =>
      `- ${item.quantity} x ${item.name} (${item.category}, cód. ${item.sku || item.product_id}) $${formatCop(item.lineTotal)}`,
  );
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const city = customer.city || "Cúcuta o Bogotá";
  const text = [
    `Hola, quiero confirmar este pedido Yanbal ${orderId}.`,
    `Ciudad: ${city}.`,
    customer.name ? `Nombre: ${customer.name}.` : "",
    customer.phone ? `Teléfono: ${customer.phone}.` : "",
    "Productos:",
    ...lines,
    `Total productos: $${formatCop(total)}.`,
    customer.address ? `Dirección: ${customer.address}.` : "",
    customer.notes ? `Notas: ${customer.notes}.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return buildWhatsAppUrl(text);
}
