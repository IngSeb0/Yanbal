import {
  authorizedOrder,
  fetchPayment,
  reconcilePayment,
} from "../../lib/orders.js";
import { json, method, readJson } from "../../lib/http.js";
export default async function handler(req, res) {
  if (!method(req, res, "POST")) return;
  try {
    const input = await readJson(req);
    let order = await authorizedOrder(input.orderId, input.accessToken);
    if (!order)
      return json(res, 404, {
        ok: false,
        error: "No pudimos verificar el acceso a este pedido.",
      });
    if (input.paymentId) {
      const payment = await fetchPayment(input.paymentId);
      if (payment.external_reference !== order.id)
        return json(res, 400, {
          ok: false,
          error: "El pago no corresponde al pedido.",
        });
      order = await reconcilePayment(payment);
    }
    json(res, 200, {
      ok: true,
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.payment_status,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        city: order.customer.city,
        department: order.customer.department,
        paid: order.payment_status === "approved",
      },
    });
  } catch {
    json(res, 503, {
      ok: false,
      error: "No pudimos consultar el estado. Intenta nuevamente.",
    });
  }
}
