import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
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
