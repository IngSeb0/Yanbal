import type { Metadata } from "next";
import { store } from "../../config/store.js";
export const metadata: Metadata = {
  title: "Términos de compra",
  alternates: { canonical: "/terminos" },
};
export default function Page() {
  return (
    <main className="shop-main shop-section policy-page">
      <h1>Términos de compra</h1>
      <p>
        Esta es una tienda de asesoría independiente; no se presenta como tienda
        oficial de Yanbal. Ofrecemos los productos y presentaciones indicados en
        el catálogo.
      </p>
      <p>
        Los precios se expresan en pesos colombianos. Antes del pago se muestran
        los productos, promociones, envío y total. Las promociones combinables
        requieren la cantidad indicada.
      </p>
      <p>
        El pedido mínimo es de $50.000. El envío es gratis en Cúcuta y Bogotá,
        y en los demás destinos desde $150.000. Para otros municipios, los
        pedidos entre $50.000 y $149.999 tienen un envío de $14.000.
      </p>
      <p>
        Puedes comprar como invitado. Debes proporcionar datos correctos para
        gestionar el pedido y la entrega. El pago completo se procesa mediante
        Mercado Pago; la confirmación depende de su aprobación.
      </p>
      <p>
        Los productos están sujetos a disponibilidad al procesar el pedido. Si
        alguno se agota después de comprar, podrás elegir un reemplazo o
        solicitar la devolución del valor correspondiente.
      </p>
      <p>
        La cobertura y los costos se consultan antes de pagar. Revisa las
        páginas de envíos, cambios y devoluciones y privacidad para más
        información. Para aclaraciones, contáctanos por WhatsApp.
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
