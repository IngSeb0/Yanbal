const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";

const publishableKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const secretKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "";

function normalizeUrl(value) {
  return value.replace(/\/$/, "");
}

function keyFor({ service = false } = {}) {
  if (service) {
    return secretKey;
  }

  return publishableKey || secretKey;
}

export function hasSupabaseConfig(options = {}) {
  return Boolean(supabaseUrl && keyFor(options));
}

export function publicStorageUrl(bucket, objectPath) {
  if (!supabaseUrl) {
    return "";
  }

  return `${normalizeUrl(supabaseUrl)}/storage/v1/object/public/${bucket}/${objectPath}`;
}

export async function supabaseRequest(path, options = {}, authOptions = {}) {
  const key = keyFor(authOptions);
  if (!supabaseUrl || !key) {
    throw new Error("Supabase is not configured");
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...options.headers,
  };

  let body = options.body;
  if (body && !(body instanceof Buffer) && typeof body !== "string") {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const response = await fetch(`${normalizeUrl(supabaseUrl)}${path}`, {
    method: options.method || "GET",
    headers,
    body,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.error || "Supabase request failed";
    throw new Error(message);
  }

  return data;
}

export async function restSelect(path, authOptions = {}) {
  return supabaseRequest(`/rest/v1/${path}`, { method: "GET" }, authOptions);
}

export async function restInsert(table, rows, options = {}) {
  const query = options.onConflict ? `?on_conflict=${encodeURIComponent(options.onConflict)}` : "";
  const prefer = options.upsert
    ? "resolution=merge-duplicates,return=minimal"
    : "return=minimal";

  return supabaseRequest(
    `/rest/v1/${table}${query}`,
    {
      method: "POST",
      headers: {
        Prefer: prefer,
      },
      body: rows,
    },
    { service: options.service },
  );
}

export async function storageUpload(bucket, objectPath, buffer, mimeType) {
  if (!hasSupabaseConfig({ service: true })) {
    throw new Error("Supabase service key is not configured");
  }

  return supabaseRequest(
    `/storage/v1/object/${bucket}/${objectPath}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": mimeType,
        "x-upsert": "true",
      },
      body: buffer,
    },
    { service: true },
  );
}
