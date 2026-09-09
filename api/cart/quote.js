import { cartLines } from "../../lib/commerce-products.js";
import { shippingQuote } from "../../lib/shipping.js";
import { json, method, readJson } from "../../lib/http.js";
export default async function handler(req, res) {
  if (!method(req, res, "POST")) return;
  try {
    const input = await readJson(req),
      items = cartLines(input.items);
    const subtotal = items.reduce((s, l) => s + l.price * l.quantity, 0);
    const quote = shippingQuote(input.departmentCode, input.cityCode, subtotal);
    json(res, 200, { ok: true, items, subtotal, ...quote });
  } catch (e) {
    json(res, 400, { ok: false, error: e.message });
  }
}
