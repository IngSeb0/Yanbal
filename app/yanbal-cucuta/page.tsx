import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Yanbal Cúcuta: perfumes, maquillaje y Total Block",
  description:
    "Cúcuta es una de nuestras principales zonas de atención. Elige tus productos, selecciona Cúcuta en la entrega y revisa el costo antes de pagar. Para áreas cercanas, selecciona tu municipio real; la cobertura se confirma según la zona.",
  alternates: { canonical: "/yanbal-cucuta" },
  openGraph: {
    title: "Yanbal Cúcuta: perfumes, maquillaje y Total Block",
    description:
      "Cúcuta es una de nuestras principales zonas de atención. Elige tus productos, selecciona Cúcuta en la entrega y revisa el costo antes de pagar. Para áreas cercanas, selecciona tu municipio real; la cobertura se confirma según la zona.",
    url: "/yanbal-cucuta",
  },
  twitter: {
    title: "Yanbal Cúcuta: perfumes, maquillaje y Total Block",
    description:
      "Cúcuta es una de nuestras principales zonas de atención. Elige tus productos, selecciona Cúcuta en la entrega y revisa el costo antes de pagar. Para áreas cercanas, selecciona tu municipio real; la cobertura se confirma según la zona.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Yanbal Cúcuta: perfumes, maquillaje y Total Block"
      intro="Cúcuta es una de nuestras principales zonas de atención. Elige tus productos, selecciona Cúcuta en la entrega y revisa el costo antes de pagar. Para áreas cercanas, selecciona tu municipio real; la cobertura se confirma según la zona."
      filter=""
      gender=""
    />
  );
}
