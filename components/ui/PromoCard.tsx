import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { getLocalizedText, type LocalizedText } from "@/components/sections/home-hero/types";
import type { Locale } from "@/i18n/routing";
import { cva } from "class-variance-authority";

const cardColStyles = cva(
  "self-center bg-[#F5F5F5] p-3 flex flex-col gap-4",
  {
    variants: {
      locale: {
        en: "col-span-3 col-start-10",
        fr: "col-span-3 col-start-10",
      },
    },
    defaultVariants: { locale: "en" },
  },
);

const cardStyles = cva(
  "relative isolate overflow-hidden self-center bg-impact-yellow border border-[#f4c600]",
  {
    variants: {
      locale: {
        en: "col-span-3 col-start-10",
        fr: "col-span-3 col-start-10",
      },
    },
    defaultVariants: { locale: "en" },
  },
);

const cardInnerStyles =
  "relative z-10 flex flex-col gap-6 p-3 shadow-[inset_0_70px_50px_70px_rgba(255,255,255,0.2)]";

export type PromoCardContent = {
  badgeLabel: LocalizedText;
  image: string;
  title: LocalizedText;
  dateLine: LocalizedText;
  applyButton: { label: LocalizedText; href: string };
  learnMoreButton: { label: LocalizedText; href: string };
};

export function PromoCard({
  content,
  locale,
}: {
  content: PromoCardContent;
  locale: Locale;
}) {
  return (
    <div className={cardColStyles({ locale })}>
      <div className={cardStyles({ locale })}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0 aspect-square w-[100%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.15)_40%,rgba(255,255,255,0)_70%)] animate-sunlight-sweep"
        />
        <div className={cardInnerStyles}>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-black">
              {getLocalizedText(content.badgeLabel, locale)}
            </span>
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={content.image}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[1.1rem] !font-medium text-black !leading-[120%]">
              {getLocalizedText(content.title, locale)}
            </h2>
            <p className="text-black text-sm">
              {getLocalizedText(content.dateLine, locale)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              href={content.applyButton.href}
              variant="dark"
              width={"full"}
              icon={<ArrowRightIcon weight="bold" className="h-5 w-5" />}
            >
              {getLocalizedText(content.applyButton.label, locale)}
            </Button>
            <Button href={content.learnMoreButton.href} variant="transparent" width="full">
              {getLocalizedText(content.learnMoreButton.label, locale)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
