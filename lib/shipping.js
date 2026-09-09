import municipalities from "../config/municipalities.json" with { type: "json" };
import { shippingConfig } from "../config/store.js";
export { municipalities };
const amount = (value) =>
  value === null || value === undefined || value === ""
    ? null
    : Number.isSafeInteger(Number(value)) && Number(value) >= 0
      ? Number(value)
      : null;
export function shippingQuote(
  departmentCode,
  cityCode,
  subtotal,
  env = process.env,
) {
  const city = municipalities.find(
    (m) => m.code === cityCode && m.departmentCode === departmentCode,
  );
  if (!city) throw new Error("Selecciona un departamento y municipio válidos.");
  let tariff;
  if (Object.hasOwn(shippingConfig.cities, cityCode))
    tariff = shippingConfig.cities[cityCode];
  else if (cityCode === "54001")
    tariff = env.SHIPPING_CUCUTA ?? shippingConfig.cucuta;
  else if (cityCode === "11001")
    tariff = env.SHIPPING_BOGOTA ?? shippingConfig.bogota;
  else tariff = env.SHIPPING_NATIONAL_DEFAULT ?? shippingConfig.nationalDefault;
  const base = amount(tariff),
    minimumOrder = amount(
      env.MINIMUM_ORDER ?? shippingConfig.minimumOrder,
    ),
    threshold = amount(
      env.FREE_SHIPPING_THRESHOLD ?? shippingConfig.freeShippingThreshold,
    );
  const meetsMinimum = minimumOrder === null || subtotal >= minimumOrder,
    free =
      base !== null &&
      (base === 0 || (threshold > 0 && subtotal >= threshold)),
    shipping = free ? 0 : base;
  return {
    city,
    code:
      base === null
        ? "SHIPPING_UNAVAILABLE"
        : meetsMinimum
          ? "SHIPPING_AVAILABLE"
          : "MINIMUM_ORDER_NOT_MET",
    configured: base !== null,
    checkoutEligible: base !== null && meetsMinimum,
    shipping,
    freeShipping: free,
    minimumOrder,
    amountToMinimum: meetsMinimum ? 0 : minimumOrder - subtotal,
    freeShippingThreshold: threshold > 0 ? threshold : null,
    total: base === null ? null : subtotal + shipping,
    message:
      base === null
        ? "Estamos confirmando el valor del envío para tu ubicación. Escríbenos por WhatsApp para finalizar tu pedido."
        : !meetsMinimum
          ? `El pedido mínimo es de $${minimumOrder.toLocaleString("es-CO")}. Agrega $${(minimumOrder - subtotal).toLocaleString("es-CO")} para continuar.`
        : cityCode === "54001"
          ? "Envío gratis en Cúcuta."
          : cityCode === "11001"
            ? "Envío gratis en Bogotá."
            : free
              ? "Envío gratis por compras desde $150.000."
              : "Envío nacional: $14.000.",
  };
}
