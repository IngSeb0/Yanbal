import type { Metadata } from "next";
import { CategoryLanding } from "../category-landing";
import { perfumeProducts } from "../product-selections";

export const metadata: Metadata = {
  title: "Perfumes Yanbal Cúcuta y Bogotá | Fragancias con descuento",
  description:
    "Compra perfumes Yanbal en Cúcuta y Bogotá con asesoría por WhatsApp: fragancias femeninas, masculinas, Parfum, Eau de Parfum y regalos de campaña.",
  keywords: [
    "perfumes Yanbal Cúcuta",
    "perfumes Yanbal Bogotá",
    "fragancias Yanbal",
    "comprar perfumes Yanbal",
    "perfumes de mujer Yanbal",
    "perfumes de hombre Yanbal",
    "perfumes Yanbal con descuento",
    "regalos Yanbal perfumes",
  ],
};

const quickPoints = [
  {
    title: "Aromas para regalar",
    text:
      "Opciones dulces, elegantes, frescas e intensas para cumpleaños, Amor y Amistad o detalle especial.",
  },
  {
    title: "Perfumes femeninos y masculinos",
    text:
      "Consulta Parfum, Eau de Parfum, colonias y líneas de hombre con precio de campaña.",
  },
  {
    title: "Asesoría por WhatsApp",
    text:
      "Si no sabes qué aroma elegir, te ayudo según ocasión, presupuesto y gusto de la persona.",
  },
];

const faqs = [
  {
    question: "¿Dónde comprar perfumes Yanbal en Cúcuta?",
    answer:
      "Puedes comprar perfumes Yanbal en Cúcuta desde esta página, agregarlos al carrito y confirmar disponibilidad por WhatsApp Business.",
  },
  {
    question: "¿Tienen perfumes Yanbal para Bogotá?",
    answer:
      "Sí. Puedes consultar perfumes Yanbal para Bogotá, revisar precio de campaña y confirmar entrega o disponibilidad por WhatsApp.",
  },
  {
    question: "¿Qué perfume Yanbal sirve para regalo?",
    answer:
      "Dulce Amor, Ohm, Gaia, Dendur y fragancias Parfum son opciones buscadas para regalo, según si prefieres aroma dulce, elegante, fresco o intenso.",
  },
];

export default function PerfumesYanbalPage() {
  return (
    <CategoryLanding
      eyebrow="Perfumes Yanbal"
      title="Perfumes Yanbal en Cúcuta y Bogotá"
      description="Encuentra fragancias Yanbal con precio de campaña: perfumes femeninos, perfumes masculinos, Parfum, Eau de Parfum, colonias y aromas para regalo. Agrega al carrito o escribe por WhatsApp para elegir el aroma correcto."
      localTitle="Perfumes Yanbal con asesoría local"
      localCopy="Esta página está pensada para quienes buscan comprar perfumes Yanbal en Cúcuta o Bogotá sin perder tiempo revisando todo el catálogo. Puedes comparar fragancias, ver precio, revisar código y confirmar disponibilidad por WhatsApp."
      productHeading="Fragancias Yanbal disponibles"
      productCopy="Elige el perfume, agrégalo al carrito y finaliza por WhatsApp o Mercado Pago. Si necesitas recomendación, escríbeme y dime si buscas aroma dulce, floral, fresco, elegante, fuerte o para regalo."
      products={perfumeProducts}
      quickPoints={quickPoints}
      faqs={faqs}
      urlPath="/perfumes-yanbal-cucuta-bogota"
      whatsappTopic="consultar perfumes Yanbal con descuento"
      footerLabel="Perfumes Yanbal Cúcuta y Bogotá"
    />
  );
}
