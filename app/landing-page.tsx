/* eslint-disable @next/next/no-html-link-for-pages -- Static export intentionally uses full-page navigation without React hydration. */
import { products, normalize } from "../lib/commerce-products.js";
import { ProductCatalogCard, AvailabilityNote } from "./storefront-ui";
export function Landing({
  title,
  intro,
  filter = "",
  gender = "",
}: {
  title: string;
  intro: string;
  filter?: string;
  gender?: string;
}) {
  const pool =
    title === "Ofertas Yanbal"
      ? products
          .filter((p) => p.discount > 0)
          .sort((a, b) => b.discount - a.discount)
      : title === "Regalos Yanbal"
        ? products.filter((p) => p.giftable)
        : products;
  const selected = pool
    .filter(
      (p) =>
        !filter ||
        normalize(p.category + " " + p.name + " " + p.description).includes(
          normalize(filter),
        ),
    )
    .filter(
      (p) =>
        !gender ||
        (gender === "hombre"
          ? /masculin|hombre/i.test(p.description + " " + p.category)
          : !/masculin|hombre/i.test(p.description + " " + p.category)),
    )
    .slice(0, 24);
  return (
    <main className="shop-main shop-section">
      <nav className="breadcrumbs">
        <a href="/">Inicio</a> / {title}
      </nav>
      <p className="eyebrow">Compra Yanbal en línea</p>
      <h1>{title}</h1>
      <p className="landing-intro">{intro}</p>
      <div className="buy-buttons">
        <a
          className="button button--primary"
          href={`/catalogo?q=${encodeURIComponent(filter)}${gender ? `&gender=${gender}` : ""}`}
        >
          Ver catálogo y comprar
        </a>
        <a className="button button--ghost" href="/envios">
          Consultar cómo funciona el envío
        </a>
      </div>
      <div className="shop-grid">
        {selected.map((p) => (
          <ProductCatalogCard product={p} key={p.id} />
        ))}
      </div>
      <AvailabilityNote />
    </main>
  );
}
