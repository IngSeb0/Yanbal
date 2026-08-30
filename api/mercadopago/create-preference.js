import { productById, whatsappFallback, whatsappNumber } from "../../lib/mercadopago-products.js";

function redirect(response, location) {
  response.setHeader("Cache-Control", "no-store");
  response.writeHead(303, { Location: location });
  response.end();
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function originFromRequest(request) {
  const proto = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers["x-forwarded-host"] || request.headers.host;
  return host ? `${proto}://${host}` : "https://yanbal-promos-cucuta-bogota.vercel.app";
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.setHeader("Cache-Control", "no-store");
    response.statusCode = 405;
    response.end("Método no permitido");
    return;
  }

  const body = await readBody(request);
  const params = new URLSearchParams(body);
  const productId = params.get("productId") || "";
  const product = productById(productId);

  if (!product) {
    response.setHeader("Cache-Control", "no-store");
    response.statusCode = 400;
    response.end("Producto no válido");
    return;
  }

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) {
    redirect(response, whatsappFallback(product));
    return;
  }

  const origin = originFromRequest(request);
  const returnBase = `${origin}/api/mercadopago/return?productId=${encodeURIComponent(productId)}`;
  const preference = {
    items: [
      {
        id: productId,
        title: product.title,
        quantity: 1,
        currency_id: "COP",
        unit_price: product.unit_price,
      },
    ],
    back_urls: {
      success: `${returnBase}&status=success`,
      failure: `${returnBase}&status=failure`,
      pending: `${returnBase}&status=pending`,
    },
    notification_url: `${origin}/api/mercadopago/webhook`,
    auto_return: "approved",
    external_reference: productId,
    metadata: {
      product_id: productId,
      product_name: product.title,
      whatsapp: whatsappNumber,
      channel: "yanbal-c9-web",
    },
    statement_descriptor: "YANBAL",
  };

  let checkout;
  try {
    const mercadoPagoResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    if (!mercadoPagoResponse.ok) {
      redirect(response, whatsappFallback(product));
      return;
    }

    checkout = await mercadoPagoResponse.json();
  } catch {
    redirect(response, whatsappFallback(product));
    return;
  }

  const redirectUrl =
    process.env.MERCADO_PAGO_USE_SANDBOX === "true"
      ? checkout.sandbox_init_point
      : checkout.init_point;

  redirect(response, redirectUrl || whatsappFallback(product));
}
