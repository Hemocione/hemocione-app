const HIDDEN_QUERY = new Set(["token", "iframed"]);

// Page of a sub-app iframe: the route slug plus the query (sorted, without token/iframed).
export function iframeRouteKey(
  slug: string | string[] | undefined,
  query: Record<string, unknown>,
): string {
  const path = Array.isArray(slug) ? slug.filter(Boolean).join("/") : slug || "";
  const params = Object.keys(query)
    .filter((key) => !HIDDEN_QUERY.has(key))
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`);
  return params.length ? `${path}?${params.join("&")}` : path;
}

// Coming back from the menu (no slug) keeps the page the user left the iframe on.
// A link to a specific page loads that page.
export function shouldReloadIframe(loadedKey: string, nextKey: string): boolean {
  return nextKey !== "" && nextKey !== loadedKey;
}
