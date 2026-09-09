/* eslint-disable @next/next/no-html-link-for-pages -- Static export intentionally uses full-page navigation without React hydration. */
import type { Metadata } from "next";
import { store } from "../config/store.js";
import "./globals.css";
import "./commerce.css";
export const metadata: Metadata = {
  metadataBase: new URL(store.url),
  title: {
    default: "Productos Yanbal en oferta | Envíos Colombia",
    template: "%s | Yanbal Colombia",
  },
  description:
    "Compra perfumes, maquillaje y Total Block Yanbal en línea. Pago con Mercado Pago y envíos en Colombia, con atención en Cúcuta y Bogotá.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: store.name,
    images: [{ url: store.campaign.banner }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CO">
      <head>
        <script src="/conversion-tracking.js" defer />
        <script src="/commerce.js" defer />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Saltar al contenido
        </a>
        <div className="benefits-bar">
          Envío gratis en Cúcuta y Bogotá <span>·</span> Gratis desde $150.000
          en Colombia <span>·</span> Pedido mínimo $50.000
        </div>
        <header className="shop-header">
          <a className="shop-logo" href="/">
            YANBAL<span>Belleza en Colombia</span>
          </a>
          <nav aria-label="Navegación principal">
            <a href="/ofertas">Ofertas</a>
            <a href="/perfumes-yanbal">Perfumes</a>
            <a href="/maquillaje-yanbal">Maquillaje</a>
            <a href="/bloqueadores-total-block">Protección solar</a>
            <a href="/catalogo">Catálogo</a>
            <a href="/guias">Guías</a>
          </nav>
          <div className="header-actions">
            <a href="/catalogo#buscar" aria-label="Buscar productos">
              Buscar
            </a>
            <button type="button" data-cart-open>
              Carrito <span data-cart-count>0</span>
            </button>
            <details className="mobile-menu">
              <summary>Menú</summary>
              <div>
                <a href="/ofertas">Ofertas</a>
                <a href="/perfumes-yanbal">Perfumes</a>
                <a href="/maquillaje-yanbal">Maquillaje</a>
                <a href="/bloqueadores-total-block">Protección solar</a>
                <a href="/catalogo">Catálogo</a>
                <a href="/guias">Guías</a>
              </div>
            </details>
          </div>
        </header>
        <div id="main-content">{children}</div>
        <footer className="shop-footer">
          <div>
            <strong>{store.name}</strong>
            <p>Asesoría independiente. Atención antes y después de comprar.</p>
            <p>
              Envío gratis en Cúcuta y Bogotá; $14.000 en otros destinos y
              gratis desde $150.000. Pedido mínimo $50.000.
            </p>
          </div>
          <nav aria-label="Información">
            <a href="/yanbal-cucuta">Cúcuta</a>
            <a href="/yanbal-bogota">Bogotá</a>
            <a href="/yanbal-colombia">Colombia</a>
            <a href="/catalogo">Catálogo</a>
            <a href="/guias">Guías para elegir</a>
            <a href="/contacto">Contacto</a>
            <a href="/envios">Envíos</a>
            <a href="/cambios-y-devoluciones">Cambios y devoluciones</a>
            <a href="/privacidad">Privacidad</a>
            <a href="/terminos">Términos</a>
            <button type="button" data-consent-settings>
              Preferencias de medición
            </button>
          </nav>
          <a
            href={`https://wa.me/${store.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp 302 629 3535
          </a>
        </footer>
        <a
          className="help-fab"
          href={`https://wa.me/${store.whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          ¿Necesitas ayuda?
        </a>
        <dialog
          className="shop-cart"
          data-cart-dialog
          aria-labelledby="cart-title"
        >
          <header>
            <h2 id="cart-title">Tu carrito</h2>
            <button type="button" data-cart-close aria-label="Cerrar carrito">
              ×
            </button>
          </header>
          <div data-cart-items />
          <p data-cart-subtotal />
          <p>
            Pedido mínimo $50.000. Envío gratis en Cúcuta y Bogotá; $14.000 en
            otros destinos y gratis desde $150.000.
          </p>
          <a
            className="button button--primary"
            href="/checkout"
            data-checkout-link
          >
            Ir a pagar
          </a>
          <button
            className="button button--ghost"
            type="button"
            data-cart-close
          >
            Seguir comprando
          </button>
          <section data-cross-sell>
            <h3>También te puede gustar</h3>
            <div data-recommendations />
          </section>
        </dialog>
        <div className="toast" role="status" data-toast hidden />
        <aside
          className="consent-bar"
          data-consent-banner
          hidden
          aria-label="Preferencias de privacidad"
        >
          <p>
            Con tu permiso medimos visitas y compras para mejorar la tienda.
            Puedes comprar sin aceptar la medición.{" "}
            <a href="/privacidad">Privacidad</a>
          </p>
          <button type="button" data-consent="yes">
            Aceptar
          </button>
          <button type="button" data-consent="no">
            Rechazar
          </button>
        </aside>
      </body>
    </html>
  );
}
