import { publicStorageUrl, restInsert, storageUpload } from "../../lib/supabase-rest.js";
import crypto from "node:crypto";

const bucket = "yanbal-catalogs";
const allowedMimeTypes = new Set(["application/pdf", "image/webp", "image/png", "image/jpeg"]);
const maxUploadBytes = 12 * 1024 * 1024;

function json(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

async function readJson(request, maxBytes = 18 * 1024 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) {
      const error = new Error("payload_too_large");
      error.code = "PAYLOAD_TOO_LARGE";
      throw error;
    }
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function safeFileName(value) {
  const clean = String(value || "catalogo.pdf")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return clean || "catalogo.pdf";
}

function decodeBase64File(value) {
  const base64 = String(value || "").replace(/^data:[^;]+;base64,/, "");
  return Buffer.from(base64, "base64");
}

function tokenMatches(input, expected) {
  const inputBuffer = Buffer.from(String(input || ""));
  const expectedBuffer = Buffer.from(String(expected || ""));
  return (
    inputBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(inputBuffer, expectedBuffer)
  );
}

function isSafeExternalUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    json(response, 405, { ok: false, error: "Metodo no permitido" });
    return;
  }

  const adminToken = process.env.CATALOG_ADMIN_TOKEN;
  if (!adminToken) {
    json(response, 503, {
      ok: false,
      error: "Falta configurar CATALOG_ADMIN_TOKEN en Vercel.",
    });
    return;
  }

  let payload;
  try {
    payload = await readJson(request);
  } catch (error) {
    json(response, error.code === "PAYLOAD_TOO_LARGE" ? 413 : 400, {
      ok: false,
      error:
        error.code === "PAYLOAD_TOO_LARGE"
          ? "El archivo o payload supera el tamaño permitido."
          : "JSON no valido",
    });
    return;
  }

  if (!tokenMatches(payload.adminToken, adminToken)) {
    json(response, 401, { ok: false, error: "Clave de administrador incorrecta." });
    return;
  }

  const campaignCode = String(payload.campaignCode || "C9-2026").trim();
  const campaignId = slugify(`yanbal-${campaignCode}`);
  const campaignName = String(payload.campaignName || `Yanbal ${campaignCode}`).trim();
  const title = String(payload.title || `Catálogo ${campaignCode}`).trim();
  const externalUrl = String(payload.externalUrl || "").trim();
  const mimeType = String(payload.mimeType || "application/pdf");

  if (!isSafeExternalUrl(externalUrl)) {
    json(response, 400, { ok: false, error: "La URL externa debe ser HTTPS." });
    return;
  }

  if (!allowedMimeTypes.has(mimeType) && !externalUrl) {
    json(response, 400, { ok: false, error: "Tipo de archivo no permitido." });
    return;
  }

  let fileName = safeFileName(payload.fileName || `${campaignId}.pdf`);
  let filePath = `${campaignId}/${Date.now()}-${fileName}`;
  let publicUrl = externalUrl;
  let sizeBytes = Number(payload.sizeBytes || 0);

  if (!externalUrl) {
    if (!payload.fileBase64) {
      json(response, 400, { ok: false, error: "Adjunta un archivo o una URL publica." });
      return;
    }

    const buffer = decodeBase64File(payload.fileBase64);
    sizeBytes = buffer.length;

    if (sizeBytes > maxUploadBytes) {
      json(response, 413, { ok: false, error: "El archivo supera 12 MB. Usa una URL publica para PDFs grandes." });
      return;
    }

    try {
      await storageUpload(bucket, filePath, buffer, mimeType);
      publicUrl = publicStorageUrl(bucket, filePath);
    } catch (error) {
      json(response, 503, {
        ok: false,
        error: `No se pudo subir a Supabase Storage: ${error.message}`,
      });
      return;
    }
  } else {
    fileName = safeFileName(payload.fileName || externalUrl.split("/").pop() || `${campaignId}.pdf`);
    filePath = externalUrl;
  }

  try {
    await restInsert(
      "campaigns",
      {
        id: campaignId,
        name: campaignName,
        campaign_code: campaignCode,
        status: "active",
        catalog_url: publicUrl,
        notes: "Campaña cargada desde el panel web.",
      },
      { service: true, upsert: true, onConflict: "id" },
    );

    await restInsert(
      "catalog_uploads",
      {
        campaign_id: campaignId,
        title,
        file_name: fileName,
        file_path: filePath,
        public_url: publicUrl,
        mime_type: mimeType,
        size_bytes: sizeBytes,
        status: "active",
        notes: String(payload.notes || ""),
      },
      { service: true },
    );
  } catch (error) {
    json(response, 503, {
      ok: false,
      error: `No se pudo guardar en Supabase: ${error.message}`,
    });
    return;
  }

  json(response, 200, {
    ok: true,
    campaignId,
    title,
    publicUrl,
    sizeBytes,
  });
}
