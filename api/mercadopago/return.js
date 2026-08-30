import { buildWhatsAppUrl, formatCop, productById } from "../../lib/mercadopago-products.js";

function redirect(response, location) {
  response.setHeader("Cache-Control", "no-store");
  response.writeHead(303, { Location: location });
  response.end();
}

function requestUrl(request) {
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  const proto = request.headers["x-forwarded-proto"] || "https";
  return new URL(request.url, host ? `${proto}://${host}` : "https://yanbal-promos-cucuta-bogota.vercel.app");
}

function paymentReference(url) {
  return (
    url.searchParams.get("payment_id") ||
    url.searchParams.get("collection_id") ||
    url.searchParams.get("merchant_order_id") ||
    "sin referencia visible"
  );
}

function normalizedStatus(status) {
  return ["success", "approved", "pending", "failure", "rejected"].includes(status)
    ? status
    : "pending";
}

export default function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.setHeader("Cache-Control", "no-store");
    response.statusCode = 405;
    response.end("Metodo no permitido");
    return;
  }

  const url = requestUrl(request);
  const product = productById(url.searchParams.get("productId") || "");
  const orderId = url.searchParams.get("orderId") || "";
  const status = normalizedStatus(
    url.searchParams.get("status") || url.searchParams.get("collection_status") || "pending",
  );
  const reference = paymentReference(url);
  const productName = product?.title || (orderId ? `mi pedido Yanbal ${orderId}` : "mi pedido Yanbal");
  const price = product ? `$${formatCop(product.unit_price)}` : "precio por confirmar";

  const textByStatus = {
    success: `Hola, ya realice el pago de ${productName} por Mercado Pago. Precio: ${price}. Referencia: ${reference}. Quiero confirmar entrega y disponibilidad.`,
    approved: `Hola, ya realice el pago de ${productName} por Mercado Pago. Precio: ${price}. Referencia: ${reference}. Quiero confirmar entrega y disponibilidad.`,
    pending: `Hola, mi pago de ${productName} quedo pendiente en Mercado Pago. Precio: ${price}. Referencia: ${reference}. Quiero confirmar el pedido.`,
    failure: `Hola, intente pagar ${productName} por Mercado Pago y necesito ayuda para finalizar. Precio: ${price}. Referencia: ${reference}.`,
    rejected: `Hola, intente pagar ${productName} por Mercado Pago y necesito ayuda para finalizar. Precio: ${price}. Referencia: ${reference}.`,
  };

  const thankYouUrl = new URL("/gracias", url.origin);
  thankYouUrl.searchParams.set("status", status);
  thankYouUrl.searchParams.set("reference", reference);
  thankYouUrl.searchParams.set("wa", buildWhatsAppUrl(textByStatus[status]));

  if (orderId) {
    thankYouUrl.searchParams.set("orderId", orderId);
  }

  if (productName) {
    thankYouUrl.searchParams.set("product", productName);
  }

  redirect(response, thankYouUrl.toString());
}
