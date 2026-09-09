import fs from "node:fs";
import crypto from "node:crypto";

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) return;
  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

loadLocalEnv();

const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const publishable = process.env.SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !publishable || !secret) {
  throw new Error("Missing Supabase configuration in .env.local");
}

function headers(key, extra = {}) {
  const result = { apikey: key, ...extra };
  if (!/^sb_(?:secret|publishable)_/.test(key)) {
    result.Authorization = `Bearer ${key}`;
  }
  return result;
}

async function request(path, key, options = {}) {
  return fetch(`${url}${path}`, {
    ...options,
    headers: headers(key, options.headers),
  });
}

const publicProducts = await request(
  "/rest/v1/products?select=id&brand=eq.Yanbal&published=eq.true",
  publishable,
);
if (!publicProducts.ok) {
  throw new Error(`Public catalog check failed (${publicProducts.status})`);
}
const productCount = (await publicProducts.json()).length;
if (productCount !== 7) {
  throw new Error(`Expected 7 optional remote products, received ${productCount}`);
}

const blockedOrders = await request(
  "/rest/v1/yanbal_orders?select=id&limit=1",
  publishable,
);
if (blockedOrders.ok) {
  throw new Error("Public key unexpectedly gained access to checkout orders");
}

const token = crypto.randomUUID();
const orderId = `VERIFY-${token}`;
const order = {
  id: orderId,
  checkout_key: token,
  access_hash: crypto.createHash("sha256").update(token).digest("hex"),
  customer: { verification: true },
  items: [{ id: "verification", quantity: 1 }],
  subtotal: 1,
  shipping: 0,
  total: 1,
  attribution: {},
};

try {
  const created = await request("/rest/v1/rpc/yanbal_create_order", secret, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ p_order: order }),
  });
  const createdPayload = await created.json().catch(() => null);
  if (!created.ok || !createdPayload?.created) {
    throw new Error(
      `Order RPC check failed (${created.status}): ${JSON.stringify(createdPayload)}`,
    );
  }

  const stored = await request(
    `/rest/v1/yanbal_orders?select=id,status,total&id=eq.${encodeURIComponent(orderId)}`,
    secret,
  );
  const rows = stored.ok ? await stored.json() : [];
  if (rows.length !== 1 || rows[0].status !== "CREATED" || rows[0].total !== 1) {
    throw new Error("Stored checkout order does not match the RPC input");
  }
} finally {
  await request(
    `/rest/v1/yanbal_orders?id=eq.${encodeURIComponent(orderId)}`,
    secret,
    { method: "DELETE" },
  );
}

console.log(
  JSON.stringify({
    project: new URL(url).hostname.split(".")[0],
    publicCatalogRows: productCount,
    checkoutPublicAccess: "blocked",
    orderRpc: "passed",
    verificationDataRemoved: true,
  }),
);
