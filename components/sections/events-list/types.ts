import type { LocalizedText } from "@/components/sections/home-hero/types";

export type EventItem = {
  slug: string;
  title: LocalizedText;
  location: LocalizedText;
  /** ISO date string, e.g. "2026-03-14" */
  date: string;
};

export type EventsListContent = {
  allLabel: LocalizedText;
  pastLabel: LocalizedText;
  upcomingLabel: LocalizedText;
  tableHeaders: {
    name: LocalizedText;
    location: LocalizedText;
    date: LocalizedText;
  };
};

function isLocalizedText(value: unknown): value is LocalizedText {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.en === "string" && typeof record.fr === "string";
}

export function isEventItem(value: unknown): value is EventItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    typeof item.date === "string" &&
    isLocalizedText(item.title) &&
    isLocalizedText(item.location)
  );
}
