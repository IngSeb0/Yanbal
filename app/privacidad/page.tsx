import type { Metadata } from "next";
import { store } from "../../config/store.js";
export const metadata: Metadata = {
  title: "Política de privacidad",
  alternates: { canonical: "/privacidad" },
};
export default function Page() {
  return (
    <main className="shop-main shop-section policy-page">
      <h1>Política de privacidad</h1>
      <p>
        Somos una tienda de asesoría independiente de productos Yanbal. Puedes
        contactarnos en el WhatsApp 302 629 3535 para consultas sobre el
        tratamiento de tus datos.
      </p>
      <p>
        Usamos nombre, celular, email, dirección, barrio y ubicación para
        registrar el pedido, procesar la entrega y dar soporte. Los pedidos se
        almacenan en nuestra base de datos con acceso restringido.
      </p>
      <p>
        Mercado Pago procesa el pago y recibe la información necesaria para
        ello. No almacenamos los datos de tu tarjeta. La información de entrega
        se comparte con los participantes necesarios para gestionar el despacho.
      </p>
      <p>
        Con tu consentimiento usamos Google Tag Manager y herramientas de
        medición para conocer visitas, productos consultados y compras.
        Asociamos parámetros de campaña al pedido cuando autorizas la medición.
        No enviamos nombre, celular, email ni dirección a dataLayer.
      </p>
      <p>
        Puedes aceptar o rechazar la medición sin afectar tu compra, y cambiar
        tus preferencias en el pie de página. El carrito se conserva en este
        navegador durante 30 días; los datos del formulario no se guardan
        localmente.
      </p>
      <p>
        Puedes solicitar consulta, corrección o eliminación de tus datos por
        nuestro canal de contacto. Conservamos la información del pedido durante
        el tiempo necesario para gestionar la compra y cumplir las obligaciones
        aplicables. No usamos tus datos para campañas de mensajes sin
        autorización.
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
