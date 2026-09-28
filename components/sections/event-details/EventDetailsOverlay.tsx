"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { EventItem } from "@/components/sections/events-list/types";
import type { Locale } from "@/i18n/routing";
import type { EventDetail } from "./types";
import { EventDetailsDrawer } from "./EventDetailsDrawer";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

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
  const event = slug
    ? events.find((candidate) => candidate.slug === slug)
    : undefined;
  const detail = event ? eventDetails[event.slug] : undefined;

  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

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

  return (
    <AnimatePresence mode="wait">
      {event && detail && (
        <motion.div
          key={event.slug}
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{
            duration: prefersReducedMotion ? 0.15 : 0.45,
            ease: "easeOut",
          }}
        >
          <EventDetailsDrawer event={event} detail={detail} locale={locale} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
