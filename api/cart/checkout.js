import crypto from "node:crypto";
import { restInsert } from "../../lib/supabase-rest.js";
import {
  buildCartWhatsAppUrl,
  currentPrice,
  loadStoreProducts,
  productMap,
} from "../../lib/store-products.js";

function json(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

async function readJson(request, maxBytes = 64 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) {
      const error = new Error("payload_too_large");
      error.code = "PAYLOAD_TOO_LARGE";
      throw error;
    }
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

function originFromRequest(request) {
  const proto = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  return host ? `${proto}://${host}` : "https://yanbal-promos-cucuta-bogota.vercel.app";
}

function cleanText(value, fallback = "") {
  return String(value || fallback).trim().slice(0, 240);
}

function orderId() {
  return `YAN-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomUUID()
    .slice(0, 4)
    .toUpperCase()}`;
}

async function persistOrder(order, items) {
  try {
    await restInsert("orders", order, { service: true });
    await restInsert("order_items", items, { service: true });
    return true;
  } catch {
    try {
      await restInsert("orders", order, { service: false });
      await restInsert("order_items", items, { service: false });
      return true;
    } catch {
      return false;
    }
  }
}

async function mercadoPagoCheckout({ request, order, items, whatsappUrl }) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return {
      checkoutUrl: null,
      whatsappUrl,
      configured: false,
      error: "Mercado Pago no está configurado en Vercel.",
    };
  }

  const origin = originFromRequest(request);
  const preference = {
    items: items.map((item) => ({
      id: item.product_id,
      title: `${item.name} - Cod. ${item.sku || item.product_id}`,
      quantity: item.quantity,
      currency_id: "COP",
      unit_price: item.price,
    })),
    back_urls: {
      success: `${origin}/api/mercadopago/return?orderId=${encodeURIComponent(order.id)}&status=success`,
      failure: `${origin}/api/mercadopago/return?orderId=${encodeURIComponent(order.id)}&status=failure`,
      pending: `${origin}/api/mercadopago/return?orderId=${encodeURIComponent(order.id)}&status=pending`,
    },
    notification_url: `${origin}/api/mercadopago/webhook`,
    auto_return: "approved",
    external_reference: order.id,
    metadata: {
      order_id: order.id,
      channel: "cart",
      customer_phone: order.customer_phone,
    },
    statement_descriptor: "YANBAL",
  };

  try {
    const mercadoPagoResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    if (!mercadoPagoResponse.ok) {
      return {
        checkoutUrl: null,
        whatsappUrl,
        configured: true,
        error: "Mercado Pago no pudo crear el link de pago. Revisa el token o intenta de nuevo.",
      };
    }

    const checkout = await mercadoPagoResponse.json();
    const checkoutUrl =
      process.env.MERCADO_PAGO_USE_SANDBOX === "true"
        ? checkout.sandbox_init_point
        : checkout.init_point;

    if (!checkoutUrl) {
      return {
        checkoutUrl: null,
        whatsappUrl,
        configured: true,
        error: "Mercado Pago no devolvió una URL de pago para este carrito.",
      };
    }

    return {
      checkoutUrl,
      whatsappUrl,
      preferenceId: checkout.id,
      configured: true,
    };
  } catch {
    return {
      checkoutUrl: null,
      whatsappUrl,
      configured: true,
      error: "Mercado Pago no respondió la solicitud de pago. Intenta nuevamente.",
    };
  }
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    json(response, 405, { ok: false, error: "Metodo no permitido" });
    return;
  }

  let payload;
  try {
    payload = await readJson(request);
  } catch (error) {
    json(response, error.code === "PAYLOAD_TOO_LARGE" ? 413 : 400, {
      ok: false,
      error:
        error.code === "PAYLOAD_TOO_LARGE"
          ? "El pedido es demasiado grande. Reduce la cantidad de productos."
          : "JSON no valido",
    });
    return;
  }

  const products = await loadStoreProducts();
  const productsById = productMap(products);
  const cartItems = Array.isArray(payload.items) ? payload.items : [];
  const validatedItems = cartItems
    .map((item) => {
      const product = productsById.get(String(item.id || ""));
      const quantity = Math.max(1, Math.min(20, Number(item.quantity || 1)));
      if (!product) {
        return null;
      }
      const price = currentPrice(product);
      return {
        product,
        quantity,
        price,
        lineTotal: quantity * price,
      };
    })
    .filter(Boolean);

  if (!validatedItems.length) {
    json(response, 400, { ok: false, error: "El carrito esta vacio" });
    return;
  }

  const customer = {
    name: cleanText(payload.customer?.name, "Cliente Yanbal"),
    phone: cleanText(payload.customer?.phone),
    email: cleanText(payload.customer?.email),
    city: cleanText(payload.customer?.city, "Cúcuta o Bogotá"),
    locality: cleanText(payload.customer?.locality),
    neighborhood: cleanText(payload.customer?.neighborhood),
    address: cleanText(payload.customer?.address),
    notes: cleanText(payload.customer?.notes, payload.notes),
  };

  const id = orderId();
  const cartForWhatsApp = validatedItems.map((item) => ({
    name: item.product.name,
    category: item.product.category,
    sku: item.product.sku,
    product_id: item.product.id,
    quantity: item.quantity,
    lineTotal: item.lineTotal,
  }));
  const whatsappUrl = buildCartWhatsAppUrl(cartForWhatsApp, customer, id);
  const subtotal = validatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const payment = cleanText(payload.payment, "whatsapp") === "mercadopago" ? "mercadopago" : "whatsapp";

  const order = {
    id,
    status: "nuevo",
    customer_name: customer.name,
    customer_phone: customer.phone || "Sin confirmar",
    customer_email: customer.email,
    city: customer.city,
    locality: customer.locality,
    neighborhood: customer.neighborhood,
    address: customer.address,
    notes: customer.notes,
    payment,
    subtotal,
    shipping: 0,
    total: subtotal,
    channel: payment,
    whatsapp_url: whatsappUrl,
    metadata: {
      source: "yanbal-c9-cart",
      item_count: validatedItems.length,
    },
  };

  const orderItems = validatedItems.map((item) => ({
    order_id: id,
    product_id: item.product.id,
    sku: item.product.sku,
    name: item.product.name,
    size: "",
    color: "",
    quantity: item.quantity,
    price: item.price,
    image: item.product.image,
    category: item.product.category,
  }));

  const persisted = await persistOrder(order, orderItems);

  if (payment === "mercadopago") {
    const checkout = await mercadoPagoCheckout({ request, order, items: orderItems, whatsappUrl });
    if (!checkout.checkoutUrl) {
      json(response, 503, {
        ok: false,
        orderId: id,
        persisted,
        total: subtotal,
        checkoutUrl: null,
        whatsappUrl: checkout.whatsappUrl,
        preferenceId: null,
        mercadoPagoConfigured: checkout.configured,
        error: checkout.error || "No se pudo abrir Mercado Pago para este pedido.",
      });
      return;
    }

    json(response, 200, {
      ok: true,
      orderId: id,
      persisted,
      total: subtotal,
      checkoutUrl: checkout.checkoutUrl,
      whatsappUrl: checkout.whatsappUrl,
      preferenceId: checkout.preferenceId || null,
      mercadoPagoConfigured: checkout.configured,
    });
    return;
  }

  json(response, 200, {
    ok: true,
    orderId: id,
    persisted,
    total: subtotal,
    checkoutUrl: null,
    whatsappUrl,
  });
}
