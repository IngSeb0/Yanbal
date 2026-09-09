import type { Metadata } from "next";
import { store } from "../../config/store.js";
export const metadata: Metadata = {
  title: "Contacto y asesoría",
  alternates: { canonical: "/contacto" },
};
export default function Page() {
  return (
    <main className="shop-main shop-section policy-page">
      <h1>Contacto y asesoría</h1>
      <p>
        ¿Necesitas ayuda para elegir un aroma, un tono o conocer el estado de tu
        pedido? Estamos disponibles por WhatsApp antes y después de comprar.
      </p>
      <p>
        Atendemos Cúcuta, Bogotá y pedidos para Colombia según cobertura. Para
        seguimiento, comparte el número de pedido; no envíes información de
        tarjeta.
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
