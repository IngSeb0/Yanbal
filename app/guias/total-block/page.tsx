import type { Metadata } from "next";
import { products } from "../../../lib/commerce-products.js";
import { ProductCatalogCard } from "../../storefront-ui";

export const metadata: Metadata = {
  title: "Qué Total Block elegir: comparador",
  description: "Compara Total Block Yanbal por presentación, acabado indicado, color y uso descrito en el catálogo.",
  alternates: { canonical: "/guias/total-block" },
};

export default function Guide() {
  const options = products.filter((p) => /total block/i.test(p.name));
  return (
    <main className="shop-main shop-section policy-page">
      <p className="eyebrow">Comparador</p>
      <h1>¿Qué Total Block elegir?</h1>
      <p>
        Usa las palabras de cada presentación para acotar opciones. “Kids” y
        “Sport” identifican el uso señalado por el producto; “matificante”,
        “con color”, “compacto”, “fluido” y “gel” describen formato o acabado.
        Confirma instrucciones, advertencias y frecuencia de aplicación en la
        etiqueta del producto.
      </p>
      <h2>Cómo comparar</h2>
      <ul>
        <li>Si quieres color, compara el tono indicado y evita elegirlo solo por la pantalla.</li>
        <li>Si priorizas textura, separa compacto, fluido y gel antes de revisar precio.</li>
        <li>Compara el contenido de cada presentación para entender el valor por uso.</li>
        <li>Ante sensibilidad o una condición dermatológica, consulta a un profesional de salud.</li>
      </ul>
      <h2>Presentaciones del catálogo</h2>
      <div className="shop-grid">{options.map((p) => <ProductCatalogCard product={p} key={p.id} />)}</div>
    </main>
  );
}
