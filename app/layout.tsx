import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const googleTagManagerId = "GTM-NBHK5MMR";
const googleAdsId = "AW-18340615060";
const vercelAnalyticsSdkVersion = "2.0.1";

export const metadata: Metadata = {
  title: {
    default: "Yanbal C9 Cúcuta y Bogotá | Belleza, bloqueadores y perfumes",
    template: "%s | Yanbal Cúcuta y Bogotá",
  },
  description:
    "Productos de belleza Yanbal C9 en Cúcuta y Bogotá: perfumes, bloqueadores Total Block, maquillaje, cuidado facial y regalables con pedido por WhatsApp Business.",
  applicationName: "Promociones Yanbal",
  authors: [{ name: "Yanbal Promociones" }],
  creator: "Yanbal Promociones",
  publisher: "Yanbal Promociones",
  category: "Belleza y cuidado personal",
  keywords: [
    "Yanbal Cúcuta",
    "Yanbal Bogotá",
    "catálogo Yanbal C9",
    "ofertas Yanbal Cúcuta",
    "ofertas Yanbal Bogotá",
    "regalos Amor y Amistad Yanbal",
    "perfumes Yanbal",
    "perfumes Yanbal Cúcuta",
    "perfumes Yanbal Bogotá",
    "maquillaje Yanbal",
    "protector solar Yanbal",
    "bloqueadores Yanbal",
    "bloqueador Yanbal Total Block",
    "productos de belleza Cúcuta",
    "productos de belleza Bogotá",
  ],
  openGraph: {
    title: "Yanbal C9 Cúcuta y Bogotá | Belleza, bloqueadores y perfumes",
    description:
      "Descuentos en productos de belleza, perfumes, bloqueadores Total Block y regalos Yanbal por WhatsApp.",
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: "/yanbal-banner.webp",
        width: 601,
        height: 700,
        alt: "Yanbal Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yanbal C9 Cúcuta y Bogotá | Belleza, bloqueadores y perfumes",
    description:
      "Compra perfumes, bloqueadores y productos de belleza Yanbal C9 por WhatsApp Business en Cúcuta y Bogotá.",
    images: ["/yanbal-banner.webp"],
  },
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
    <html lang="es-CO">
      <head>
        <script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${googleTagManagerId}');`,
          }}
        />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`} />
        <script
          id="google-ads-tag"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAdsId}');`,
          }}
        />
        <script src="/conversion-tracking.js" defer />
        <script
          id="vercel-web-analytics"
          dangerouslySetInnerHTML={{
            __html: `window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};
(function(){var src='/_vercel/insights/script.js';if(document.head.querySelector('script[src*="'+src+'"]'))return;var script=document.createElement('script');script.defer=true;script.src=src;script.dataset.sdkn='@vercel/analytics';script.dataset.sdkv='${vercelAnalyticsSdkVersion}';document.head.appendChild(script);}());`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
