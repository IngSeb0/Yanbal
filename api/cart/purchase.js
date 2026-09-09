import { authorizedOrder, rpc } from "../../lib/orders.js";
import { json, method, readJson } from "../../lib/http.js";
export default async function handler(req, res) {
  if (!method(req, res, "POST")) return;
  try {
    const input = await readJson(req),
      order = await authorizedOrder(input.orderId, input.accessToken);
    if (
      !order ||
      order.payment_status !== "approved" ||
      input.analyticsConsent !== true
    )
      return json(res, 200, { ok: true, event: null });
    const claimed = await rpc("yanbal_claim_purchase", {
      p_order_id: order.id,
    });
    json(res, 200, {
      ok: true,
      event: claimed
        ? {
            transaction_id: order.id,
            value: order.subtotal,
            shipping: order.shipping,
            currency: "COP",
            items: order.items.map((l) => ({
              item_id: l.sku,
              item_name: l.name,
              item_category: l.category,
              price: l.price,
              quantity: l.quantity,
            })),
          }
        : null,
    });
  } catch {
    json(res, 503, { ok: false });
  }
}
