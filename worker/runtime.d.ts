// Runtime bindings used by the existing vinext starter. Kept local; no new dependency.
interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}
interface D1Database {
  prepare(query: string): { bind(...values: unknown[]): unknown };
}
declare module "cloudflare:workers" {
  export const env: { DB?: D1Database };
}
