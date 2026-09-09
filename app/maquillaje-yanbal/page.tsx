import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Maquillaje Yanbal",
  description:
    "Labiales, máscaras y maquillaje para tu rutina. Revisa el tono y las promociones combinables antes de agregar tus favoritos.",
  alternates: { canonical: "/maquillaje-yanbal" },
  openGraph: {
    title: "Maquillaje Yanbal",
    description:
      "Labiales, máscaras y maquillaje para tu rutina. Revisa el tono y las promociones combinables antes de agregar tus favoritos.",
    url: "/maquillaje-yanbal",
  },
  twitter: {
    title: "Maquillaje Yanbal",
    description:
      "Labiales, máscaras y maquillaje para tu rutina. Revisa el tono y las promociones combinables antes de agregar tus favoritos.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Maquillaje Yanbal"
      intro="Labiales, máscaras y maquillaje para tu rutina. Revisa el tono y las promociones combinables antes de agregar tus favoritos."
      filter="maquillaje"
      gender=""
    />
  );
}
