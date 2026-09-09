import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Perfumes Yanbal",
  description:
    "Encuentra tu próxima fragancia: perfumes y colonias para uso diario, ocasiones especiales o regalos. Revisa la presentación y el precio de cada producto antes de elegir.",
  alternates: { canonical: "/perfumes-yanbal" },
  openGraph: {
    title: "Perfumes Yanbal",
    description:
      "Encuentra tu próxima fragancia: perfumes y colonias para uso diario, ocasiones especiales o regalos. Revisa la presentación y el precio de cada producto antes de elegir.",
    url: "/perfumes-yanbal",
  },
  twitter: {
    title: "Perfumes Yanbal",
    description:
      "Encuentra tu próxima fragancia: perfumes y colonias para uso diario, ocasiones especiales o regalos. Revisa la presentación y el precio de cada producto antes de elegir.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Perfumes Yanbal"
      intro="Encuentra tu próxima fragancia: perfumes y colonias para uso diario, ocasiones especiales o regalos. Revisa la presentación y el precio de cada producto antes de elegir."
      filter="parfum"
      gender=""
    />
  );
}
