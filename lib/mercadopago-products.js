import {
  buildWhatsAppUrl,
  currentPrice,
  fallbackProducts,
  formatCop,
  whatsappNumber,
} from "./store-products.js";

export { buildWhatsAppUrl, formatCop, whatsappNumber };

export const products = Object.fromEntries(
  fallbackProducts.map((product) => [
    product.id,
    {
      title: `Yanbal ${product.name}`,
      unit_price: currentPrice(product),
      image: product.image,
      category: product.category,
    },
  ]),
);

export function productById(productId) {
  return products[productId] || null;
}

export function whatsappFallback(product) {
  const text = `Hola, quiero comprar ${product.title} y pagar por Mercado Pago. Precio: $${formatCop(
    product.unit_price,
  )}.`;
  return buildWhatsAppUrl(text);
}
