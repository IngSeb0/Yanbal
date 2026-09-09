import type { Metadata } from "next";
import { store } from "../../config/store.js";
export const metadata: Metadata = {
  title: "Envíos en Colombia",
  alternates: { canonical: "/envios" },
};
export default function Page() {
  return (
    <main className="shop-main shop-section policy-page">
      <h1>Envíos en Colombia</h1>
      <p>
        Atendemos pedidos para Colombia según cobertura de la logística, con
        atención prioritaria en Cúcuta y Bogotá.
      </p>
      <p>
        El pedido mínimo es de $50.000. El envío no tiene costo en Cúcuta ni
        Bogotá. Para los demás municipios cuesta $14.000 cuando el subtotal
        está entre $50.000 y $149.999, y es gratis desde $150.000.
      </p>
      <p>
        Selecciona tu departamento y municipio en el checkout. Verás el
        subtotal, el envío y el total exacto antes de pagar.
      </p>
      <p>
        El pedido se procesa una vez aprobado el pago. Preparamos los productos
        disponibles o los solicitamos a Yanbal y coordinamos el despacho. Los
        plazos dependen de la disponibilidad y la ubicación; no ofrecemos
        entrega inmediata garantizada.
      </p>
      <p>
        Para consultar cobertura o seguimiento, escríbenos por WhatsApp
        indicando únicamente el número de pedido.
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
