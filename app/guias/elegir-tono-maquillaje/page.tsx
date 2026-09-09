import type { Metadata } from "next";
import { products } from "../../../lib/commerce-products.js";
import { ProductCatalogCard } from "../../storefront-ui";

export const metadata: Metadata = {
  title: "Cómo elegir tono de maquillaje Yanbal",
  description: "Pasos para comparar tonos Yanbal en línea y reducir errores antes de pedir maquillaje con color.",
  alternates: { canonical: "/guias/elegir-tono-maquillaje" },
};

export default function Guide() {
  const makeup = products.filter((p) => /maquillaje|labial|base|tinta|polvo|corrector/i.test(`${p.category} ${p.name}`)).slice(0, 8);
  return (
    <main className="shop-main shop-section policy-page">
      <p className="eyebrow">Guía de color</p>
      <h1>Cómo elegir un tono de maquillaje por internet</h1>
      <p>
        Las pantallas alteran brillo y color. Toma la imagen como referencia,
        confirma el nombre y código del tono y compáralo con un producto que ya
        te funcione. Si puedes, observa ese tono conocido junto a tu piel con
        luz natural antes de decidir.
      </p>
      <ol>
        <li>Identifica producto, acabado y código: nombres parecidos pueden pertenecer a líneas distintas.</li>
        <li>Para rostro, compara cuello y mandíbula con luz natural, no solo la mano.</li>
        <li>Para labios, considera que el color natural modifica el resultado.</li>
        <li>Conserva el empaque y revisa las condiciones de cambios antes de abrirlo.</li>
      </ol>
      <p>
        Si dudas entre opciones, envía por WhatsApp el nombre de tu tono actual
        y los códigos que comparas. No publicamos equivalencias sin comprobar.
      </p>
      <h2>Opciones con color</h2>
      <div className="shop-grid">{makeup.map((p) => <ProductCatalogCard product={p} key={p.id} />)}</div>
    </main>
  );
}
