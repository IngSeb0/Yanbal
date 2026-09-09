import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Cuidado personal Yanbal",
  description:
    "Cremas, cuidado corporal y productos para tu rutina diaria. Explora las presentaciones y ofertas del catálogo.",
  alternates: { canonical: "/cuidado-personal" },
  openGraph: {
    title: "Cuidado personal Yanbal",
    description:
      "Cremas, cuidado corporal y productos para tu rutina diaria. Explora las presentaciones y ofertas del catálogo.",
    url: "/cuidado-personal",
  },
  twitter: {
    title: "Cuidado personal Yanbal",
    description:
      "Cremas, cuidado corporal y productos para tu rutina diaria. Explora las presentaciones y ofertas del catálogo.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Cuidado personal Yanbal"
      intro="Cremas, cuidado corporal y productos para tu rutina diaria. Explora las presentaciones y ofertas del catálogo."
      filter="cuidado personal"
      gender=""
    />
  );
}
