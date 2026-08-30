export const whatsappNumber = "573026293535";

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
};

export function formatCurrency(value?: number | null) {
  if (!value) {
    return "Consultar";
  }

  return `$${value.toLocaleString("es-CO")}`;
}

export function whatsappLink(productName: string, price: string) {
  const text = `Hola, vi tu página de Yanbal y quiero ${productName}. Ciudad: Cúcuta o Bogotá. Precio: ${price}. ¿Me confirmas disponibilidad, descuento y entrega?`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function productWhatsAppLink(product: StorefrontProduct) {
  const price = product.promo_price ?? product.price;
  const text = `Hola, vi tu página de Yanbal y quiero comprar ${product.name}. Cód. ${product.sku}, pág. ${product.page}. Precio: ${formatCurrency(price)}. ¿Está disponible para Cúcuta o Bogotá?`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function ProductCatalogCard({
  product,
  featured = false,
}: {
  product: StorefrontProduct;
  featured?: boolean;
}) {
  const price = product.promo_price ?? product.price;
  const detail =
    product.promotion_detail ||
    product.description ||
    product.promotion ||
    "Producto Yanbal C9 con precio de campaña.";
  const searchText = [
    product.name,
    product.sku,
    product.category,
    product.variant,
    product.content,
    product.promotion,
    product.promotion_detail,
    product.description,
    ...(product.benefits ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    <article
      className={featured ? "catalog-product catalog-product--featured" : "catalog-product"}
      data-product-line
      data-product-category={product.category}
      data-search-text={searchText}
    >
      <a
        className="catalog-product__thumb"
        href={product.image}
        target="_blank"
        rel="noreferrer"
        aria-label={`Ver imagen de ${product.name}`}
      >
        <img
          src={product.image}
          alt={`Producto Yanbal C9: ${product.name}`}
          width="640"
          height="800"
          loading="lazy"
          decoding="async"
        />
      </a>
      <div className="catalog-product__main">
        <p className="catalog-product__meta">
          <span>Cód. {product.sku}</span>
          <span>Pág. {product.page}</span>
          {product.content ? <span>{product.content}</span> : null}
        </p>
        <h3>{product.name}</h3>
        <p>{detail}</p>
        {product.benefits?.length ? (
          <ul className="benefit-list benefit-list--compact" aria-label={`Beneficios de ${product.name}`}>
            {product.benefits.slice(0, 3).map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="catalog-product__buy">
        <span className="catalog-product__category">{product.category}</span>
        <strong>{formatCurrency(price)}</strong>
        {product.normal_price ? <small>Antes {formatCurrency(product.normal_price)}</small> : null}
        <div className="button-stack">
          <button
            className="cart-link"
            type="button"
            data-add-to-cart
            data-product-id={product.id}
            data-product-name={product.name}
            data-product-category={product.category}
            data-product-price={price}
            data-product-image={product.image}
            data-product-code={product.sku}
            data-product-page={product.page}
            data-product-variant={product.variant ?? ""}
          >
            Agregar al carrito
          </button>
          <a
            className="order-link order-link--ghost"
            href={productWhatsAppLink(product)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Comprar ${product.name} por WhatsApp`}
            data-whatsapp-cta
          >
            Comprar por WhatsApp <span aria-hidden="true">&gt;</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function CartExperience({
  footerLabel = "Yanbal C9 Cúcuta y Bogotá",
}: {
  footerLabel?: string;
}) {
  return (
    <>
      <a
        className="whatsapp-fab"
        href={whatsappLink("productos Yanbal C9", "consultar disponibilidad")}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir WhatsApp Business"
        data-whatsapp-cta
      >
        WhatsApp
      </a>

      <button className="cart-fab" type="button" data-cart-open aria-label="Abrir carrito">
        Carrito <span data-cart-count hidden>0</span>
      </button>

      <div className="cart-backdrop" data-cart-backdrop hidden />
      <aside className="cart-drawer" data-cart-drawer hidden aria-labelledby="cart-drawer-title">
        <div className="cart-drawer__header">
          <div>
            <p className="eyebrow">Pedido Yanbal</p>
            <h2 id="cart-drawer-title">Carrito</h2>
          </div>
          <button className="cart-close" type="button" data-cart-close aria-label="Cerrar carrito">
            ×
          </button>
        </div>
        <div className="cart-items" data-cart-items />
        <p className="cart-empty" data-cart-empty>
          Aún no has agregado productos.
        </p>
        <div className="cart-summary">
          <span>Total productos</span>
          <strong data-cart-total>$0</strong>
        </div>
        <form className="cart-form" data-cart-checkout-form>
          <div className="field-grid">
            <label>
              Nombre
              <input name="name" type="text" placeholder="Tu nombre" />
            </label>
            <label>
              Teléfono
              <input name="phone" type="tel" placeholder="302 629 3535" />
            </label>
            <label>
              Ciudad
              <select name="city" defaultValue="Cúcuta">
                <option>Cúcuta</option>
                <option>Bogotá</option>
                <option>Otra ciudad</option>
              </select>
            </label>
            <label>
              Dirección
              <input name="address" type="text" placeholder="Barrio, dirección o punto de entrega" />
            </label>
          </div>
          <label>
            Notas del pedido
            <textarea name="notes" rows={3} placeholder="Tono, aroma, fecha de entrega o disponibilidad" />
          </label>
          <p className="checkout-safe-note">
            Tus datos están seguros y protegidos. Uso tu información solo para
            confirmar disponibilidad, entrega y soporte del pedido. Los datos de
            tarjeta no pasan por esta página: el pago se completa directamente
            en Mercado Pago.
          </p>
          <div className="button-stack">
            <button className="pay-link" type="submit" name="payment" value="mercadopago">
              Pagar seguro con Mercado Pago
            </button>
            <button className="order-link order-link--ghost" type="submit" name="payment" value="whatsapp">
              Enviar pedido por WhatsApp
            </button>
          </div>
          <p className="status-message" data-cart-status role="status" />
        </form>
      </aside>

      <script src="/storefront.js" defer></script>
      <span className="sr-only">{footerLabel}</span>
    </>
  );
}
