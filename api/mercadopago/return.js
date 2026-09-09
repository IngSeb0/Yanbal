export default function handler(req, res) {
  const url = new URL(req.url, "https://localhost"),
    query = new URLSearchParams();
  for (const key of ["orderId", "payment_id"])
    if (url.searchParams.has(key)) query.set(key, url.searchParams.get(key));
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.writeHead(303, { Location: `/pedido/pendiente?${query}` });
  res.end();
}
