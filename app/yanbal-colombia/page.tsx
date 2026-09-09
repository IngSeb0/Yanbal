import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Comprar Yanbal online en Colombia",
  description:
    "Compra sin crear una cuenta. Elige tu departamento y municipio para conocer el envío; si tu ubicación aún requiere cotización, puedes solicitarla por WhatsApp. La tienda recibe pedidos para Colombia y prioriza la atención en Cúcuta y Bogotá.",
  alternates: { canonical: "/yanbal-colombia" },
  openGraph: {
    title: "Comprar Yanbal online en Colombia",
    description:
      "Compra sin crear una cuenta. Elige tu departamento y municipio para conocer el envío; si tu ubicación aún requiere cotización, puedes solicitarla por WhatsApp. La tienda recibe pedidos para Colombia y prioriza la atención en Cúcuta y Bogotá.",
    url: "/yanbal-colombia",
  },
  twitter: {
    title: "Comprar Yanbal online en Colombia",
    description:
      "Compra sin crear una cuenta. Elige tu departamento y municipio para conocer el envío; si tu ubicación aún requiere cotización, puedes solicitarla por WhatsApp. La tienda recibe pedidos para Colombia y prioriza la atención en Cúcuta y Bogotá.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Comprar Yanbal online en Colombia"
      intro="Compra sin crear una cuenta. Elige tu departamento y municipio para conocer el envío; si tu ubicación aún requiere cotización, puedes solicitarla por WhatsApp. La tienda recibe pedidos para Colombia y prioriza la atención en Cúcuta y Bogotá."
      filter=""
      gender=""
    />
  );
}
