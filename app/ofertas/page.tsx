import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Ofertas Yanbal",
  description:
    "Descubre descuentos calculados sobre el precio anterior del catálogo. Las promociones de dos unidades indican sus condiciones para que sepas exactamente qué recibes.",
  alternates: { canonical: "/ofertas" },
  openGraph: {
    title: "Ofertas Yanbal",
    description:
      "Descubre descuentos calculados sobre el precio anterior del catálogo. Las promociones de dos unidades indican sus condiciones para que sepas exactamente qué recibes.",
    url: "/ofertas",
  },
  twitter: {
    title: "Ofertas Yanbal",
    description:
      "Descubre descuentos calculados sobre el precio anterior del catálogo. Las promociones de dos unidades indican sus condiciones para que sepas exactamente qué recibes.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Ofertas Yanbal"
      intro="Descubre descuentos calculados sobre el precio anterior del catálogo. Las promociones de dos unidades indican sus condiciones para que sepas exactamente qué recibes."
      filter=""
      gender=""
    />
  );
}
