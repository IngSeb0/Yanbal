import type { Metadata } from "next";
import { store } from "../../config/store.js";
export const metadata: Metadata = {
  title: "Cambios y devoluciones",
  alternates: { canonical: "/cambios-y-devoluciones" },
};
export default function Page() {
  return (
    <main className="shop-main shop-section policy-page">
      <h1>Cambios y devoluciones</h1>
      <p>
        Si un producto se agota después del pago, te contactaremos para
        ofrecerte un reemplazo o la devolución del valor correspondiente.
      </p>
      <p>
        Si recibes un producto distinto o con un inconveniente, contáctanos por
        WhatsApp con el número de pedido y una descripción del problema.
        Conserva el producto y su empaque mientras coordinamos la solución.
      </p>
      <p>
        Las solicitudes de cambio, garantía, retracto o reversión se atienden
        conforme a los derechos que correspondan a la compra y la normativa
        aplicable en Colombia. Esta página no limita tus derechos.
      </p>
      <p>
        No envíes datos de tarjeta por WhatsApp. Te indicaremos los pasos y
        condiciones aplicables a tu solicitud antes de realizar una devolución.
      </p>
      <a
        className="button button--ghost"
        href={`https://wa.me/${store.whatsapp}`}
        target="_blank"
        rel="noreferrer"
      >
        Consultar por WhatsApp
      </a>
    </main>
  );
}
