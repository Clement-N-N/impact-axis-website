import { notFound } from "next/navigation";

// Bots probe thousands of made-up URLs. Rendering these 404s fresh, rather
// than caching each one, keeps them from adding to Vercel's cache writes.
export const dynamic = "force-dynamic";

// Unmatched URLs are otherwise served by the root `app/not-found.tsx`, which
// renders outside next-intl's provider and so can only be English. Matching
// them here instead pulls them into the [locale] segment, so the localized
// `app/[locale]/not-found.tsx` renders with the right language.
// `notFound()` returns `never`, so returning it keeps this a valid component
// return type. Leaving the call bare infers `void`, which fails the typecheck
// and makes React's dev profiler measure a component that never returns.
export default function CatchAllNotFound() {
  return notFound();
}
