import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { EventsHero } from "@/components/sections/events-hero";
import { eventsHeroContent } from "@/components/sections/events-hero/data";
import { EventsList } from "@/components/sections/events-list";
import { EventDetailsOverlay } from "@/components/sections/event-details";
import { getEventDetails, getEvents } from "@/sanity/events";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === "fr" ? "Événements & Ateliers" : "Events & Workshops";
  const description =
    locale === "fr"
      ? "Rejoignez nos événements, ateliers et webinaires pour connecter et développer les compétences des jeunes talents."
      : "Join our upcoming events, workshops, and webinars empowering young African leaders and professionals.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://impact-axis.org";
  const canonical = `${baseUrl}/${locale}/events`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/en/events`,
        fr: `${baseUrl}/fr/events`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Impact Axis",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

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
