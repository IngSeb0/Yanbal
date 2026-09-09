# Configuración de envíos

La única configuración de negocio está en `config/store.js`, dentro de `shippingConfig`.
Los valores deben ser enteros en pesos colombianos. `null` significa que el destino no
tiene tarifa confirmada y bloquea el pago. El valor `0` solo debe usarse cuando el
propietario haya autorizado explícitamente envío gratis.

La prioridad es:

1. `shippingConfig.cities[CODIGO_DIVIPOLA]`.
2. `SHIPPING_CUCUTA` o `SHIPPING_BOGOTA` para esas ciudades; si la variable no existe,
   se usan `shippingConfig.cucuta` o `shippingConfig.bogota`.
3. `SHIPPING_NATIONAL_DEFAULT`; si no existe, `shippingConfig.nationalDefault`.
4. Sin valor: `SHIPPING_UNAVAILABLE`, se bloquea el checkout y se ofrece finalizar por WhatsApp.

`FREE_SHIPPING_THRESHOLD` tiene prioridad sobre `shippingConfig.freeShippingThreshold`.
Permanece desactivado mientras ambos valores sean `null` o estén vacíos. Nunca convierte
un destino sin tarifa en envío gratis.
