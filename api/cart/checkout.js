import crypto from "node:crypto";
import { cartLines } from "../../lib/commerce-products.js";
import { store } from "../../config/store.js";
import { shippingQuote } from "../../lib/shipping.js";
import { hasSupabaseConfig } from "../../lib/supabase-rest.js";
import { digest, rpc, updateOrder } from "../../lib/orders.js";
import { json, method, readJson } from "../../lib/http.js";
export function validateCustomer(input = {}) {
  const fields = {},
    c = {};
  for (const key of [
    "name",
    "phone",
    "email",
    "address",
    "neighborhood",
    "complement",
    "reference",
    "notes",
    "departmentCode",
    "cityCode",
  ])
    c[key] = String(input[key] || "")
      .trim()
      .slice(0, key === "notes" ? 500 : 240);
  c.phone = c.phone.replace(/[\s()+.-]/g, "").replace(/^57(?=3\d{9}$)/, "");
  if (c.name.length < 3) fields.name = "Escribe tu nombre completo.";
  if (!/^3\d{9}$/.test(c.phone))
    fields.phone = "Escribe un celular colombiano de 10 dígitos.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))
    fields.email = "Revisa tu correo electrónico.";
  if (c.address.length < 5) fields.address = "Escribe la dirección de entrega.";
  if (!c.neighborhood) fields.neighborhood = "Escribe el barrio.";
  if (!c.departmentCode) fields.departmentCode = "Selecciona el departamento.";
  if (!c.cityCode) fields.cityCode = "Selecciona el municipio.";
  return { customer: c, fields };
}
export default async function handler(req, res) {
  if (!method(req, res, "POST")) return;
  let input, items, customer, quote, subtotal;
  try {
    input = await readJson(req);
    const validation = validateCustomer(input.customer);
    if (Object.keys(validation.fields).length)
      return json(res, 400, {
        ok: false,
        error: "Revisa los datos de entrega.",
        fields: validation.fields,
      });
    customer = validation.customer;
    items = cartLines(input.items);
    subtotal = items.reduce((s, l) => s + l.price * l.quantity, 0);
    quote = shippingQuote(customer.departmentCode, customer.cityCode, subtotal);
    if (!quote.configured)
      return json(res, 422, { ok: false, error: quote.message });
    if (!quote.checkoutEligible)
      return json(res, 422, {
        ok: false,
        error: quote.message,
        minimumOrder: quote.minimumOrder,
        amountToMinimum: quote.amountToMinimum,
      });
    if (input.acceptedTotal !== quote.total)
      return json(res, 409, {
        ok: false,
        error: "El total cambió. Revisa el resumen actualizado antes de pagar.",
      });
    if (!/^[a-zA-Z0-9-]{20,80}$/.test(input.idempotencyKey || ""))
      throw new Error("Actualiza el resumen e intenta nuevamente.");
  } catch (e) {
    return json(res, 400, { ok: false, error: e.message });
  }
  if (
    !process.env.MERCADO_PAGO_ACCESS_TOKEN ||
    !process.env.MERCADO_PAGO_WEBHOOK_SECRET ||
    !hasSupabaseConfig({ service: true })
  )
    return json(res, 503, {
      ok: false,
      error:
        "El pago en línea no está disponible por el momento. Tu carrito se conserva.",
    });
  try {
    const attribution = {};
    if (input.analyticsConsent === true)
      for (const key of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "gclid",
      ]) {
        if (typeof input.attribution?.[key] === "string")
          attribution[key] = input.attribution[key].slice(0, 180);
      }
    const token = crypto.randomBytes(32).toString("hex"),
      id = `YAN-${new Date().getUTCFullYear()}-${crypto.randomUUID().toUpperCase()}`;
    const row = await rpc("yanbal_create_order", {
      p_order: {
        id,
        access_hash: digest(token),
        checkout_key: input.idempotencyKey,
        customer: {
          ...customer,
          city: quote.city.name,
          department: quote.city.department,
        },
        items,
        subtotal,
        shipping: quote.shipping,
        total: quote.total,
        attribution,
      },
    });
    if (!row.created)
      return json(res, 409, {
        ok: false,
        error:
          "Este intento ya fue registrado. Revisa el estado de tu pedido antes de iniciar otro.",
      });
    const origin = process.env.SITE_URL || store.url;
    const back = (status) =>
      `${origin}/pedido/${status}?orderId=${id}#access=${token}`;
    const mpItems = items.map((l) => ({
      id: l.id,
      title: `${l.name}${l.unitsPerPack > 1 ? " (paquete de 2)" : ""}`.slice(
        0,
        250,
      ),
      currency_id: "COP",
      quantity: l.quantity,
      unit_price: l.price,
    }));
    if (quote.shipping > 0)
      mpItems.push({
        id: "shipping",
        title: "Envío estándar",
        currency_id: "COP",
        quantity: 1,
        unit_price: quote.shipping,
      });
    const mp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: mpItems,
        external_reference: id,
        back_urls: {
          success: back("exitoso"),
          pending: back("pendiente"),
          failure: back("error"),
        },
        notification_url: `${origin}/api/mercadopago/webhook`,
        auto_return: "approved",
        payer: { email: customer.email },
        metadata: { order_id: id },
        statement_descriptor: "YANBAL",
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!mp.ok) {
      await updateOrder(id, { payment_status: "preference_failed" });
      return json(res, 502, {
        ok: false,
        orderId: id,
        accessToken: token,
        error:
          "No pudimos abrir Mercado Pago. Puedes reintentar; tu carrito se conserva.",
      });
    }
    const preference = await mp.json();
    const checkoutUrl =
      process.env.MERCADO_PAGO_USE_SANDBOX === "true"
        ? preference.sandbox_init_point
        : preference.init_point;
    if (
      !checkoutUrl ||
      !/^https:\/\/([a-z0-9-]+\.)*mercadopago\.com(\.co)?\//i.test(checkoutUrl)
    )
      throw new Error("Invalid checkout URL");
    await updateOrder(id, {
      preference_id: String(preference.id),
      status: "PAYMENT_PENDING",
      payment_status: "pending",
    });
    json(res, 200, {
      ok: true,
      orderId: id,
      accessToken: token,
      checkoutUrl,
      total: quote.total,
    });
  } catch {
    json(res, 503, {
      ok: false,
      error:
        "No pudimos preparar el pago de forma segura. Tu carrito se conserva; revisa el estado si ya abriste Mercado Pago.",
    });
  }
}
