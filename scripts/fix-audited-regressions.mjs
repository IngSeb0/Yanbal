import fs from "node:fs";
const edit = (file, fn) =>
  fs.writeFileSync(file, fn(fs.readFileSync(file, "utf8")));
edit("lib/commerce-products.js", (s) =>
  s
    .replace(
      'import { store } from "../config/store.js";',
      'import { store } from "../config/store.js";\nimport { promotionFor } from "../config/promotions.js";',
    )
    .replace(
      'const bundle = /Pide 1, recibe 2/i.test(p.promotion_detail || "");',
      'const rule = promotionFor(p);\n  const bundle = rule?.kind === "pack";',
    )
    .replace(
      'const mix = /Cualquier combinación/i.test(p.promotion_detail || "");',
      'const mix = rule?.kind === "mix";',
    )
    .replace(
      'const group = mix ? (/Hydra-Lip/.test(p.base_name) ? "hydra-lip" : slugify(p.base_name)) : null;',
      "const group = mix ? rule.group : null;",
    ),
);
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
pkg.scripts.build = "node scripts/export-commerce-data.mjs && vinext build";
pkg.scripts["test:commerce"] =
  "node --test tests/commerce.test.mjs tests/tracking.test.mjs";
pkg.scripts["test:sql"] = "node --test tests/migration.test.mjs";
pkg.scripts["preview:commerce"] = "node scripts/serve-commerce.mjs";
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
// Legacy callback must never trust a status query parameter.
fs.writeFileSync(
  "app/gracias/page.tsx",
  'import type { Metadata } from "next";\nimport Order from "../pedido/[estado]/page";\nexport const metadata:Metadata={title:"Estado de tu pedido",robots:{index:false,follow:false}};\nexport default function LegacyReturn(){return <Order params={Promise.resolve({estado:"pendiente"})}/>;}\n',
);
edit("app/category-landing.tsx", (s) =>
  s
    .replaceAll("https://schema.org/InStock", "https://schema.org/BackOrder")
    .replaceAll(
      'paymentAccepted: ["Mercado Pago", "WhatsApp"]',
      'paymentAccepted: ["Mercado Pago"]',
    ),
);
edit("app/landing-page.tsx", (s) =>
  s.replace(
    "const selected=products.filter",
    'const pool = title === "Ofertas Yanbal" ? products.filter(p=>p.discount>0).sort((a,b)=>b.discount-a.discount) : title === "Regalos Yanbal" ? products.filter(p=>p.giftable) : products;\n const selected=pool.filter',
  ),
);
edit("app/page.tsx", (s) =>
  s
    .replace('id="ofertas"', 'id="descuentos"')
    .replace(
      '<section className="shop-section need-section">',
      '<section className="shop-section need-section" id="amor-amistad">',
    )
    .replace(
      '<section className="catalog-cta">',
      '<section className="catalog-cta" id="productos-definidos">',
    ),
);
edit("public/commerce.js", (s) =>
  s
    .replace(
      '$("[data-consent-banner]")?.addEventListener("click",()=>{});',
      "",
    )
    .replace(
      'history.replaceState(null,"",location.pathname+(params.size?"?"+params:""));',
      'history.replaceState(null,"",location.pathname+(params.size?"?"+params:"")+location.hash);',
    ),
);
edit("scripts/export-vercel-static.mjs", (s) =>
  s.replace(
    'await writeFile(path.join(outDir,"sitemap.xml"),sitemap);',
    'await writeFile(path.join(outDir,"sitemap.xml"),sitemap);\nawait writeFile("public/sitemap.xml",sitemap);',
  ),
);
