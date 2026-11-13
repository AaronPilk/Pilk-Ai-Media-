/** The page a form is on, without the query string (which can carry click IDs). */
export function currentPageUrl(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}`;
}
