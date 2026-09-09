import { store } from "../config/store.js";
import {
  enrichProduct,
  money,
  productPath,
  available,
} from "../lib/commerce-products.js";
export const whatsappNumber = store.whatsapp;
export type StorefrontProduct = {
  id: string;
  sku: string;
  name: string;
  category: string;
  variant?: string;
  page: number;
  content?: string;
  price: number;
  promo_price?: number | null;
  normal_price?: number | null;
  promotion?: string;
  promotion_detail?: string;
  description?: string;
  benefits?: string[];
  image: string;
  slug?: string;
  saleLabel?: string;
  availability?: string;
};
export const formatCurrency = (n?: number | null) => money(n || 0);
export function whatsappLink(subject: string, detail: string) {
  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Hola, necesito asesoría sobre ${subject}. ${detail}`)}`;
}
export function productWhatsAppLink(product: StorefrontProduct) {
  const p = product.slug ? product : enrichProduct(product);
  return whatsappLink(
    `${p.name}, código ${p.sku}`,
    `Precio: ${money(p.price)}. ${store.url}${productPath(p)}`,
  );
}
export function BuyButtons({ product }: { product: StorefrontProduct }) {
  const p = product.slug ? product : enrichProduct(product);
  return (
    <div className="buy-buttons">
      <button
        className="button button--primary"
        type="button"
        data-buy-now={p.id}
        disabled={!available(p)}
      >
        Comprar ahora
      </button>
      <button
        className="button button--ghost"
        type="button"
        data-add-to-cart={p.id}
        disabled={!available(p)}
      >
        + Agregar
      </button>
    </div>
  );
}
export function ProductCatalogCard({
  product,
  featured = false,
}: {
  product: StorefrontProduct;
  featured?: boolean;
}) {
  const p = product.slug
    ? (product as ReturnType<typeof enrichProduct>)
    : enrichProduct(product);
  return (
    <article
      className={`shop-card ${featured ? "shop-card--featured" : ""}`}
      data-product-card
    >
      <a className="shop-card__image" href={productPath(p)}>
        <img
          src={p.image}
          alt={p.name}
          width="400"
          height="480"
          loading="lazy"
          decoding="async"
        />
        {p.discount > 0 && (
          <span className="discount-badge">−{p.discount}%</span>
        )}
      </a>
      <div className="shop-card__body">
        <small>
          {p.category} · Cód. {p.sku}
        </small>
        <h3>
          <a href={productPath(p)}>{p.name}</a>
        </h3>
        <p>{p.content || p.variant || "Producto Yanbal"}</p>
        <p className="price">
          {p.normal_price && <del>{money(p.normal_price)}</del>}
          <strong>{money(p.price)}</strong>
        </p>
        {p.savings > 0 && <p className="saving">Ahorras {money(p.savings)}</p>}
        {p.saleLabel && <p className="promotion-note">{p.saleLabel}</p>}
        <p className="availability">
          {available(p) ? "Disponible para pedido" : "Agotado temporalmente"}
        </p>
        <BuyButtons product={p} />
        <a
          className="support-link"
          href={productWhatsAppLink(p)}
          target="_blank"
          rel="noreferrer"
        >
          ¿Preguntas? WhatsApp
        </a>
      </div>
    </article>
  );
}
// Compatibility for existing landings. Global cart now belongs to the layout.
export function CartExperience(_props: { footerLabel?: string }) {
  void _props; // Retain the props signature used by existing category pages.
  return null;
}
export function AvailabilityNote() {
  return (
    <p className="fine-print">
      Los productos están sujetos a disponibilidad de Yanbal al momento de
      procesar el pedido. Si alguno se agota después de tu compra, podrás elegir
      un reemplazo o solicitar la devolución del valor correspondiente.
    </p>
  );
}
