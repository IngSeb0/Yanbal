import type { Metadata } from "next";
import { Landing } from "../landing-page";
export const metadata: Metadata = {
  title: "Cuidado facial Yanbal",
  description:
    "Productos de limpieza y cuidado para completar tu rutina facial. Lee las indicaciones del producto y elige según tus necesidades.",
  alternates: { canonical: "/cuidado-facial" },
  openGraph: {
    title: "Cuidado facial Yanbal",
    description:
      "Productos de limpieza y cuidado para completar tu rutina facial. Lee las indicaciones del producto y elige según tus necesidades.",
    url: "/cuidado-facial",
  },
  twitter: {
    title: "Cuidado facial Yanbal",
    description:
      "Productos de limpieza y cuidado para completar tu rutina facial. Lee las indicaciones del producto y elige según tus necesidades.",
  },
};
export default function Page() {
  return (
    <Landing
      title="Cuidado facial Yanbal"
      intro="Productos de limpieza y cuidado para completar tu rutina facial. Lee las indicaciones del producto y elige según tus necesidades."
      filter="facial"
      gender=""
    />
  );
}
