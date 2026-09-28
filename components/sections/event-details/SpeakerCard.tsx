"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { resolveSanityImageUrl } from "@/sanity/image";
import type { EventSpeaker } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SpeakerCard({
  speaker,
  locale,
}: {
  speaker: EventSpeaker;
  locale: Locale;
}) {
  const imageSrc = resolveSanityImageUrl(speaker.image, 400, 400);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fade-up entrance, matching this app's card-grid house recipe. Each card
  // computes its own position among its rendered siblings so a stagger reads
  // correctly without needing the parent grid (EventDetailsDrawer's speakers/
  // special-guests grids) to own the animation itself.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const siblings = el.parentElement
      ? Array.from(el.parentElement.children)
      : [el];
    const index = siblings.indexOf(el);

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y: 20 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: Math.max(index, 0) * 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={cardRef} className="flex flex-col gap-4">
      <div className="bg-impact-gray/10 relative aspect-square w-full overflow-hidden">
        {imageSrc && (
          <Image src={imageSrc} alt="" fill className="object-cover" />
        )}
      </div>
      <div>
        <p className="font-medium text-black">{speaker.name}</p>
        <p className="text-impact-gray text-sm">
          {getLocalizedText(speaker.title, locale)}
        </p>
      </div>
    </div>
  );
}
