"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { XIcon } from "@phosphor-icons/react";

export function VideoModal({
  videoUrl,
  mimeType,
  onClose,
  prefersReducedMotion,
}: {
  videoUrl: string;
  mimeType: string;
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

  return (
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
      <motion.video
        controls
        autoPlay
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
    </motion.div>
  );
}
