/* eslint-disable @next/next/no-html-link-for-pages -- Static export uses full-page navigation. */
import type { Metadata } from "next";
import { store } from "../../../config/store.js";
import { products } from "../../../lib/commerce-products.js";
import { ProductCatalogCard, whatsappLink } from "../../storefront-ui";

const path = "/guias/combinar-perfumes";
const title = "Cómo combinar perfumes y lociones paso a paso";
const description =
  "Aprende un método sencillo para combinar perfume y loción sin mezclar los frascos, comparar el resultado y elegir productos del catálogo actual.";
const shareUrl = `${store.url}${path}`;
const shareText =
  "Encontré este método para combinar perfume y loción sin improvisar:";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    type: "article",
    url: path,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: title,
      description,
      mainEntityOfPage: `${store.url}${path}`,
      author: { "@type": "Organization", name: store.name },
      publisher: { "@type": "Organization", name: store.name },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: store.url },
        { "@type": "ListItem", position: 2, name: "Guías", item: `${store.url}/guias` },
        { "@type": "ListItem", position: 3, name: title, item: `${store.url}${path}` },
      ],
    },
  ],
};

export default function LayeringGuide() {
  const perfumes = products
    .filter((product) => /parfum|eau de parfum|colonia/i.test(product.name))
    .slice(0, 4);
  const bodyProducts = products
    .filter((product) => /locion perfumada|crema para cuerpo|biomilk/i.test(product.name))
    .slice(0, 4);

  return (
    <main className="shop-main shop-section policy-page guide-article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className="breadcrumbs" aria-label="Ruta de navegación">
        <a href="/">Inicio</a> <span>/</span> <a href="/guias">Guías</a>{" "}
        <span>/</span> <span>Combinar perfumes</span>
      </nav>
      <p className="eyebrow">Guía práctica · Tendencia scent stacking</p>
      <h1>{title}</h1>
      <p className="guide-article__lead">
        Combinar aromas, también conocido como <em>scent stacking</em>, consiste
        en usar productos perfumados por capas para crear una experiencia
        personal. La clave está en probar con calma y comprobar las notas reales
        de cada producto antes de asumir que dos aromas combinan.
      </p>

      <div className="guide-callout">
        <strong>Regla sencilla:</strong> empieza con dos productos, cambia una
        sola cosa en cada prueba y anota la combinación que te gustó.
      </div>

      <section>
        <h2>El método de tres pasos</h2>
        <ol className="guide-steps">
          <li>
            <strong>Elige una base.</strong> Puede ser una loción corporal
            perfumada usada según las instrucciones de su etiqueta.
          </li>
          <li>
            <strong>Busca un hilo común.</strong> Confirma en el empaque o con
            una asesora si ambos productos comparten una familia o una nota. El
            nombre y el color del frasco no bastan para saberlo.
          </li>
          <li>
            <strong>Prueba antes de decidir.</strong> Aplica cada producto por
            separado, espera a percibir su evolución y evita añadir una tercera
            capa hasta saber si te gusta el resultado.
          </li>
        </ol>
      </section>

      <section>
        <h2>Tres fórmulas para experimentar</h2>
        <div className="guide-formulas">
          <article>
            <span>01</span>
            <h3>Una misma familia</h3>
            <p>Compara una loción y un perfume con notas verificadas en común.</p>
          </article>
          <article>
            <span>02</span>
            <h3>De suave a protagonista</h3>
            <p>Usa primero el producto más ligero y evalúa el perfume después.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Prueba dividida</h3>
            <p>Compara la combinación en una zona y cada aroma solo en otra.</p>
          </article>
        </div>
      </section>

      <section>
        <h2>Errores que conviene evitar</h2>
        <ul>
          <li>No mezcles líquidos dentro de los frascos.</li>
          <li>No atribuyas notas o duración a un producto sin verificarlas.</li>
          <li>No pruebes muchas combinaciones seguidas; el olfato se satura.</li>
          <li>Suspende el uso si aparece irritación y sigue siempre la etiqueta.</li>
        </ul>
      </section>

      <aside className="guide-share" aria-label="Compartir esta guía">
        <div>
          <strong>¿A quién le serviría esta guía?</strong>
          <p>Compártela y comparen una combinación antes de comprar.</p>
        </div>
        <div className="guide-share__actions">
          <a
            className="button button--whatsapp"
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            data-content-share="whatsapp"
            data-content-id="combinar_perfumes"
          >
            Compartir por WhatsApp
          </a>
          <button
            className="button button--ghost"
            type="button"
            data-content-share="native"
            data-content-id="combinar_perfumes"
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
            <p className="eyebrow">Primera capa</p>
            <h2>Lociones y cremas del catálogo</h2>
          </div>
        </div>
        <div className="shop-grid">
          {bodyProducts.map((product) => (
            <ProductCatalogCard product={product} key={product.id} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Segunda capa</p>
            <h2>Perfumes para explorar</h2>
          </div>
        </div>
        <div className="shop-grid">
          {perfumes.map((product) => (
            <ProductCatalogCard product={product} key={product.id} />
          ))}
        </div>
      </section>

      <aside className="guide-advice">
        <h2>¿Quieres confirmar las notas antes de combinar?</h2>
        <p>
          Envíanos los nombres o códigos de los dos productos y revisamos la
          información disponible antes de tu compra.
        </p>
        <a
          className="button button--primary button--whatsapp"
          href={whatsappLink("combinar perfumes y lociones", "quiero confirmar las notas de dos productos")}
          target="_blank"
          rel="noreferrer"
        >
          Consultar por WhatsApp
        </a>
      </aside>
    </main>
  );
}
