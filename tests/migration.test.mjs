import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import { Readable } from "node:stream";
import { PGlite } from "@electric-sql/pglite";
process.env.SUPABASE_URL = "https://database.invalid";
process.env.SUPABASE_SECRET_KEY = "sb_secret_test-only";
process.env.MERCADO_PAGO_ACCESS_TOKEN = "test-only";
process.env.MERCADO_PAGO_WEBHOOK_SECRET = "webhook-test-only";
process.env.MERCADO_PAGO_USE_SANDBOX = "true";
process.env.SHIPPING_BOGOTA = "10000"; // Fixture, never business configuration.
const { default: checkout } = await import("../api/cart/checkout.js");
const { default: status } =
  await import("../api/mercadopago/payment-status.js");
const { default: webhook } = await import("../api/mercadopago/webhook.js");
const { default: purchase } = await import("../api/cart/purchase.js");
const db = new PGlite();
await db.exec(
  "create role anon; create role authenticated; create role service_role bypassrls; create table public.orders(id text primary key, historical text); insert into public.orders values('OLD','preserved'); create table public.yanbal_orders(id text); insert into public.yanbal_orders values('LEGACY-YANBAL-ROW');",
);
const migration = fs.readFileSync(
  "supabase/migrations/20260908163022_national_checkout.sql",
  "utf8",
);
const storefrontMigration = fs.readFileSync(
  "supabase/migrations/20260822_yanbal_commerce.sql",
  "utf8",
);
const hardeningMigration = fs.readFileSync(
  "supabase/migrations/20260909150000_schema_hardening.sql",
  "utf8",
);
const realFetch = globalThis.fetch;
let mpCalls = 0,
  preference,
  offline = false,
  payment;
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
      mpCalls++;
      preference = body;
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
  assert.equal(opts.headers.apikey, "sb_secret_test-only");
  assert.equal(opts.headers.Authorization, undefined);
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
test("storefront migration bootstraps a fresh Supabase project", async () => {
  const fresh = new PGlite();
  try {
    await fresh.exec(`
      create role anon;
      create role authenticated;
      create schema storage;
      create table storage.buckets (
        id text primary key,
        name text not null,
        public boolean not null default false,
        file_size_limit bigint,
        allowed_mime_types text[],
        updated_at timestamptz default now()
      );
      create table storage.objects (
        id uuid primary key default gen_random_uuid(),
        bucket_id text references storage.buckets(id)
      );
    `);
    await fresh.exec(storefrontMigration);
    await fresh.exec(storefrontMigration);
    await fresh.exec(hardeningMigration);
    await fresh.exec(hardeningMigration);
    assert.equal(
      (await fresh.query("select count(*)::int n from public.products")).rows[0]
        .n,
      7,
    );
    assert.equal(
      (
        await fresh.query(
          "select count(*)::int n from storage.buckets where id='yanbal-catalogs'",
        )
      ).rows[0].n,
      1,
    );
    assert.deepEqual(
      (
        await fresh.query(
          "select indexname from pg_indexes where schemaname='public' and indexname in ('order_items_order_id_idx','order_items_product_id_idx') order by indexname",
        )
      ).rows.map((row) => row.indexname),
      ["order_items_order_id_idx", "order_items_product_id_idx"],
    );
  } finally {
    await fresh.close();
  }
});
test("isolated PostgreSQL migration and complete API payment lifecycle", async (t) => {
  let order, accessToken, input;
  try {
    await t.test(
      "migration applies twice, preserves historical tables, and closes public access",
      async () => {
        assert.doesNotMatch(
          migration,
          /\b(?:drop\s+(?:table|column)|truncate|delete\s+from)\b/i,
        );
        await db.exec(migration);
        await db.exec(migration);
        assert.equal(
          (
            await db.query(
              "select historical from public.orders where id='OLD'",
            )
          ).rows[0].historical,
          "preserved",
        );
        assert.equal(
          (
            await db.query(
              "select count(*)::int n from public.yanbal_orders where id='LEGACY-YANBAL-ROW'",
            )
          ).rows[0].n,
          1,
        );
        const privileges = (
          await db.query(
            "select has_table_privilege('anon','public.yanbal_orders','select') can_read,has_function_privilege('anon','public.yanbal_claim_purchase(text)','execute') can_call",
          )
        ).rows[0];
        assert.equal(privileges.can_read, false);
        assert.equal(privileges.can_call, false);
      },
    );
    await t.test("failed persistence never opens Mercado Pago", async () => {
      offline = true;
      const r = await call(checkout, payload());
      offline = false;
      assert.equal(r.code, 503);
      assert.equal(mpCalls, 0);
    });
    await t.test(
      "tampered totals, identifiers, quantities and promotion units fail before payment",
      async () => {
        const attempts = [
          {
            ...payload(),
            acceptedTotal: 1,
            shipping: 0,
            total: 1,
            status: "PAID",
          },
          { ...payload(), items: [{ id: "unknown", quantity: 1, price: 1 }] },
          {
            ...payload(),
            items: [{ id: "2203-pasion-parfum", quantity: 1.5, price: 1 }],
          },
          {
            ...payload(),
            items: [
              {
                id: "723-blum-reparacion-intensiva-proteccion-total-acondicionador-proteccion-total",
                quantity: 1,
                price: 1,
              },
            ],
          },
        ];
        for (const attempt of attempts) {
          const result = await call(checkout, attempt);
          assert.ok([400, 409].includes(result.code));
        }
        assert.equal(mpCalls, 0);
        assert.equal(
          (
            await db.query(
              "select count(*)::int n from public.yanbal_orders where id like 'YAN-%'",
            )
          ).rows[0].n,
          0,
        );
      },
    );
    await t.test(
      "backend total includes configured shipping and ignores manipulated price",
      async () => {
        input = payload();
        input.status = "PAID";
        input.shipping = 0;
        input.discount = 100;
        input.analyticsConsent = true;
        input.attribution = {
          utm_source: "google",
          utm_medium: "cpc",
          utm_campaign: "yanbal-c9",
          utm_term: "perfume",
          utm_content: "hero",
          gclid: "test-click-id",
          untrusted: "discard-me",
        };
        const r = await call(checkout, input);
        assert.equal(r.code, 200);
        assert.equal(r.data.total, 131000);
        order = r.data.orderId;
        accessToken = r.data.accessToken;
        assert.equal(
          preference.items.reduce((s, l) => s + l.quantity * l.unit_price, 0),
          131000,
        );
        assert.equal(preference.external_reference, order);
        assert.ok(preference.back_urls.success.includes("/pedido/exitoso"));
        assert.ok(!JSON.stringify(preference.metadata).includes("phone"));
        const stored = (
          await db.query(
            "select status,subtotal,shipping,total,attribution from public.yanbal_orders where id=$1",
            [order],
          )
        ).rows[0];
        assert.equal(stored.status, "PAYMENT_PENDING");
        assert.equal(stored.subtotal, 121000);
        assert.equal(stored.shipping, 10000);
        assert.equal(stored.total, 131000);
        assert.deepEqual(Object.keys(stored.attribution).sort(), [
          "gclid",
          "utm_campaign",
          "utm_content",
          "utm_medium",
          "utm_source",
          "utm_term",
        ]);
      },
    );
    await t.test(
      "duplicate checkout key cannot create or charge a second order",
      async () => {
        const r = await call(checkout, input);
        assert.equal(r.code, 409);
        assert.equal(mpCalls, 1);
        assert.equal(
          (
            await db.query(
              "select count(*)::int n from public.yanbal_orders where id like 'YAN-%'",
            )
          ).rows[0].n,
          1,
        );
      },
    );
    await t.test(
      "return URL or missing token cannot confirm a payment",
      async () => {
        assert.equal(
          (await call(status, { orderId: order, accessToken: "bad" })).code,
          404,
        );
        const r = await call(status, {
          orderId: order,
          accessToken,
          status: "approved",
        });
        assert.equal(r.data.order.paid, false);
        assert.equal(r.data.order.status, "PAYMENT_PENDING");
        assert.equal(
          (
            await call(purchase, {
              orderId: order,
              accessToken,
              analyticsConsent: true,
            })
          ).data.event,
          null,
        );
      },
    );
    await t.test(
      "signed webhook verifies remote amount, updates once and tolerates duplicates",
      async () => {
        payment = {
          id: 123,
          external_reference: order,
          currency_id: "COP",
          transaction_amount: 131000,
          live_mode: false,
          status: "approved",
          date_last_updated: "2026-09-08T15:00:00Z",
        };
        const ts = "1788879600000",
          requestId = "notification-test";
        const signature = crypto
          .createHmac("sha256", process.env.MERCADO_PAGO_WEBHOOK_SECRET)
          .update("id:123;request-id:" + requestId + ";ts:" + ts + ";")
          .digest("hex");
        const options = {
          url: "/api/mercadopago/webhook?data.id=123&type=payment",
          headers: {
            "x-request-id": requestId,
            "x-signature": "ts=" + ts + ",v1=" + signature,
          },
        };
        assert.equal(
          (
            await call(
              webhook,
              { type: "payment", data: { id: 123 } },
              {
                ...options,
                headers: { ...options.headers, "x-signature": "bad" },
              },
            )
          ).code,
          401,
        );
        assert.equal(
          (await call(webhook, { type: "payment", data: { id: 999 } }, options))
            .code,
          400,
        );
        assert.equal(
          (await call(webhook, { type: "payment", data: { id: 123 } }, options))
            .code,
          200,
        );
        assert.equal(
          (await call(webhook, { type: "payment", data: { id: 123 } }, options))
            .code,
          200,
        );
        assert.equal(
          (
            await db.query(
              "select count(*)::int n from public.yanbal_payment_events",
            )
          ).rows[0].n,
          1,
        );
        const r = await call(status, {
          orderId: order,
          accessToken,
          paymentId: "123",
        });
        assert.equal(r.data.order.paid, true);
        assert.equal(r.data.order.status, "PAID");
        payment.transaction_amount = 1;
        assert.equal(
          (
            await call(status, {
              orderId: order,
              accessToken,
              paymentId: "123",
            })
          ).code,
          503,
        );
        payment.transaction_amount = 131000;
      },
    );
    await t.test(
      "purchase claim is atomic and does not expose personal information",
      async () => {
        const requests = await Promise.all([
          call(purchase, {
            orderId: order,
            accessToken,
            analyticsConsent: true,
          }),
          call(purchase, {
            orderId: order,
            accessToken,
            analyticsConsent: true,
          }),
        ]);
        assert.equal(requests.filter((r) => r.data.event).length, 1);
        const event = requests.find((r) => r.data.event).data.event;
        assert.equal(event.transaction_id, order);
        assert.equal(event.value, 121000);
        assert.equal(event.shipping, 10000);
        assert.ok(!JSON.stringify(event).includes("test@example.com"));
        assert.equal(
          (
            await call(purchase, {
              orderId: order,
              accessToken,
              analyticsConsent: true,
            })
          ).data.event,
          null,
        );
        assert.ok(
          (
            await db.query(
              "select purchase_claimed_at from public.yanbal_orders where id=$1",
              [order],
            )
          ).rows[0].purchase_claimed_at,
        );
      },
    );
    await t.test(
      "delayed rejection cannot undo paid or fulfillment states; refunds are final",
      async () => {
        await db.query(
          "update public.yanbal_orders set status='SHIPPED' where id=$1",
          [order],
        );
        await db.query(
          "select public.yanbal_apply_payment($1,'124','rejected','2026-09-08T17:00:00Z')",
          [order],
        );
        assert.equal(
          (
            await db.query(
              "select status from public.yanbal_orders where id=$1",
              [order],
            )
          ).rows[0].status,
          "SHIPPED",
        );
        await db.query(
          "select public.yanbal_apply_payment($1,'123','approved','2026-09-08T18:00:00Z')",
          [order],
        );
        assert.equal(
          (
            await db.query(
              "select status from public.yanbal_orders where id=$1",
              [order],
            )
          ).rows[0].status,
          "SHIPPED",
        );
        await db.query(
          "select public.yanbal_apply_payment($1,'123','refunded','2026-09-08T19:00:00Z')",
          [order],
        );
        assert.equal(
          (
            await db.query(
              "select status from public.yanbal_orders where id=$1",
              [order],
            )
          ).rows[0].status,
          "REFUNDED",
        );
      },
    );
    await t.test(
      "pending, rejected and unknown payment states remain unpaid",
      async () => {
        for (const state of ["pending", "rejected", "unknown_test_status"]) {
          const r = await call(checkout, payload());
          assert.equal(r.code, 200);
          await db.query(
            "select public.yanbal_apply_payment($1,$2,$3,'2026-09-08T19:00:00Z')",
            [
              r.data.orderId,
              state === "pending"
                ? "201"
                : state === "rejected"
                  ? "202"
                  : "203",
              state,
            ],
          );
          const result = await call(status, {
            orderId: r.data.orderId,
            accessToken: r.data.accessToken,
          });
          assert.equal(result.data.order.paid, false);
          assert.equal(result.data.order.paymentStatus, state);
        }
      },
    );
  } finally {
    globalThis.fetch = realFetch;
    await db.close();
  }
});
