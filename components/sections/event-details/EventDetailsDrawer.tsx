"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowLeftIcon, CalendarIcon, MapPinIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PortableTextRenderer } from "@/components/ui/PortableTextRenderer";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { eventsHeroContent } from "@/components/sections/events-hero/data";
import { formatEventDate } from "@/components/sections/events-list/formatEventDate";
import type { EventItem } from "@/components/sections/events-list/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { resolveSanityImageUrl } from "@/sanity/image";
import { eventDetailsContent } from "./data";
import { PartnerPill } from "./PartnerPill";
import { SpeakerCard } from "./SpeakerCard";
import type { EventDetail } from "./types";

const EYEBROW_CLASSES =
  "text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black font-bold uppercase tracking-widest";

function DotSectionRow({ tag, children }: { tag: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <div className="hidden h-full lg:col-span-1 lg:mt-16 lg:block">
        <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
      </div>
      <div className="col-span-4 mt-12 md:col-span-8 lg:col-span-4 lg:col-start-2 lg:mt-16">
        <span className={EYEBROW_CLASSES}>{tag}</span>
      </div>
      <div className="col-span-4 mt-4 md:col-span-8 lg:col-span-7 lg:col-start-6 lg:mt-16">
        {children}
      </div>
    </>
  );
}

export function EventDetailsDrawer({
  event,
  detail,
  locale,
}: {
  event: EventItem;
  detail: EventDetail;
  locale: Locale;
}) {
  const data = eventDetailsContent;
  const heroImageSrc = resolveSanityImageUrl(detail.heroImage, 1600, 1000);

  useEffect(() => {
    // Scroll to top when opening an event detail page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [event.slug]);

  return (
    <div className="w-full bg-white py-12 text-black">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
       

        {/* Title Section */}
        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-12">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 bg-[#febb09] inline-block" />
            <span className="text-xs font-bold uppercase tracking-widest text-black">
              {getLocalizedText(eventsHeroContent.eyebrow, locale)}
            </span>
          </div>
          <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-[1.15] text-black tracking-tight">
            {getLocalizedText(event.title, locale)}
          </h1>
        </div>

        {/* Meta Bar: Date, Location, CTA */}
        <div className="col-span-4 mt-6 flex flex-col gap-6 border border-border bg-gray-50/80 p-6 md:col-span-8 md:flex-row md:items-center md:justify-between lg:col-span-12">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2 text-black font-semibold">
              <CalendarIcon weight="bold" className="h-5 w-5 text-black" />
              <span>{formatEventDate(event.date, locale)}</span>
            </div>
            <div className="flex items-center gap-2 text-impact-gray font-medium">
              <MapPinIcon weight="bold" className="h-5 w-5 text-impact-gray" />
              <span>{getLocalizedText(event.location, locale)}</span>
            </div>
          </div>

          {detail.registerHref && (
            <Button variant="primary" href={detail.registerHref}>
              {getLocalizedText(data.registerLabel, locale)}
            </Button>
          )}
        </div>

        {/* Hero Image */}
        {heroImageSrc && (
          <div className="relative col-span-4 mt-8 aspect-[16/9] w-full overflow-hidden border border-border bg-gray-100 shadow-md md:col-span-8 lg:col-span-12 lg:aspect-[21/9]">
            <Image
              src={heroImageSrc}
              alt={detail.heroImage.alt ?? getLocalizedText(event.title, locale)}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Program Overview */}
        {detail.programOverview?.[locale] && (
          <DotSectionRow tag={getLocalizedText(data.overviewLabel, locale)}>
            <div className="prose prose-lg max-w-none text-black">
              <PortableTextRenderer value={detail.programOverview[locale]} />
            </div>
          </DotSectionRow>
        )}

        {/* Speakers */}
        {detail.speakers && detail.speakers.length > 0 && (
          <DotSectionRow tag={getLocalizedText(data.speakersLabel, locale)}>
            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
              {detail.speakers.map((speaker) => (
                <SpeakerCard key={speaker.name} speaker={speaker} locale={locale} />
              ))}
            </div>
          </DotSectionRow>
        )}

        {/* Partners */}
        {detail.partners && detail.partners.length > 0 && (
          <DotSectionRow tag={getLocalizedText(data.partnersLabel, locale)}>
            <div className="flex flex-wrap gap-gutter">
              {detail.partners.map((partner) => (
                <PartnerPill key={partner.name} partner={partner} />
              ))}
            </div>
          </DotSectionRow>
        )}

        {/* Special guests */}
        {detail.specialGuests && detail.specialGuests.length > 0 && (
          <DotSectionRow tag={getLocalizedText(data.specialGuestsLabel, locale)}>
            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
              {detail.specialGuests.map((guest) => (
                <SpeakerCard key={guest.name} speaker={guest} locale={locale} />
              ))}
            </div>
          </DotSectionRow>
        )}

        {/* Bottom Back Button */}
        <div className="col-span-4 mt-16 border-t border-border pt-8 md:col-span-8 lg:col-span-12">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:underline"
          >
            <ArrowLeftIcon weight="bold" className="h-4 w-4" />
            <span>
              {locale === "fr" ? "Retour à tous les événements" : "Back to all events"}
            </span>
          </Link>
        </div>
      </Container>
    </div>
  );
}
