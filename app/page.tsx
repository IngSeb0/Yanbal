import type { Metadata } from "next";
import { products } from "../lib/commerce-products.js";
import { store } from "../config/store.js";
import { ProductCatalogCard, AvailabilityNote } from "./storefront-ui";
export const metadata: Metadata = {
  title: "Productos Yanbal en oferta | Envíos Colombia",
  alternates: { canonical: "/" },
};
const categories = [
  ["Perfumes para mujer", "/perfumes-mujer", "01"],
  ["Perfumes para hombre", "/perfumes-hombre", "02"],
  ["Protección solar", "/bloqueadores-total-block", "03"],
  ["Maquillaje", "/maquillaje-yanbal", "04"],
  ["Cuidado facial", "/cuidado-facial", "05"],
  ["Cuidado personal", "/cuidado-personal", "06"],
  ["Regalos", "/regalos-yanbal", "07"],
  ["Ver todo", "/catalogo", "08"],
];
const faq = [
  [
    "¿Hacen envíos a toda Colombia?",
    "Sí. El pedido mínimo es de $50.000. El envío es gratis en Cúcuta y Bogotá; cuesta $14.000 en otros destinos y es gratis desde $150.000.",
  ],
  [
    "¿Puedo comprar desde Cúcuta o Bogotá?",
    "Sí. El envío no tiene costo en Cúcuta y Bogotá. Elige tu municipio para confirmar el total antes del pago.",
  ],
  [
    "¿Cómo pago?",
    "Agrega tus productos al carrito, completa los datos de entrega y paga con los medios disponibles en Mercado Pago. Tu pedido se procesa cuando se aprueba el pago.",
  ],
  [
    "¿Tengo que escribir por WhatsApp para comprar?",
    "No. Puedes comprar directamente cuando el envío esté habilitado para tu ubicación. WhatsApp está disponible para asesoría y seguimiento.",
  ],
  [
    "¿Qué sucede si un producto se agota?",
    "Te contactaremos para ofrecerte un reemplazo o gestionar la devolución del valor correspondiente.",
  ],
];
export default function Home() {
  const discounts = [...products]
    .filter((p) => p.discount > 0)
    .sort((a, b) => b.discount - a.discount);
  const featured = store.featuredProducts
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
  const offers = [
    ...new Map([...featured, ...discounts].map((p) => [p.id, p])).values(),
  ].slice(0, 8);
  return (
    <main className="shop-main">
      <section className="shop-hero">
        <div>
          <p className="eyebrow">Tu rutina. Tu aroma. Tu momento.</p>
          <h1>
            Productos Yanbal
            <br />
            <em>en oferta</em>
          </h1>
          <p>Compra productos del catálogo y recibe tu pedido en Colombia.</p>
          <p>
            Perfumes, maquillaje, Total Block y cuidado personal con precios de
            catálogo.
          </p>
          <ul className="hero-benefits">
            <li>Envío gratis en Cúcuta y Bogotá</li>
            <li>Envío gratis nacional desde $150.000</li>
            <li>Pago seguro con Mercado Pago</li>
            <li>Atención personalizada por WhatsApp</li>
          </ul>
          <div className="hero__actions">
            <a className="button button--primary" href="/ofertas">
              Ver ofertas
            </a>
            <a className="button button--ghost" href="/catalogo#buscar">
              Buscar un producto
            </a>
          </div>
          <small>{store.campaign.name} · Disponibilidad según campaña</small>
        </div>
        <img
          src={store.campaign.banner}
          alt="Selección de belleza Yanbal"
          width="601"
          height="700"
          fetchPriority="high"
        />
      </section>
      <section className="shop-section" id="descuentos">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Elige tu próximo favorito</p>
            <h2>Ofertas destacadas</h2>
          </div>
          <a href="/ofertas">Ver todas las ofertas →</a>
        </div>
        <div className="shop-grid">
          {offers.map((p) => (
            <ProductCatalogCard product={p} key={p.id} />
          ))}
        </div>
      </section>
      <section className="shop-section">
        <h2>Compra por categoría</h2>
        <div className="category-grid">
          {categories.map(([name, href, n]) => (
            <a href={href} key={href}>
              <small>{n}</small>
              <strong>{name}</strong>
              <span>Explorar →</span>
            </a>
          ))}
        </div>
      </section>
      <section className="shop-section">
        <h2>Productos destacados</h2>
        <p>Una selección de perfumes, detalles y cuidado personal para ti.</p>
        <div className="shop-grid">
          {featured.slice(0, 6).map((p) => (
            <ProductCatalogCard product={p} key={p.id} />
          ))}
        </div>
      </section>
      <section className="shop-section need-section" id="amor-amistad">
        <h2>Compra según lo que buscas</h2>
        <div>
          {[
            ["Quiero un perfume", "/perfumes-yanbal"],
            ["Busco un regalo", "/regalos-yanbal"],
            ["Quiero bloqueador", "/bloqueadores-total-block"],
            ["Maquillaje", "/maquillaje-yanbal"],
            ["Cuidado facial", "/cuidado-facial"],
          ].map(([label, href]) => (
            <a className="button button--ghost" href={href} key={href}>
              {label} →
            </a>
          ))}
        </div>
      </section>
      <section className="shop-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Decide con información</p>
            <h2>Guías para elegir mejor</h2>
          </div>
          <a href="/guias">Ver todas las guías →</a>
        </div>
        <div className="trust-grid">
          <a href="/guias/elegir-perfume">
            <h3>Perfumes por ocasión →</h3>
            <p>Compara formato, presupuesto y momento de uso.</p>
          </a>
          <a href="/guias/total-block">
            <h3>¿Qué Total Block elegir? →</h3>
            <p>Ordena las opciones por presentación y necesidad indicada.</p>
          </a>
          <a href="/guias/elegir-tono-maquillaje">
            <h3>Cómo elegir tu tono →</h3>
            <p>Reduce dudas antes de pedir maquillaje por internet.</p>
          </a>
          <a href="/guias/regalos-por-presupuesto">
            <h3>Regalos por presupuesto →</h3>
            <p>Ideas con precios actuales del catálogo.</p>
          </a>
        </div>
      </section>
      <section className="shop-section">
        <h2>Compra con confianza</h2>
        <div className="trust-grid">
          {[
            [
              "Pago protegido",
              "Tu pago se procesa directamente con Mercado Pago.",
            ],
            [
              "Envíos claros",
              "Gratis en Cúcuta y Bogotá; $14.000 en otros destinos y gratis desde $150.000.",
            ],
            [
              "Atención personalizada",
              "Estamos disponibles antes y después de comprar.",
            ],
            ["Productos Yanbal", "Productos del catálogo y campaña indicados."],
          ].map(([h, p]) => (
            <div key={h}>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="shop-section">
        <h2>Ofertas de mayor descuento</h2>
        <div className="shop-grid">
          {discounts.slice(0, 4).map((p) => (
            <ProductCatalogCard product={p} key={p.id} />
          ))}
        </div>
      </section>
      <section className="shop-section">
        <h2>Belleza que llega a ti</h2>
        <div className="trust-grid">
          {[
            [
              "Cúcuta",
              "Atención cercana para Cúcuta y áreas habilitadas.",
              "/yanbal-cucuta",
            ],
            [
              "Bogotá",
              "Tu rutina de belleza, con entrega según zona.",
              "/yanbal-bogota",
            ],
            [
              "Colombia",
              "Elige tu municipio y consulta el envío antes de pagar.",
              "/yanbal-colombia",
            ],
          ].map(([h, p, url]) => (
            <a href={url} key={url}>
              <h3>{h} →</h3>
              <p>{p}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="shop-section about-section">
        <h2>¿Quién está detrás de la tienda?</h2>
        {store.consultant.photo && (
          <img
            src={store.consultant.photo}
            alt={store.consultant.name || "Tu asesora"}
            width="180"
            height="180"
          />
        )}
        {store.consultant.name && <h3>{store.consultant.name}</h3>}
        <p>
          Somos una tienda de asesoría independiente. Te ayudamos a encontrar
          productos Yanbal y recibir tu pedido en Colombia. Puedes contactarnos
          directamente antes o después de comprar.
        </p>
        <a href="/contacto">Conoce cómo contactarnos →</a>
      </section>
      <section className="shop-section faq-section">
        <h2>Preguntas frecuentes</h2>
        {faq.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
        <AvailabilityNote />
      </section>
      <section className="catalog-cta" id="productos-definidos">
        <a className="button button--primary" href="/catalogo">
          Ver catálogo completo
        </a>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: store.name,
                url: store.url,
                telephone: `+${store.whatsapp}`,
                areaServed: "CO",
              },
              {
                "@type": "FAQPage",
                mainEntity: faq.map(([name, text]) => ({
                  "@type": "Question",
                  name,
                  acceptedAnswer: { "@type": "Answer", text },
                })),
              },
            ],
          }),
        }}
      />
    </main>
  );
}
