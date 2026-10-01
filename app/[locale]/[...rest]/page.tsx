import { notFound } from "next/navigation";

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
