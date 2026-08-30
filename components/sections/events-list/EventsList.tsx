"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { eventsListContent } from "./data";
import { EventFilterTab } from "./EventFilterTabs";
import { formatEventDate } from "./formatEventDate";
import type { EventItem } from "./types";

type Filter = "all" | "past" | "upcoming";

export function EventsList({ events, locale }: { events: EventItem[]; locale: Locale }) {
  const data = eventsListContent;
  const [filter, setFilter] = useState<Filter>("all");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);

  const { past, upcoming } = useMemo(() => {
    const today = new Date();
    return events.reduce<{ past: EventItem[]; upcoming: EventItem[] }>(
      (acc, event) => {
        if (new Date(event.date) < today) {
          acc.past.push(event);
        } else {
          acc.upcoming.push(event);
        }
        return acc;
      },
      { past: [], upcoming: [] },
    );
  }, [events]);

  const visibleEvents =
    filter === "past" ? past : filter === "upcoming" ? upcoming : events;

  useEffect(() => {
    rowRefs.current.length = visibleEvents.length;
    rowRefs.current.forEach((el, index) => {
      if (!el) return;
      const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
      gsap.to(el, {
        opacity: isDimmed ? 0.4 : 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }, [hoveredIndex, visibleEvents]);

  return (
    <section className="w-full bg-white py-section">
      <Container className="grid grid-cols-4 gap-gutter md:grid-cols-8 lg:grid-cols-12">
        <div className="col-span-4 flex flex-wrap gap-3 md:col-span-8 lg:col-span-11 lg:col-start-2">
          <EventFilterTab
            label={getLocalizedText(data.allLabel, locale)}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <EventFilterTab
            label={getLocalizedText(data.pastLabel, locale)}
            count={past.length}
            active={filter === "past"}
            onClick={() => setFilter("past")}
          />
          <EventFilterTab
            label={getLocalizedText(data.upcomingLabel, locale)}
            count={upcoming.length}
            active={filter === "upcoming"}
            onClick={() => setFilter("upcoming")}
          />
        </div>

        <div className="col-span-4 mt-8 border-t border-border md:col-span-8 lg:col-span-11 lg:col-start-2">
          <div className="hidden py-4 text-xs uppercase tracking-wide text-impact-gray md:grid md:grid-cols-8 md:gap-gutter lg:grid-cols-12">
            <span className="md:col-span-4 lg:col-span-6">
              {getLocalizedText(data.tableHeaders.name, locale)}
            </span>
            <span className="md:col-span-2 lg:col-span-3">
              {getLocalizedText(data.tableHeaders.location, locale)}
            </span>
            <span className="md:col-span-2 lg:col-span-3">
              {getLocalizedText(data.tableHeaders.date, locale)}
            </span>
          </div>

          <div className="divide-y divide-border">
            {visibleEvents.map((event, index) => (
              <Link
                key={event.slug}
                href={`/events?event=${event.slug}`}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="grid grid-cols-1 gap-1 py-6 md:grid-cols-8 md:items-center md:gap-gutter lg:grid-cols-12"
                onMouseEnter={(e) => {
                  setHoveredIndex(index);
                  gsap.to(e.currentTarget.querySelector("[data-arrow]"), {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }}
                onMouseLeave={(e) => {
                  setHoveredIndex(null);
                  gsap.to(e.currentTarget.querySelector("[data-arrow]"), {
                    opacity: 0,
                    x: -8,
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }}
              >
                <span className="flex items-center gap-2 text-[clamp(1.125rem,1.5vw,1.375rem)] text-black md:col-span-4 lg:col-span-6">
                  {getLocalizedText(event.title, locale)}
                  <ArrowRightIcon
                    data-arrow
                    weight="bold"
                    className="h-4 w-4 -translate-x-2 opacity-0"
                  />
                </span>
                <span className="text-impact-gray md:col-span-2 lg:col-span-3">
                  {getLocalizedText(event.location, locale)}
                </span>
                <span className="text-impact-gray md:col-span-2 lg:col-span-3">
                  {formatEventDate(event.date, locale)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
