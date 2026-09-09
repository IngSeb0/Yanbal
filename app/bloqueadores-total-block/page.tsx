import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Bloqueadores Yanbal Total Block",
  description:
    "Explora la línea Total Block para rostro, cuerpo y actividades al aire libre. Consulta las características y recomendaciones de uso en el producto y su empaque.",
  alternates: { canonical: "/bloqueadores-total-block" },
  openGraph: {
    title: "Bloqueadores Yanbal Total Block",
    description:
      "Explora la línea Total Block para rostro, cuerpo y actividades al aire libre. Consulta las características y recomendaciones de uso en el producto y su empaque.",
    url: "/bloqueadores-total-block",
  },
  twitter: {
    title: "Bloqueadores Yanbal Total Block",
    description:
      "Explora la línea Total Block para rostro, cuerpo y actividades al aire libre. Consulta las características y recomendaciones de uso en el producto y su empaque.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Bloqueadores Yanbal Total Block"
      intro="Explora la línea Total Block para rostro, cuerpo y actividades al aire libre. Consulta las características y recomendaciones de uso en el producto y su empaque."
      filter="total block"
      gender=""
    />
  );
}
