import type { Metadata } from "next";
import { CategoryLanding } from "../category-landing";
import { sunCareProducts } from "../product-selections";

export const metadata: Metadata = {
  title: "Bloqueadores Yanbal Cúcuta y Bogotá | Total Block SPF",
  description:
    "Compra bloqueadores Yanbal Total Block en Cúcuta y Bogotá: SPF 100, protección solar facial, corporal, kids, sport y opciones con color.",
  keywords: [
    "bloqueadores Yanbal Cúcuta",
    "bloqueadores Yanbal Bogotá",
    "Total Block Yanbal",
    "bloqueador SPF 100 Yanbal",
    "protector solar Yanbal",
    "Total Block Sport",
    "Total Block Kids",
    "protección solar Cúcuta",
    "protección solar Bogotá",
  ],
};

const quickPoints = [
  {
    title: "Protección para sol fuerte",
    text:
      "Opciones Yanbal Total Block para rostro, cuerpo y uso diario con SPF alto.",
  },
  {
    title: "Uso diario, deporte y niños",
    text:
      "Consulta protectores solares para rutina facial, actividad al aire libre, piel infantil y piel con color.",
  },
  {
    title: "Compra con confirmación",
    text:
      "Revisa precio de campaña, código y disponibilidad antes de pagar o enviar el pedido completo.",
  },
];

const faqs = [
  {
    question: "¿Qué bloqueador Yanbal comprar para Cúcuta?",
    answer:
      "Para Cúcuta conviene revisar Total Block SPF alto, opciones resistentes al agua y presentaciones para rostro o cuerpo según exposición al sol.",
  },
  {
    question: "¿Hay Total Block Yanbal para Bogotá?",
    answer:
      "Sí. Puedes consultar bloqueadores Yanbal Total Block para Bogotá, incluyendo opciones faciales, con color, sport y kids según disponibilidad.",
  },
  {
    question: "¿Puedo pedir bloqueador por WhatsApp?",
    answer:
      "Sí. Agrega el bloqueador al carrito o escribe por WhatsApp para confirmar precio, presentación, código y entrega antes de comprar.",
  },
];

export default function BloqueadoresYanbalPage() {
  return (
    <CategoryLanding
      eyebrow="Bloqueadores Yanbal"
      title="Bloqueadores Yanbal Total Block"
      description="Compra bloqueadores Yanbal Total Block en Cúcuta y Bogotá: SPF 100, protectores solares para rostro, cuerpo, deporte, niños y opciones con color. Confirma disponibilidad por WhatsApp antes de pagar."
      localTitle="Protección solar Yanbal para Cúcuta y Bogotá"
      localCopy="Esta página ayuda a encontrar rápido bloqueadores Yanbal para quienes buscan protección solar, Total Block, SPF alto, textura ligera, opciones kids, sport o faciales con precio de campaña."
      productHeading="Bloqueadores y protección solar Yanbal"
      productCopy="Compara presentaciones Total Block, agrega al carrito y confirma por WhatsApp. Si no sabes cuál elegir, dime si lo necesitas para rostro, cuerpo, niños, deporte, uso diario o piel con color."
      products={sunCareProducts}
      quickPoints={quickPoints}
      faqs={faqs}
      urlPath="/bloqueadores-yanbal-cucuta-bogota"
      whatsappTopic="consultar bloqueadores Yanbal Total Block"
      footerLabel="Bloqueadores Yanbal Cúcuta y Bogotá"
    />
  );
}
