function json(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function requestUrl(request) {
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  const proto = request.headers["x-forwarded-proto"] || "https";
  return new URL(request.url, host ? `${proto}://${host}` : "https://yanbal-promos-cucuta-bogota.vercel.app");
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    json(response, 405, { ok: false, error: "Metodo no permitido" });
    return;
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    json(response, 200, {
      ok: false,
      configured: false,
      error: "Falta configurar MERCADO_PAGO_ACCESS_TOKEN en Vercel.",
    });
    return;
  }

  const url = requestUrl(request);
  const paymentId = url.searchParams.get("payment_id") || url.searchParams.get("id");
  if (!paymentId) {
    json(response, 400, { ok: false, configured: true, error: "Falta payment_id." });
    return;
  }

  try {
    const mercadoPagoResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const payment = await mercadoPagoResponse.json();

    if (!mercadoPagoResponse.ok) {
      json(response, mercadoPagoResponse.status, {
        ok: false,
        configured: true,
        error: payment.message || "No se pudo consultar el pago.",
      });
      return;
    }

    json(response, 200, {
      ok: true,
      configured: true,
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      external_reference: payment.external_reference,
      transaction_amount: payment.transaction_amount,
      currency_id: payment.currency_id,
    });
  } catch {
    json(response, 502, {
      ok: false,
      configured: true,
      error: "Mercado Pago no respondio la consulta.",
    });
  }
}
