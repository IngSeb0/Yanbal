import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guías para elegir productos Yanbal",
  description: "Compara perfumes, protectores solares, tonos de maquillaje y regalos Yanbal con precios actuales del catálogo.",
  alternates: { canonical: "/guias" },
};

const guides = [
  ["/guias/elegir-perfume", "Cómo elegir un perfume", "Compara ocasión, presentación y presupuesto sin atribuir características que el catálogo no confirma."],
  ["/guias/total-block", "Qué Total Block elegir", "Compara las presentaciones por las características indicadas en su nombre y ficha."],
  ["/guias/elegir-tono-maquillaje", "Cómo elegir un tono", "Pasos prácticos para reducir diferencias entre la pantalla y el resultado real."],
  ["/guias/regalos-por-presupuesto", "Regalos por presupuesto", "Ideas ordenadas por precio, pedido mínimo y costo de envío."],
];

export default function Guides() {
  return (
    <main className="shop-main shop-section policy-page">
      <p className="eyebrow">Compra con criterio</p>
      <h1>Guías para elegir productos Yanbal</h1>
      <p>
        Estas guías usan nombres, presentaciones y precios del catálogo actual.
        Cuando una característica no aparece en la ficha, recomendamos revisar
        la etiqueta o consultarla por WhatsApp antes de comprar.
      </p>
      <div className="trust-grid">
        {guides.map(([href, title, description]) => (
          <a href={href} key={href}>
            <h2>{title} →</h2>
            <p>{description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
