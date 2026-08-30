async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

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

function extractNotification(url, payload) {
  return {
    topic:
      payload.type ||
      payload.topic ||
      url.searchParams.get("type") ||
      url.searchParams.get("topic") ||
      "unknown",
    id:
      payload.data?.id ||
      payload.resource ||
      payload.id ||
      url.searchParams.get("data.id") ||
      url.searchParams.get("id") ||
      "",
  };
}

async function fetchPayment(paymentId, accessToken) {
  const mercadoPagoResponse = await fetch(
    `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!mercadoPagoResponse.ok) {
    return null;
  }

  return mercadoPagoResponse.json();
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    json(response, 405, { received: false, error: "Metodo no permitido" });
    return;
  }

  const url = requestUrl(request);
  const body = await readBody(request);
  let payload = {};

  try {
    payload = body ? JSON.parse(body) : {};
  } catch {
    payload = {};
  }

  const notification = extractNotification(url, payload);
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const shouldVerifyPayment =
    accessToken && notification.id && ["payment", "payments"].includes(notification.topic);
  const payment = shouldVerifyPayment ? await fetchPayment(notification.id, accessToken) : null;

  json(response, 200, {
    received: true,
    topic: notification.topic,
    id: notification.id,
    verified: Boolean(payment),
    payment_status: payment?.status || null,
    external_reference: payment?.external_reference || null,
  });
}
