import crypto from "node:crypto";
import { restSelect, supabaseRequest } from "./supabase-rest.js";
export const digest = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
export const rpc = (name, body) =>
  supabaseRequest(
    `/rest/v1/rpc/${name}`,
    { method: "POST", body },
    { service: true },
  );
export async function getOrder(id) {
  if (!/^YAN-[0-9]{4}-[A-F0-9-]{16,36}$/.test(id || "")) return null;
  const rows = await restSelect(
    `yanbal_orders?id=eq.${encodeURIComponent(id)}&select=*`,
    { service: true },
  );
  return rows[0] || null;
}
export async function authorizedOrder(id, token) {
  if (!/^[a-f0-9]{64}$/.test(token || "")) return null;
  const order = await getOrder(id);
  return order && order.access_hash === digest(token) ? order : null;
}
export async function updateOrder(id, patch) {
  return supabaseRequest(
    `/rest/v1/yanbal_orders?id=eq.${encodeURIComponent(id)}`,
    { method: "PATCH", body: patch },
    { service: true },
  );
}
export async function fetchPayment(id) {
  if (!/^\d+$/.test(String(id))) throw new Error("Invalid payment identifier");
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error("Payment verification unavailable");
  return res.json();
}
export async function reconcilePayment(payment) {
  const order = await getOrder(payment.external_reference);
  if (!order) return null;
  if (
    payment.currency_id !== "COP" ||
    Number(payment.transaction_amount) !== Number(order.total)
  )
    throw new Error("Payment amount mismatch");
  if (
    process.env.MERCADO_PAGO_COLLECTOR_ID &&
    String(payment.collector_id) !== process.env.MERCADO_PAGO_COLLECTOR_ID
  )
    throw new Error("Payment collector mismatch");
  if (payment.live_mode !== (process.env.MERCADO_PAGO_USE_SANDBOX !== "true"))
    throw new Error("Payment environment mismatch");
  await rpc("yanbal_apply_payment", {
    p_order_id: order.id,
    p_payment_id: String(payment.id),
    p_status: payment.status,
    p_updated: payment.date_last_updated || payment.date_created,
  });
  return getOrder(order.id);
}
