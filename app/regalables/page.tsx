/* eslint-disable @next/next/no-html-link-for-pages -- Static export uses full-page navigation. */
import type { Metadata } from "next";
import {
  CartExperience,
  ProductCatalogCard,
  whatsappLink,
  whatsappNumber,
} from "../storefront-ui";
import {
  giftSections,
  giftableProducts,
  loveAndFriendshipProducts,
} from "../product-selections";

export const metadata: Metadata = {
  title: "Regalables Yanbal Amor y Amistad",
  description:
    "Regalos Yanbal para Amor y Amistad en Cúcuta y Bogotá: Ohm, Collar Amira, Dulce Amor, Combo Soy Única, iluminador, bálsamo, perfumes y joyería.",
  keywords: [
    "regalos Yanbal Amor y Amistad",
    "regalables Yanbal Cúcuta",
    "regalables Yanbal Bogotá",
    "Dulce Amor Yanbal",
    "Ohm Yanbal",
    "Combo Soy Única",
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Regalables Yanbal Amor y Amistad",
  description:
    "Selección de productos Yanbal para regalar en Amor y Amistad con atención local en Cúcuta y Bogotá.",
  telephone: "+573026293535",
  areaServed: [
    { "@type": "City", name: "Cúcuta" },
    { "@type": "City", name: "Bogotá" },
  ],
  mainEntity: loveAndFriendshipProducts.map((product) => ({
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    category: product.category,
    image: product.image,
    offers: {
      "@type": "Offer",
      priceCurrency: "COP",
      price: String(product.promo_price ?? product.price),
      availability: "https://schema.org/InStock",
      url: `https://wa.me/${whatsappNumber}`,
    },
  })),
};

export default function RegalablesPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero gift-page-hero" aria-labelledby="gift-title">
        <div className="hero__content">
          <p className="eyebrow">Regalables Yanbal</p>
          <h1 id="gift-title">Amor y Amistad con descuento</h1>
          <p className="hero__copy">
            Encuentra regalos Yanbal para sorprender en Cúcuta y Bogotá:
            perfumes, joyería, maquillaje, bálsamos, iluminadores y combos con
            precio de campaña. Agrega al carrito y confirma por WhatsApp.
          </p>
          <div className="hero__actions" aria-label="Acciones de regalables">
            <a
              className="button button--primary button--whatsapp"
              href={whatsappLink("regalables Yanbal Amor y Amistad", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              Comprar por WhatsApp
            </a>
            <a className="button button--ghost" href="#amor-amistad-regalos">
              Ver recomendados
            </a>
            <a className="button button--ghost" href="#regalables-categorias">
              Ver más regalos
            </a>
            <a className="button button--ghost" href="/" >
              Ir a descuentos
            </a>
            <a className="button button--ghost" href="#carrito-regalables" data-cart-open>
              Carrito <span className="cart-count-inline" data-cart-count hidden>0</span>
            </a>
            <a
              className="button button--ghost"
              href={whatsappLink("regalables Yanbal Amor y Amistad", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              WhatsApp 302 629 3535
            </a>
          </div>
        </div>
      </section>

      <section className="promo-strip" aria-label="Resumen de regalos">
        <div>
          <strong>Amor y Amistad</strong>
          <span>regalos listos para elegir</span>
        </div>
        <div>
          <strong>{giftableProducts.length} opciones</strong>
          <span>productos del C9 con enfoque regalo</span>
        </div>
        <div>
          <strong>Cúcuta y Bogotá</strong>
          <span>asesoría local por WhatsApp</span>
        </div>
      </section>

      <section className="catalog product-catalog love-section" id="amor-amistad-regalos" aria-labelledby="gift-love-title">
        <div className="section-heading">
          <p className="eyebrow">Selección especial</p>
          <h2 id="gift-love-title">Los seis regalables recomendados</h2>
          <p>
            Para una compra rápida, esta selección reúne Ohm para él, Collar
            Amira, Dulce Amor, Combo Soy Única, Jelly Stick iluminador y
            Bálsamo Lip Oil Balm. Son productos con buena intención de búsqueda
            local para regalos Yanbal en Cúcuta y Bogotá.
          </p>
        </div>
        <div className="highlight-product-grid">
          {loveAndFriendshipProducts.map((product) => (
            <ProductCatalogCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      <section className="catalog product-catalog" id="regalables-categorias" aria-labelledby="gift-categories-title">
        <div className="section-heading">
          <p className="eyebrow">Más ideas de regalo</p>
          <h2 id="gift-categories-title">Regalables separados por intención</h2>
          <p>
            Si buscas algo más específico, revisa perfumes para regalar, joyería
            y detalles de maquillaje o cuidado personal. Cada producto puede
            agregarse al carrito.
          </p>
        </div>

        <div className="defined-product-groups gift-groups">
          {giftSections.map((section) => (
            <details className="defined-product-group" key={section.title} open>
              <summary>
                <span>{section.title}</span>
                <strong>{section.products.length} productos</strong>
              </summary>
              <p className="group-description">{section.description}</p>
              <div className="defined-product-list">
                {section.products.map((product) => (
                  <ProductCatalogCard key={product.id} product={product} />
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="cart-anchor" id="carrito-regalables" aria-labelledby="gift-cart-title">
        <div className="section-heading">
          <p className="eyebrow">Carrito</p>
          <h2 id="gift-cart-title">Arma tu regalo antes de confirmar</h2>
          <p>
            Puedes combinar perfume, joyería, maquillaje y cuidado personal en
            un solo pedido para pagarlo seguro por Mercado Pago o enviarlo por
            WhatsApp si quieres confirmar disponibilidad primero.
          </p>
        </div>
        <button className="button button--primary" type="button" data-cart-open>
          Ver carrito <span data-cart-count hidden>0</span>
        </button>
      </section>

      <footer className="site-footer">
        <p>Regalables Yanbal C9</p>
        <div className="footer-links">
          <a href="/">Volver a descuentos</a>
          <a href="/regalos-amor-amistad-colombia">Regalos Amor y Amistad Colombia</a>
          <a href="/catalogo">Catálogo separado</a>
          <a
            href={whatsappLink("regalables Yanbal Amor y Amistad", "consultar disponibilidad")}
            target="_blank"
            rel="noreferrer"
            data-whatsapp-cta
          >
            Pedir por WhatsApp Business
          </a>
        </div>
      </footer>

      <CartExperience footerLabel="Regalables Yanbal Amor y Amistad" />
    </main>
  );
}
