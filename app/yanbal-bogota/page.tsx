import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Productos Yanbal en Bogotá",
  description:
    "Encuentra perfumes para el día a día, maquillaje y cuidado personal con entrega en Bogotá según zona. Indica tu dirección, barrio y apartamento para facilitar el despacho. El envío aparece antes de abrir Mercado Pago.",
  alternates: { canonical: "/yanbal-bogota" },
  openGraph: {
    title: "Productos Yanbal en Bogotá",
    description:
      "Encuentra perfumes para el día a día, maquillaje y cuidado personal con entrega en Bogotá según zona. Indica tu dirección, barrio y apartamento para facilitar el despacho. El envío aparece antes de abrir Mercado Pago.",
    url: "/yanbal-bogota",
  },
  twitter: {
    title: "Productos Yanbal en Bogotá",
    description:
      "Encuentra perfumes para el día a día, maquillaje y cuidado personal con entrega en Bogotá según zona. Indica tu dirección, barrio y apartamento para facilitar el despacho. El envío aparece antes de abrir Mercado Pago.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Productos Yanbal en Bogotá"
      intro="Encuentra perfumes para el día a día, maquillaje y cuidado personal con entrega en Bogotá según zona. Indica tu dirección, barrio y apartamento para facilitar el despacho. El envío aparece antes de abrir Mercado Pago."
      filter=""
      gender=""
    />
  );
}
