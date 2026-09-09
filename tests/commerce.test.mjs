import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { Readable } from "node:stream";
import {
  products,
  cartLines,
  enrichProduct,
} from "../lib/commerce-products.js";
import { catalogProducts } from "../lib/catalog-products.js";
import { virtualProducts } from "../lib/virtual-products.js";
import { shippingQuote, municipalities } from "../lib/shipping.js";
import { validateCustomer } from "../api/cart/checkout.js";
import quoteHandler from "../api/cart/quote.js";
import checkoutHandler from "../api/cart/checkout.js";
import { validSignature } from "../api/mercadopago/webhook.js";
import { promotionRules } from "../config/promotions.js";
import { shippingConfig } from "../config/store.js";
const call = async (handler, body, method = "POST") => {
  const req = Readable.from([Buffer.from(JSON.stringify(body))]);
  req.method = method;
  req.headers = {};
  let data, code;
  const res = {
    setHeader() {},
    set statusCode(v) {
      code = v;
    },
    end(s) {
      data = JSON.parse(s);
    },
  };
  await handler(req, res);
  return { code, data };
};
test("469 original references, source facts and images remain present", () => {
  assert.equal(catalogProducts.length, 468);
  assert.equal(virtualProducts.length, 1);
  assert.equal(products.length, 469);
  assert.equal(new Set(products.map((p) => p.slug)).size, 469);
  for (const source of [...catalogProducts, ...virtualProducts]) {
    const p = products.find((p) => p.id === source.id);
    assert.ok(p);
    for (const key of [
      "sku",
      "name",
      "category",
      "page",
      "content",
      "image",
      "promotion",
      "promotion_detail",
      "description",
      "benefits",
    ])
      assert.deepEqual(p[key], source[key], source.id + " " + key);
    assert.ok(fs.existsSync("public" + p.image), p.image);
    assert.ok(Number.isSafeInteger(p.price) && p.price > 0);
    if (!p.promotionGroup)
      assert.equal(p.price, source.promo_price ?? source.price);
  }
});
test("catalog audit finds no invalid commercial or routing data", () => {
  const duplicates = (values) =>
    values.filter((value, index) => values.indexOf(value) !== index);
  assert.deepEqual(duplicates(products.map((p) => p.slug)), []);
  assert.deepEqual(duplicates(products.map((p) => p.sku)), []);
  for (const p of products) {
    assert.ok(String(p.name || "").trim(), p.id + " missing name");
    assert.ok(p.slug, p.id + " missing slug");
    assert.ok(Number.isSafeInteger(p.price) && p.price > 0, p.id + " price");
    assert.ok(
      !p.normal_price || p.price <= p.normal_price,
      p.id + " old price",
    );
    assert.ok(p.discount >= 0 && p.discount <= 100, p.id + " discount");
    assert.ok(fs.existsSync("public" + p.image), p.id + " image");
    if (p.promotionGroup) assert.equal(p.requiredQuantity, 2, p.id);
    if (p.unitsPerPack > 1) {
      assert.equal(p.requiredQuantity, 1, p.id);
      assert.match(p.saleLabel, /2 unidades/, p.id);
    }
  }
  for (const rule of promotionRules)
    for (const sku of rule.skus)
      assert.ok(
        products.some((p) => p.sku === sku),
        "promotion SKU " + sku,
      );
});
test("quantities and unknown/unavailable products fail closed; frontend prices ignored", () => {
  const p = products.find((p) => p.sku === "2203");
  for (const quantity of [0, -1, 1.5, NaN, 21, "2", Infinity])
    assert.throws(() => cartLines([{ id: p.id, quantity }]));
  assert.throws(() => cartLines([{ id: "unknown", quantity: 1 }]));
  assert.throws(() =>
    cartLines([
      { id: p.id, quantity: 1 },
      { id: p.id, quantity: 1 },
    ]),
  );
  assert.equal(
    cartLines([{ id: p.id, quantity: 2, price: 1 }])[0].price,
    p.price,
  );
});
test("reviewed 2-for promotions respect allowed groups and pack quantities", () => {
  const p = products.find((p) => p.sku === "723"),
    other = products.find((p) => p.sku === "691"),
    wrong = products.find((p) => p.sku === "5318");
  assert.equal(p.price, 29000);
  assert.equal(p.bundlePrice, 58000);
  assert.throws(() => cartLines([{ id: p.id, quantity: 1 }]), /2 unidades/);
  assert.throws(() =>
    cartLines([
      { id: p.id, quantity: 1 },
      { id: wrong.id, quantity: 1 },
    ]),
  );
  const lines = cartLines([
    { id: p.id, quantity: 1 },
    { id: other.id, quantity: 1 },
  ]);
  assert.equal(
    lines.reduce((s, l) => s + l.price * l.quantity, 0),
    58000,
  );
  const pack = products.find((p) => p.sku === "2223");
  assert.equal(pack.unitsPerPack, 2);
  assert.equal(cartLines([{ id: pack.id, quantity: 1 }])[0].price, 156000);
  assert.throws(
    () =>
      enrichProduct({
        ...catalogProducts.find((p) => p.sku === "723"),
        price: 1,
        promo_price: 1,
      }),
    /review/,
  );
  const unknown = enrichProduct({
    id: "future",
    name: "Future",
    sku: "FUTURE",
    price: 58000,
    promotion_detail: "Cualquier combinación: 2 por $58.000",
  });
  assert.equal(unknown.price, 58000);
  assert.equal(unknown.promotionGroup, null);
});
test("32 departments plus Bogota use the confirmed shipping rules", () => {
  assert.equal(new Set(municipalities.map((m) => m.departmentCode)).size, 33);
  assert.equal(municipalities.length, 1122);
  assert.throws(() => shippingQuote("05", "11001", 100000, {}));
  for (const code of ["54001", "11001", "05001"]) {
    const m = municipalities.find((m) => m.code === code);
    const q = shippingQuote(m.departmentCode, code, 100000, {});
    assert.equal(q.configured, true);
    assert.equal(q.checkoutEligible, true);
  }
  assert.equal(shippingQuote("54", "54001", 100000, {}).shipping, 0);
  assert.equal(shippingQuote("11", "11001", 100000, {}).shipping, 0);
  assert.equal(shippingQuote("05", "05001", 100000, {}).shipping, 14000);
  const known = shippingQuote("05", "05001", 100000, {
    SHIPPING_NATIONAL_DEFAULT: "15000",
  });
  assert.equal(known.total, 115000);
  assert.equal(
    shippingQuote("05", "05001", 100000, {
      SHIPPING_NATIONAL_DEFAULT: "invalid",
    }).configured,
    false,
  );
  assert.equal(
    shippingQuote("05", "05001", 100000, { SHIPPING_NATIONAL_DEFAULT: "0" })
      .shipping,
    0,
  );
  assert.equal(
    shippingQuote("05", "05001", 100000, {
      SHIPPING_NATIONAL_DEFAULT: "15000",
      FREE_SHIPPING_THRESHOLD: "90000",
    }).shipping,
    0,
  );
  assert.equal(
    shippingQuote("05", "05001", 100000, { FREE_SHIPPING_THRESHOLD: "90000" })
      .shipping,
    0,
  );
  assert.equal(
    shippingQuote("05", "05001", 100000, {
      SHIPPING_NATIONAL_DEFAULT: "",
    }).message,
    "Estamos confirmando el valor del envío para tu ubicación. Escríbenos por WhatsApp para finalizar tu pedido.",
  );
});
test("shipping priority is city override, special city, national, unavailable", () => {
  shippingConfig.cities["54001"] = 7000;
  try {
    assert.equal(
      shippingQuote("54", "54001", 100000, {
        SHIPPING_CUCUTA: "9000",
        SHIPPING_NATIONAL_DEFAULT: "15000",
      }).shipping,
      7000,
    );
  } finally {
    delete shippingConfig.cities["54001"];
  }
  assert.equal(
    shippingQuote("54", "54001", 100000, {
      SHIPPING_CUCUTA: "9000",
      SHIPPING_NATIONAL_DEFAULT: "15000",
    }).shipping,
    9000,
  );
  assert.equal(
    shippingQuote("05", "05001", 100000, {
      SHIPPING_NATIONAL_DEFAULT: "15000",
    }).shipping,
    15000,
  );
  assert.equal(
    shippingQuote("05", "05001", 100000, {
      SHIPPING_NATIONAL_DEFAULT: "",
    }).configured,
    false,
  );
});
test("minimum order and free-shipping boundaries are enforced", () => {
  const below = shippingQuote("05", "05001", 49999, {});
  assert.equal(below.code, "MINIMUM_ORDER_NOT_MET");
  assert.equal(below.checkoutEligible, false);
  assert.equal(below.shipping, 14000);
  assert.equal(below.amountToMinimum, 1);
  assert.equal(shippingQuote("05", "05001", 50000, {}).shipping, 14000);
  assert.equal(shippingQuote("05", "05001", 149999, {}).shipping, 14000);
  assert.equal(shippingQuote("05", "05001", 150000, {}).shipping, 0);
  assert.equal(shippingQuote("54", "54001", 50000, {}).shipping, 0);
  assert.equal(shippingQuote("11", "11001", 50000, {}).shipping, 0);
});
test("customer validation accepts accents and Colombian phone formats", () => {
  const result = validateCustomer({
    name: "María José Pérez",
    phone: "+57 (302) 629-3535",
    email: "test@example.com",
    address: "Calle 1 # 2-3",
    neighborhood: "Centro",
    departmentCode: "11",
    cityCode: "11001",
  });
  assert.deepEqual(result.fields, {});
  assert.equal(result.customer.phone, "3026293535");
  assert.ok(validateCustomer({}).fields.email);
});
test("quote computes trusted price and confirmed free shipping", async () => {
  const items = [
    { id: products.find((p) => p.sku === "2203").id, quantity: 1, price: 1 },
  ];
  const q = await call(quoteHandler, {
    items,
    departmentCode: "11",
    cityCode: "11001",
  });
  assert.equal(q.code, 200);
  assert.equal(q.data.subtotal, 121000);
  assert.equal(q.data.shipping, 0);
  assert.equal(q.data.total, 121000);
  assert.equal(q.data.checkoutEligible, true);
  const r = await call(checkoutHandler, {
    items,
    acceptedTotal: 121000,
    idempotencyKey: crypto.randomUUID(),
    customer: {
      name: "Prueba Local",
      phone: "3001234567",
      email: "test@example.com",
      address: "Calle prueba 123",
      neighborhood: "Prueba",
      departmentCode: "11",
      cityCode: "11001",
    },
  });
  assert.equal(r.code, 503);
  assert.match(r.data.error, /pago en línea no está disponible/i);
});
test("checkout rejects a server-calculated subtotal below $50,000", async () => {
  const item = products.find((p) => p.sku === "60117");
  const payload = {
    items: [{ id: item.id, quantity: 1, price: 999999 }],
    acceptedTotal: 999999,
    idempotencyKey: crypto.randomUUID(),
    customer: {
      name: "Prueba Mínimo",
      phone: "3001234567",
      email: "test@example.com",
      address: "Calle prueba 123",
      neighborhood: "Prueba",
      departmentCode: "11",
      cityCode: "11001",
    },
  };
  const quote = await call(quoteHandler, {
    items: payload.items,
    departmentCode: "11",
    cityCode: "11001",
  });
  assert.equal(quote.data.subtotal, 3000);
  assert.equal(quote.data.checkoutEligible, false);
  assert.equal(quote.data.amountToMinimum, 47000);
  const checkout = await call(checkoutHandler, payload);
  assert.equal(checkout.code, 422);
  assert.equal(checkout.data.minimumOrder, 50000);
  assert.equal(checkout.data.amountToMinimum, 47000);
});
test("webhook requires authentic signed payment id and request id", () => {
  const secret = "test-only",
    id = "123",
    requestId = "test-request",
    ts = "1742505638683";
  const hmac = crypto
    .createHmac("sha256", secret)
    .update("id:" + id + ";request-id:" + requestId + ";ts:" + ts + ";")
    .digest("hex");
  assert.ok(validSignature(id, requestId, "ts=" + ts + ",v1=" + hmac, secret));
  assert.equal(
    validSignature("124", requestId, "ts=" + ts + ",v1=" + hmac, secret),
    false,
  );
  assert.equal(
    validSignature(id, requestId, "ts=" + ts + ",v1=bad", secret),
    false,
  );
  assert.equal(validSignature(id, requestId, "", ""), false);
});
