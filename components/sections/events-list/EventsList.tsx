"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRightIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { eventsListContent } from "./data";
import { EventFilterTab } from "./EventFilterTabs";
import { formatEventDate } from "./formatEventDate";
import type { EventItem } from "./types";

type Filter = "all" | "past" | "upcoming";

function getEventStatus(dateStr: string): "live" | "upcoming" | "past" {
  const eventDate = new Date(dateStr);
  const now = new Date();

  // Strip time for exact date comparison
  const eventYMD = `${eventDate.getFullYear()}-${eventDate.getMonth()}-${eventDate.getDate()}`;
  const nowYMD = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  if (eventYMD === nowYMD) {
    return "live";
  }

  if (eventDate < now) {
    return "past";
  }

  return "upcoming";
}

export function EventsList({ events, locale }: { events: EventItem[]; locale: Locale }) {
  const data = eventsListContent;
  const [filter, setFilter] = useState<Filter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);

  const { past, upcoming } = useMemo(() => {
    const now = new Date();
    return events.reduce<{ past: EventItem[]; upcoming: EventItem[] }>(
      (acc, event) => {
        if (new Date(event.date) < now) {
          acc.past.push(event);
        } else {
          acc.upcoming.push(event);
        }
        return acc;
      },
      { past: [], upcoming: [] },
    );
  }, [events]);

  const filteredEvents = useMemo(() => {
    let list = filter === "past" ? past : filter === "upcoming" ? upcoming : events;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((event) => {
        const title = getLocalizedText(event.title, locale).toLowerCase();
        const location = getLocalizedText(event.location, locale).toLowerCase();
        return title.includes(q) || location.includes(q);
      });
    }

    return list;
  }, [events, past, upcoming, filter, searchQuery, locale]);

  useEffect(() => {
    rowRefs.current.length = filteredEvents.length;
    rowRefs.current.forEach((el, index) => {
      if (!el) return;
      const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
      gsap.to(el, {
        opacity: isDimmed ? 0.5 : 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  }, [hoveredIndex, filteredEvents]);

  return (
    <section className="w-full bg-white py-12 md:py-20">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        {/* Search & Filter Header Bar */}
        <div className="col-span-4 flex flex-col gap-4 md:col-span-8 md:flex-row md:items-center md:justify-between lg:col-span-12">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <EventFilterTab
              label={getLocalizedText(data.allLabel, locale)}
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
            <EventFilterTab
              label={getLocalizedText(data.upcomingLabel, locale)}
              count={upcoming.length}
              active={filter === "upcoming"}
              onClick={() => setFilter("upcoming")}
            />
            <EventFilterTab
              label={getLocalizedText(data.pastLabel, locale)}
              count={past.length}
              active={filter === "past"}
              onClick={() => setFilter("past")}
            />
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-impact-gray">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getLocalizedText(data.searchPlaceholder, locale)}
              className="w-full rounded-full border border-border bg-gray-50/60 py-2 pl-10 pr-9 text-sm text-black placeholder:text-impact-gray/70 focus:border-black focus:bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-impact-gray hover:text-black"
                aria-label="Clear search"
              >
                <XIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Directory Table */}
        <div className="col-span-4 mt-6 md:col-span-8 lg:col-span-12">
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            {/* Table Header */}
            <div className="hidden border-b border-border bg-gray-50/80 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-impact-gray md:grid md:grid-cols-12 md:gap-4">
              <span className="md:col-span-2">
                {getLocalizedText(data.tableHeaders.status, locale)}
              </span>
              <span className="md:col-span-5">
                {getLocalizedText(data.tableHeaders.name, locale)}
              </span>
              <span className="md:col-span-3">
                {getLocalizedText(data.tableHeaders.location, locale)}
              </span>
              <span className="md:col-span-2">
                {getLocalizedText(data.tableHeaders.date, locale)}
              </span>
            </div>

            {/* Table Rows */}
            {filteredEvents.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredEvents.map((event, index) => {
                  const status = getEventStatus(event.date);

                  return (
                    <Link
                      key={event.slug}
                      href={`/events?event=${event.slug}`}
                      ref={(el) => {
                        rowRefs.current[index] = el;
                      }}
                      className="group grid grid-cols-1 gap-2 px-6 py-5 transition-colors duration-200 hover:bg-gray-50/90 md:grid-cols-12 md:items-center md:gap-4"
                      onMouseEnter={(e) => {
                        setHoveredIndex(index);
                        gsap.to(e.currentTarget.querySelector("[data-arrow]"), {
                          opacity: 1,
                          x: 0,
                          duration: 0.2,
                          ease: "power2.out",
                        });
                      }}
                      onMouseLeave={(e) => {
                        setHoveredIndex(null);
                        gsap.to(e.currentTarget.querySelector("[data-arrow]"), {
                          opacity: 0,
                          x: -6,
                          duration: 0.2,
                          ease: "power2.out",
                        });
                      }}
                    >
                      {/* Status Pill */}
                      <div className="md:col-span-2">
                        {status === "live" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                            {locale === "fr" ? "En direct" : "Live"}
                          </span>
                        )}
                        {status === "upcoming" && (
                          <span className="inline-flex items-center rounded-full border border-[#febb09] bg-[#fef08a] px-2.5 py-0.5 text-xs font-semibold text-black">
                            {locale === "fr" ? "À venir" : "Upcoming"}
                          </span>
                        )}
                        {status === "past" && (
                          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                            {locale === "fr" ? "Passé" : "Past"}
                          </span>
                        )}
                      </div>

                      {/* Event Title */}
                      <div className="md:col-span-5">
                        <span className="flex items-center gap-2 text-base font-medium text-black group-hover:text-[#808d00] transition-colors md:text-lg">
                          {getLocalizedText(event.title, locale)}
                          <ArrowRightIcon
                            data-arrow
                            weight="bold"
                            className="h-4 w-4 -translate-x-2 text-black opacity-0 transition-opacity"
                          />
                        </span>
                      </div>

                      {/* Location */}
                      <div className="text-sm text-impact-gray md:col-span-3">
                        {getLocalizedText(event.location, locale)}
                      </div>

                      {/* Date */}
                      <div className="text-sm font-medium text-black md:col-span-2">
                        {formatEventDate(event.date, locale)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-impact-gray">
                {locale === "fr"
                  ? "Aucun événement ne correspond à votre recherche."
                  : "No events found matching your filter."}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
