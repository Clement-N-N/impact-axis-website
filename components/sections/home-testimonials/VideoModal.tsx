"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { XIcon } from "@phosphor-icons/react";

/**
 * Plays a YouTube video (preferred) or an uploaded video file, full screen.
 * Rendered into <body>: the carousel cards are scaled with transforms, and a
 * transformed ancestor would trap a `position: fixed` overlay inside the card.
 */
export function VideoModal({
  youtubeId,
  videoUrl,
  mimeType,
  title,
  onClose,
  prefersReducedMotion,
}: {
  youtubeId?: string;
  videoUrl?: string;
  mimeType?: string;
  title: string;
  onClose: () => void;
  prefersReducedMotion: boolean;
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 p-6"
      onClick={onClose}
    >
      <motion.button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: "easeOut",
        }}
        className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center bg-white/10 text-white hover:bg-white/20"
      >
        <XIcon weight="bold" className="h-5 w-5" />
      </motion.button>
      {youtubeId ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            ease: "easeOut",
          }}
          className="aspect-video w-[min(92vw,calc(85vh*16/9))]"
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </motion.div>
      ) : (
        <motion.video
          controls
          autoPlay
          playsInline
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            ease: "easeOut",
          }}
          className="max-h-[85vh] max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <source src={videoUrl} type={mimeType} />
        </motion.video>
      )}
    </motion.div>,
    document.body,
  );
}
