import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Perfumes Yanbal para mujer",
  description:
    "Explora fragancias femeninas y sus presentaciones. Si necesitas orientación sobre aromas, puedes consultarnos por WhatsApp.",
  alternates: { canonical: "/perfumes-mujer" },
  openGraph: {
    title: "Perfumes Yanbal para mujer",
    description:
      "Explora fragancias femeninas y sus presentaciones. Si necesitas orientación sobre aromas, puedes consultarnos por WhatsApp.",
    url: "/perfumes-mujer",
  },
  twitter: {
    title: "Perfumes Yanbal para mujer",
    description:
      "Explora fragancias femeninas y sus presentaciones. Si necesitas orientación sobre aromas, puedes consultarnos por WhatsApp.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Perfumes Yanbal para mujer"
      intro="Explora fragancias femeninas y sus presentaciones. Si necesitas orientación sobre aromas, puedes consultarnos por WhatsApp."
      filter="parfum"
      gender="mujer"
    />
  );
}
