"use client";

import { motion } from "framer-motion";
import { CaretDownIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { FaqItem } from "./types";

export function FaqAccordionItem({
  item,
  locale,
  isOpen,
  onToggle,
  panelId,
}: {
  item: FaqItem;
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
}) {
  return (
    <div className="border-t border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="text-[clamp(1.125rem,1.5vw,1.375rem)] font-medium text-black">
          {getLocalizedText(item.question, locale)}
        </span>
        <CaretDownIcon
          weight="bold"
          className={clsx("h-5 w-5 shrink-0 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>
      <motion.div
        id={panelId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-impact-gray">{getLocalizedText(item.answer, locale)}</p>
      </motion.div>
    </div>
  );
}
