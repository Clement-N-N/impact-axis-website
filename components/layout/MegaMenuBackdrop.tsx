"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

export function MegaMenuBackdrop({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      aria-hidden="true"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "fixed inset-x-0 top-header bottom-0 z-40 bg-black/50 backdrop-blur-md",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
    />
  );
}
