import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { EventsHero } from "@/components/sections/events-hero";
import { eventsHeroContent } from "@/components/sections/events-hero/data";
import { EventsList } from "@/components/sections/events-list";
import { EventDetailsOverlay } from "@/components/sections/event-details";
import { getEventDetails, getEvents } from "@/sanity/events";
import type { Locale } from "@/i18n/routing";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [events, eventDetails] = await Promise.all([getEvents(), getEventDetails()]);

  return (
    <>
      <EventsHero data={eventsHeroContent} locale={locale as Locale} />
      <EventsList events={events} locale={locale as Locale} />
      <Suspense fallback={null}>
        <EventDetailsOverlay events={events} eventDetails={eventDetails} locale={locale as Locale} />
      </Suspense>
    </>
  );
}
