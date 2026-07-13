import Image from "next/image";
import clsx from "clsx";
import { PlayIcon } from "@phosphor-icons/react";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { urlFor } from "@/sanity/image";
import type { Testimonial } from "./types";

function resolveImageSrc(image: Testimonial["image"]): string | null {
  if (typeof image === "string") return image || null;
  return urlFor(image).width(800).height(1000).url();
}

export function TestimonialCard({
  testimonial,
  locale,
  isActive,
}: {
  testimonial: Testimonial;
  locale: Locale;
  isActive: boolean;
}) {
  const imageSrc = resolveImageSrc(testimonial.image);

  return (
    <div className={clsx("flex gap-6 p-5", isActive ? "bg-[#99CCFF]" : "bg-white/10")}>
      {imageSrc && (
        <div className="group relative aspect-[4/5] w-2/5 shrink-0 cursor-pointer overflow-hidden">
          <Image src={imageSrc} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#101B62]/35" />
          <button
            type="button"
            aria-label="Play video"
            className="absolute left-1/2 top-1/2 flex h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-impact-yellow/50 transition-transform duration-300 group-hover:scale-[1.2]"
          >
            <PlayIcon weight="fill" className="h-5 w-5 text-white" />
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between gap-6 min-h-full">
        <div />
        <p
          className={clsx(
            "text-[clamp(1.25rem,1.875vw,1.75rem)]",
            isActive ? "text-black" : "text-white",
          )}
        >
          {getLocalizedText(testimonial.quote, locale)}
        </p>
        <div>
          <p className={clsx("font-medium", isActive ? "text-black" : "text-white")}>
            {testimonial.name}
          </p>
          <p className={clsx("text-sm", isActive ? "text-black/90" : "text-white/90")}>
            {getLocalizedText(testimonial.title, locale)}
          </p>
        </div>
      </div>
    </div>
  );
}
