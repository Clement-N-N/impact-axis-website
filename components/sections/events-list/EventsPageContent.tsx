"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { EventsHero } from "@/components/sections/events-hero";
import type { EventsHeroContent } from "@/components/sections/events-hero/types";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { EventDetail } from "@/components/sections/event-details/types";
import { EventDetailsDrawer } from "@/components/sections/event-details/EventDetailsDrawer";
import type { ImpactStatItem } from "@/sanity/events";
import { EventsList } from "./EventsList";
import type { EventItem } from "./types";
import type { Locale } from "@/i18n/routing";

export function EventsPageContent({
  heroData,
  events,
  eventDetails,
  featuredEvent,
  impactStat,
  locale,
}: {
  heroData: EventsHeroContent;
  events: EventItem[];
  eventDetails: Record<string, EventDetail>;
  featuredEvent?: EventItem | null;
  impactStat?: ImpactStatItem | null;
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
    document.title = `${getLocalizedText(event.title, locale)} | Impact Axis`;

    return () => {
      if (previousTitleRef.current !== null) {
        document.title = previousTitleRef.current;
      }
    };
  }, [event, locale]);

  if (event && detail) {
    return <EventDetailsDrawer event={event} detail={detail} locale={locale} />;
  }

  return (
    <>
      <EventsHero
        data={heroData}
        locale={locale}
        featuredEvent={featuredEvent}
        impactStat={impactStat}
      />
      <EventsList events={events} locale={locale} />
    </>
  );
}
