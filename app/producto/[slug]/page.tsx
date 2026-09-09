/* eslint-disable @next/next/no-html-link-for-pages -- Static export intentionally uses full-page navigation without React hydration. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  products,
  productPath,
  money,
  available,
} from "../../../lib/commerce-products.js";
import { store } from "../../../config/store.js";
import {
  ProductCatalogCard,
  BuyButtons,
  AvailabilityNote,
  productWhatsAppLink,
} from "../../storefront-ui";
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  if (!p) return { title: "Producto no encontrado", robots: { index: false } };
  const title = `${p.name} Yanbal ${p.content || ""}`;
  const description = `Compra ${p.name} a ${money(p.price)}. ${p.saleLabel || p.content || ""} Pago con Mercado Pago y envíos a Cúcuta, Bogotá y Colombia.`;
  return {
    title,
    description,
    alternates: { canonical: productPath(p) },
    openGraph: {
      title,
      description,
      url: productPath(p),
      images: [{ url: p.image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [p.image],
    },
  };
}
export default async function Product({ params }: Props) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  const related = products
    .filter((r) => r.id !== p.id && r.category === p.category)
    .slice(0, 4);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: p.name,
        description: p.description || p.content,
        image: `${store.url}${p.image}`,
        sku: p.sku,
        brand: { "@type": "Brand", name: "Yanbal" },
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: "COP",
          url: `${store.url}${productPath(p)}`,
          availability: available(p)
            ? "https://schema.org/BackOrder"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: store.name },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: store.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Catálogo",
            item: `${store.url}/catalogo`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: p.name,
            item: `${store.url}${productPath(p)}`,
          },
        ],
      },
    ],
  };
  return (
    <main className="shop-main shop-section" data-product-detail={p.id}>
      <nav className="breadcrumbs" aria-label="Migas de pan">
        <a href="/">Inicio</a> / <a href="/catalogo">Catálogo</a> / {p.name}
      </nav>
      <section className="product-detail">
        <div className="product-detail__image">
          <img
            src={p.image}
            alt={p.name}
            width="640"
            height="800"
            fetchPriority="high"
          />
        </div>
        <div>
          <p className="eyebrow">{p.category}</p>
          <h1>{p.name}</h1>
          <p>
            {p.content} {p.variant}
          </p>
          <p className="fine-print">
            Código Yanbal {p.sku} · Página {p.page} · {store.campaign.name}
          </p>
          <div className="price price--large">
            {p.normal_price && <del>{money(p.normal_price)}</del>}
            <strong>{money(p.price)}</strong>
          </div>
          {p.savings > 0 && (
            <p className="saving">
              Ahorras {money(p.savings)} (−{p.discount}%)
            </p>
          )}
          {p.saleLabel && <p className="promotion-note">{p.saleLabel}</p>}
          <ul className="hero-benefits">
            <li>
              {available(p)
                ? "Disponible para pedido"
                : "Agotado temporalmente"}
            </li>
            <li>Envío gratis en Cúcuta y Bogotá</li>
            <li>Envío gratis nacional desde $150.000</li>
            <li>Pago protegido con Mercado Pago</li>
          </ul>
          <BuyButtons product={p} />
          {p.promotionGroup && (
            <p>
              Agrega 2 unidades combinables de esta promoción para completar la
              compra. Puedes elegir distintos tonos en el catálogo.
            </p>
          )}
          <p>
            <a
              className="support-link"
              href={productWhatsAppLink(p)}
              target="_blank"
              rel="noreferrer"
            >
              ¿Tienes una duda sobre este producto? Preguntar por WhatsApp
            </a>
          </p>
          <h2>Conoce el producto</h2>
          <p>{p.description}</p>
          {p.benefits?.length > 0 && (
            <ul>
              {p.benefits.map((b: string) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {p.promotion_detail && <p>{p.promotion_detail}</p>}
          <h3>Entrega y disponibilidad</h3>
          <p>
            El pedido mínimo es de $50.000. El envío es gratis en Cúcuta y
            Bogotá. Para los demás municipios cuesta $14.000 y se vuelve gratis
            cuando el subtotal llega a $150.000. El total se confirma antes del
            pago.
          </p>
          <p>
            <a href="/guias">Consulta nuestras guías para comparar opciones →</a>
          </p>
          <AvailabilityNote />
        </div>
      </section>
      <section className="shop-section">
        <h2>También te puede gustar</h2>
        <div className="shop-grid">
          {related.map((r) => (
            <ProductCatalogCard product={r} key={r.id} />
          ))}
        </div>
      </section>
      <div className="product-sticky">
        <strong>{money(p.price)}</strong>
        <button
          className="button button--primary"
          type="button"
          data-buy-now={p.id}
          disabled={!available(p)}
        >
          Comprar ahora
        </button>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
