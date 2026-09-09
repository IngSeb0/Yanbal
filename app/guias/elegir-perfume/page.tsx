import type { Metadata } from "next";
import { products } from "../../../lib/commerce-products.js";
import { ProductCatalogCard } from "../../storefront-ui";

export const metadata: Metadata = {
  title: "Cómo elegir un perfume Yanbal",
  description: "Guía para comparar perfumes Yanbal por ocasión, presentación y presupuesto antes de comprar.",
  alternates: { canonical: "/guias/elegir-perfume" },
};

export default function Guide() {
  const perfumes = products.filter((p) => /parfum|perfume|eau de|colonia/i.test(`${p.name} ${p.category}`)).slice(0, 8);
  return (
    <main className="shop-main shop-section policy-page">
      <p className="eyebrow">Guía de compra</p>
      <h1>Cómo elegir un perfume Yanbal</h1>
      <p>
        Empieza por la persona y el momento: uso diario, oficina, salida o
        regalo. Después compara el tipo de presentación que aparece en el
        nombre —Parfum, Eau de Parfum, Eau de Toilette o colonia— y el tamaño
        indicado en la ficha. No deduzcas la intensidad solo por la foto.
      </p>
      <h2>Tres decisiones que reducen la duda</h2>
      <ol>
        <li>Define un presupuesto total, incluido el envío cuando corresponda.</li>
        <li>Decide si buscas una fragancia individual o un set para regalar.</li>
        <li>Si no conoces el aroma, pregunta por familia olfativa y notas verificadas antes de pagar.</li>
      </ol>
      <p>
        En clima cálido puede ser útil probar primero poca cantidad y observar
        cómo evoluciona sobre la piel. La percepción cambia entre personas; una
        recomendación no sustituye probar la fragancia.
      </p>
      <h2>Opciones del catálogo actual</h2>
      <div className="shop-grid">{perfumes.map((p) => <ProductCatalogCard product={p} key={p.id} />)}</div>
    </main>
  );
}
