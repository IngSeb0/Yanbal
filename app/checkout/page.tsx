import type { Metadata } from "next";
import { AvailabilityNote } from "../storefront-ui";
export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};
const fields = [
  ["name", "Nombre completo", "name", "text"],
  ["phone", "Celular / WhatsApp", "tel", "tel"],
  ["email", "Email", "email", "email"],
  ["address", "Dirección", "street-address", "text"],
  ["neighborhood", "Barrio", "address-line2", "text"],
];
export default function Checkout() {
  return (
    <main className="shop-main shop-section">
      <p className="eyebrow">Compra como invitado</p>
      <h1>Finalizar compra</h1>
      <p>Datos y entrega → Revisa tu pedido → Mercado Pago</p>
      <ul className="hero-benefits" aria-label="Condiciones de compra y envío">
        <li>Pedido mínimo: $50.000</li>
        <li>Envío gratis en Cúcuta y Bogotá</li>
        <li>Envío gratis nacional desde $150.000</li>
        <li>Envío nacional: $14.000 en pedidos inferiores a $150.000</li>
      </ul>
      <form data-checkout-form noValidate className="checkout-layout">
        <section>
          <h2>Datos personales</h2>
          {fields.slice(0, 3).map(([name, label, auto, type]) => (
            <label className="form-field" key={name}>
              {label}
              <input
                name={name}
                autoComplete={auto}
                type={type}
                required
                maxLength={240}
                aria-describedby={`error-${name}`}
              />
              <small id={`error-${name}`} data-error={name} />
            </label>
          ))}
          <h2>Entrega</h2>
          <div className="quick-cities">
            <button type="button" data-city="54001">
              Cúcuta
            </button>
            <button type="button" data-city="11001">
              Bogotá
            </button>
          </div>
          <label className="form-field">
            Departamento
            <select
              name="departmentCode"
              required
              aria-describedby="error-departmentCode"
            >
              <option value="">Selecciona tu departamento</option>
            </select>
            <small id="error-departmentCode" data-error="departmentCode" />
          </label>
          <label className="form-field">
            Ciudad / municipio
            <select
              name="cityCode"
              required
              disabled
              aria-describedby="error-cityCode"
            >
              <option value="">Selecciona primero el departamento</option>
            </select>
            <small id="error-cityCode" data-error="cityCode" />
          </label>
          <p role="status" data-shipping-message>
            Selecciona tu municipio para calcular el envío.
          </p>
          {fields.slice(3).map(([name, label, auto, type]) => (
            <label className="form-field" key={name}>
              {label}
              <input
                name={name}
                autoComplete={auto}
                type={type}
                required
                maxLength={240}
                aria-describedby={`error-${name}`}
              />
              <small id={`error-${name}`} data-error={name} />
            </label>
          ))}
          {[
            ["complement", "Complemento / apartamento (opcional)"],
            ["reference", "Referencia (opcional)"],
            ["notes", "Notas (opcional)"],
          ].map(([name, label]) => (
            <label className="form-field" key={name}>
              {label}
              <textarea
                name={name}
                rows={2}
                maxLength={name === "notes" ? 500 : 240}
              />
            </label>
          ))}
        </section>
        <section className="checkout-summary">
          <h2>Tu pedido</h2>
          <div data-checkout-items />
          <dl>
            <div>
              <dt>Subtotal productos</dt>
              <dd data-subtotal>—</dd>
            </div>
            <div>
              <dt>Envío</dt>
              <dd data-shipping>Selecciona municipio</dd>
            </div>
            <div className="total-row">
              <dt>Total a pagar</dt>
              <dd data-total>—</dd>
            </div>
          </dl>
          <p data-free-shipping />
          <ul className="hero-benefits">
            <li>Pago procesado por Mercado Pago</li>
            <li>No almacenamos los datos de tu tarjeta</li>
            <li>Confirmación después del pago</li>
          </ul>
          <p className="fine-print">
            Al realizar el pedido aceptas los <a href="/terminos">términos</a> y
            autorizas el uso de tus datos para gestionar la compra según la{" "}
            <a href="/privacidad">política de privacidad</a>.
          </p>
          <button
            className="button button--primary"
            type="submit"
            data-pay
            disabled
          >
            Pagar y confirmar pedido
          </button>
          <p data-checkout-status role="status" />
          <p>
            <a href="/contacto">¿Necesitas ayuda?</a>
          </p>
          <h3>Disponibilidad de campaña</h3>
          <AvailabilityNote />
        </section>
      </form>
    </main>
  );
}
