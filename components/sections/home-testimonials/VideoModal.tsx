"use client";

import { useEffect } from "react";
import { XIcon } from "@phosphor-icons/react";

export function VideoModal({
  videoUrl,
  mimeType,
  onClose,
}: {
  videoUrl: string;
  mimeType: string;
  onClose: () => void;
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
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 p-6"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center bg-white/10 text-white hover:bg-white/20"
      >
        <XIcon weight="bold" className="h-5 w-5" />
      </button>
      <video controls autoPlay className="max-h-[85vh] max-w-full" onClick={(e) => e.stopPropagation()}>
        <source src={videoUrl} type={mimeType} />
      </video>
    </div>
  );
}
