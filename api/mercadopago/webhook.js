import crypto from "node:crypto";
import { json, method, readJson } from "../../lib/http.js";
import { fetchPayment, reconcilePayment } from "../../lib/orders.js";
const logWebhook = (level, outcome, fields = {}) =>
  console[level]("mercadopago_webhook", { outcome, ...fields });
export function validSignature(id, requestId, signature, secret) {
  if (!secret || !id || !requestId || !signature) return false;
  const parts = Object.fromEntries(
    signature.split(",").map((v) => v.trim().split("=")),
  );
  if (!/^\d+$/.test(parts.ts || "") || !/^[a-f0-9]{64}$/i.test(parts.v1 || ""))
    return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(
      `id:${String(id).toLowerCase()};request-id:${requestId};ts:${parts.ts};`,
    )
    .digest();
  return crypto.timingSafeEqual(expected, Buffer.from(parts.v1, "hex"));
}
export default async function handler(req, res) {
  if (!method(req, res, "POST")) return;
  const requestId = req.headers["x-request-id"];
  if (
    !process.env.MERCADO_PAGO_WEBHOOK_SECRET ||
    !process.env.MERCADO_PAGO_ACCESS_TOKEN
  ) {
    logWebhook("error", "configuration_missing", { requestId });
    return json(res, 503, { received: false });
  }
  try {
    const body = await readJson(req),
      url = new URL(req.url, "https://localhost"),
      id = url.searchParams.get("data.id");
    if (
      !validSignature(
        id,
        requestId,
        req.headers["x-signature"],
        process.env.MERCADO_PAGO_WEBHOOK_SECRET,
      )
    ) {
      logWebhook("warn", "invalid_signature", { requestId, paymentId: id });
      return json(res, 401, { received: false });
    }
    if (body.data?.id && String(body.data.id) !== id) {
      logWebhook("warn", "payment_id_mismatch", {
        requestId,
        paymentId: id,
      });
      return json(res, 400, { received: false });
    }
    if ((body.type || url.searchParams.get("type")) !== "payment") {
      logWebhook("info", "ignored_event_type", { requestId });
      return json(res, 200, { received: true });
    }
    const order = await reconcilePayment(await fetchPayment(id));
    logWebhook("info", order ? "reconciled" : "unknown_order", {
      requestId,
      paymentId: id,
      orderId: order?.id,
      paymentStatus: order?.payment_status,
    });
    json(res, 200, { received: true });
  } catch (error) {
    logWebhook("error", "retryable_failure", {
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    json(res, 503, { received: false });
  }
}
