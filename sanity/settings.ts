import { client, sanityFetchOptions } from "./client";
import { SITE_SETTINGS_QUERY } from "./queries";

export type SiteSettings = {
  /** The Events page. Hidden unless switched on in Studio → Site Settings. */
  showEventsPage: boolean;
};

/**
 * The page switches from the "Site Settings" document. Anything missing
 * (the document not created yet, or Sanity unreachable) counts as off.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const result = await client.fetch(SITE_SETTINGS_QUERY, {}, sanityFetchOptions);
    return { showEventsPage: result?.showEventsPage === true };
  } catch (error) {
    console.error("Failed to fetch site settings from Sanity.", error);
    return { showEventsPage: false };
  }
}
