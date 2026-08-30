"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/layout/Container";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ParallaxImageProps = {
  src: string;
  heightClass?: string;
  padded?: boolean;
  reveal?: boolean;
  exitGradient?: boolean;
};

export function ParallaxImage({
  src,
  heightClass = "h-[55vh]",
  padded = true,
  reveal = false,
  exitGradient = false,
}: ParallaxImageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { yPercent: -30 },
        {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      if (exitGradient) {
        gsap.set(gradientRef.current, { opacity: 0 });
        gsap.to(gradientRef.current, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (reveal) {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        if (prefersReducedMotion) {
          gsap.set(frameRef.current, { opacity: 1, y: 0 });
        } else {
          gsap.set(frameRef.current, { opacity: 0, y: 20 });
          gsap.to(frameRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reveal, exitGradient]);

  const frame = (
    <div ref={frameRef} className={clsx("relative w-full overflow-hidden", heightClass)}>
      <div ref={imageRef} className="absolute inset-x-0 -top-[18%] -bottom-[18%]">
        <Image src={src} alt="" fill className="object-cover" />
      </div>
      {exitGradient && (
        <div
          ref={gradientRef}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/80"
        />
      )}
    </div>
  );

  return (
    <section ref={sectionRef} className={clsx("w-full", padded && "bg-white py-12")}>
      {padded ? <Container>{frame}</Container> : frame}
    </section>
  );
}
