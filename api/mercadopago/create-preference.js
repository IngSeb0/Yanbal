import { json } from "../../lib/http.js";
export default function handler(req, res) {
  json(res, 410, {
    ok: false,
    error: "Agrega el producto al carrito y completa tus datos de entrega.",
    url: "/checkout",
  });
}
