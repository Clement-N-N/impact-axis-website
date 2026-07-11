import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { getLocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import type { BottomCtaBlock as BottomCtaBlockData } from "./types";

export function BottomCtaBlock({ block, locale }: { block: BottomCtaBlockData; locale: Locale }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-full md:w-1/2">
      <Image src={block.image} alt="" fill className="object-cover" />
      <div className="absolute inset-0 bg-[#191E20]/50">
        <div
          className="flex h-full w-full flex-col justify-between p-10"
          style={{ backgroundColor: `${block.accentColor}8C` }}
        >
          <h2 className="max-w-md text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium leading-[1.3] text-white">
            {getLocalizedText(block.title, locale)}
          </h2>
          <Button
            href={block.button.href}
            variant={block.buttonVariant}
            icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
            className="w-fit"
          >
            {getLocalizedText(block.button.label, locale)}
          </Button>
        </div>
      </div>
    </div>
  );
}
