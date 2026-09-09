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
  title: "Yanbal Cúcuta | Productos de belleza, perfumes y bloqueadores",
  description:
    "Compra Yanbal en Cúcuta con asesoría local: perfumes, bloqueadores Total Block, maquillaje, cuidado facial y regalos de campaña con carrito y Mercado Pago.",
  keywords: [
    "Yanbal Cúcuta",
    "productos Yanbal Cúcuta",
    "perfumes Yanbal Cúcuta",
    "bloqueadores Yanbal Cúcuta",
    "productos de belleza Cúcuta",
    "comprar Yanbal en Cúcuta",
  ],
};

const cucutaProducts = Array.from(
  new Map(
    [...discountProducts, ...loveAndFriendshipProducts, ...storefrontProducts]
      .filter((product) =>
        /perfume|parfum|block|protección|solar|maquillaje|labial|amor/i.test(
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
  name: "Yanbal Cúcuta por WhatsApp",
  description:
    "Productos Yanbal con descuento para Cúcuta: perfumes, bloqueadores solares, maquillaje y regalos con pago por Mercado Pago o asesoría por WhatsApp.",
  telephone: "+573026293535",
  areaServed: { "@type": "City", name: "Cúcuta" },
  paymentAccepted: ["Mercado Pago", "WhatsApp"],
  url: "https://yanbal-promos-cucuta-bogota.vercel.app/cucuta",
  sameAs: [`https://wa.me/${whatsappNumber}`],
  makesOffer: cucutaProducts.slice(0, 12).map((product) => ({
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

export default function CucutaPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero local-page-hero" aria-labelledby="cucuta-title">
        <div className="hero__content">
          <p className="eyebrow">Yanbal Cúcuta</p>
          <h1 id="cucuta-title">Productos de belleza Yanbal en Cúcuta</h1>
          <p className="hero__copy">
            Encuentra perfumes Yanbal, bloqueadores Total Block, maquillaje,
            cuidado facial y regalos de campaña con asesoría local para Cúcuta.
            Agrega al carrito, paga seguro por Mercado Pago o confirma por
            WhatsApp Business.
          </p>
          <div className="hero__actions" aria-label="Acciones Yanbal Cúcuta">
            <a
              className="button button--primary button--whatsapp"
              href={whatsappLink("productos Yanbal en Cúcuta", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              Comprar por WhatsApp
            </a>
            <a className="button button--ghost" href="#yanbal-cucuta-productos">
              Ver productos en Cúcuta
            </a>
            <a className="button button--ghost" href="/bogota">
              Yanbal Bogotá
            </a>
            <a className="button button--ghost" href="/regalos-amor-amistad-colombia">
              Regalos Colombia
            </a>
            <a
              className="button button--ghost"
              href={whatsappLink("productos Yanbal en Cúcuta", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              WhatsApp 302 629 3535
            </a>
          </div>
        </div>
      </section>

      <section className="seo-panel seo-panel--topics" aria-labelledby="cucuta-seo-title">
        <div>
          <p className="eyebrow">Compra local</p>
          <h2 id="cucuta-seo-title">Yanbal cerca de ti en Cúcuta</h2>
          <p>
            Si buscas productos de belleza en Cúcuta, aquí puedes revisar
            precios de campaña, códigos y beneficios antes de comprar. Te ayudo
            a elegir perfumes para diario o regalo, bloqueadores solares para
            clima cálido, maquillaje y cuidado personal según disponibilidad.
          </p>
        </div>
        <div className="copy-grid copy-grid--seo">
          <article>
            <h3>Perfumes Yanbal Cúcuta</h3>
            <p>
              Fragancias femeninas y masculinas para regalo, uso diario o fechas
              especiales, con consulta rápida por WhatsApp.
            </p>
          </article>
          <article>
            <h3>Bloqueadores Total Block Cúcuta</h3>
            <p>
              Protección solar Yanbal para rostro, cuerpo y actividad al aire
              libre, ideal para el clima de la ciudad.
            </p>
          </article>
          <article>
            <h3>Maquillaje y cuidado facial</h3>
            <p>
              Productos con precio de campaña para armar rutina, regalo o pedido
              familiar desde el carrito.
            </p>
          </article>
        </div>
      </section>

      <section
        className="catalog product-catalog"
        id="yanbal-cucuta-productos"
        aria-labelledby="cucuta-products-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Productos destacados</p>
          <h2 id="cucuta-products-title">Ofertas Yanbal para Cúcuta</h2>
          <p>
            Selección útil para búsquedas locales: perfumes, protección solar,
            regalos, maquillaje y cuidado personal. Puedes añadir varios
            productos al carrito y pagar seguro por Mercado Pago.
          </p>
        </div>
        <div className="highlight-product-grid">
          {cucutaProducts.map((product) => (
            <ProductCatalogCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      <section className="security-panel" aria-labelledby="cucuta-security-title">
        <div>
          <p className="eyebrow">Datos protegidos</p>
          <h2 id="cucuta-security-title">Compra con confianza</h2>
          <p>
            Tus datos se usan solo para preparar y confirmar tu pedido. La
            tarjeta se procesa fuera de esta página, directamente en Mercado
            Pago.
          </p>
        </div>
        <ul className="security-list">
          <li>Atención por WhatsApp Business.</li>
          <li>Pago en línea con Mercado Pago.</li>
          <li>Confirmación de disponibilidad antes de entrega.</li>
        </ul>
      </section>

      <footer className="site-footer">
        <p>Yanbal Cúcuta</p>
        <div className="footer-links">
          <a href="/">Tienda principal</a>
          <a href="/bogota">Yanbal Bogotá</a>
          <a href="/regalables">Regalables</a>
          <a href="/catalogo">Catálogo separado</a>
        </div>
      </footer>

      <CartExperience footerLabel="Yanbal Cúcuta" />
    </main>
  );
}
