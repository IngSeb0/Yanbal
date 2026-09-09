import type { Metadata } from "next";
import { notFound } from "next/navigation";
export const metadata: Metadata = {
  title: "Estado de tu pedido",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export function generateStaticParams() {
  return ["exitoso", "pendiente", "error"].map((estado) => ({ estado }));
}
export default async function Order({
  params,
}: {
  params: Promise<{ estado: string }>;
}) {
  const { estado } = await params;
  if (!["exitoso", "pendiente", "error"].includes(estado)) notFound();
  return (
    <main className="shop-main shop-section order-result" data-order-result>
      <p className="eyebrow">Tu compra Yanbal</p>
      <h1 data-order-title>Verificando el estado de tu pedido</h1>
      <p data-order-message>
        Consultamos la confirmación del pago antes de mostrar el resultado.
      </p>
      <div data-order-summary />
      <div className="buy-buttons">
        <button
          className="button button--primary"
          type="button"
          data-refresh-order
        >
          Revisar estado
        </button>
        <a className="button button--ghost" href="/checkout" data-retry hidden>
          Intentar nuevamente / usar otro medio de pago
        </a>
        <a href="/contacto" data-order-support>
          Necesito ayuda por WhatsApp
        </a>
      </div>
      <section data-order-next hidden>
        <h2>¿Qué sigue?</h2>
        <ol>
          <li>Procesamos tu pedido.</li>
          <li>Preparamos o solicitamos los productos correspondientes.</li>
          <li>Coordinamos el despacho.</li>
          <li>Recibes seguimiento de tu compra.</li>
        </ol>
      </section>
    </main>
  );
}
