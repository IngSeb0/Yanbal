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
  title: "Regalos Amor y Amistad Colombia | Regalables Yanbal",
  description:
    "Regalos de Amor y Amistad en Colombia con Yanbal: Ohm, Collar Amira, Dulce Amor, Combo Soy Única, iluminador y bálsamo con carrito y Mercado Pago.",
  keywords: [
    "regalos Amor y Amistad Colombia",
    "regalos Yanbal Colombia",
    "regalables Yanbal Amor y Amistad",
    "Dulce Amor Yanbal",
    "Ohm Yanbal",
    "Combo Soy Única Yanbal",
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Regalos Amor y Amistad Colombia Yanbal",
  description:
    "Selección de regalos Yanbal para Amor y Amistad en Colombia, con atención para Cúcuta y Bogotá, carrito y pago por Mercado Pago.",
  telephone: "+573026293535",
  areaServed: [
    { "@type": "Country", name: "Colombia" },
    { "@type": "City", name: "Cúcuta" },
    { "@type": "City", name: "Bogotá" },
  ],
  url: "https://yanbal-promos-cucuta-bogota.vercel.app/regalos-amor-amistad-colombia",
  sameAs: [`https://wa.me/${whatsappNumber}`],
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
    },
  })),
};

export default function AmorAmistadColombiaPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero gift-page-hero" aria-labelledby="amor-colombia-title">
        <div className="hero__content">
          <p className="eyebrow">Regalos Amor y Amistad Colombia</p>
          <h1 id="amor-colombia-title">Regalables Yanbal para Amor y Amistad</h1>
          <p className="hero__copy">
            Ideas de regalo Yanbal para Amor y Amistad en Colombia: perfumes,
            joyería, maquillaje, iluminador, bálsamo y combos listos para
            sorprender. Agrega al carrito y paga seguro por Mercado Pago.
          </p>
          <div className="hero__actions" aria-label="Acciones regalos Amor y Amistad Colombia">
            <a
              className="button button--primary button--whatsapp"
              href={whatsappLink("regalos Yanbal Amor y Amistad Colombia", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              Comprar por WhatsApp
            </a>
            <a className="button button--ghost" href="#regalos-recomendados">
              Ver recomendados
            </a>
            <a className="button button--ghost" href="/cucuta">
              Cúcuta
            </a>
            <a className="button button--ghost" href="/bogota">
              Bogotá
            </a>
            <a
              className="button button--ghost"
              href={whatsappLink("regalos Yanbal Amor y Amistad Colombia", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              WhatsApp 302 629 3535
            </a>
          </div>
        </div>
      </section>

      <section className="promo-strip" aria-label="Resumen de regalos Amor y Amistad Colombia">
        <div>
          <strong>Amor y Amistad</strong>
          <span>opciones listas para regalar</span>
        </div>
        <div>
          <strong>{giftableProducts.length} regalables</strong>
          <span>perfumes, joyería, maquillaje y cuidado</span>
        </div>
        <div>
          <strong>Mercado Pago</strong>
          <span>pago seguro y confirmación por WhatsApp</span>
        </div>
      </section>

      <section
        className="catalog product-catalog love-section"
        id="regalos-recomendados"
        aria-labelledby="regalos-recomendados-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Selección especial</p>
          <h2 id="regalos-recomendados-title">Los regalos Yanbal más buscados</h2>
          <p>
            Para Amor y Amistad, esta página destaca Ohm, Collar Amira, Dulce
            Amor, Combo Soy Única, Jelly Stick Iluminador y Bálsamo Lip Oil
            Balm: opciones buscadas para regalar en Colombia.
          </p>
        </div>
        <div className="highlight-product-grid">
          {loveAndFriendshipProducts.map((product) => (
            <ProductCatalogCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      <section className="catalog product-catalog" aria-labelledby="ideas-title">
        <div className="section-heading">
          <p className="eyebrow">Más ideas</p>
          <h2 id="ideas-title">Regalos por intención de compra</h2>
          <p>
            Elige fragancias, joyería, maquillaje o cuidado personal según la
            persona, el presupuesto y la ocasión. Cada producto se puede añadir
            al carrito.
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

      <section className="security-panel" aria-labelledby="gifts-security-title">
        <div>
          <p className="eyebrow">Compra protegida</p>
          <h2 id="gifts-security-title">Tus datos están seguros y protegidos</h2>
          <p>
            No guardo datos de tarjeta en esta página. El pago se completa en
            Mercado Pago y tus datos de contacto se usan para coordinar
            disponibilidad, empaque y entrega.
          </p>
        </div>
        <ul className="security-list">
          <li>Carrito con productos visibles antes de pagar.</li>
          <li>Confirmación de pedido por WhatsApp Business.</li>
          <li>Ideal para compras de regalos de última hora.</li>
        </ul>
      </section>

      <footer className="site-footer">
        <p>Regalos Amor y Amistad Colombia</p>
        <div className="footer-links">
          <a href="/">Tienda principal</a>
          <a href="/regalables">Regalables Yanbal</a>
          <a href="/cucuta">Yanbal Cúcuta</a>
          <a href="/bogota">Yanbal Bogotá</a>
          <a href="/catalogo">Catálogo separado</a>
        </div>
      </footer>

      <CartExperience footerLabel="Regalos Amor y Amistad Colombia" />
    </main>
  );
}
