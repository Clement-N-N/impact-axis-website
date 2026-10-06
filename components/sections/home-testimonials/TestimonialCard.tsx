import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { PlayIcon } from "@phosphor-icons/react";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { urlFor } from "@/sanity/image";
import type { Testimonial } from "./types";
import { VideoModal } from "./VideoModal";

function resolveImageSrc(image: Testimonial["image"]): string | null {
  if (typeof image === "string") return image || null;
  return urlFor(image).width(800).height(1000).url();
}

export function TestimonialCard({
  testimonial,
  locale,
  isActive,
  prefersReducedMotion,
}: {
  testimonial: Testimonial;
  locale: Locale;
  isActive: boolean;
  prefersReducedMotion: boolean;
}) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const youtube = testimonial.youtubeId;
  const file = youtube ? null : (testimonial.video?.asset ?? null);
  const hasVideo = Boolean(youtube || file);
  // Photo first; otherwise the YouTube thumbnail. An uploaded file with no
  // photo shows its own first frame instead (below).
  const imageSrc =
    resolveImageSrc(testimonial.image) ??
    (youtube ? `https://i.ytimg.com/vi/${youtube}/hqdefault.jpg` : null);
  const playLabel = `${locale === "fr" ? "Lire la vidéo de" : "Play video from"} ${testimonial.name}`;

  return (
    <motion.div
      className={clsx(
        "flex gap-6 p-5",
        isActive ? "bg-[#99CCFF]" : "bg-white/10",
      )}
      initial={false}
      animate={{ opacity: isActive ? 1 : 0.6, scale: isActive ? 1 : 0.97 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      {(imageSrc || hasVideo) && (
        <div
          className={clsx(
            "group relative aspect-[4/5] w-2/5 shrink-0 overflow-hidden bg-[#101B62]",
            hasVideo && "cursor-pointer",
          )}
          onClick={hasVideo ? () => setIsVideoOpen(true) : undefined}
        >
          {imageSrc ? (
            <Image src={imageSrc} alt="" fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
          ) : file ? (
            <video
              src={`${file.url}#t=1`}
              muted
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          {hasVideo && (
            <>
              <div className="absolute inset-0 bg-[#101B62]/35" />
              <button
                type="button"
                aria-label={playLabel}
                onClick={() => setIsVideoOpen(true)}
                className="bg-impact-yellow/50 absolute top-1/2 left-1/2 flex h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform duration-300 group-hover:scale-[1.2]"
              >
                <PlayIcon weight="fill" className="h-5 w-5 text-white" />
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex min-h-full flex-1 flex-col justify-between gap-6">
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
          <p
            className={clsx(
              "font-medium",
              isActive ? "text-black" : "text-white",
            )}
          >
            {testimonial.name}
          </p>
          <p
            className={clsx(
              "text-sm",
              isActive ? "text-black/90" : "text-white/90",
            )}
          >
            {getLocalizedText(testimonial.title, locale)}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isVideoOpen && hasVideo && (
          <VideoModal
            youtubeId={youtube}
            videoUrl={file?.url}
            mimeType={file?.mimeType}
            title={testimonial.name}
            onClose={() => setIsVideoOpen(false)}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
