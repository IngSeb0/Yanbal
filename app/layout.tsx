import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promociones Yanbal | Pedido por WhatsApp",
  description:
    "Promociones Yanbal de Campaña 9 con pedido directo por WhatsApp Business.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
