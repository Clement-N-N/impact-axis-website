import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { eventsHeroContent } from "@/components/sections/events-hero/data";
import { EventsPageContent } from "@/components/sections/events-list";
import { getEventDetails, getEvents, getHomeImpactStat } from "@/sanity/events";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata("events", "/events", locale);
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [events, eventDetails, impactStat] = await Promise.all([
    getEvents(),
    getEventDetails(),
    getHomeImpactStat(),
  ]);

  const now = new Date();
  const featuredEvent =
    events.find((e) => new Date(e.date) >= now) || events[0] || null;

  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-white" />}>
      <EventsPageContent
        heroData={eventsHeroContent}
        events={events}
        eventDetails={eventDetails}
        featuredEvent={featuredEvent}
        impactStat={impactStat}
        locale={locale as Locale}
      />
    </Suspense>
  );
}
