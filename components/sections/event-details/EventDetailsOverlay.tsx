"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { EventItem } from "@/components/sections/events-list/types";
import type { Locale } from "@/i18n/routing";
import type { EventDetail } from "./types";
import { EventDetailsDrawer } from "./EventDetailsDrawer";

export function EventDetailsOverlay({
  events,
  eventDetails,
  locale,
}: {
  events: EventItem[];
  eventDetails: Record<string, EventDetail>;
  locale: Locale;
}) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("event");
  const event = slug ? events.find((candidate) => candidate.slug === slug) : undefined;
  const detail = event ? eventDetails[event.slug] : undefined;

  const previousTitleRef = useRef<string | null>(null);

  useEffect(() => {
    if (!event) return;

    previousTitleRef.current = document.title;
    document.title = getLocalizedText(event.title, locale);

    return () => {
      if (previousTitleRef.current !== null) {
        document.title = previousTitleRef.current;
      }
    };
  }, [event, locale]);

  if (!event || !detail) return null;

  return <EventDetailsDrawer event={event} detail={detail} locale={locale} />;
}
