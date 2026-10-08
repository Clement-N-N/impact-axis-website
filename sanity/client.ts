import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Read straight from Sanity, not its API CDN. The site already caches
  // every page itself (see SANITY_REVALIDATE below), so the CDN adds no
  // speed for visitors. It did cause stale pages: on publish the webhook
  // refreshes the site at once, but the CDN can still hold the previous
  // version for a short while, and that stale copy then stayed cached for a
  // day. Fetches only happen when a page is rebuilt, so API use stays low.
  useCdn: false,
});

/**
 * Cache options for every Sanity fetch. Pages stay cached until content is
 * published: the Sanity webhook calls app/api/revalidate, which refreshes the
 * whole site at once. The daily expiry is only a safety net if a webhook is
 * missed. Keep this long: each refresh rewrites cached pages, and Vercel
 * meters those writes (a 60-second expiry used up the monthly allowance).
 */
export const SANITY_REVALIDATE = 60 * 60 * 24;
export const sanityFetchOptions = { next: { revalidate: SANITY_REVALIDATE } };
