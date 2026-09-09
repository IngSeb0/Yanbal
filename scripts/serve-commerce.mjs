import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const root = path.resolve("vercel-dist"),
  port = Number(process.env.PORT || 4173);
const handlers = new Map();
for (const name of [
  "cart/quote",
  "cart/checkout",
  "cart/purchase",
  "mercadopago/payment-status",
  "mercadopago/webhook",
  "mercadopago/create-preference",
  "mercadopago/return",
  "catalog/list",
  "admin/upload-catalog",
]) {
  handlers.set(
    "/api/" + name,
    (await import(pathToFileURL(path.resolve("api/" + name + ".js")))).default,
  );
}
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (handlers.has(url.pathname)) {
        await handlers.get(url.pathname)(req, res);
        return;
      }
      let file = path.resolve(root, "." + decodeURIComponent(url.pathname));
      if (!file.startsWith(root + path.sep) && file !== root) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (file === root) file = path.join(root, "index.html");
      else if (!path.extname(file)) file += ".html";
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.statusCode = 404;
        file = path.join(root, "404.html");
      }
      res.setHeader(
        "Content-Type",
        mime[path.extname(file)] || "application/octet-stream",
      );
      res.setHeader("Cache-Control", "no-store");
      fs.createReadStream(file).pipe(res);
    } catch {
      res.writeHead(500);
      res.end("Error al procesar la solicitud");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log("Yanbal local: http://127.0.0.1:" + port),
  );
