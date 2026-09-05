"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRightIcon, CalendarIcon, MapPinIcon, SparkleIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { formatEventDate } from "@/components/sections/events-list/formatEventDate";
import type { EventItem } from "@/components/sections/events-list/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { resolveSanityImageUrl } from "@/sanity/image";
import type { SanityImageValue } from "@/sanity/types";
import type { EventsHeroContent } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function EventsHero({
  data,
  locale,
  featuredEvent,
}: {
  data: EventsHeroContent;
  locale: Locale;
  featuredEvent?: EventItem | null;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const targets = [leftColRef.current, cardRef.current];

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 20 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const imageUrl =
    featuredEvent?.heroImage
      ? resolveSanityImageUrl(featuredEvent.heroImage as SanityImageValue, 800, 600) || data.image
      : data.image;

  return (
    <section
      ref={sectionRef}
      className="relative w-full border-b border-border bg-white py-12 text-black md:py-20"
    >
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        {/* Left Column: Eyebrow + Title */}
        <div
          ref={leftColRef}
          className="col-span-4 flex flex-col justify-center md:col-span-8 lg:col-span-6"
        >
          <div className="mb-4 inline-flex items-center gap-2 self-start bg-gray-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-black border border-gray-200">
            <SparkleIcon weight="fill" className="h-3.5 w-3.5 text-black" />
            <span>{getLocalizedText(data.eyebrow, locale)}</span>
          </div>

          <h1 className="text-[clamp(2.25rem,4vw,3.25rem)] font-extrabold leading-[1.12] tracking-tight text-black">
            {getLocalizedText(data.title, locale)}
          </h1>

          <p className="mt-4 max-w-xl text-base text-impact-gray md:text-lg">
            {locale === "fr"
              ? "Découvrez nos ateliers, conférences et programmes interactifs conçus pour former et inspirer la prochaine génération."
              : "Discover workshops, conferences, and interactive sessions empowering young leaders and driving social impact across Africa."}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#101a3a] text-xs font-bold text-white ring-2 ring-white">
                YA
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#febb09] text-xs font-bold text-black ring-2 ring-white">
                BA
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-black ring-2 ring-white">
                DO
              </div>
            </div>
            <span className="text-xs font-medium text-impact-gray">
              {locale === "fr"
                ? "200+ membres à travers le Cameroun"
                : "200+ fellows across Cameroon"}
            </span>
          </div>
        </div>

        {/* Right Visual Feature Card */}
        <div
          ref={cardRef}
          className="col-span-4 mt-8 md:col-span-8 lg:col-span-6 lg:mt-0 lg:pl-6"
        >
          {featuredEvent ? (
            <Link
              href={`/events?event=${featuredEvent.slug}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden border border-border shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Image
                src={imageUrl}
                alt={getLocalizedText(featuredEvent.title, locale)}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Deep navy radial/linear gradient tint at bottom-left fading up so 3/4 of image stays clear */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#101a3a]/95 via-[#101a3a]/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                <span className="text-xs font-bold uppercase tracking-widest text-[#febb09] mb-1">
                  {locale === "fr" ? "Événement Vedette" : "Spotlight Session"}
                </span>

                <h3 className="text-xl md:text-2xl font-bold text-white leading-snug drop-shadow-sm group-hover:text-[#febb09] transition-colors">
                  {getLocalizedText(featuredEvent.title, locale)}
                </h3>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-white/80 border-t border-white/15 pt-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CalendarIcon weight="bold" className="h-4 w-4 text-[#febb09]" />
                    {formatEventDate(featuredEvent.date, locale)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon weight="bold" className="h-4 w-4 text-white/70" />
                    {getLocalizedText(featuredEvent.location, locale)}
                  </span>
                  <div className="hidden md:flex h-7 w-7 items-center justify-center bg-white/20 text-white group-hover:bg-[#febb09] group-hover:text-black transition-all">
                    <ArrowRightIcon weight="bold" className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-gray-100">
              <Image
                src={data.image}
                alt={getLocalizedText(data.imageAlt, locale)}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
