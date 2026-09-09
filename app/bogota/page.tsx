/* eslint-disable @next/next/no-html-link-for-pages -- Static export uses full-page navigation. */
import type { Metadata } from "next";
import {
  CartExperience,
  ProductCatalogCard,
  whatsappLink,
  whatsappNumber,
} from "../storefront-ui";
import {
  discountProducts,
  loveAndFriendshipProducts,
  storefrontProducts,
} from "../product-selections";

export const metadata: Metadata = {
  title: "Yanbal Bogotá | Belleza, bloqueadores y perfumes con descuento",
  description:
    "Compra productos Yanbal en Bogotá: perfumes, bloqueadores Total Block SPF, maquillaje, cuidado facial y regalos con carrito, WhatsApp y Mercado Pago.",
  keywords: [
    "Yanbal Bogotá",
    "productos Yanbal Bogotá",
    "perfumes Yanbal Bogotá",
    "bloqueadores Yanbal Bogotá",
    "productos de belleza Bogotá",
    "comprar Yanbal en Bogotá",
  ],
};

const bogotaProducts = Array.from(
  new Map(
    [...discountProducts, ...loveAndFriendshipProducts, ...storefrontProducts]
      .filter((product) =>
        /perfume|parfum|block|spf|maquillaje|facial|joyería|collar|labial/i.test(
          `${product.name} ${product.category} ${product.description ?? ""}`,
        ),
      )
      .slice(0, 18)
      .map((product) => [product.id, product]),
  ).values(),
);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Yanbal Bogotá por WhatsApp",
  description:
    "Productos Yanbal con descuento para Bogotá: perfumes, bloqueadores Total Block, maquillaje, cuidado facial y regalos con pago por Mercado Pago.",
  telephone: "+573026293535",
  areaServed: { "@type": "City", name: "Bogotá" },
  paymentAccepted: ["Mercado Pago", "WhatsApp"],
  url: "https://yanbal-promos-cucuta-bogota.vercel.app/bogota",
  sameAs: [`https://wa.me/${whatsappNumber}`],
  makesOffer: bogotaProducts.slice(0, 12).map((product) => ({
    "@type": "Offer",
    priceCurrency: "COP",
    price: String(product.promo_price ?? product.price),
    itemOffered: {
      "@type": "Product",
      name: `Yanbal ${product.name}`,
      sku: product.sku,
      category: product.category,
      image: product.image,
    },
  })),
};

export default function BogotaPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero local-page-hero" aria-labelledby="bogota-title">
        <div className="hero__content">
          <p className="eyebrow">Yanbal Bogotá</p>
          <h1 id="bogota-title">Productos Yanbal en Bogotá</h1>
          <p className="hero__copy">
            Compra perfumes Yanbal, bloqueadores solares Total Block, maquillaje
            y regalos de campaña para Bogotá. Arma tu carrito, paga seguro por
            Mercado Pago o solicita asesoría por WhatsApp Business.
          </p>
          <div className="hero__actions" aria-label="Acciones Yanbal Bogotá">
            <a
              className="button button--primary button--whatsapp"
              href={whatsappLink("productos Yanbal en Bogotá", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              Comprar por WhatsApp
            </a>
            <a className="button button--ghost" href="#yanbal-bogota-productos">
              Ver productos en Bogotá
            </a>
            <a className="button button--ghost" href="/cucuta">
              Yanbal Cúcuta
            </a>
            <a className="button button--ghost" href="/regalos-amor-amistad-colombia">
              Regalos Colombia
            </a>
            <a
              className="button button--ghost"
              href={whatsappLink("productos Yanbal en Bogotá", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              WhatsApp 302 629 3535
            </a>
          </div>
        </div>
      </section>

      <section className="seo-panel seo-panel--topics" aria-labelledby="bogota-seo-title">
        <div>
          <p className="eyebrow">Belleza en Bogotá</p>
          <h2 id="bogota-seo-title">Perfumes, maquillaje y bloqueadores Yanbal en Bogotá</h2>
          <p>
            Esta página está pensada para búsquedas locales de belleza en
            Bogotá. Puedes comparar productos Yanbal de campaña, consultar
            códigos, agregar al carrito y finalizar con pago seguro o WhatsApp.
          </p>
        </div>
        <div className="copy-grid copy-grid--seo">
          <article>
            <h3>Perfumes Yanbal Bogotá</h3>
            <p>
              Opciones femeninas y masculinas para uso personal o regalos, con
              precios de campaña y confirmación directa.
            </p>
          </article>
          <article>
            <h3>Bloqueadores Yanbal Total Block</h3>
            <p>
              Protección SPF para ciudad, deporte y rutina diaria, con productos
              para rostro y cuerpo según disponibilidad.
            </p>
          </article>
          <article>
            <h3>Regalos y maquillaje Yanbal</h3>
            <p>
              Combos, labiales, iluminadores, joyería y cuidado facial para
              armar detalles listos para entregar.
            </p>
          </article>
        </div>
      </section>

      <section
        className="catalog product-catalog"
        id="yanbal-bogota-productos"
        aria-labelledby="bogota-products-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Productos destacados</p>
          <h2 id="bogota-products-title">Ofertas Yanbal para Bogotá</h2>
          <p>
            Selección enfocada en lo que más busca la gente: perfumes,
            bloqueadores, maquillaje, cuidado facial y regalos Yanbal con precio
            de campaña.
          </p>
        </div>
        <div className="highlight-product-grid">
          {bogotaProducts.map((product) => (
            <ProductCatalogCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      <section className="security-panel" aria-labelledby="bogota-security-title">
        <div>
          <p className="eyebrow">Pago protegido</p>
          <h2 id="bogota-security-title">Tus datos y tu pago están protegidos</h2>
          <p>
            El sitio usa HTTPS y cabeceras de seguridad. El pago se procesa en
            Mercado Pago y los datos de contacto se usan solo para confirmar tu
            pedido Yanbal.
          </p>
        </div>
        <ul className="security-list">
          <li>No se guardan datos de tarjeta en la tienda.</li>
          <li>Confirmación por WhatsApp Business.</li>
          <li>Carrito con productos y precios visibles.</li>
        </ul>
      </section>

      <footer className="site-footer">
        <p>Yanbal Bogotá</p>
        <div className="footer-links">
          <a href="/">Tienda principal</a>
          <a href="/cucuta">Yanbal Cúcuta</a>
          <a href="/regalables">Regalables</a>
          <a href="/catalogo">Catálogo separado</a>
        </div>
      </footer>

      <CartExperience footerLabel="Yanbal Bogotá" />
    </main>
  );
}
