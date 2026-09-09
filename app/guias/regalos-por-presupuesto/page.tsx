import type { Metadata } from "next";
import { products } from "../../../lib/commerce-products.js";
import { ProductCatalogCard } from "../../storefront-ui";

export const metadata: Metadata = {
  title: "Regalos Yanbal por presupuesto",
  description: "Ideas de regalos Yanbal ordenadas por precio, con pedido mínimo y reglas de envío claras.",
  alternates: { canonical: "/guias/regalos-por-presupuesto" },
};

export default function Guide() {
  const giftable = products.filter((p) => p.giftable);
  const ranges = [
    ["De $50.000 a $99.999", 50000, 99999],
    ["De $100.000 a $149.999", 100000, 149999],
    ["Desde $150.000", 150000, Number.POSITIVE_INFINITY],
  ] as const;
  return (
    <main className="shop-main shop-section policy-page">
      <p className="eyebrow">Precios actuales</p>
      <h1>Regalos Yanbal por presupuesto</h1>
      <p>
        El pedido mínimo es de $50.000. En Cúcuta y Bogotá el envío es gratis.
        En los demás municipios cuesta $14.000 hasta $149.999 y es gratis desde
        $150.000. Puedes combinar productos para alcanzar el mínimo o el umbral
        de envío gratis, respetando las promociones que exigen dos unidades.
      </p>
      {ranges.map(([title, min, max]) => {
        const choices = giftable
          .filter((p) => p.price >= min && p.price <= max)
          .slice(0, 4);
        return (
          <section key={title}>
            <h2>{title}</h2>
            <div className="shop-grid">
              {choices.map((p) => <ProductCatalogCard product={p} key={p.id} />)}
            </div>
          </section>
        );
      })}
    </main>
  );
}
