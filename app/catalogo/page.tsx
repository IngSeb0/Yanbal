import type { Metadata } from "next";
import { catalogPages, type CatalogPage } from "../catalog-data";

export const metadata: Metadata = {
  title: "Catálogo Yanbal C9 separado",
  description:
    "Catálogo Yanbal C9 Colombia separado de la tienda principal, con recortes por categoría para consultar productos, precios y códigos en Cúcuta y Bogotá.",
  keywords: [
    "catálogo Yanbal C9",
    "catálogo Yanbal Cúcuta",
    "catálogo Yanbal Bogotá",
    "productos Yanbal Colombia",
  ],
};

const whatsappNumber = "573026293535";

const sectionOrder = [
  "Destacados",
  "Perfumes y colonias",
  "Joyería para mujer",
  "Maquillaje",
  "Tratamiento facial",
  "Protección solar",
  "Cuidado personal",
  "Mundo hombre",
  "Bebés y niños",
  "Catálogo Yanbal",
];

const catalogGroups = sectionOrder
  .map((section) => ({
    section,
    pages: catalogPages.filter((page) => page.section === section),
  }))
  .filter((group) => group.pages.length > 0);

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function whatsappLink(productName: string, price: string) {
  const text = `Hola, quiero pedir ${productName} de Yanbal C9 para Cúcuta o Bogotá. Precio: ${price}.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function catalogWhatsAppLink(page: CatalogPage) {
  const price = page.prices.length ? page.prices.slice(0, 3).join(", ") : "consultar precio";
  const code = page.codes.length ? ` Códigos visibles: ${page.codes.join(", ")}.` : "";
  const text = `Hola, quiero comprar o consultar ${page.title}. Página ${page.page}. Precios visibles: ${price}.${code}`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

function PriceMeta({ page }: { page: CatalogPage }) {
  return (
    <div className="price-meta" aria-label="Precios y códigos visibles">
      {page.prices.slice(0, 3).map((price) => (
        <span key={price}>{price}</span>
      ))}
      {page.codes.slice(0, 2).map((code) => (
        <span key={code}>Cód. {code}</span>
      ))}
      {!page.prices.length && !page.codes.length ? <span>Consultar</span> : null}
    </div>
  );
}

function CatalogCard({ page }: { page: CatalogPage }) {
  return (
    <article className="catalog-card">
      <a href={page.image} target="_blank" rel="noreferrer" aria-label={`Ver ${page.title}`}>
        <img
          src={page.image}
          alt={`Recorte del catálogo Yanbal C9: ${page.title}`}
          width="760"
          height="980"
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="catalog-card__body">
        <p className="catalog-card__eyebrow">{page.section}</p>
        <h3>{page.title}</h3>
        <PriceMeta page={page} />
        <a
          className="order-link"
          href={catalogWhatsAppLink(page)}
          target="_blank"
          rel="noreferrer"
          data-whatsapp-cta
        >
          Consultar por WhatsApp <span aria-hidden="true">&gt;</span>
        </a>
      </div>
    </article>
  );
}

export default function CatalogoPage() {
  return (
    <main>
      <section className="hero catalog-page-hero" aria-labelledby="catalog-title">
        <div className="hero__content">
          <p className="eyebrow">Catálogo separado</p>
          <h1 id="catalog-title">Catálogo Yanbal C9 completo</h1>
          <p className="hero__copy">
            Aquí está el catálogo por recortes y categorías. Para comprar más
            rápido, vuelve a la tienda principal y agrega productos al carrito
            con código y precio.
          </p>
          <div className="hero__actions" aria-label="Acciones del catálogo">
            <a className="button button--primary" href="/">
              Ir a productos con descuento
            </a>
            <a
              className="button button--ghost"
              href={whatsappLink("catálogo Yanbal C9", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              WhatsApp 302 629 3535
            </a>
          </div>
        </div>
      </section>

      <section className="catalog-archive catalog-archive--standalone" aria-labelledby="archive-title">
        <div className="section-heading">
          <p className="eyebrow">Catálogo C9</p>
          <h2 id="archive-title">Recortes por categoría</h2>
          <p>
            Abre cada imagen para verla grande o consulta por WhatsApp con la
            página, precios y códigos visibles. La compra directa está separada
            en la página principal para mantener el carrito claro.
          </p>
        </div>

        <nav className="section-nav" aria-label="Categorías del catálogo">
          {catalogGroups.map((group) => (
            <a key={group.section} href={`#catalogo-${slugify(group.section)}`}>
              {group.section} <span>{group.pages.length}</span>
            </a>
          ))}
        </nav>

        {catalogGroups.map((group) => (
          <section className="catalog-group" id={`catalogo-${slugify(group.section)}`} key={group.section}>
            <div className="catalog-group__heading">
              <h3>{group.section}</h3>
              <span>{group.pages.length} recortes</span>
            </div>
            <div className="catalog-grid">
              {group.pages.map((page) => (
                <CatalogCard key={page.page} page={page} />
              ))}
            </div>
          </section>
        ))}
      </section>

      <footer className="site-footer">
        <p>Catálogo Yanbal C9</p>
        <div className="footer-links">
          <a href="/">Volver a la tienda</a>
          <a
            href={whatsappLink("catálogo Yanbal C9", "consultar disponibilidad")}
            target="_blank"
            rel="noreferrer"
            data-whatsapp-cta
          >
            Pedir por WhatsApp Business
          </a>
        </div>
      </footer>
    </main>
  );
}
