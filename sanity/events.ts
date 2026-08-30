import { isEventItem, type EventItem } from "@/components/sections/events-list/types";
import type { EventDetail } from "@/components/sections/event-details/types";
import { client } from "./client";
import { EVENT_DETAILS_QUERY, EVENTS_QUERY } from "./queries";

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
