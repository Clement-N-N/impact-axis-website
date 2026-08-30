import Image from "next/image";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { resolveSanityImageUrl } from "@/sanity/image";
import type { EventSpeaker } from "./types";

export function SpeakerCard({ speaker, locale }: { speaker: EventSpeaker; locale: Locale }) {
  const imageSrc = resolveSanityImageUrl(speaker.image, 400, 400);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden bg-impact-gray/10">
        {imageSrc && <Image src={imageSrc} alt="" fill className="object-cover" />}
      </div>
      <div>
        <p className="font-medium text-black">{speaker.name}</p>
        <p className="text-sm text-impact-gray">{getLocalizedText(speaker.title, locale)}</p>
      </div>
    </div>
  );
}
