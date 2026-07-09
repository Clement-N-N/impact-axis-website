"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const TRANSITION_SECONDS = 1.2;

const HIDDEN_CLIP = "inset(0% 0% 100% 0%)";
const VISIBLE_CLIP = "inset(0% 0% 0% 0%)";

export function CarouselImageSwitcher({
  images,
  activeIndex,
}: {
  images: string[];
  activeIndex: number;
}) {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zIndexRef = useRef(images.length);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    const layers = layerRefs.current;
    if (layers.some((layer) => !layer)) return;

    gsap.set(layers[activeIndex], { clipPath: VISIBLE_CLIP, zIndex: zIndexRef.current });
    layers.forEach((layer, index) => {
      if (index !== activeIndex) gsap.set(layer, { clipPath: HIDDEN_CLIP, zIndex: 0 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const layers = layerRefs.current;
    if (layers.some((layer) => !layer)) return;
    if (prevIndexRef.current === activeIndex) return;

    const incoming = layers[activeIndex];
    zIndexRef.current += 1;
    gsap.set(incoming, { clipPath: HIDDEN_CLIP, zIndex: zIndexRef.current });
    gsap.to(incoming, {
      clipPath: VISIBLE_CLIP,
      duration: TRANSITION_SECONDS,
      ease: "power2.inOut",
    });

    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <div className="absolute inset-0">
      {images.map((src, index) => (
        <div
          key={src}
          ref={(el) => {
            layerRefs.current[index] = el;
          }}
          className="absolute inset-0"
        >
          <Image src={src} alt="" fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}
