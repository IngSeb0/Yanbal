import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
function setup(
  consent,
  url = "https://shop.test/catalogo?utm_source=google&utm_campaign=perfumes&gclid=test-click",
) {
  const local = new Map(),
    session = new Map(),
    scripts = [],
    handlers = {},
    banner = { hidden: true };
  if (consent !== undefined)
    local.set("yanbal_analytics_consent", JSON.stringify(consent));
  const storage = (map) => ({
    getItem: (k) => map.get(k) || null,
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k),
  });
  const context = {
    URL,
    URLSearchParams,
    Date,
    Event: class {
      constructor(type) {
        this.type = type;
      }
    },
    localStorage: storage(local),
    sessionStorage: storage(session),
    location: { href: url },
    history: {
      replaceState(_a, _b, path) {
        context.finalPath = path;
      },
    },
    document: {
      createElement: () => ({}),
      head: { append: (s) => scripts.push(s) },
      querySelector: () => banner,
      addEventListener: (name, fn) => (handlers[name] = fn),
    },
  };
  context.window = context;
  context.dispatchEvent = () => {};
  vm.runInNewContext(
    fs.readFileSync("public/conversion-tracking.js", "utf8"),
    context,
  );
  return { context, local, session, scripts, handlers, banner };
}
test("tags use existing GTM and Ads IDs after consent; attribution is retained", () => {
  assert.match(
    fs.readFileSync("public/commerce.js", "utf8"),
    /track\("add_payment_info", paymentData\)/,
  );
  const t = setup(true),
    w = t.context;
  assert.ok(t.scripts.some((s) => s.src.includes("GTM-NBHK5MMR")));
  assert.ok(t.scripts.some((s) => s.src.includes("AW-18340615060")));
  assert.ok(t.scripts.some((s) => s.src === "/_vercel/insights/script.js"));
  assert.equal(w.yanbalAttribution().gclid, "test-click");
  assert.equal(w.yanbalAttribution().utm_campaign, "perfumes");
  w.yanbalTrack("view_item", {
    currency: "COP",
    value: 121000,
    items: [{ item_id: "2203", price: 121000, quantity: 1 }],
  });
  w.yanbalTrack("add_to_cart", {
    currency: "COP",
    value: 121000,
    items: [{ item_id: "2203", item_name: "Pasión Parfum", price: 121000, quantity: 1 }],
  });
  w.yanbalTrackBeginCheckout({
    cart: [{ sku: "2203", price: 121000, quantity: 1 }],
    total: 121000,
  });
  w.yanbalTrack("payment_click", {
    currency: "COP",
    value: 121000,
    payment_type: "Mercado Pago",
  });
  w.yanbalTrackWhatsAppLead();
  w.yanbalTrackContent("share", {
    method: "whatsapp",
    content_type: "guide",
    item_id: "combinar_perfumes",
  });
  const purchase = {
    transaction_id: "YAN-TEST-TRANSACTION",
    value: 121000,
    shipping: 10000,
    currency: "COP",
    items: [
      {
        item_id: "2203",
        item_name: "Pasión Parfum",
        item_category: "Perfumes y colonias",
        price: 121000,
        quantity: 1,
      },
    ],
  };
  w.yanbalTrack("purchase", purchase);
  const events = w.dataLayer.filter((x) => x.event).map((x) => x.event);
  assert.ok(events.includes("view_item"));
  assert.ok(events.includes("add_to_cart"));
  assert.ok(events.includes("begin_checkout"));
  w.yanbalTrack("add_shipping_info", {
    currency: "COP",
    value: 121000,
    shipping_tier: "standard",
    items: [{ item_id: "2203", price: 121000, quantity: 1 }],
  });
  w.yanbalTrack("add_payment_info", {
    currency: "COP",
    value: 121000,
    payment_type: "Mercado Pago",
    items: [{ item_id: "2203", price: 121000, quantity: 1 }],
  });
  const updatedEvents = w.dataLayer.filter((x) => x.event).map((x) => x.event);
  assert.ok(updatedEvents.includes("add_shipping_info"));
  assert.ok(updatedEvents.includes("add_payment_info"));
  assert.ok(events.includes("payment_click"));
  assert.ok(events.includes("whatsapp_click"));
  assert.ok(events.includes("share"));
  assert.ok(events.includes("purchase"));
  assert.deepEqual(
    JSON.parse(
      JSON.stringify(w.dataLayer.find((x) => x.event === "purchase").ecommerce),
    ),
    purchase,
  );
  const conversions = w.dataLayer.filter(
    (x) => x[0] === "event" && x[1] === "conversion",
  );
  assert.deepEqual(
    Array.from(conversions, (x) => x[2].send_to),
    [
      "AW-18340615060/2pBzCITFmOYcEJSnvqlE",
      "AW-18340615060/JBeHCK6u3ukcEJSnvqlE",
    ],
  );
  assert.equal(
    w.dataLayer.filter((x) => x[0] === "event" && x[1] === "conversion").length,
    2,
    "Purchase must not reuse lead or checkout conversion goals",
  );
});
test("rejected consent prevents tags, analytics events and attribution", () => {
  const t = setup(false);
  t.context.yanbalTrack("add_to_cart", { value: 1 });
  t.context.yanbalTrackContent("share", { item_id: "combinar_perfumes" });
  assert.equal(t.scripts.length, 0);
  assert.equal(Object.keys(t.context.yanbalAttribution()).length, 0);
  assert.ok(!t.context.dataLayer.some((x) => x.event));
});
test("return token is removed before any third-party script sees the page", () => {
  const t = setup(
    true,
    "https://shop.test/pedido/exitoso?orderId=YAN-TEST&payment_id=123#access=private-token",
  );
  assert.equal(t.finalPath, undefined);
  assert.equal(t.context.finalPath, "/pedido/exitoso");
  assert.equal(t.session.get("yanbal_order_YAN-TEST"), "private-token");
  assert.ok(!JSON.stringify(t.context.dataLayer).includes("private-token"));
  assert.ok(!t.context.dataLayer.some((x) => x.event === "purchase"));
});
