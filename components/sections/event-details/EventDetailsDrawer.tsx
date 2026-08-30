"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { XIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PortableTextRenderer } from "@/components/ui/PortableTextRenderer";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { eventsHeroContent } from "@/components/sections/events-hero/data";
import { formatEventDate } from "@/components/sections/events-list/formatEventDate";
import type { EventItem } from "@/components/sections/events-list/types";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { resolveSanityImageUrl } from "@/sanity/image";
import { eventDetailsContent } from "./data";
import { PartnerPill } from "./PartnerPill";
import { SpeakerCard } from "./SpeakerCard";
import type { EventDetail } from "./types";

const EYEBROW_CLASSES =
  "text-[clamp(0.875rem,1.3125vw,1.1875rem)] leading-[clamp(1.25rem,3vw,2.75rem)] text-black";

function DotSectionRow({ tag, children }: { tag: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <div className="hidden h-full lg:col-span-1 lg:mt-20 lg:block">
        <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
      </div>
      <div className="col-span-4 mt-16 md:col-span-8 lg:col-span-5 lg:col-start-2 lg:mt-20">
        <span className={EYEBROW_CLASSES}>{tag}</span>
      </div>
      <div className="col-span-4 mt-5 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:mt-20">
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
  const router = useRouter();
  const data = eventDetailsContent;
  const heroImageSrc = resolveSanityImageUrl(detail.heroImage, 1600, 1000);

  const close = () => router.push("/events");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <motion.div
        aria-hidden="true"
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-x-0 top-header bottom-0 z-1000 bg-black/50 backdrop-blur-[3px]"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={getLocalizedText(event.title, locale)}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
        className="fixed inset-x-0 bottom-0 z-[1001] max-h-[90vh] overflow-y-auto bg-white pt-section pb-section"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          className="absolute right-6 top-6 flex h-10 w-10 cursor-pointer items-center justify-center bg-black/5 text-black hover:bg-black/10"
        >
          <XIcon weight="bold" className="h-5 w-5" />
        </button>

        <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
          {/* Title section */}
          <div className="hidden h-full lg:col-span-1 lg:block">
            <div className="mt-[1vw] h-[8px] w-[8px] bg-black" />
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-2 lg:col-start-2">
            <span className={EYEBROW_CLASSES}>{getLocalizedText(eventsHeroContent.eyebrow, locale)}</span>
          </div>
          <div className="col-span-4 mt-5 md:col-span-8 lg:col-span-5 lg:col-start-4 lg:mt-0">
            <h2 className="text-[clamp(1.75rem,3vw,2.7rem)] font-medium leading-[1.3] text-black">
              {getLocalizedText(event.title, locale)}
            </h2>
          </div>

          {/* Image */}
          <div className="relative col-span-4 mt-8 h-[300px] overflow-hidden md:col-span-8 lg:col-span-12 lg:h-[480px]">
            {heroImageSrc && (
              <Image src={heroImageSrc} alt={detail.heroImage.alt ?? ""} fill className="object-cover" />
            )}
          </div>

          {/* Meta row: location/date + register */}
          <div className="col-span-4 mt-8 flex flex-col gap-6 md:col-span-8 md:flex-row md:items-center md:justify-between lg:col-span-11 lg:col-start-2">
            <div>
              <p className="font-medium text-black">{getLocalizedText(event.location, locale)}</p>
              <p className="text-impact-gray">{formatEventDate(event.date, locale)}</p>
            </div>
            <Button variant="primary" href={detail.registerHref}>
              {getLocalizedText(data.registerLabel, locale)}
            </Button>
          </div>

          {/* Speakers */}
          <DotSectionRow tag={getLocalizedText(data.speakersLabel, locale)}>
            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
              {detail.speakers.map((speaker) => (
                <SpeakerCard key={speaker.name} speaker={speaker} locale={locale} />
              ))}
            </div>
          </DotSectionRow>

          {/* Partners */}
          <DotSectionRow tag={getLocalizedText(data.partnersLabel, locale)}>
            <div className="flex flex-wrap gap-gutter">
              {detail.partners.map((partner) => (
                <PartnerPill key={partner.name} partner={partner} />
              ))}
            </div>
          </DotSectionRow>

          {/* Overview of the program */}
          <DotSectionRow tag={getLocalizedText(data.overviewLabel, locale)}>
            <PortableTextRenderer value={detail.programOverview[locale]} />
          </DotSectionRow>

          {/* Special guests */}
          <DotSectionRow tag={getLocalizedText(data.specialGuestsLabel, locale)}>
            <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
              {detail.specialGuests.map((guest) => (
                <SpeakerCard key={guest.name} speaker={guest} locale={locale} />
              ))}
            </div>
          </DotSectionRow>
        </Container>
      </motion.div>
    </>
  );
}
