"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import clsx from "clsx";

const INTERVAL_SECONDS = 6;
const TRANSITION_SECONDS = 1.2;

const HIDDEN_CLIP = "inset(0% 0% 100% 0%)";
const VISIBLE_CLIP = "inset(0% 0% 0% 0%)";

export function HeroBackgroundSlideshow({
  images,
  className,
}: {
  images: [string, string, string];
  className?: string;
}) {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const layers = layerRefs.current;
    if (layers.some((layer) => !layer)) return;

    let zIndex = images.length;
    gsap.set(layers[0], { clipPath: VISIBLE_CLIP, zIndex });
    for (let i = 1; i < layers.length; i++) {
      gsap.set(layers[i], { clipPath: HIDDEN_CLIP, zIndex: 0 });
    }

    const tl = gsap.timeline({ repeat: -1 });
    for (let step = 0; step < images.length; step++) {
      const incoming = layers[(step + 1) % images.length];
      const outgoing = layers[step % images.length];
      tl.set(incoming, { zIndex: ++zIndex }, `+=${INTERVAL_SECONDS}`)
        .to(incoming, {
          clipPath: VISIBLE_CLIP,
          duration: TRANSITION_SECONDS,
          ease: "power2.inOut",
        })
        .set(outgoing, { clipPath: HIDDEN_CLIP });
    }

    return () => {
      tl.kill();
    };
  }, [images]);

  return (
    <div className={clsx("absolute inset-0 z-0", className)}>
      {images.map((src, index) => (
        <div
          key={src}
          ref={(el) => {
            layerRefs.current[index] = el;
          }}
          className="absolute inset-0"
        >
          <Image src={src} alt="" fill priority className="object-cover" />
        </div>
      ))}
    </div>
  );
}
