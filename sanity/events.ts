import type { LocalizedText } from "@/components/sections/home-hero/types";
import { isEventItem, type EventItem } from "@/components/sections/events-list/types";
import type { EventDetail } from "@/components/sections/event-details/types";
import { client } from "./client";
import { EVENT_DETAILS_QUERY, EVENTS_QUERY, HOME_IMPACT_QUERY } from "./queries";

export type ImpactStatItem = {
  number: string;
  label: LocalizedText;
};

export async function getEvents(): Promise<EventItem[]> {
  try {
    const result = await client.fetch(EVENTS_QUERY, {}, { next: { revalidate: 60 } });
    if (Array.isArray(result) && result.every(isEventItem)) {
      return result;
    }
  } catch (error) {
    console.error("Failed to fetch events from Sanity.", error);
  }
  return [];
}

export async function getEventDetails(): Promise<Record<string, EventDetail>> {
  try {
    const result = await client.fetch(EVENT_DETAILS_QUERY, {}, { next: { revalidate: 60 } });
    if (Array.isArray(result)) {
      return Object.fromEntries(
        (result as (EventDetail & { slug: string })[]).map(({ slug, ...detail }) => [slug, detail]),
      );
    }
  } catch (error) {
    console.error("Failed to fetch event details from Sanity.", error);
  }
  return {};
}

export async function getHomeImpactStat(): Promise<ImpactStatItem | null> {
  try {
    const result = await client.fetch(HOME_IMPACT_QUERY, {}, { next: { revalidate: 60 } });
    if (result?.metrics && Array.isArray(result.metrics) && result.metrics.length > 0) {
      const match =
        result.metrics.find(
          (m: { number?: string; label?: unknown }) =>
            typeof m.number === "string" && m.number.includes("450"),
        ) || result.metrics[0];

      if (
        match &&
        typeof match.number === "string" &&
        match.label &&
        typeof match.label === "object" &&
        "en" in match.label &&
        "fr" in match.label
      ) {
        return {
          number: match.number,
          label: match.label as LocalizedText,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch home impact stat from Sanity.", error);
  }
  return null;
}
