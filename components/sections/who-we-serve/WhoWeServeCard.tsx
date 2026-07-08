import Image from "next/image";
import clsx from "clsx";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { WhoWeServeCard as WhoWeServeCardData } from "./types";

export function WhoWeServeCard({
  card,
  locale,
  className,
}: {
  card: WhoWeServeCardData;
  locale: Locale;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "group relative col-span-4 flex flex-col justify-between overflow-hidden bg-[#F5F5F5] p-8 transition-colors duration-300 hover:bg-impact-yellow/10 md:col-span-8 lg:col-span-3 lg:aspect-[2/3]",
        className,
      )}
    >
      <span className="text-[clamp(1.25rem,1.875vw,1.75rem)] font-medium text-black">
        {getLocalizedText(card.label, locale)}
      </span>

      <div className="flex flex-1 items-center justify-center">
        <Image
          src={card.icon}
          alt=""
          width={120}
          height={120}
          className="h-auto w-20 transition-transform duration-300 group-hover:scale-150 lg:w-28"
        />
      </div>

      <div className="relative flex min-h-28 items-end">
        <span className="text-[clamp(2rem,5.5vw,3.5rem)] text-impact-gray transition-opacity duration-300 group-hover:opacity-0">
          {card.number}
        </span>
        <p className="absolute inset-0 text-[clamp(1rem,1.25vw,1.125rem)] text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {getLocalizedText(card.description, locale)}
        </p>
      </div>
    </div>
  );
}
