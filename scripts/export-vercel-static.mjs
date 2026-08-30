import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("vercel-dist");
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/`
  : "https://yanbal-promos-cucuta-bogota.vercel.app/";

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await cp(path.resolve("dist/client"), outDir, { recursive: true });

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

async function renderPage(pathname) {
  const url = new URL(pathname, baseUrl);
  const response = await worker.fetch(
    new Request(url, {
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

  let html = await response.text();
  html = html
    .replace(/<link rel="modulepreload"[^>]*>/g, "")
    .replace(/<script>(?:(?!<\/script>).)*<\/script>/gs, "")
    .replace(/<script(?=[^>]*\bsrc=["'][^"']*\/_next\/)[^>]*><\/script>/g, "")
    .replaceAll("http://localhost:3000/", baseUrl);

  return html;
}

const homeHtml = await renderPage("/");
await writeFile(path.join(outDir, "index.html"), homeHtml, "utf8");
await writeFile(path.join(outDir, "404.html"), homeHtml, "utf8");

const catalogHtml = await renderPage("/catalogo");
await writeFile(path.join(outDir, "catalogo.html"), catalogHtml, "utf8");
await mkdir(path.join(outDir, "catalogo"), { recursive: true });
await writeFile(path.join(outDir, "catalogo", "index.html"), catalogHtml, "utf8");

const giftsHtml = await renderPage("/regalables");
await writeFile(path.join(outDir, "regalables.html"), giftsHtml, "utf8");
await mkdir(path.join(outDir, "regalables"), { recursive: true });
await writeFile(path.join(outDir, "regalables", "index.html"), giftsHtml, "utf8");

const thanksHtml = await renderPage("/gracias");
await writeFile(path.join(outDir, "gracias.html"), thanksHtml, "utf8");
await mkdir(path.join(outDir, "gracias"), { recursive: true });
await writeFile(path.join(outDir, "gracias", "index.html"), thanksHtml, "utf8");

const cucutaHtml = await renderPage("/cucuta");
await writeFile(path.join(outDir, "cucuta.html"), cucutaHtml, "utf8");
await mkdir(path.join(outDir, "cucuta"), { recursive: true });
await writeFile(path.join(outDir, "cucuta", "index.html"), cucutaHtml, "utf8");

const bogotaHtml = await renderPage("/bogota");
await writeFile(path.join(outDir, "bogota.html"), bogotaHtml, "utf8");
await mkdir(path.join(outDir, "bogota"), { recursive: true });
await writeFile(path.join(outDir, "bogota", "index.html"), bogotaHtml, "utf8");

const loveColombiaHtml = await renderPage("/regalos-amor-amistad-colombia");
await writeFile(path.join(outDir, "regalos-amor-amistad-colombia.html"), loveColombiaHtml, "utf8");
await mkdir(path.join(outDir, "regalos-amor-amistad-colombia"), { recursive: true });
await writeFile(
  path.join(outDir, "regalos-amor-amistad-colombia", "index.html"),
  loveColombiaHtml,
  "utf8",
);

const perfumesHtml = await renderPage("/perfumes-yanbal-cucuta-bogota");
await writeFile(path.join(outDir, "perfumes-yanbal-cucuta-bogota.html"), perfumesHtml, "utf8");
await mkdir(path.join(outDir, "perfumes-yanbal-cucuta-bogota"), { recursive: true });
await writeFile(
  path.join(outDir, "perfumes-yanbal-cucuta-bogota", "index.html"),
  perfumesHtml,
  "utf8",
);

const bloqueadoresHtml = await renderPage("/bloqueadores-yanbal-cucuta-bogota");
await writeFile(path.join(outDir, "bloqueadores-yanbal-cucuta-bogota.html"), bloqueadoresHtml, "utf8");
await mkdir(path.join(outDir, "bloqueadores-yanbal-cucuta-bogota"), { recursive: true });
await writeFile(
  path.join(outDir, "bloqueadores-yanbal-cucuta-bogota", "index.html"),
  bloqueadoresHtml,
  "utf8",
);
