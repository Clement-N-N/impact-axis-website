import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./env";
import type { SanityImageValue } from "./types";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}

/** Resolves a possibly-missing Sanity image field to a URL, or null if unset. */
export function resolveSanityImageUrl(
  image: SanityImageValue | undefined | null,
  width: number,
  height: number,
): string | null {
  if (!image?.asset) return null;
  return urlFor(image).width(width).height(height).url();
}
