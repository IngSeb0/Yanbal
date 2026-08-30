import type { Metadata } from "next";
import {
  CartExperience,
  ProductCatalogCard,
  whatsappLink,
  whatsappNumber,
} from "./storefront-ui";
import {
  discountProducts,
  loveAndFriendshipProducts,
  storefrontCategories,
  storefrontProductGroups,
  storefrontProducts,
} from "./product-selections";

export const metadata: Metadata = {
  title: "Yanbal C9 Cúcuta y Bogotá | Productos de belleza en descuento",
  description:
    "Compra productos de belleza Yanbal C9 con descuento en Cúcuta y Bogotá: perfumes, bloqueadores solares Total Block, maquillaje, cuidado facial y regalables por WhatsApp.",
  keywords: [
    "Yanbal Cúcuta",
    "Yanbal Bogotá",
    "productos Yanbal en descuento",
    "productos de belleza Cúcuta",
    "productos de belleza Bogotá",
    "bloqueadores Yanbal Cúcuta",
    "bloqueadores Yanbal Bogotá",
    "bloqueador Total Block Yanbal",
    "perfumes Yanbal Cúcuta",
    "perfumes Yanbal Bogotá",
    "ofertas Yanbal Colombia",
    "regalos Amor y Amistad Yanbal",
    "comprar Yanbal por WhatsApp",
    "catálogo Yanbal C9",
  ],
};

const businessProfile = [
  "Asesoría personalizada por WhatsApp Business",
  "Productos Yanbal C9 con precios de campaña",
  "Atención local para pedidos en Cúcuta y Bogotá",
  "Carrito para armar el pedido antes de confirmar",
];

const quickIntentLinks = [
  {
    title: "Estoy en Cúcuta",
    text: "Confirma disponibilidad local, precio de campaña y entrega para productos Yanbal.",
    cta: "Pedir en Cúcuta",
    href: whatsappLink("promociones Yanbal en Cúcuta", "confirmar precio de campaña"),
  },
  {
    title: "Estoy en Bogotá",
    text: "Pregunta por perfumes, bloqueadores, maquillaje y regalables con asesoría directa.",
    cta: "Pedir en Bogotá",
    href: whatsappLink("promociones Yanbal en Bogotá", "confirmar precio de campaña"),
  },
  {
    title: "Quiero perfume",
    text: "Te ayudo a elegir aroma femenino, masculino o regalo según presupuesto y ocasión.",
    cta: "Consultar perfumes",
    href: "/perfumes-yanbal-cucuta-bogota",
  },
  {
    title: "Quiero bloqueador",
    text: "Consulta Total Block para uso diario, deporte, niños, rostro o cuerpo.",
    cta: "Consultar bloqueador",
    href: "/bloqueadores-yanbal-cucuta-bogota",
  },
  {
    title: "Busco regalo",
    text: "Opciones listas para Amor y Amistad: perfume, collar, brillo, bálsamo o combo.",
    cta: "Ver regalables",
    href: whatsappLink("regalos Yanbal Amor y Amistad", "confirmar disponibilidad"),
  },
  {
    title: "Tengo un código",
    text: "Envíame el código del catálogo y reviso precio, existencia y producto correcto.",
    cta: "Enviar código",
    href: whatsappLink("un producto Yanbal por código de catálogo", "consultar"),
  },
];

const buyingQuestions = [
  {
    question: "¿Puedo preguntar antes de pagar?",
    answer:
      "Sí. Puedes escribir por WhatsApp para confirmar precio, aroma, tono, disponibilidad y entrega antes de finalizar.",
  },
  {
    question: "¿Qué productos se venden más?",
    answer:
      "Perfumes Yanbal, bloqueadores Total Block, maquillaje, cuidado facial y regalos de Amor y Amistad son las búsquedas más comunes.",
  },
  {
    question: "¿Cómo pido varios productos?",
    answer:
      "Agrega todo al carrito y envía el pedido completo por WhatsApp. Así se confirma más rápido y con menos errores.",
  },
];

const localSeoTopics = [
  {
    title: "Productos de belleza Yanbal en Cúcuta",
    text:
      "Encuentra maquillaje, cuidado facial, hidratantes, labiales, iluminadores y productos de cuidado personal Yanbal con asesoría directa para pedidos en Cúcuta.",
  },
  {
    title: "Bloqueadores Yanbal Total Block en Bogotá",
    text:
      "Consulta bloqueadores solares Yanbal, Total Block SPF 100 y protectores para rostro, cuerpo, deporte, niños y uso diario con disponibilidad para Bogotá.",
  },
  {
    title: "Perfumes Yanbal con descuento",
    text:
      "Elige perfumes Yanbal femeninos y masculinos como Dulce Amor, Ohm, Dendur, Gaia y fragancias de campaña para regalar o comprar al mejor precio disponible.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Yanbal Cúcuta y Bogotá por WhatsApp",
  description:
    "Productos de belleza Yanbal C9 con descuento, perfumes, bloqueadores Total Block, maquillaje, regalables de Amor y Amistad, carrito de compras y asesoría por WhatsApp Business para Cúcuta y Bogotá.",
  telephone: "+573026293535",
  areaServed: [
    { "@type": "City", name: "Cúcuta" },
    { "@type": "City", name: "Bogotá" },
  ],
  paymentAccepted: ["Mercado Pago", "WhatsApp"],
  url: "https://yanbal-promos-cucuta-bogota.vercel.app/",
  sameAs: [`https://wa.me/${whatsappNumber}`],
  image: "/yanbal-banner.webp",
  knowsAbout: [
    "productos de belleza Yanbal",
    "bloqueadores Yanbal Total Block",
    "perfumes Yanbal",
    "maquillaje Yanbal",
    "regalos Amor y Amistad Yanbal",
  ],
  department: [
    {
      "@type": "Store",
      name: "Productos de belleza Yanbal en Cúcuta y Bogotá",
    },
    {
      "@type": "Store",
      name: "Bloqueadores Yanbal Total Block SPF",
    },
    {
      "@type": "Store",
      name: "Perfumes Yanbal femeninos y masculinos",
    },
  ],
  makesOffer: [...loveAndFriendshipProducts, ...discountProducts, ...storefrontProducts]
    .slice(0, 42)
    .map((product) => ({
      "@type": "Offer",
      priceCurrency: "COP",
      price: String(product.promo_price ?? product.price),
      availability: "https://schema.org/InStock",
      itemOffered: {
        "@type": "Product",
        name: `Yanbal ${product.name}`,
        description:
          product.promotion_detail ||
          product.description ||
          product.promotion ||
          product.content ||
          product.category,
        category: product.category,
        sku: product.sku,
        image: product.image,
      },
    })),
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="eyebrow">Asesora Yanbal en Cúcuta y Bogotá</p>
          <h1 id="hero-title">Productos Yanbal con descuento</h1>
          <p className="hero__copy">
            Soy tu asesora Yanbal. Aquí encuentras descuentos de campaña,
            perfumes, bloqueadores solares Total Block, maquillaje, cuidado
            facial, regalables de Amor y Amistad y productos del C9 para Cúcuta
            y Bogotá. Agrega al carrito y confirma por WhatsApp Business o pago
            en línea.
          </p>
          <div className="hero__actions" aria-label="Acciones principales">
            <a
              className="button button--primary button--whatsapp"
              href={whatsappLink("productos Yanbal C9 en descuento", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              Comprar por WhatsApp
            </a>
            <a className="button button--ghost" href="#descuentos">
              Ver descuentos
            </a>
            <a className="button button--ghost" href="/perfumes-yanbal-cucuta-bogota">
              Perfumes
            </a>
            <a className="button button--ghost" href="/bloqueadores-yanbal-cucuta-bogota">
              Bloqueadores
            </a>
            <a className="button button--ghost" href="#amor-amistad">
              Amor y Amistad
            </a>
            <a className="button button--ghost" href="/regalables">
              Regalables
            </a>
            <a className="button button--ghost" href="/cucuta">
              Yanbal Cúcuta
            </a>
            <a className="button button--ghost" href="/bogota">
              Yanbal Bogotá
            </a>
            <a className="button button--ghost" href="#carrito" data-cart-open>
              Carrito <span className="cart-count-inline" data-cart-count hidden>0</span>
            </a>
            <a
              className="button button--ghost"
              href={whatsappLink("productos Yanbal C9", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
              data-whatsapp-cta
            >
              WhatsApp 302 629 3535
            </a>
          </div>
        </div>
      </section>

      <section className="promo-strip" aria-label="Resumen de tienda">
        <div>
          <strong>Cúcuta y Bogotá</strong>
          <span>asesoría local y pedidos por WhatsApp</span>
        </div>
        <div>
          <strong>{storefrontProducts.length} productos</strong>
          <span>tarjetas con recortes individuales</span>
        </div>
        <div>
          <strong>Carrito activo</strong>
          <span>arma el pedido antes de pagar o confirmar</span>
        </div>
      </section>

      <section className="quick-order" id="pedir-whatsapp" aria-labelledby="quick-order-title">
        <div className="section-heading">
          <p className="eyebrow">Compra rápida</p>
          <h2 id="quick-order-title">Elige lo que buscas y escribe directo</h2>
          <p>
            Si llegaste desde un anuncio, usa una de estas opciones para abrir
            WhatsApp con el mensaje listo. Así puedo responderte con precio,
            disponibilidad y entrega sin hacerte repetir la información.
          </p>
        </div>
        <div className="quick-order__grid">
          {quickIntentLinks.map((intent) => (
            <article className="quick-order__card" key={intent.title}>
              <h3>{intent.title}</h3>
              <p>{intent.text}</p>
              <a
                className={intent.href.startsWith("http") ? "order-link" : "order-link order-link--ghost"}
                href={intent.href}
                target={intent.href.startsWith("http") ? "_blank" : undefined}
                rel={intent.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={
                  intent.href.startsWith("http")
                    ? `${intent.cta} por WhatsApp`
                    : `Abrir ${intent.cta}`
                }
                data-whatsapp-cta={intent.href.startsWith("http") ? true : undefined}
              >
                {intent.cta}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="lead-panel" aria-labelledby="lead-title">
        <div>
          <p className="eyebrow">Respuesta rápida</p>
          <h2 id="lead-title">Escríbeme y te confirmo la promo disponible</h2>
          <p>
            No tienes que pagar para preguntar. Si vienes del anuncio, abre
            WhatsApp y dime qué buscas: perfume, bloqueador, maquillaje, regalo
            o producto por código. Te confirmo disponibilidad, precio y entrega
            para Cúcuta o Bogotá.
          </p>
        </div>
        <div className="lead-panel__actions">
          <a
            className="button button--whatsapp"
            href={whatsappLink("asesoría Yanbal por WhatsApp", "quiero revisar promociones")}
            target="_blank"
            rel="noreferrer"
            data-whatsapp-cta
          >
            Escríbeme por WhatsApp
          </a>
          <a className="button button--ghost" href="#productos-definidos">
            Ver productos antes
          </a>
          <ul className="lead-panel__proof" aria-label="Razones para escribir por WhatsApp">
            <li>Mensaje listo para enviar.</li>
            <li>Atención en Cúcuta y Bogotá.</li>
            <li>Confirmo descuento antes de pagar.</li>
          </ul>
        </div>
      </section>

      <section className="answer-panel" aria-labelledby="answers-title">
        <div className="section-heading">
          <p className="eyebrow">Antes de escribir</p>
          <h2 id="answers-title">Respuestas rápidas para comprar Yanbal</h2>
          <p>
            La idea es que compres con seguridad: puedes preguntar primero,
            armar carrito, comparar productos y confirmar disponibilidad para
            Cúcuta o Bogotá antes de pagar.
          </p>
        </div>
        <div className="answer-grid">
          {buyingQuestions.map((item) => (
            <article key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog product-catalog featured-discounts" id="descuentos" aria-labelledby="discounts-title">
        <div className="section-heading">
          <p className="eyebrow">Descuentos Yanbal C9</p>
          <h2 id="discounts-title">Ofertas destacadas para pedir hoy</h2>
          <p>
            Selección de productos con descuento de campaña para quienes buscan
            Yanbal en Cúcuta y Bogotá: perfumes, maquillaje, cuidado personal y
            detalles con precio claro para agregar al carrito.
          </p>
        </div>
        <div className="highlight-product-grid">
          {discountProducts.map((product) => (
            <ProductCatalogCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      <section className="catalog product-catalog love-section" id="amor-amistad" aria-labelledby="love-title">
        <div className="section-heading">
          <p className="eyebrow">Regalos Amor y Amistad</p>
          <h2 id="love-title">Regalables Yanbal para sorprender</h2>
          <p>
            Esta selección reúne lo más buscado para Amor y Amistad: Ohm,
            Collar Amira, Dulce Amor, Combo Soy Única, iluminador y bálsamo
            labial. Son opciones fáciles de regalar en Cúcuta y Bogotá porque
            combinan aroma, brillo, cuidado y presentación especial.
          </p>
          <div className="catalog-cta">
            <a className="button button--ghost" href="/regalos-amor-amistad-colombia">
              Ver regalos Amor y Amistad Colombia
            </a>
          </div>
        </div>
        <div className="love-callout">
          <strong>Sección especial</strong>
          <span>elige un regalo, agrégalo al carrito y confirma disponibilidad por WhatsApp.</span>
        </div>
        <div className="highlight-product-grid">
          {loveAndFriendshipProducts.map((product) => (
            <ProductCatalogCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      <section className="business-panel" aria-labelledby="profile-title">
        <div>
          <p className="eyebrow">Quién soy</p>
          <h2 id="profile-title">Tu asesora Yanbal por WhatsApp Business</h2>
          <p>
            Te ayudo a elegir perfumes, maquillaje, protección solar, cuidado
            personal y regalos Yanbal según tu presupuesto, ocasión y
            disponibilidad de campaña. Atiendo pedidos locales en Cúcuta y
            Bogotá con acompañamiento directo antes y después de comprar.
          </p>
        </div>
        <ul className="business-list" aria-label="Fortalezas del perfil de negocio">
          {businessProfile.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="seo-panel seo-panel--topics" aria-labelledby="local-seo-title">
        <div>
          <p className="eyebrow">Belleza local</p>
          <h2 id="local-seo-title">Productos de belleza, bloqueadores y perfumes en Cúcuta y Bogotá</h2>
          <p>
            Esta tienda está pensada para quienes buscan comprar Yanbal en
            Cúcuta o Bogotá con precio claro, asesoría rápida y carrito de
            compra. Aquí puedes encontrar perfumes Yanbal, bloqueadores solares
            Total Block, maquillaje, cuidado facial, cuidado personal y regalos
            de campaña.
          </p>
        </div>
        <div className="copy-grid copy-grid--seo">
          {localSeoTopics.map((topic) => (
            <article key={topic.title}>
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="security-panel" aria-labelledby="security-title">
        <div>
          <p className="eyebrow">Compra segura</p>
          <h2 id="security-title">Tus datos están seguros y protegidos</h2>
          <p>
            Esta tienda usa HTTPS, cabeceras de seguridad y validaciones en el
            servidor para proteger el pedido. Solo uso tus datos de contacto
            para confirmar disponibilidad, entrega y soporte por WhatsApp
            Business.
          </p>
        </div>
        <ul className="security-list" aria-label="Protección de datos y pagos">
          <li>No guardo datos de tarjeta en la página.</li>
          <li>El pago en línea se procesa directamente en Mercado Pago.</li>
          <li>WhatsApp se usa para confirmar disponibilidad y entrega.</li>
          <li>Los catálogos del servidor requieren clave privada de administrador.</li>
        </ul>
      </section>

      <section className="catalog product-catalog" id="productos-definidos" aria-labelledby="defined-products-title">
        <div className="section-heading">
          <p className="eyebrow">Todos los productos</p>
          <h2 id="defined-products-title">Busca por código, producto o categoría</h2>
          <p>
            Aquí están los productos definidos del C9 con recorte individual,
            código, página, presentación y precio de campaña. Agrega uno o
            varios al carrito para enviar el pedido completo por WhatsApp o
            pagar seguro por Mercado Pago.
          </p>
        </div>

        <div className="product-tools" aria-label="Buscar productos Yanbal C9">
          <label>
            Buscar
            <input
              type="search"
              placeholder="Ej. Dulce Amor, Ohm, 2040, collar"
              data-product-search
            />
          </label>
          <label>
            Categoría
            <select data-product-category-filter defaultValue="">
              <option value="">Todas las categorías</option>
              {storefrontCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="product-count" aria-live="polite">
          <strong>{storefrontProducts.length}</strong> productos cargados con precio de campaña.
        </div>

        <div className="defined-product-groups">
          {storefrontProductGroups.map((group, index) => (
            <details className="defined-product-group" key={group.category} open={index < 2}>
              <summary>
                <span>{group.category}</span>
                <strong>{group.products.length} productos</strong>
              </summary>
              <div className="defined-product-list">
                {group.products.map((product) => (
                  <ProductCatalogCard key={product.id} product={product} />
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="cart-anchor" id="carrito" aria-labelledby="cart-anchor-title">
        <div className="section-heading">
          <p className="eyebrow">Carrito</p>
          <h2 id="cart-anchor-title">Arma el pedido antes de confirmar</h2>
          <p>
            Agrega varios productos, confirma tus datos y finaliza con pago
            seguro por Mercado Pago. Si prefieres asesoría antes de pagar,
            también puedes enviar el pedido por WhatsApp.
          </p>
        </div>
        <button className="button button--primary" type="button" data-cart-open>
          Ver carrito <span data-cart-count hidden>0</span>
        </button>
      </section>

      <footer className="site-footer">
        <p>Yanbal C9 Cúcuta y Bogotá</p>
        <div className="footer-links">
          <a href="/regalables">Regalables Amor y Amistad</a>
          <a href="/cucuta">Yanbal Cúcuta</a>
          <a href="/bogota">Yanbal Bogotá</a>
          <a href="/regalos-amor-amistad-colombia">Regalos Colombia</a>
          <a href="/perfumes-yanbal-cucuta-bogota">Perfumes Yanbal</a>
          <a href="/bloqueadores-yanbal-cucuta-bogota">Bloqueadores Yanbal</a>
          <a href="/catalogo">Catálogo separado</a>
          <a
            href={whatsappLink("productos Yanbal C9", "consultar disponibilidad")}
            target="_blank"
            rel="noreferrer"
            data-whatsapp-cta
          >
            Pedir por WhatsApp Business
          </a>
        </div>
      </footer>

      <CartExperience />
    </main>
  );
}
