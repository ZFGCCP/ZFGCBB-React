const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function readCookie(name: string): string | undefined {
  if (import.meta.env.SSR) return undefined;
  const prefix = `${name}=`;
  for (const part of document.cookie.split("; ")) {
    if (part.startsWith(prefix)) return part.slice(prefix.length);
  }
  return undefined;
}
// gm112 note: This is just a helper wrapper around fetch to handle XSRF-TOKEN
// We actually might be able to remove this piece of code later on - its really
// just for intercepting one header.
export function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  if (!SAFE_METHODS.has(method)) {
    const token = readCookie("XSRF-TOKEN");
    if (token && !headers.has("X-XSRF-TOKEN")) {
      headers.set("X-XSRF-TOKEN", decodeURIComponent(token));
    }
  }
  return fetch(input, { ...init, credentials: "include", headers });
}
