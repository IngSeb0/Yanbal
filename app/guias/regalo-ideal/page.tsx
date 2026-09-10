/* eslint-disable @next/next/no-html-link-for-pages -- Static export uses full-page navigation. */
import type { Metadata } from "next";
import { store } from "../../../config/store.js";
import { available, products } from "../../../lib/commerce-products.js";
import { ProductCatalogCard } from "../../storefront-ui";

const path = "/guias/regalo-ideal";
const title = "Encuentra tu regalo Yanbal";
const description =
  "Responde tres preguntas y descubre regalos Yanbal reales del catálogo, ordenados por presupuesto y tipo de detalle.";
const shareUrl = `${store.url}${path}`;
const shareText = "Estoy buscando un regalo Yanbal con este quiz:";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, type: "website", url: path },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: title,
      description,
      url: shareUrl,
      isPartOf: { "@type": "WebSite", name: store.name, url: store.url },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: store.url },
        { "@type": "ListItem", position: 2, name: "Guías", item: `${store.url}/guias` },
        { "@type": "ListItem", position: 3, name: title, item: shareUrl },
      ],
    },
  ],
};

export default function GiftQuizPage() {
  const fallback = products
    .filter((product) => available(product) && product.giftable && !product.promotionGroup)
    .filter((product) => product.price >= 50000 && product.price <= 200000)
    .slice(0, 4);

  return (
    <main className="shop-main shop-section policy-page guide-article gift-quiz-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <a href="/">Inicio</a> <span>/</span> <a href="/guias">Guías</a>{" "}
        <span>/</span> <span>Encuentra tu regalo</span>
      </nav>
      <p className="eyebrow">Quiz de regalos · Catálogo actual</p>
      <h1>{title}</h1>
      <p className="guide-article__lead">
        Responde tres preguntas y te mostraremos productos reales del catálogo.
        El resultado es una forma de empezar a explorar: revisa cada ficha y
        confirma disponibilidad antes de pagar.
      </p>

      <form className="gift-quiz" data-gift-quiz>
        <fieldset>
          <legend>1. ¿Cuál es tu presupuesto aproximado?</legend>
          <label><input type="radio" name="budget" value="80000" required /> Hasta $80.000</label>
          <label><input type="radio" name="budget" value="120000" /> Hasta $120.000</label>
          <label><input type="radio" name="budget" value="150000" /> Hasta $150.000</label>
          <label><input type="radio" name="budget" value="200000" /> Más de $150.000</label>
        </fieldset>
        <fieldset>
          <legend>2. ¿Para quién buscas el detalle?</legend>
          <label><input type="radio" name="recipient" value="pareja" required /> Pareja o alguien especial</label>
          <label><input type="radio" name="recipient" value="amistad" /> Amistad o agradecimiento</label>
          <label><input type="radio" name="recipient" value="familia" /> Familiar</label>
          <label><input type="radio" name="recipient" value="yo" /> Para mí</label>
        </fieldset>
        <fieldset>
          <legend>3. ¿Qué tipo de detalle quieres explorar?</legend>
          <label><input type="radio" name="interest" value="perfume" required /> Perfume o colonia</label>
          <label><input type="radio" name="interest" value="joyeria" /> Joyería o accesorio</label>
          <label><input type="radio" name="interest" value="set" /> Set o combo</label>
          <label><input type="radio" name="interest" value="sorpresa" /> Sorpréndeme</label>
        </fieldset>
        <button className="button button--primary" type="submit">Ver ideas para regalar</button>
      </form>

      <section className="gift-quiz-results" data-gift-quiz-results hidden aria-live="polite">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tus ideas</p>
            <h2 data-gift-quiz-title>Opciones del catálogo</h2>
          </div>
        </div>
        <p data-gift-quiz-summary />
        <div className="gift-quiz-results__grid" data-gift-quiz-cards />
        <p className="fine-print" data-gift-quiz-shipping />
      </section>

      <aside className="guide-share" aria-label="Compartir este quiz">
        <div>
          <strong>¿Con quién elegirías el regalo?</strong>
          <p>Compartan el quiz y comparen ideas antes de agregar al carrito.</p>
        </div>
        <div className="guide-share__actions">
          <a
            className="button button--whatsapp"
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            data-content-share="whatsapp"
            data-content-type="gift_quiz"
            data-content-id="regalo_ideal"
          >
            Compartir por WhatsApp
          </a>
          <button
            className="button button--ghost"
            type="button"
            data-content-share="native"
            data-content-type="gift_quiz"
            data-content-id="regalo_ideal"
            data-share-title={title}
            data-share-text={shareText}
            data-share-url={shareUrl}
          >
            Compartir enlace
          </button>
        </div>
      </aside>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Para empezar</p>
            <h2>Detalles que puedes revisar ahora</h2>
          </div>
        </div>
        <div className="shop-grid">
          {fallback.map((product) => <ProductCatalogCard product={product} key={product.id} />)}
        </div>
      </section>
    </main>
  );
}
