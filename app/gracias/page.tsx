import type { Metadata } from "next";
import Order from "../pedido/[estado]/page";
export const metadata: Metadata = {
  title: "Estado de tu pedido",
  robots: { index: false, follow: false },
};
export default function LegacyReturn() {
  return <Order params={Promise.resolve({ estado: "pendiente" })} />;
}
