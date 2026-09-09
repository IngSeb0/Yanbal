import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CATALOG_PAGE_COUNT,
  catalogPagePath,
  catalogPageProducts,
} from "../../../../lib/catalog-pagination.js";
import { ProductCatalogCard } from "../../../storefront-ui";

type PageProps = { params: Promise<{ page: string }> };

export function generateStaticParams() {
  return Array.from({ length: CATALOG_PAGE_COUNT - 1 }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = Number((await params).page);
  if (!catalogPageProducts(page)) return {};
  return {
    title: `Catálogo Yanbal, página ${page}`,
    description: `Explora productos Yanbal de la página ${page} de ${CATALOG_PAGE_COUNT}: perfumes, maquillaje, cuidado personal y ofertas.`,
    alternates: { canonical: catalogPagePath(page) },
  };
}

export default async function CatalogPage({ params }: PageProps) {
  const page = Number((await params).page);
  const pageProducts = catalogPageProducts(page);
  if (!pageProducts || page === 1) notFound();
  const first = (page - 1) * 24 + 1;
  const last = first + pageProducts.length - 1;
  return (
    <main className="shop-main shop-section">
      <p className="eyebrow">Todos los productos</p>
      <h1>Catálogo Yanbal · Página {page}</h1>
      <p>
        Productos {first}–{last}. Usa el{" "}
        <a href="/catalogo#buscar">buscador y los filtros</a> para encontrar una
        referencia por nombre, código, precio o categoría.
      </p>
      <div className="shop-grid">
        {pageProducts.map((product) => (
          <ProductCatalogCard product={product} key={product.id} />
        ))}
      </div>
      <nav className="catalog-pagination" aria-label="Páginas del catálogo">
        <a href={catalogPagePath(page - 1)} rel="prev">← Anterior</a>
        {Array.from({ length: CATALOG_PAGE_COUNT }, (_, index) => {
          const number = index + 1;
          return number === page ? (
            <strong aria-current="page" key={number}>{number}</strong>
          ) : (
            <a href={catalogPagePath(number)} key={number}>{number}</a>
          );
        })}
        {page < CATALOG_PAGE_COUNT && (
          <a href={catalogPagePath(page + 1)} rel="next">Siguiente →</a>
        )}
      </nav>
    </main>
  );
}
