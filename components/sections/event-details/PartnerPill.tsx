"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resolveSanityImageUrl } from "@/sanity/image";
import type { EventPartner } from "./types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PartnerPill({ partner }: { partner: EventPartner }) {
  const logoSrc = resolveSanityImageUrl(partner.logo, 48, 48);
  const pillRef = useRef<HTMLDivElement>(null);

  // Small chip/accent reveal (150-250ms per house style guide), quicker and
  // with a smaller offset than the card-level fade-up since a pill is a much
  // smaller element. Same self-computed sibling stagger as SpeakerCard/
  // EventFilterTab so the row reveals in order without needing the parent
  // flex-wrap in EventDetailsDrawer to own the animation.
  useEffect(() => {
    const el = pillRef.current;
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
      gsap.set(el, { opacity: 0, y: 10 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out",
        delay: Math.max(index, 0) * 0.06,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          once: true,
        },
      });
    }, pillRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pillRef}
      className="border-border flex items-center gap-2 rounded-full border px-3 py-1.5"
    >
      <div className="bg-impact-gray/10 relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
        {logoSrc && (
          <Image src={logoSrc} alt="" fill className="object-cover" />
        )}
      </div>
      <span className="text-sm text-black">{partner.name}</span>
    </div>
  );
}
