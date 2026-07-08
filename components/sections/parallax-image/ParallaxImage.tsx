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
};

export function ParallaxImage({ src, heightClass = "h-[55vh]", padded = true }: ParallaxImageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const frame = (
    <div className={clsx("relative w-full overflow-hidden", heightClass)}>
      <div ref={imageRef} className="absolute inset-x-0 -top-[18%] -bottom-[18%]">
        <Image src={src} alt="" fill className="object-cover" />
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className={clsx("w-full", padded && "bg-white py-12")}>
      {padded ? <Container>{frame}</Container> : frame}
    </section>
  );
}
