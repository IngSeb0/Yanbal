/* eslint-disable @next/next/no-html-link-for-pages -- Static export intentionally uses full-page navigation without React hydration. */
import {
  CartExperience,
  ProductCatalogCard,
  type StorefrontProduct,
  whatsappLink,
  whatsappNumber,
} from "./storefront-ui";

type QuickPoint = {
  title: string;
  text: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type CategoryLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  localTitle: string;
  localCopy: string;
  productHeading: string;
  productCopy: string;
  products: StorefrontProduct[];
  quickPoints: QuickPoint[];
  faqs: FaqItem[];
  urlPath: string;
  whatsappTopic: string;
  footerLabel: string;
};

function productOffer(product: StorefrontProduct) {
  const price = product.promo_price ?? product.price;
  return {
    "@type": "Offer",
    priceCurrency: "COP",
    price: String(price),
    availability: "https://schema.org/BackOrder",
    itemOffered: {
      "@type": "Product",
      name: `Yanbal ${product.name}`,
      description:
        product.promotion_detail ||
        product.description ||
        product.promotion ||
        product.category,
      sku: product.sku,
      category: product.category,
      image: product.image,
    },
  };
}

export function CategoryLanding({
  eyebrow,
  title,
  description,
  localTitle,
  localCopy,
  productHeading,
  productCopy,
  products,
  quickPoints,
  faqs,
  urlPath,
  whatsappTopic,
  footerLabel,
}: CategoryLandingProps) {
  const url = `https://yanbal-promos-cucuta-bogota.vercel.app${urlPath}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Store",
      name: footerLabel,
      description,
      telephone: "+573026293535",
      areaServed: [
        { "@type": "City", name: "Cúcuta" },
        { "@type": "City", name: "Bogotá" },
      ],
      paymentAccepted: ["Mercado Pago"],
      url,
      sameAs: [`https://wa.me/${whatsappNumber}`],
      makesOffer: products.slice(0, 24).map(productOffer),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Tienda Yanbal",
          item: "https://yanbal-promos-cucuta-bogota.vercel.app/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: url,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        className="hero local-page-hero"
        aria-labelledby="category-title"
      >
        <div className="hero__content">
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="category-title">{title}</h1>
          <p className="hero__copy">{description}</p>
          <div className="hero__actions" aria-label={`Acciones para ${title}`}>
            <a
              className="button button--primary button--whatsapp"
              href={whatsappLink(whatsappTopic, "confirmar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              Comprar por WhatsApp
            </a>
            <a className="button button--ghost" href="#productos">
              Ver productos
            </a>
            <a className="button button--ghost" href="/cucuta">
              Cúcuta
            </a>
            <a className="button button--ghost" href="/bogota">
              Bogotá
            </a>
            <a className="button button--ghost" href="/regalables">
              Regalables
            </a>
          </div>
        </div>
      </section>

      <section className="category-proof" aria-label="Razones para comprar">
        {quickPoints.map((point) => (
          <article key={point.title}>
            <h2>{point.title}</h2>
            <p>{point.text}</p>
          </article>
        ))}
      </section>

      <section
        className="seo-panel seo-panel--topics"
        aria-labelledby="local-title"
      >
        <div>
          <p className="eyebrow">SEO local</p>
          <h2 id="local-title">{localTitle}</h2>
          <p>{localCopy}</p>
        </div>
        <div className="copy-grid copy-grid--seo">
          {faqs.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="catalog product-catalog"
        id="productos"
        aria-labelledby="products-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Catálogo con carrito</p>
          <h2 id="products-title">{productHeading}</h2>
          <p>{productCopy}</p>
        </div>
        <div className="highlight-product-grid">
          {products.map((product) => (
            <ProductCatalogCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p>{footerLabel}</p>
        <div className="footer-links">
          <a href="/">Tienda principal</a>
          <a href="/perfumes-yanbal-cucuta-bogota">Perfumes Yanbal</a>
          <a href="/bloqueadores-yanbal-cucuta-bogota">Bloqueadores Yanbal</a>
          <a href="/regalos-amor-amistad-colombia">Regalos Amor y Amistad</a>
          <a
            href={whatsappLink(whatsappTopic, "confirmar disponibilidad")}
            target="_blank"
            rel="noreferrer"
            data-whatsapp-cta
          >
            WhatsApp Business
          </a>
        </div>
      </footer>

      <CartExperience footerLabel={footerLabel} />
    </main>
  );
}
