import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yanbal Promociones Campaña 9",
  description:
    "Perfumes, maquillaje y protectores Yanbal con 50% de descuento y pedido directo por WhatsApp.",
};

const whatsappNumber = "573225285078";

const promos = [
  {
    name: "GAIA Eternal",
    category: "Parfum",
    price: "$121.000",
    discount: "50% DCTO",
    detail: "Aroma luminoso y elegante",
    image: "/promos/gaia-eternal.png",
    tone: "rose",
  },
  {
    name: "GAIA",
    category: "Parfum",
    price: "$121.000",
    discount: "50% DCTO",
    detail: "Fragancia femenina sofisticada",
    image: "/promos/gaia-parfum.png",
    tone: "violet",
  },
  {
    name: "Total Block Sport",
    category: "Ultraprotección SPF 100",
    price: "$78.000",
    discount: "50% DCTO",
    detail: "Ideal para actividades al aire libre",
    image: "/promos/total-block-sport.png",
    tone: "lime",
  },
  {
    name: "BB Cream",
    category: "Hidratante + Matificante",
    price: "$55.000 c/u",
    discount: "50% DCTO",
    detail: "Piel perfecta en un solo paso",
    image: "/promos/bb-cream.png",
    tone: "teal",
  },
  {
    name: "Dulce Amor",
    category: "Eau de Parfum",
    price: "$78.000",
    discount: "50% DCTO",
    detail: "Edición limitada, ideal para regalar",
    image: "/promos/dulce-amor.png",
    tone: "pink",
  },
  {
    name: "43N Paralel",
    category: "Parfum",
    price: "$143.000",
    discount: "50% DCTO",
    detail: "Actitud que deja huella",
    image: "/promos/43n-paralel.png",
    tone: "gold",
  },
  {
    name: "Dendur",
    category: "Eau de Parfum",
    price: "$115.000",
    discount: "50% DCTO",
    detail: "Aroma impactante",
    image: "/promos/dendur.png",
    tone: "amber",
  },
  {
    name: "Total Block Kids",
    category: "Ultraprotección SPF 100",
    price: "$78.000",
    discount: "50% DCTO",
    detail: "Protección para niños",
    image: "/promos/total-block-kids.png",
    tone: "orange",
  },
  {
    name: "Total Block Sport Plus",
    category: "Ultraprotección SPF 100",
    price: "$80.000",
    discount: "50% DCTO",
    detail: "Resistente al agua y al sudor",
    image: "/promos/total-block-sport-plus.png",
    tone: "green",
  },
];

function whatsappLink(productName: string, price: string) {
  const text = `Hola, quiero pedir ${productName} de las promociones Yanbal Campaña 9. Precio: ${price}.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__content">
          <p className="eyebrow">Pedido directo al WhatsApp Business</p>
          <h1 id="hero-title">Yanbal Promociones Campaña 9</h1>
          <p className="hero__copy">
            Perfumes, maquillaje y protección solar con 50% de descuento por
            tiempo limitado.
          </p>
          <div className="hero__actions" aria-label="Acciones principales">
            <a className="button button--primary" href="#promos">
              Ver promociones
            </a>
            <a
              className="button button--ghost"
              href={whatsappLink("promos Yanbal", "consultar disponibilidad")}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp 322 528 5078
            </a>
          </div>
        </div>
      </section>

      <section className="promo-strip" aria-label="Resumen de la campaña">
        <div>
          <strong>50% DCTO</strong>
          <span>en todas estas promos</span>
        </div>
        <div>
          <strong>Campaña 9</strong>
          <span>por tiempo limitado</span>
        </div>
        <div>
          <strong>Pedido rápido</strong>
          <span>atención por WhatsApp Business</span>
        </div>
      </section>

      <section className="catalog" id="promos" aria-labelledby="catalog-title">
        <div className="section-heading">
          <p className="eyebrow">Catálogo disponible</p>
          <h2 id="catalog-title">Elige tu promo Yanbal</h2>
          <p>
            Cada botón abre WhatsApp con el producto seleccionado para confirmar
            disponibilidad y finalizar tu pedido.
          </p>
        </div>

        <div className="product-grid">
          {promos.map((promo) => (
            <article
              className={`product-card product-card--${promo.tone}`}
              key={promo.name}
            >
              <a
                className="product-card__image-link"
                href={whatsappLink(promo.name, promo.price)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Pedir ${promo.name} por WhatsApp`}
              >
                <img
                  src={promo.image}
                  alt={`Promoción Yanbal ${promo.name}`}
                  loading="lazy"
                />
              </a>
              <div className="product-card__body">
                <div className="product-card__topline">
                  <span>{promo.discount}</span>
                  <span>Campaña 9</span>
                </div>
                <h3>{promo.name}</h3>
                <p className="product-card__category">{promo.category}</p>
                <p className="product-card__detail">{promo.detail}</p>
                <div className="product-card__footer">
                  <strong>{promo.price}</strong>
                  <a
                    className="order-link"
                    href={whatsappLink(promo.name, promo.price)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Pedir ${promo.name} por WhatsApp`}
                  >
                    Pedir ahora <span aria-hidden="true">&gt;</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="how-to" aria-labelledby="how-to-title">
        <div className="section-heading">
          <p className="eyebrow">Compra personalizada</p>
          <h2 id="how-to-title">Haz tu pedido en tres pasos</h2>
        </div>
        <div className="steps">
          <div>
            <span>1</span>
            <h3>Escoge tu promoción</h3>
            <p>Revisa la imagen, precio y beneficio de cada producto.</p>
          </div>
          <div>
            <span>2</span>
            <h3>Escribe por WhatsApp</h3>
            <p>El mensaje llega con el producto que quieres pedir.</p>
          </div>
          <div>
            <span>3</span>
            <h3>Confirma disponibilidad</h3>
            <p>Recibe atención directa para cerrar tu compra.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <p>Yanbal Promociones Campaña 9</p>
        <a
          href={whatsappLink("promos Yanbal", "consultar disponibilidad")}
          target="_blank"
          rel="noreferrer"
        >
          Pedir por WhatsApp Business
        </a>
      </footer>

      <a
        className="whatsapp-fab"
        href={whatsappLink("promos Yanbal", "consultar disponibilidad")}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir WhatsApp Business"
      >
        WhatsApp
      </a>
    </main>
  );
}
