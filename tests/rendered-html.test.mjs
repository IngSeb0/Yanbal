import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Yanbal promotions storefront", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Yanbal Promociones Campaña 9/);
  assert.match(html, /WhatsApp 322 528 5078/);
  assert.match(html, /50% DCTO/);
  assert.match(html, /Pedir ahora/);
  assert.match(html, /https:\/\/wa\.me\/573225285078\?text=/);
  assert.match(html, /\/promos\/gaia-eternal\.png/);
  assert.match(html, /\/promos\/total-block-sport-plus\.png/);
  assert.doesNotMatch(
    html,
    /codex-preview|SkeletonPreview|react-loading-skeleton|Your site is taking shape/,
  );
});

test("uses the promotion assets and removes the starter skeleton", async () => {
  const [page, packageJson, assets] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readdir(new URL("../public/promos/", import.meta.url)),
  ]);

  assert.deepEqual(assets.sort(), [
    "43n-paralel.png",
    "bb-cream.png",
    "dendur.png",
    "dulce-amor.png",
    "gaia-eternal.png",
    "gaia-parfum.png",
    "total-block-kids.png",
    "total-block-sport-plus.png",
    "total-block-sport.png",
  ]);

  for (const asset of assets) {
    assert.match(page, new RegExp(`/promos/${asset.replace(".", "\\.")}`));
  }

  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
