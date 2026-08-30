import type { Metadata } from "next";
import { whatsappLink } from "../storefront-ui";

type SearchValue = string | string[] | undefined;
type SearchParams = Record<string, SearchValue> | URLSearchParams;

export const metadata: Metadata = {
  title: "Gracias por tu compra Yanbal",
  description:
    "Confirmación de pago Yanbal para pedidos en Cúcuta y Bogotá.",
  robots: {
    index: false,
    follow: false,
  },
};

const statusCopy = {
  success: {
    eyebrow: "Pago recibido",
    title: "Gracias, recibimos tu pago",
    copy:
      "Tu pedido Yanbal quedó registrado. Te escribiré por WhatsApp Business para confirmar disponibilidad, entrega y datos finales.",
  },
  approved: {
    eyebrow: "Pago aprobado",
    title: "Gracias, recibimos tu pago",
    copy:
      "Tu pedido Yanbal quedó registrado. Te escribiré por WhatsApp Business para confirmar disponibilidad, entrega y datos finales.",
  },
  pending: {
    eyebrow: "Pago en revisión",
    title: "Gracias, tu pago está pendiente",
    copy:
      "Mercado Pago está revisando la transacción. Puedes confirmar por WhatsApp para separar el pedido mientras se actualiza el estado.",
  },
  failure: {
    eyebrow: "Pago no finalizado",
    title: "Te ayudo a terminar la compra",
    copy:
      "El intento de pago no se completó. Escríbeme por WhatsApp y revisamos otra forma de finalizar tu pedido Yanbal.",
  },
  rejected: {
    eyebrow: "Pago rechazado",
    title: "Te ayudo a terminar la compra",
    copy:
      "El intento de pago fue rechazado. Escríbeme por WhatsApp y revisamos otra forma de finalizar tu pedido Yanbal.",
  },
} as const;

async function resolveParams(searchParams?: SearchParams | Promise<SearchParams>) {
  const resolved = await searchParams;

  if (!resolved) {
    return {};
  }

  if (typeof (resolved as URLSearchParams).get === "function") {
    const params = resolved as URLSearchParams;
    return Object.fromEntries(params.entries());
  }

  return resolved as Record<string, SearchValue>;
}

function paramValue(params: Record<string, SearchValue>, key: string) {
  const value = params[key];

  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

export default async function GraciasPage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const params = await resolveParams(searchParams);
  const status = paramValue(params, "status").toLowerCase();
  const copy = statusCopy[status as keyof typeof statusCopy] || statusCopy.pending;
  const orderId = paramValue(params, "orderId");
  const product = paramValue(params, "product");
  const reference = paramValue(params, "reference");
  const whatsappHref =
    paramValue(params, "wa") ||
    whatsappLink("mi pedido Yanbal pagado por Mercado Pago", "confirmar disponibilidad");

  return (
    <main>
      <section className="hero thanks-hero" aria-labelledby="thanks-title">
        <div className="hero__content">
          <p className="eyebrow" data-thanks-eyebrow>{copy.eyebrow}</p>
          <h1 id="thanks-title" data-thanks-title>{copy.title}</h1>
          <p className="hero__copy" data-thanks-copy>{copy.copy}</p>
          <div className="hero__actions" aria-label="Acciones posteriores al pago">
            <a
              className="button button--primary"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              data-thanks-whatsapp
            >
              Confirmar por WhatsApp
            </a>
            <a className="button button--ghost" href="/#descuentos">
              Volver a descuentos
            </a>
            <a className="button button--ghost" href="/regalables">
              Ver regalables
            </a>
          </div>
        </div>
      </section>

      <section className="promo-strip" aria-label="Resumen de confirmación">
        <div>
          <strong>Mercado Pago</strong>
          <span data-thanks-status-line>estado: {copy.eyebrow.toLowerCase()}</span>
        </div>
        <div>
          <strong data-thanks-order>{orderId || "Pedido Yanbal"}</strong>
          <span data-thanks-product>{product || "Producto o carrito de campaña"}</span>
        </div>
        <div>
          <strong>Cúcuta y Bogotá</strong>
          <span>confirmación y entrega por WhatsApp Business</span>
        </div>
      </section>

      <section className="thanks-panel" aria-labelledby="next-steps-title">
        <div className="section-heading">
          <p className="eyebrow">Siguiente paso</p>
          <h2 id="next-steps-title">Confirmación del pedido</h2>
          <p>
            Guarda esta pantalla y abre WhatsApp para dejar el pedido listo. Si
            pagaste un carrito completo, usaré el número de pedido para revisar
            productos, cantidades y disponibilidad.
          </p>
        </div>

        <div className="thanks-status" data-thanks-status-list>
          <span className="status-pill">{copy.eyebrow}</span>
          {reference ? <span>Referencia Mercado Pago: {reference}</span> : null}
          {orderId ? <span>Pedido: {orderId}</span> : null}
        </div>

        <div className="thanks-steps">
          <article>
            <span>1</span>
            <h3>Reviso el pago</h3>
            <p>Valido el estado de Mercado Pago y el detalle del pedido.</p>
          </article>
          <article>
            <span>2</span>
            <h3>Confirmo disponibilidad</h3>
            <p>Te aviso si el producto está disponible en la campaña actual.</p>
          </article>
          <article>
            <span>3</span>
            <h3>Coordinamos entrega</h3>
            <p>Definimos entrega local en Cúcuta, Bogotá u otra ciudad.</p>
          </article>
        </div>

        <a
          className="order-link thanks-whatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          data-thanks-whatsapp
        >
          Abrir WhatsApp Business <span aria-hidden="true">&gt;</span>
        </a>
      </section>

      <footer className="site-footer">
        <p>Gracias por comprar Yanbal</p>
        <div className="footer-links">
          <a href="/">Volver a la tienda</a>
          <a href="/catalogo">Catálogo separado</a>
          <a href="/regalables">Regalables Amor y Amistad</a>
        </div>
      </footer>

      <script src="/payment-thanks.js" defer></script>
    </main>
  );
}
