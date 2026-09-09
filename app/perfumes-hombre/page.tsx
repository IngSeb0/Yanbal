import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Perfumes Yanbal para hombre",
  description:
    "Fragancias masculinas para distintos estilos y ocasiones. Compra directamente o pide asesoría para elegir tu aroma.",
  alternates: { canonical: "/perfumes-hombre" },
  openGraph: {
    title: "Perfumes Yanbal para hombre",
    description:
      "Fragancias masculinas para distintos estilos y ocasiones. Compra directamente o pide asesoría para elegir tu aroma.",
    url: "/perfumes-hombre",
  },
  twitter: {
    title: "Perfumes Yanbal para hombre",
    description:
      "Fragancias masculinas para distintos estilos y ocasiones. Compra directamente o pide asesoría para elegir tu aroma.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Perfumes Yanbal para hombre"
      intro="Fragancias masculinas para distintos estilos y ocasiones. Compra directamente o pide asesoría para elegir tu aroma."
      filter="parfum"
      gender="hombre"
    />
  );
}
