import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Regalos Yanbal",
  description:
    "Perfumes, joyería y detalles de belleza para regalar. Elige la presentación y compra con el costo de entrega visible antes de pagar.",
  alternates: { canonical: "/regalos-yanbal" },
  openGraph: {
    title: "Regalos Yanbal",
    description:
      "Perfumes, joyería y detalles de belleza para regalar. Elige la presentación y compra con el costo de entrega visible antes de pagar.",
    url: "/regalos-yanbal",
  },
  twitter: {
    title: "Regalos Yanbal",
    description:
      "Perfumes, joyería y detalles de belleza para regalar. Elige la presentación y compra con el costo de entrega visible antes de pagar.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Regalos Yanbal"
      intro="Perfumes, joyería y detalles de belleza para regalar. Elige la presentación y compra con el costo de entrega visible antes de pagar."
      filter=""
      gender=""
    />
  );
}
