/**
 * Full-viewport loading state used by route-level `loading.tsx` files while
 * a page's data is being fetched. Kept minimal and on-brand (navy/gold)
 * rather than a skeleton per-route, since routes vary widely in layout.
 */
export function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen w-full flex-1 flex-col items-center justify-center gap-4 bg-white py-32"
    >
      <span className="border-border border-t-impact-blue h-10 w-10 animate-spin rounded-full border-4" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
