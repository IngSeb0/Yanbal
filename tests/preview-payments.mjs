// Local fixtures only: in-memory database, synthetic customers and blocked external network.
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { Readable } from "node:stream";
import { PGlite } from "@electric-sql/pglite";
process.env.SUPABASE_URL = "https://database.invalid";
process.env.SUPABASE_SECRET_KEY = "test-only";
process.env.MERCADO_PAGO_ACCESS_TOKEN = "test-only";
process.env.MERCADO_PAGO_WEBHOOK_SECRET = "webhook-test-only";
process.env.MERCADO_PAGO_USE_SANDBOX = "true";
process.env.SHIPPING_BOGOTA = "10000"; // Fixture, never business configuration.
const { default: checkout } = await import("../api/cart/checkout.js");
const db = new PGlite();
await db.exec(
  "create role anon; create role authenticated; create role service_role bypassrls; create table public.orders(id text primary key, historical text); insert into public.orders values('OLD','preserved');",
);
const migration = fs.readFileSync(
  "supabase/migrations/20260908163022_national_checkout.sql",
  "utf8",
);
let offline = false, payment;
globalThis.fetch = async (url, opts = {}) => {
  const u = new URL(url),
    body = opts.body ? JSON.parse(opts.body) : {};
  const result = (data) =>
    new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  if (u.hostname === "api.mercadopago.com") {
    if (u.pathname === "/checkout/preferences") {
      assert.equal(
        (
          await db.query(
            "select count(*)::int n from public.yanbal_orders where id=$1",
            [body.external_reference],
          )
        ).rows[0].n,
        1,
        "Order must exist before MP request",
      );
      return result({
        id: "preference-test",
        sandbox_init_point:
          "https://sandbox.mercadopago.com.co/checkout/v1/redirect?pref_id=test",
      });
    }
    if (u.pathname === "/v1/payments/123") return result(payment);
    throw Error("Unexpected MP request");
  }
  if (u.hostname !== "database.invalid")
    throw Error("External network forbidden in this test");
  if (offline) throw Error("Database offline");
  const rpc = u.pathname.split("/rpc/")[1];
  if (rpc === "yanbal_create_order")
    return result(
      (
        await db.query("select public.yanbal_create_order($1::jsonb) value", [
          JSON.stringify(body.p_order),
        ])
      ).rows[0].value,
    );
  if (rpc === "yanbal_apply_payment") {
    await db.query(
      "select public.yanbal_apply_payment($1,$2,$3,$4::timestamptz)",
      [body.p_order_id, body.p_payment_id, body.p_status, body.p_updated],
    );
    return result(null);
  }
  if (rpc === "yanbal_claim_purchase")
    return result(
      (
        await db.query("select public.yanbal_claim_purchase($1) value", [
          body.p_order_id,
        ])
      ).rows[0].value,
    );
  if (u.pathname === "/rest/v1/yanbal_orders") {
    const id = u.searchParams.get("id").slice(3);
    if (opts.method === "PATCH") {
      const keys = Object.keys(body);
      assert.ok(
        keys.every((k) =>
          ["preference_id", "status", "payment_status"].includes(k),
        ),
      );
      await db.query(
        "update public.yanbal_orders set " +
          keys.map((k, i) => k + "=$" + (i + 1)).join(",") +
          " where id=$" +
          (keys.length + 1),
        [...Object.values(body), id],
      );
      return result(null);
    }
    return result(
      (await db.query("select * from public.yanbal_orders where id=$1", [id]))
        .rows,
    );
  }
  throw Error("Unexpected DB request");
};
const call = async (fn, body, { url = "/", headers = {} } = {}) => {
  const req = Readable.from([Buffer.from(JSON.stringify(body))]);
  req.method = "POST";
  req.url = url;
  req.headers = headers;
  let code, data;
  const res = {
    setHeader() {},
    set statusCode(v) {
      code = v;
    },
    end(s) {
      data = JSON.parse(s);
    },
  };
  await fn(req, res);
  return { code, data };
};
const payload = () => ({
  items: [{ id: "2203-pasion-parfum", quantity: 1, price: 1 }],
  customer: {
    name: "Prueba Local",
    phone: "+57 300 123 4567",
    email: "test@example.com",
    address: "Calle de prueba 123",
    neighborhood: "Prueba",
    departmentCode: "11",
    cityCode: "11001",
  },
  acceptedTotal: 131000,
  idempotencyKey: crypto.randomUUID(),
});

await db.exec(migration);
for (const [index, state] of ["approved", "pending", "rejected"].entries()) {
  const r = await call(checkout, payload());
  await db.query(
    "select public.yanbal_apply_payment($1,$2,$3,'2026-09-08T19:00:00Z')",
    [r.data.orderId, String(801 + index), state],
  );
  const route =
    state === "approved"
      ? "exitoso"
      : state === "pending"
        ? "pendiente"
        : "error";
  console.log(
    state +
      ": http://127.0.0.1:4183/pedido/" +
      route +
      "?orderId=" +
      r.data.orderId +
      "#access=" +
      r.data.accessToken,
  );
}
process.env.PORT = "4183";
await import("../scripts/serve-commerce.mjs");
