import type { Metadata } from "next";
import { products } from "../../lib/commerce-products.js";
import {
  CATALOG_PAGE_COUNT,
  catalogPagePath,
} from "../../lib/catalog-pagination.js";
import { ProductCatalogCard } from "../storefront-ui";
export const metadata: Metadata = {
  title: "Catálogo Yanbal: perfumes, maquillaje y ofertas",
  description:
    "Busca productos Yanbal por nombre o código, filtra por precio y descuento y compra en línea con envíos en Colombia.",
  alternates: { canonical: "/catalogo" },
};
export default function Catalog() {
  return (
    <main className="shop-main shop-section">
      <p className="eyebrow">Encuentra tu favorito</p>
      <h1>Catálogo Yanbal</h1>
      <p>{products.length} productos · Busca por nombre, código o categoría.</p>
      <form className="catalog-filters" data-catalog-form id="buscar">
        <label className="search-field">
          Buscar productos
          <input
            type="search"
            name="q"
            placeholder="Busca Ohm, Total Block, Dulce Amor, código 2040…"
          />
        </label>
        <label>
          Categoría
          <select name="category">
            <option value="">Todas</option>
            {[...new Set(products.map((p) => p.category))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Desde
          <input name="min" type="number" min="0" placeholder="$0" />
        </label>
        <label>
          Hasta
          <input name="max" type="number" min="0" placeholder="Sin límite" />
        </label>
        <label>
          Descuento
          <select name="discount">
            <option value="0">Todos</option>
            <option value="20">20% o más</option>
            <option value="30">30% o más</option>
            <option value="50">50% o más</option>
          </select>
        </label>
        <label>
          Para
          <select name="gender">
            <option value="">Todos</option>
            <option value="mujer">Mujer</option>
            <option value="hombre">Hombre</option>
          </select>
        </label>
        <label>
          Tipo
          <select name="type">
            <option value="">Todos</option>
            {[
              "parfum",
              "colonia",
              "labial",
              "crema",
              "shampoo",
              "collar",
              "mascara",
              "solar",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Ordenar
          <select name="sort">
            <option value="featured">Destacados</option>
            <option value="discount">Mayor descuento</option>
            <option value="price">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name">Nombre A–Z</option>
          </select>
        </label>
        <label className="check-label">
          <input name="offers" type="checkbox" /> Solo ofertas
        </label>
        <label className="check-label">
          <input name="gifts" type="checkbox" /> Regalables
        </label>
        <button type="reset" className="button button--ghost">
          Limpiar filtros
        </button>
      </form>
      <p data-results-count role="status" />
      <div className="shop-grid" data-catalog-grid>
        {products.slice(0, 24).map((p) => (
          <ProductCatalogCard product={p} key={p.id} />
        ))}
      </div>
      <div data-catalog-empty hidden>
        <h2>No encontramos ese producto.</h2>
        <a href="/catalogo">Ver catálogo</a> ·{" "}
        <a href="/contacto">Preguntar por WhatsApp</a>
      </div>
      <button
        className="button button--ghost load-more"
        type="button"
        data-load-more
      >
        Cargar más productos
      </button>
      <nav className="catalog-pagination" aria-label="Páginas del catálogo">
        <strong aria-current="page">1</strong>
        {Array.from({ length: CATALOG_PAGE_COUNT - 1 }, (_, index) => {
          const page = index + 2;
          return (
            <a href={catalogPagePath(page)} key={page}>
              {page}
            </a>
          );
        })}
        <a href={catalogPagePath(2)} rel="next">
          Siguiente →
        </a>
      </nav>
      <noscript>
        Activa JavaScript para buscar y cargar más productos. Puedes abrir
        cualquier ficha desde las categorías o el sitemap.
      </noscript>
      <p>
        <a href="/catalogo-paginas">
          Ver las páginas originales del catálogo →
        </a>
      </p>
    </main>
  );
}
